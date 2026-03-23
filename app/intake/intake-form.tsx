"use client";

import type { ReactNode } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

      <div className="grid gap-5 md:grid-cols-2">
        <Field
          id="fullName"
          label="Nombre y apellido"
          error={safeState.fieldErrors.fullName}
        >
          <Input
            id="fullName"
            name="fullName"
            placeholder="Como figura en tu DNI"
            defaultValue={safeState.values.fullName}
            required
            aria-invalid={Boolean(safeState.fieldErrors.fullName)}
          />
        </Field>

        <Field id="dni" label="DNI" error={safeState.fieldErrors.dni}>
          <Input
            id="dni"
            name="dni"
            inputMode="numeric"
            placeholder="Solo numeros"
            defaultValue={safeState.values.dni}
            required
            aria-invalid={Boolean(safeState.fieldErrors.dni)}
          />
        </Field>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field id="email" label="Email" error={safeState.fieldErrors.email}>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="tu@email.com"
            defaultValue={safeState.values.email}
            required
            aria-invalid={Boolean(safeState.fieldErrors.email)}
          />
        </Field>

        <Field
          id="phone"
          label="Telefono o WhatsApp"
          error={safeState.fieldErrors.phone}
        >
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+54 9 11 ..."
            defaultValue={safeState.values.phone}
            required
            aria-invalid={Boolean(safeState.fieldErrors.phone)}
          />
        </Field>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field
          id="vehiclePlate"
          label="Patente"
          error={safeState.fieldErrors.vehiclePlate}
        >
          <Input
            id="vehiclePlate"
            name="vehiclePlate"
            placeholder="AB123CD o AAA123"
            defaultValue={safeState.values.vehiclePlate}
            required
            aria-invalid={Boolean(safeState.fieldErrors.vehiclePlate)}
          />
        </Field>

        <Field
          id="jurisdiction"
          label="Jurisdiccion"
          error={safeState.fieldErrors.jurisdiction}
        >
          <Input
            id="jurisdiction"
            name="jurisdiction"
            placeholder="Provincia, municipio o juzgado"
            defaultValue={safeState.values.jurisdiction}
            required
            aria-invalid={Boolean(safeState.fieldErrors.jurisdiction)}
          />
        </Field>
      </div>

      <Field
        id="summary"
        label="Contanos que paso"
        error={safeState.fieldErrors.summary}
        hint="Inclui fechas, notificaciones, montos o cualquier dato que nos ayude a revisar el tema."
      >
        <Textarea
          id="summary"
          name="summary"
          placeholder="Ejemplo: me llego una multa por exceso de velocidad en ruta 2, no estaba manejando ese dia..."
          defaultValue={safeState.values.summary}
          required
          aria-invalid={Boolean(safeState.fieldErrors.summary)}
        />
      </Field>

      <div className="rounded-[1.4rem] border border-border/80 bg-secondary/60 p-4">
        <label
          htmlFor="hasDocuments"
          className="flex items-start gap-3 text-sm text-foreground"
        >
          <Checkbox
            id="hasDocuments"
            name="hasDocuments"
            defaultChecked={safeState.values.hasDocuments}
          />
          <span className="space-y-1">
            <span className="block font-medium">
              Tengo documentacion disponible
            </span>
            <span className="block text-muted-foreground">
              Subir archivos sera opcional en el siguiente paso. Por ahora solo
              indicamos si ya contas con fotos, cedula, DNI o notificaciones.
            </span>
          </span>
        </label>
      </div>

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
    <Button type="submit" size="lg" className="w-full sm:w-fit" disabled={pending}>
      {pending ? "Creando intake..." : "Enviar intake"}
    </Button>
  );
}

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
};

function Field({ id, label, error, hint, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-sm text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
