"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  emptyIntakeFormState,
  readIntakeFormValues,
  validateIntakeFormValues,
  type IntakeFormState,
} from "@/lib/intake-form";
import { createIntake } from "@/lib/intakes";

export async function createIntakeAction(
  _previousState: IntakeFormState,
  formData: FormData,
) {
  const values = readIntakeFormValues(formData);
  const fieldErrors = validateIntakeFormValues(values);

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Revisa los campos marcados y volve a intentar.",
      fieldErrors,
      values,
    } satisfies IntakeFormState;
  }

  const intake = createIntake(values);

  revalidatePath("/admin/intakes");
  redirect(`/intake/success/${intake.publicId}`);
}

export const initialIntakeFormState = emptyIntakeFormState;
