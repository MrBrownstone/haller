import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { intakeStatusLabels } from "@/lib/intake-form";
import { listIntakes } from "@/lib/intakes";

export const dynamic = "force-dynamic";

export default function IntakeInboxPage() {
  const intakes = listIntakes();

  return (
    <div className="flex-1 px-5 py-12 sm:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <Badge variant="secondary">Uso interno local</Badge>
            <div className="space-y-3">
              <Link
                href="/"
                className="inline-flex text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Volver al inicio
              </Link>
              <h1 className="text-4xl font-semibold tracking-tight text-foreground">
                Bandeja de intakes
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
                Vista inicial para que el estudio revise lo que entra desde la
                webapp. Aun no tiene autenticacion ni workflow avanzado.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/intake"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              Abrir formulario publico
            </Link>
          </div>
        </div>

        <Card className="border-primary/15">
          <CardContent className="grid gap-4 pt-6 sm:grid-cols-3">
            <Metric value={String(intakes.length)} label="intakes cargados" />
            <Metric
              value={String(
                intakes.filter((intake) => intake.status === "pending_review")
                  .length,
              )}
              label="pendientes de revision"
            />
            <Metric
              value={String(
                intakes.filter((intake) => intake.hasDocuments).length,
              )}
              label="con documentacion disponible"
            />
          </CardContent>
        </Card>

        {intakes.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No hay intakes todavia</CardTitle>
              <CardDescription>
                Cuando alguien complete el formulario publico, aparecera aqui.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {intakes.map((intake) => (
              <Card key={intake.id} className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between gap-4">
                    <Badge>{intake.publicId}</Badge>
                    <span className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                      {intakeStatusLabels[intake.status]}
                    </span>
                  </div>
                  <CardTitle>{intake.fullName}</CardTitle>
                  <CardDescription>
                    {formatDateTime(intake.createdAt)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                  <Detail label="DNI" value={intake.dni} />
                  <Detail label="Email" value={intake.email} />
                  <Detail label="Telefono" value={intake.phone} />
                  <Detail label="Patente" value={intake.vehiclePlate} />
                  <Detail label="Jurisdiccion" value={intake.jurisdiction} />
                  <Detail
                    label="Documentacion"
                    value={intake.hasDocuments ? "Disponible" : "No indicada"}
                  />
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                      Resumen
                    </p>
                    <p className="rounded-2xl bg-secondary/70 px-4 py-3 leading-6 text-foreground">
                      {truncate(intake.summary, 220)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[1.4rem] bg-secondary/70 p-4">
      <p className="text-2xl font-semibold text-foreground">{value}</p>
      <p className="mt-2 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </p>
      <p className="text-foreground">{value}</p>
    </div>
  );
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function truncate(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1)}…`;
}
