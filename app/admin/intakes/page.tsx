import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { intakeStatusLabels, type IntakeStatus } from "@/lib/intake-form";
import { listIntakes } from "@/lib/intakes";

export const dynamic = "force-dynamic";

type IntakeInboxPageProps = {
  searchParams: Promise<{
    status?: string | string[];
  }>;
};

export default async function IntakeInboxPage({
  searchParams,
}: IntakeInboxPageProps) {
  const resolvedSearchParams = await searchParams;
  const intakes = listIntakes();
  const activeStatus = getStatusFilter(
    getSearchParamValue(resolvedSearchParams.status),
  );
  const filteredIntakes =
    activeStatus === "all"
      ? intakes
      : intakes.filter((intake) => intake.status === activeStatus);
  const statusFilters = [
    {
      value: "all" as const,
      label: "Todos",
      count: intakes.length,
      href: "/admin/intakes",
    },
    ...Object.entries(intakeStatusLabels).map(([value, label]) => ({
      value: value as IntakeStatus,
      label,
      count: intakes.filter((intake) => intake.status === value).length,
      href: `/admin/intakes?status=${value}`,
    })),
  ];

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
                Vista en tabla para revisar ingresos recientes con una lectura
                mas directa del estado, contacto y contexto de cada consulta.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" variant="outline" className="rounded-full px-6">
              <Link href="/intake">Abrir formulario publico</Link>
            </Button>
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
                intakes.filter(
                  (intake) => intake.hasDocuments || intake.documentCount > 0,
                ).length,
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
          <>
            <Card className="border-primary/15">
              <CardHeader className="gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-2">
                  <CardTitle>Vista de trabajo</CardTitle>
                  <CardDescription>
                    Estado como columna y filtro rapido para mantener la bandeja
                    simple de recorrer.
                  </CardDescription>
                </div>
                <p className="text-sm text-muted-foreground">
                  Mostrando {filteredIntakes.length} de {intakes.length} intakes
                </p>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3 pt-0">
                {statusFilters.map((filter) => {
                  const isActive = filter.value === activeStatus;

                  return (
                    <Button
                      key={filter.value}
                      asChild
                      size="sm"
                      variant={isActive ? "default" : "outline"}
                    >
                      <Link href={filter.href}>
                        {filter.label}
                        <span className="text-xs opacity-80">
                          {filter.count}
                        </span>
                      </Link>
                    </Button>
                  );
                })}
              </CardContent>
            </Card>

            {filteredIntakes.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>No hay intakes con ese filtro</CardTitle>
                  <CardDescription>
                    Pruebe volver a todos los estados para recuperar la vista
                    completa.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline">
                    <Link href="/admin/intakes">Ver todos</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="overflow-hidden border-primary/15">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1120px] border-collapse text-sm">
                    <thead className="bg-secondary/60 text-left">
                      <tr className="border-b border-border/80">
                        <TableHead>Ingreso</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Contacto</TableHead>
                        <TableHead>Vehiculo</TableHead>
                        <TableHead>Documentacion</TableHead>
                        <TableHead>Resumen</TableHead>
                        <TableHead>Accion</TableHead>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredIntakes.map((intake) => (
                        <tr
                          key={intake.id}
                          className="border-b border-border/70 align-top transition-colors hover:bg-accent/20 last:border-b-0"
                        >
                          <td className="px-4 py-4">
                            <div className="space-y-1">
                              <Link
                                href={`/admin/intakes/${intake.publicId}`}
                                className="font-medium text-foreground transition-colors hover:text-primary"
                              >
                                {intake.fullName}
                              </Link>
                              <Badge variant="outline">{intake.publicId}</Badge>
                              <p className="text-xs text-muted-foreground">
                                DNI {intake.dni}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-muted-foreground">
                            {formatDateTime(intake.createdAt)}
                          </td>
                          <td className="px-4 py-4">
                            <StatusBadge status={intake.status} />
                          </td>
                          <td className="px-4 py-4">
                            <div className="space-y-1 text-muted-foreground">
                              <p className="text-foreground">{intake.email}</p>
                              <p>{intake.phone}</p>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="space-y-1 text-muted-foreground">
                              <p className="font-medium text-foreground">
                                {intake.vehiclePlate}
                              </p>
                              <p>{intake.jurisdiction}</p>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="space-y-2">
                              <Badge
                                variant={
                                  intake.hasDocuments || intake.documentCount > 0
                                    ? "secondary"
                                    : "outline"
                                }
                              >
                                {intake.documentCount > 0
                                  ? `${intake.documentCount} archivo${
                                      intake.documentCount === 1 ? "" : "s"
                                    }`
                                  : intake.hasDocuments
                                    ? "Indicada"
                                    : "No indicada"}
                              </Badge>
                              {intake.documentCount > 0 ? (
                                <p className="text-xs text-muted-foreground">
                                  Ya hay documentacion cargada
                                </p>
                              ) : null}
                            </div>
                          </td>
                          <td className="px-4 py-4 leading-6 text-muted-foreground">
                            <p className="max-w-md text-pretty text-foreground">
                              {truncate(intake.summary, 180)}
                            </p>
                          </td>
                          <td className="px-4 py-4">
                            <Button asChild size="sm" variant="outline">
                              <Link href={`/admin/intakes/${intake.publicId}`}>
                                Abrir detalle
                              </Link>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </>
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

function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
      {children}
    </th>
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

function StatusBadge({ status }: { status: IntakeStatus }) {
  return <Badge variant="secondary">{intakeStatusLabels[status]}</Badge>;
}

function getSearchParamValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

function getStatusFilter(value: string): IntakeStatus | "all" {
  if (Object.hasOwn(intakeStatusLabels, value)) {
    return value as IntakeStatus;
  }

  return "all";
}
