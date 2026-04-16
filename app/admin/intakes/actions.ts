"use server";

import { revalidatePath } from "next/cache";
import {
  intakeDocumentSourceLabels,
  intakeStatusLabels,
  type IntakeDocumentSource,
  type IntakeStatus,
} from "@/lib/intake-form";
import { INTAKE_DOCUMENT_MAX_SIZE_BYTES } from "@/lib/intake-documents";
import {
  createIntakeDocument,
  deleteIntakeDocument,
  isSupportedIntakeDocumentFile,
  updateIntakeStatus,
} from "@/lib/intakes";

export async function updateIntakeStatusAction(
  publicId: string,
  status: IntakeStatus,
) {
  if (!Object.hasOwn(intakeStatusLabels, status)) {
    throw new Error("Estado de intake invalido.");
  }

  const intake = updateIntakeStatus(publicId, status);

  if (!intake) {
    throw new Error("No se encontro el intake indicado.");
  }

  revalidatePath("/admin/intakes");
  revalidatePath(`/admin/intakes/${publicId}`);
}

export async function uploadIntakeDocumentAction(
  publicId: string,
  _previousState: {
    status: "idle" | "error" | "success";
    message: string | null;
    resetToken: string | null;
  },
  formData: FormData,
): Promise<{
  status: "idle" | "error" | "success";
  message: string | null;
  resetToken: string | null;
}> {
  const file = formData.get("document");
  const uploadedBy = readDocumentSource(formData.get("uploadedBy"));
  const note = normalizeNote(formData.get("note"));

  if (!(file instanceof File) || file.size === 0) {
    return {
      status: "error",
      message: "Seleccione un archivo antes de continuar.",
      resetToken: null,
    };
  }

  if (!uploadedBy) {
    return {
      status: "error",
      message: "Indique si la documentacion la agrego administracion o cliente.",
      resetToken: null,
    };
  }

  if (!isSupportedIntakeDocumentFile(file)) {
    return {
      status: "error",
      message: "Solo se admiten PDF, JPG, PNG o WEBP.",
      resetToken: null,
    };
  }

  if (file.size > INTAKE_DOCUMENT_MAX_SIZE_BYTES) {
    return {
      status: "error",
      message: "El archivo supera el limite actual de 12 MB.",
      resetToken: null,
    };
  }

  const document = await createIntakeDocument({
    publicId,
    file,
    uploadedBy,
    note,
  });

  if (!document) {
    return {
      status: "error",
      message: "No se encontro el intake indicado para asociar el archivo.",
      resetToken: null,
    };
  }

  revalidatePath("/admin/intakes");
  revalidatePath(`/admin/intakes/${publicId}`);

  return {
    status: "success",
    message: "Documento agregado correctamente.",
    resetToken: crypto.randomUUID(),
  };
}

export async function deleteIntakeDocumentAction(
  publicId: string,
  documentId: number,
) {
  const document = deleteIntakeDocument(publicId, documentId);

  if (!document) {
    throw new Error("No se encontro el documento indicado.");
  }

  revalidatePath("/admin/intakes");
  revalidatePath(`/admin/intakes/${publicId}`);
}

function readDocumentSource(
  value: FormDataEntryValue | null,
): IntakeDocumentSource | null {
  const normalizedValue = String(value ?? "").trim();

  if (Object.hasOwn(intakeDocumentSourceLabels, normalizedValue)) {
    return normalizedValue as IntakeDocumentSource;
  }

  return null;
}

function normalizeNote(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 240);
}
