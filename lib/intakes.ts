import "server-only";

import { randomBytes } from "node:crypto";
import {
  mkdirSync,
  readFileSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, extname, join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import {
  INTAKE_INITIAL_STATUS,
  type IntakeDocumentSource,
  type IntakeFormValues,
  type IntakeStatus,
} from "@/lib/intake-form";
import {
  intakeDocumentExtensions,
  intakeDocumentMimeTypes,
} from "@/lib/intake-documents";

export type IntakeRecord = {
  id: number;
  publicId: string;
  fullName: string;
  dni: string;
  email: string;
  phone: string;
  vehiclePlate: string;
  jurisdiction: string;
  summary: string;
  hasDocuments: boolean;
  documentCount: number;
  status: IntakeStatus;
  createdAt: string;
};

export type IntakeDocumentRecord = {
  id: number;
  intakeId: number;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  uploadedBy: IntakeDocumentSource;
  note: string;
  createdAt: string;
};

export type IntakeDocumentFile = IntakeDocumentRecord & {
  buffer: Buffer;
};

export type IntakeDetailRecord = IntakeRecord & {
  documents: IntakeDocumentRecord[];
};

const databasePath =
  process.env.DATABASE_PATH ?? join(process.cwd(), "data", "haller.sqlite");
const documentsRootPath =
  process.env.INTAKE_DOCUMENTS_PATH ??
  join(process.cwd(), "data", "intake-documents");
const allowedDocumentMimeTypes = new Set<string>(intakeDocumentMimeTypes);
const allowedDocumentExtensions = new Set<string>(intakeDocumentExtensions);

let database: DatabaseSync | null = null;

export function createIntake(values: IntakeFormValues) {
  const db = getDatabase();
  const createdAt = new Date().toISOString();
  const statement = db.prepare(
    `
      INSERT INTO intakes (
        public_id,
        full_name,
        dni,
        email,
        phone,
        vehicle_plate,
        jurisdiction,
        summary,
        has_documents,
        status,
        created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
  );

  let publicId = "";
  let result: ReturnType<typeof statement.run> | null = null;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    publicId = createPublicId();

    try {
      result = statement.run(
        publicId,
        values.fullName,
        values.dni,
        values.email,
        values.phone,
        values.vehiclePlate,
        values.jurisdiction,
        values.summary,
        values.hasDocuments ? 1 : 0,
        INTAKE_INITIAL_STATUS,
        createdAt,
      );
      break;
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("UNIQUE constraint failed: intakes.public_id")
      ) {
        continue;
      }

      throw error;
    }
  }

  if (!result) {
    throw new Error("No se pudo generar un identificador unico para el intake.");
  }

  return {
    id: Number(result.lastInsertRowid),
    publicId,
    ...values,
    documentCount: 0,
    status: INTAKE_INITIAL_STATUS,
    createdAt,
  } satisfies IntakeRecord;
}

export function listIntakes() {
  const rows = getDatabase()
    .prepare(
      `
        SELECT
          id,
          public_id,
          full_name,
          dni,
          email,
          phone,
          vehicle_plate,
          jurisdiction,
          summary,
          has_documents,
          status,
          created_at,
          (
            SELECT COUNT(*)
            FROM intake_documents
            WHERE intake_documents.intake_id = intakes.id
          ) AS document_count
        FROM intakes
        ORDER BY datetime(created_at) DESC, id DESC
      `,
    )
    .all() as IntakeRow[];

  return rows.map(mapIntakeRow) satisfies IntakeRecord[];
}

export function getIntakeByPublicId(publicId: string) {
  const row = getDatabase()
    .prepare(
      `
        SELECT
          id,
          public_id,
          full_name,
          dni,
          email,
          phone,
          vehicle_plate,
          jurisdiction,
          summary,
          has_documents,
          status,
          created_at,
          (
            SELECT COUNT(*)
            FROM intake_documents
            WHERE intake_documents.intake_id = intakes.id
          ) AS document_count
        FROM intakes
        WHERE public_id = ?
      `,
    )
    .get(publicId) as IntakeRow | undefined;

  if (!row) {
    return null;
  }

  return mapIntakeRow(row);
}

export function getIntakeDetailByPublicId(publicId: string) {
  const intake = getIntakeByPublicId(publicId);

  if (!intake) {
    return null;
  }

  return {
    ...intake,
    documents: listIntakeDocuments(intake.id),
  } satisfies IntakeDetailRecord;
}

export function updateIntakeStatus(publicId: string, status: IntakeStatus) {
  const result = getDatabase()
    .prepare(
      `
        UPDATE intakes
        SET status = ?
        WHERE public_id = ?
      `,
    )
    .run(status, publicId);

  if (Number(result.changes) === 0) {
    return null;
  }

  return getIntakeByPublicId(publicId);
}

export async function createIntakeDocument({
  publicId,
  file,
  uploadedBy,
  note,
}: {
  publicId: string;
  file: File;
  uploadedBy: IntakeDocumentSource;
  note: string;
}) {
  const intake = findIntakeIdentity(publicId);

  if (!intake) {
    return null;
  }

  const normalizedMimeType = getIntakeDocumentMimeType(file.name, file.type);
  const originalName = getOriginalDocumentName(file.name, normalizedMimeType);
  const storageKey = createDocumentStorageKey(publicId, originalName);
  const absolutePath = getDocumentAbsolutePath(storageKey);
  const createdAt = new Date().toISOString();
  const buffer = Buffer.from(await file.arrayBuffer());

  mkdirSync(dirname(absolutePath), { recursive: true });
  writeFileSync(absolutePath, buffer);

  try {
    const db = getDatabase();
    const result = db
      .prepare(
        `
          INSERT INTO intake_documents (
            intake_id,
            original_name,
            storage_key,
            mime_type,
            size_bytes,
            uploaded_by,
            note,
            created_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
      )
      .run(
        intake.id,
        originalName,
        storageKey,
        normalizedMimeType,
        file.size,
        uploadedBy,
        note,
        createdAt,
      );

    db.prepare(
      `
        UPDATE intakes
        SET has_documents = 1
        WHERE id = ?
      `,
    ).run(intake.id);

    return {
      id: Number(result.lastInsertRowid),
      intakeId: intake.id,
      originalName,
      mimeType: normalizedMimeType,
      sizeBytes: file.size,
      uploadedBy,
      note,
      createdAt,
    } satisfies IntakeDocumentRecord;
  } catch (error) {
    unlinkSync(absolutePath);
    throw error;
  }
}

export function getIntakeDocumentFile(publicId: string, documentId: number) {
  const row = findIntakeDocumentRow(publicId, documentId);

  if (!row) {
    return null;
  }

  try {
    return {
      ...mapIntakeDocumentRow(row),
      buffer: readFileSync(getDocumentAbsolutePath(row.storage_key)),
    } satisfies IntakeDocumentFile;
  } catch {
    return null;
  }
}

export function getIntakeDocumentRecord(publicId: string, documentId: number) {
  const row = findIntakeDocumentRow(publicId, documentId);

  if (!row) {
    return null;
  }

  return mapIntakeDocumentRow(row);
}

export function deleteIntakeDocument(publicId: string, documentId: number) {
  const row = findIntakeDocumentRow(publicId, documentId);

  if (!row) {
    return null;
  }

  const db = getDatabase();

  db.prepare(
    `
      DELETE FROM intake_documents
      WHERE id = ?
    `,
  ).run(documentId);

  const remainingDocumentCountRow = db
    .prepare(
      `
        SELECT COUNT(*) AS count
        FROM intake_documents
        WHERE intake_id = ?
      `,
    )
    .get(row.intake_id) as { count: number };

  db.prepare(
    `
      UPDATE intakes
      SET has_documents = ?
      WHERE id = ?
    `,
  ).run(remainingDocumentCountRow.count > 0 ? 1 : 0, row.intake_id);

  try {
    rmSync(getDocumentAbsolutePath(row.storage_key), { force: true });
  } catch {
    // If the file is already gone, keep the DB mutation authoritative.
  }

  return mapIntakeDocumentRow(row);
}

export function isSupportedIntakeDocumentFile(file: Pick<File, "name" | "type">) {
  const normalizedMimeType = file.type.trim().toLowerCase();

  if (normalizedMimeType.length > 0) {
    return allowedDocumentMimeTypes.has(normalizedMimeType);
  }

  return allowedDocumentExtensions.has(extname(file.name).toLowerCase());
}

function listIntakeDocuments(intakeId: number) {
  const rows = getDatabase()
    .prepare(
      `
        SELECT
          id,
          intake_id,
          original_name,
          storage_key,
          mime_type,
          size_bytes,
          uploaded_by,
          note,
          created_at
        FROM intake_documents
        WHERE intake_id = ?
        ORDER BY datetime(created_at) DESC, id DESC
      `,
    )
    .all(intakeId) as IntakeDocumentRow[];

  return rows.map(mapIntakeDocumentRow) satisfies IntakeDocumentRecord[];
}

function findIntakeDocumentRow(publicId: string, documentId: number) {
  return getDatabase()
    .prepare(
      `
        SELECT
          intake_documents.id,
          intake_documents.intake_id,
          intake_documents.original_name,
          intake_documents.storage_key,
          intake_documents.mime_type,
          intake_documents.size_bytes,
          intake_documents.uploaded_by,
          intake_documents.note,
          intake_documents.created_at
        FROM intake_documents
        INNER JOIN intakes
          ON intakes.id = intake_documents.intake_id
        WHERE intakes.public_id = ?
          AND intake_documents.id = ?
      `,
    )
    .get(publicId, documentId) as IntakeDocumentRow | undefined;
}

function findIntakeIdentity(publicId: string) {
  return getDatabase()
    .prepare(
      `
        SELECT id, public_id
        FROM intakes
        WHERE public_id = ?
      `,
    )
    .get(publicId) as IntakeIdentityRow | undefined;
}

function getDatabase() {
  if (database) {
    return database;
  }

  mkdirSync(dirname(databasePath), { recursive: true });
  mkdirSync(documentsRootPath, { recursive: true });

  const db = new DatabaseSync(databasePath);
  db.exec(`
    PRAGMA foreign_keys = ON;
    PRAGMA journal_mode = WAL;
    PRAGMA synchronous = NORMAL;

    CREATE TABLE IF NOT EXISTS intakes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      public_id TEXT NOT NULL UNIQUE,
      full_name TEXT NOT NULL,
      dni TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      vehicle_plate TEXT NOT NULL,
      jurisdiction TEXT NOT NULL,
      summary TEXT NOT NULL,
      has_documents INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS intake_documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      intake_id INTEGER NOT NULL,
      original_name TEXT NOT NULL,
      storage_key TEXT NOT NULL UNIQUE,
      mime_type TEXT NOT NULL,
      size_bytes INTEGER NOT NULL,
      uploaded_by TEXT NOT NULL,
      note TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL,
      FOREIGN KEY (intake_id) REFERENCES intakes(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS intakes_created_at_idx
      ON intakes (created_at DESC);

    CREATE INDEX IF NOT EXISTS intake_documents_intake_id_idx
      ON intake_documents (intake_id, created_at DESC);
  `);

  database = db;
  return db;
}

function createPublicId() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = randomBytes(2).toString("hex").toUpperCase();
  return `INT-${date}-${suffix}`;
}

