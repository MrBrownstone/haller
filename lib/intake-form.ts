export const INTAKE_INITIAL_STATUS = "pending_review" as const;

export const intakeStatusLabels = {
  pending_review: "Pendiente de revision",
} as const;

export type IntakeStatus = keyof typeof intakeStatusLabels;

export type IntakeFormValues = {
  fullName: string;
  dni: string;
  email: string;
  phone: string;
  vehiclePlate: string;
  jurisdiction: string;
  summary: string;
  hasDocuments: boolean;
};

export type IntakeFieldName = keyof IntakeFormValues;
export type IntakeFieldErrors = Partial<Record<IntakeFieldName, string>>;

export type IntakeFormState = {
  status: "idle" | "error";
  message: string | null;
  fieldErrors: IntakeFieldErrors;
  values: IntakeFormValues;
};

export const emptyIntakeFormState: IntakeFormState = {
  status: "idle",
  message: null,
  fieldErrors: {},
  values: {
    fullName: "",
    dni: "",
    email: "",
    phone: "",
    vehiclePlate: "",
    jurisdiction: "",
    summary: "",
    hasDocuments: false,
  },
};

export function readIntakeFormValues(formData: FormData): IntakeFormValues {
  return {
    fullName: normalizeText(formData.get("fullName")),
    dni: normalizeDigits(formData.get("dni")),
    email: normalizeText(formData.get("email")).toLowerCase(),
    phone: normalizePhone(formData.get("phone")),
    vehiclePlate: normalizeVehiclePlate(formData.get("vehiclePlate")),
    jurisdiction: normalizeText(formData.get("jurisdiction")),
    summary: normalizeMultilineText(formData.get("summary")),
    hasDocuments: formData.get("hasDocuments") === "on",
  };
}

export function validateIntakeFormValues(
  values: IntakeFormValues,
): IntakeFieldErrors {
  const errors: IntakeFieldErrors = {};

  if (values.fullName.length < 3) {
    errors.fullName = "Ingresa nombre y apellido.";
  }

  if (values.dni.length < 7 || values.dni.length > 10) {
    errors.dni = "Ingresa un DNI valido.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Ingresa un email valido.";
  }

  if (digitsOnly(values.phone).length < 8) {
    errors.phone = "Ingresa un telefono o WhatsApp valido.";
  }

  if (!isValidVehiclePlate(values.vehiclePlate)) {
    errors.vehiclePlate = "Ingresa una patente valida.";
  }

  if (values.jurisdiction.length < 2) {
    errors.jurisdiction = "Indica la jurisdiccion.";
  }

  if (values.summary.length < 20) {
    errors.summary = "Contanos un poco mas sobre la infraccion o consulta.";
  }

  if (values.summary.length > 3000) {
    errors.summary = "El detalle es demasiado largo.";
  }

  return errors;
}

function normalizeText(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ");
}

function normalizeMultilineText(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .trim();
}

function normalizeDigits(value: FormDataEntryValue | null) {
  return String(value ?? "").replace(/\D/g, "");
}

function normalizePhone(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .trim()
    .replace(/[^\d+\s()-]/g, "")
    .replace(/\s+/g, " ");
}

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function normalizeVehiclePlate(value: FormDataEntryValue | null) {
  return String(value ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function isValidVehiclePlate(value: string) {
  if (/^[A-Z]{3}\d{3}$/.test(value)) {
    return true;
  }

  if (/^[A-Z]{2}\d{3}[A-Z]{2}$/.test(value)) {
    return true;
  }

  return /^[A-Z0-9]{6,8}$/.test(value);
}
