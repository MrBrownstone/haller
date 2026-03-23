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
import { emptyIntakeFormState } from "@/lib/intake-form";
import { createIntakeAction } from "@/app/intake/actions";

export function IntakeForm() {
  const [state, formAction] = useActionState(createIntakeAction, emptyIntakeFormState);
  const safeState = state ?? emptyIntakeFormState;

  return (
    <form action={formAction} className="space-y-6">
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
            placeholder="Como figura en tu DNI"
            defaultValue={safeState.values.fullName}
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
            required
            aria-invalid={Boolean(safeState.fieldErrors.jurisdiction)}
          />
        </FormField>
      </FieldGroup>

      <FormField
        error={safeState.fieldErrors.summary}
        description="Inclui fechas, notificaciones, montos o cualquier dato que nos ayude a revisar el tema."
      >
        <FieldLabel htmlFor="summary">Contanos que paso</FieldLabel>
        <Textarea
          id="summary"
          name="summary"
          placeholder="Ejemplo: me llego una multa por exceso de velocidad en ruta 2, no estaba manejando ese dia..."
          defaultValue={safeState.values.summary}
          className="min-h-36 rounded-[1.4rem] px-4 py-3"
          required
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
              Tengo documentacion disponible
            </span>
            <FieldDescription className="text-sm">
              Subir archivos sera opcional en el siguiente paso. Por ahora solo
              indicamos si ya contas con fotos, cedula, DNI o notificaciones.
            </FieldDescription>
          </FieldContent>
        </FieldLabel>
      </Field>

      <div className="flex flex-col gap-3 rounded-[1.6rem] border border-primary/15 bg-[linear-gradient(180deg,rgba(249,245,240,0.94),rgba(255,255,255,0.92))] p-5">
        <p className="text-sm text-muted-foreground">
          No necesitas crear una cuenta para enviar tu consulta inicial.
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
      {pending ? "Creando intake..." : "Enviar intake"}
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