function createDocumentStorageKey(publicId: string, originalName: string) {
  const suffix = randomBytes(6).toString("hex");
  return join(publicId, `${suffix}-${sanitizeDocumentFilename(originalName)}`);
}

function sanitizeDocumentFilename(value: string) {
  const extension = getDocumentExtension(value);
  const stem = basename(value, extname(value))
    .normalize("NFKD")
    .replace(/[^\x00-\x7F]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const safeStem = stem.length > 0 ? stem : "documento";
  return `${safeStem}${extension}`;
}

function getOriginalDocumentName(value: string, mimeType: string) {
  const trimmedValue = basename(value).trim();

  if (trimmedValue.length === 0) {
    return `documento${extensionByMimeType[mimeType] ?? ""}`;
  }

  const extension = getDocumentExtension(trimmedValue) || extensionByMimeType[mimeType];

  if (!extension) {
    return trimmedValue;
  }

  const baseName = basename(trimmedValue, extname(trimmedValue));
  return `${baseName}${extension}`;
}

function getDocumentExtension(value: string) {
  const extension = extname(value).toLowerCase();

  if (allowedDocumentExtensions.has(extension)) {
    return extension;
  }

  return "";
}

function getIntakeDocumentMimeType(filename: string, mimeType: string) {
  const normalizedMimeType = mimeType.trim().toLowerCase();

  if (allowedDocumentMimeTypes.has(normalizedMimeType)) {
    return normalizedMimeType;
  }

  const extension = getDocumentExtension(filename);
  return mimeTypeByExtension[extension] ?? "application/octet-stream";
}

function getDocumentAbsolutePath(storageKey: string) {
  return join(documentsRootPath, storageKey);
}

function mapIntakeRow(row: IntakeRow) {
  return {
    id: row.id,
    publicId: row.public_id,
    fullName: row.full_name,
    dni: row.dni,
    email: row.email,
    phone: row.phone,
    vehiclePlate: row.vehicle_plate,
    jurisdiction: row.jurisdiction,
    summary: row.summary,
    hasDocuments: Boolean(row.has_documents),
    documentCount: row.document_count,
    status: row.status,
    createdAt: row.created_at,
  } satisfies IntakeRecord;
}

function mapIntakeDocumentRow(row: IntakeDocumentRow) {
  return {
    id: row.id,
    intakeId: row.intake_id,
    originalName: row.original_name,
    mimeType: row.mime_type,
    sizeBytes: row.size_bytes,
    uploadedBy: row.uploaded_by,
    note: row.note,
    createdAt: row.created_at,
  } satisfies IntakeDocumentRecord;
}

const mimeTypeByExtension: Record<string, string> = {
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".webp": "image/webp",
};

const extensionByMimeType: Record<string, string> = {
  "application/pdf": ".pdf",
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

type IntakeRow = {
  id: number;
  public_id: string;
  full_name: string;
  dni: string;
  email: string;
  phone: string;
  vehicle_plate: string;
  jurisdiction: string;
  summary: string;
  has_documents: number;
  document_count: number;
  status: IntakeStatus;
  created_at: string;
};

type IntakeIdentityRow = {
  id: number;
  public_id: string;
};

type IntakeDocumentRow = {
  id: number;
  intake_id: number;
  original_name: string;
  storage_key: string;
  mime_type: string;
  size_bytes: number;
  uploaded_by: IntakeDocumentSource;
  note: string;
  created_at: string;
};
