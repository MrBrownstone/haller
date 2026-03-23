"use client";

import type { ReactNode } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  createIntakeFormState,
  type IntakeFormValues,
} from "@/lib/intake-form";
import { createIntakeAction } from "@/app/intake/actions";

type IntakeFormProps = {
  initialValues?: Partial<IntakeFormValues>;
};

export function IntakeForm({ initialValues }: IntakeFormProps) {
  const initialState = createIntakeFormState(initialValues);
  const [state, formAction] = useActionState(createIntakeAction, initialState);
  const safeState = state ?? initialState;

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {safeState.message ? (
        <div className="rounded-[1.4rem] border border-destructive/20 bg-destructive/8 px-4 py-3 text-sm text-destructive">
          {safeState.message}
        </div>
      ) : null}

      <FieldGroup className="grid md:grid-cols-2">
        <FormField error={safeState.fieldErrors.fullName}>
          <FieldLabel htmlFor="fullName">Nombre y apellido</FieldLabel>
          <Input
            id="fullName"
            name="fullName"
            placeholder="Como figura en su DNI"
            defaultValue={safeState.values.fullName}
            className="h-12 rounded-[1.2rem] px-4"
            required
            aria-invalid={Boolean(safeState.fieldErrors.fullName)}
          />
        </FormField>

        <FormField error={safeState.fieldErrors.dni}>
          <FieldLabel htmlFor="dni">DNI</FieldLabel>
          <Input
            id="dni"
            name="dni"
            inputMode="numeric"
            placeholder="Solo numeros"
            defaultValue={safeState.values.dni}
            className="h-12 rounded-[1.2rem] px-4"
            required
            aria-invalid={Boolean(safeState.fieldErrors.dni)}
          />
        </FormField>
      </FieldGroup>

      <FieldGroup className="grid md:grid-cols-2">
        <FormField error={safeState.fieldErrors.email}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="tu@email.com"
            defaultValue={safeState.values.email}
            className="h-12 rounded-[1.2rem] px-4"
            required
            aria-invalid={Boolean(safeState.fieldErrors.email)}
          />
        </FormField>

        <FormField error={safeState.fieldErrors.phone}>
          <FieldLabel htmlFor="phone">Telefono o WhatsApp</FieldLabel>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+54 9 11 ..."
            defaultValue={safeState.values.phone}
            className="h-12 rounded-[1.2rem] px-4"
            required
            aria-invalid={Boolean(safeState.fieldErrors.phone)}
          />
        </FormField>
      </FieldGroup>

      <FieldGroup className="grid md:grid-cols-2">
        <FormField error={safeState.fieldErrors.vehiclePlate}>
          <FieldLabel htmlFor="vehiclePlate">Patente</FieldLabel>
          <Input
            id="vehiclePlate"
            name="vehiclePlate"
            placeholder="AB123CD o AAA123"
            defaultValue={safeState.values.vehiclePlate}
            className="h-12 rounded-[1.2rem] px-4"
            required
            aria-invalid={Boolean(safeState.fieldErrors.vehiclePlate)}
          />
        </FormField>

        <FormField error={safeState.fieldErrors.jurisdiction}>
          <FieldLabel htmlFor="jurisdiction">Jurisdiccion</FieldLabel>
          <Input
            id="jurisdiction"
            name="jurisdiction"
            placeholder="Provincia, municipio o juzgado"
            defaultValue={safeState.values.jurisdiction}
            className="h-12 rounded-[1.2rem] px-4"
            required
            aria-invalid={Boolean(safeState.fieldErrors.jurisdiction)}
          />
        </FormField>
      </FieldGroup>

      <FormField
        error={safeState.fieldErrors.summary}
        description="Campo opcional. Puede incluir fechas, notificaciones, montos o cualquier dato que ayude a comprender el caso."
      >
        <FieldLabel htmlFor="summary">Informacion adicional (opcional)</FieldLabel>
        <Textarea
          id="summary"
          name="summary"
          placeholder="Ejemplo: recibi una multa por exceso de velocidad y deseo revisar la situacion para definir como continuar."
          defaultValue={safeState.values.summary}
          className="min-h-36 rounded-[1.4rem] px-4 py-3"
          aria-invalid={Boolean(safeState.fieldErrors.summary)}
        />
      </FormField>

      <Field
        orientation="horizontal"
        className="rounded-[1.4rem] border border-border/80 bg-secondary/60 p-4"
      >
        <FieldLabel htmlFor="hasDocuments" className="gap-3">
          <Checkbox
            id="hasDocuments"
            name="hasDocuments"
            defaultChecked={safeState.values.hasDocuments}
          />
          <FieldContent>
            <span className="text-sm font-medium text-foreground">
              Dispongo de documentacion
            </span>
            <FieldDescription className="text-sm">
              Si ya dispone de fotos, cedula, DNI o notificaciones, puede
              indicarlo desde este primer envio.
            </FieldDescription>
          </FieldContent>
        </FieldLabel>
      </Field>

      <div className="flex flex-col gap-3 rounded-[1.6rem] border border-primary/15 bg-[linear-gradient(180deg,rgba(249,245,240,0.94),rgba(255,255,255,0.92))] p-5">
        <p className="text-sm leading-6 text-muted-foreground">
          No necesita crear una cuenta para enviar esta consulta inicial.
        </p>
        <SubmitButton />
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      size="lg"
      className="h-12 w-full rounded-full px-6 sm:w-fit"
      disabled={pending}
    >
      {pending ? "Enviando consulta..." : "Enviar formulario"}
    </Button>
  );
}

type FormFieldProps = {
  error?: string;
  description?: string;
  children: ReactNode;
};

function FormField({ error, description, children }: FormFieldProps) {
  return (
    <Field data-invalid={Boolean(error)} className="gap-2">
      {children}
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      <FieldError>{error}</FieldError>
    </Field>
  );
}
