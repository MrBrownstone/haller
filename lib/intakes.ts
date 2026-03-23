import "server-only";

import { randomBytes } from "node:crypto";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import {
  INTAKE_INITIAL_STATUS,
  type IntakeFormValues,
  type IntakeStatus,
} from "@/lib/intake-form";

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
  status: IntakeStatus;
  createdAt: string;
};

const databasePath =
  process.env.DATABASE_PATH ?? join(process.cwd(), "data", "haller.sqlite");

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
          created_at
        FROM intakes
        ORDER BY datetime(created_at) DESC, id DESC
      `,
    )
    .all() as IntakeRow[];

  return rows.map((row) => ({
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
    status: row.status,
    createdAt: row.created_at,
  })) satisfies IntakeRecord[];
}

function getDatabase() {
  if (database) {
    return database;
  }

  mkdirSync(dirname(databasePath), { recursive: true });

  const db = new DatabaseSync(databasePath);
  db.exec(`
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

    CREATE INDEX IF NOT EXISTS intakes_created_at_idx
      ON intakes (created_at DESC);
  `);

  database = db;
  return db;
}

function createPublicId() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = randomBytes(2).toString("hex").toUpperCase();
  return `INT-${date}-${suffix}`;
}

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
  status: IntakeStatus;
  created_at: string;
};
