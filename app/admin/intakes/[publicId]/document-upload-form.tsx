"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HelpTooltip } from "@/components/ui/help-tooltip";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { uploadIntakeDocumentAction } from "@/app/admin/intakes/actions";
import {
  INTAKE_DOCUMENT_ACCEPT,
  INTAKE_DOCUMENT_MAX_SIZE_BYTES,
} from "@/lib/intake-documents";
import {
  intakeDocumentSourceLabels,
  type IntakeDocumentSource,
} from "@/lib/intake-form";

type DocumentUploadFormProps = {
  publicId: string;
};

export function DocumentUploadForm({ publicId }: DocumentUploadFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const uploadAction = uploadIntakeDocumentAction.bind(null, publicId);
  const [state, formAction] = useActionState(
    uploadAction,
    initialIntakeDocumentUploadState,
  );

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.resetToken, state.status]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-5">
      {state.message ? (
        <div
          className={
            state.status === "error"
              ? "rounded-[1.3rem] border border-destructive/15 bg-destructive/8 px-4 py-3 text-sm text-destructive"
              : "rounded-[1.3rem] border border-primary/15 bg-primary/8 px-4 py-3 text-sm text-foreground"
          }
        >
          {state.message}
        </div>
      ) : null}

      <Field className="gap-2">
        <div className="flex items-center gap-2">
          <FieldLabel htmlFor="document" className="mb-0">
            Archivo
          </FieldLabel>
          <HelpTooltip
            content={`Hasta ${Math.floor(
              INTAKE_DOCUMENT_MAX_SIZE_BYTES / 1024 / 1024,
            )} MB. Se admiten PDF, JPG, PNG y WEBP.`}
            label="Formatos y tamano permitidos"
            align="left"
          />
        </div>

        <DocumentFilePicker
          key={state.resetToken ?? "initial-file-picker"}
          accept={INTAKE_DOCUMENT_ACCEPT}
        />
      </Field>

      <Field className="gap-3">
        <FieldLabel htmlFor="uploadedBy-admin">Origen</FieldLabel>
        <OriginSelector
          key={state.resetToken ?? "initial-origin-selector"}
          defaultValue="admin"
        />
        <FieldDescription>
          Marque quien incorporo el archivo para mantener trazabilidad simple.
        </FieldDescription>
      </Field>

      <Field className="gap-2">
        <FieldLabel htmlFor="note">Nota breve (opcional)</FieldLabel>
        <Input
          id="note"
          name="note"
          placeholder="Ejemplo: frente del DNI o descargo firmado"
          className="h-12 rounded-[1.2rem] px-4"
          maxLength={240}
        />
        <FieldError />
      </Field>

      <div className="flex flex-col gap-3 rounded-[1.5rem] border border-primary/15 bg-[linear-gradient(180deg,rgba(249,245,240,0.94),rgba(255,255,255,0.92))] p-5">
        <p className="text-sm leading-6 text-muted-foreground">
          El archivo queda asociado a este intake en almacenamiento local.
        </p>
        <SubmitButton />
      </div>
    </form>
  );
}

const initialIntakeDocumentUploadState = {
  status: "idle",
  message: null,
  resetToken: null,
} as const;

function DocumentFilePicker({ accept }: { accept: string }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState("");

  return (
    <>
      <input
        ref={fileInputRef}
        id="document"
        name="document"
        type="file"
        accept={accept}
        className="sr-only"
        required
        onChange={(event) => {
          const file = event.currentTarget.files?.[0];
          setSelectedFileName(file?.name ?? "");
        }}
      />

      <div className="flex flex-col gap-3 rounded-[1.3rem] border border-input bg-background p-3 shadow-xs transition-[border-color,box-shadow] hover:border-border focus-within:border-ring focus-within:ring-4 focus-within:ring-ring/50">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-full border border-border/80 bg-secondary/80 px-5 text-sm font-medium text-foreground"
            onClick={() => fileInputRef.current?.click()}
          >
            Elegir archivo
          </button>
          <div className="min-w-0 flex-1 text-sm text-muted-foreground">
            <span className="block truncate">
              {selectedFileName || "Ningun archivo seleccionado"}
            </span>
          </div>
        </div>

        <p className="text-xs leading-5 text-muted-foreground">
          Use este selector para adjuntar el PDF o imagen directamente a este
          intake.
        </p>
      </div>
    </>
  );
}

function OriginSelector({
  defaultValue,
}: {
  defaultValue: IntakeDocumentSource;
}) {
  const [selectedOrigin, setSelectedOrigin] =
    useState<IntakeDocumentSource>(defaultValue);

  return (
    <div className="grid gap-3">
      <input type="hidden" name="uploadedBy" value={selectedOrigin} />

      {(
        Object.entries(intakeDocumentSourceLabels) as [
          IntakeDocumentSource,
          string,
        ][]
      ).map(([value, label]) => {
        const isSelected = selectedOrigin === value;

        return (
          <button
            key={value}
            id={`uploadedBy-${value}`}
            type="button"
            className={`flex w-full items-center gap-3 rounded-[1.2rem] border px-4 py-3 text-left transition-colors ${
              isSelected
                ? "border-primary/30 bg-primary/8"
                : "border-border/80 bg-background hover:bg-accent/25"
            }`}
            onClick={() => setSelectedOrigin(value)}
            aria-pressed={isSelected}
          >
            <span
              aria-hidden="true"
              className={`flex size-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors ${
                isSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input bg-background"
              }`}
            >
              {isSelected ? <Check className="size-3.5" /> : null}
            </span>
            <span className="flex flex-col gap-1">
              <span className="text-sm font-medium text-foreground">
                {label}
              </span>
              <span className="text-sm leading-6 text-muted-foreground">
                {originDescriptions[value]}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

const originDescriptions: Record<IntakeDocumentSource, string> = {
  admin: "Documento cargado manualmente por administracion.",
  customer: "Documento incorporado o enviado por el cliente.",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      size="lg"
      className="h-12 w-full rounded-full px-6 sm:w-fit"
      disabled={pending}
    >
      {pending ? "Adjuntando documento..." : "Agregar documento"}
    </Button>
  );
}
