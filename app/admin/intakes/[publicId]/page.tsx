import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HelpTooltip } from "@/components/ui/help-tooltip";
import { DocumentTable } from "@/app/admin/intakes/[publicId]/document-table";
import { DocumentUploadForm } from "@/app/admin/intakes/[publicId]/document-upload-form";
import { updateIntakeStatusAction } from "@/app/admin/intakes/actions";
import {
  intakeStatusLabels,
  intakeStatusOrder,
  type IntakeStatus,
} from "@/lib/intake-form";
import { getIntakeDetailByPublicId, type IntakeDocumentRecord } from "@/lib/intakes";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type IntakeDetailPageProps = {
  params: Promise<{
    publicId: string;
  }>;
  searchParams: Promise<{
    document?: string | string[];
  }>;
};

export default async function IntakeDetailPage({
  params,
  searchParams,
}: IntakeDetailPageProps) {
  const { publicId } = await params;
  const resolvedSearchParams = await searchParams;
  const intake = getIntakeDetailByPublicId(publicId);

  if (!intake) {
    notFound();
  }

  const selectedDocumentId = parseDocumentId(
    getSearchParamValue(resolvedSearchParams.document),
  );
  const selectedDocument =
    selectedDocumentId === null
      ? null
      : intake.documents.find((document) => document.id === selectedDocumentId) ??
        null;

  return (
    <div className="flex-1 px-5 py-12 sm:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <Badge variant="secondary">Revisión interna</Badge>
            <div className="space-y-3">
              <Link
                href="/admin/intakes"
                className="inline-flex text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Volver a la bandeja
              </Link>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-4xl font-semibold tracking-tight text-foreground">
                  {intake.fullName}
                </h1>
                <Badge variant="outline">{intake.publicId}</Badge>
                <StatusBadge status={intake.status} />
              </div>
              <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
                Vista de trabajo para revisar el intake, adjuntar
                documentacion, cambiar estado y consultar todo el contexto
                operativo desde un solo lugar.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" variant="outline" className="rounded-full px-6">
              <Link href="/intake">Abrir formulario publico</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Metric
            value={formatDateTime(intake.createdAt)}
            label="fecha de ingreso"
          />
          <Metric
            value={String(intake.documentCount)}
            label="documentos adjuntos"
          />
          <Metric
            value={intake.hasDocuments ? "Si" : "No"}
            label="declaro documentacion al crear"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_360px]">
          <div className="flex flex-col gap-6">
            <Card className="border-primary/15">
              <CardHeader>
                <CardTitle>Datos base</CardTitle>
                <CardDescription>
                  Identidad, contacto y vehiculo declarados al enviar la
                  consulta.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <Definition label="Nombre y apellido" value={intake.fullName} />
                <Definition label="DNI" value={intake.dni} />
                <Definition label="Email" value={intake.email} />
                <Definition label="Telefono" value={intake.phone} />
                <Definition label="Patente" value={intake.vehiclePlate} />
                <Definition label="Jurisdiccion" value={intake.jurisdiction} />
              </CardContent>
            </Card>

            <Card className="border-primary/15">
              <CardHeader>
                <CardTitle>Resumen aportado</CardTitle>
                <CardDescription>
                  Contexto textual recibido desde el formulario publico.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {intake.summary ? (
                  <p className="whitespace-pre-wrap leading-7 text-foreground">
                    {intake.summary}
                  </p>
                ) : (
                  <p className="leading-7 text-muted-foreground">
                    El intake se envio sin informacion adicional.
                  </p>
                )}

                {intake.hasDocuments && intake.documentCount === 0 ? (
                  <div className="rounded-[1.4rem] border border-border/80 bg-secondary/60 px-4 py-3 text-sm leading-6 text-muted-foreground">
                    La persona indico que dispone de documentacion, pero todavia
                    no hay archivos cargados en este intake.
                  </div>
                ) : null}
              </CardContent>
            </Card>

            <Card className="border-primary/15">
              <CardHeader>
                <CardTitle>Documentacion</CardTitle>
                <CardDescription>
                  Tabla simple para gestionar los archivos adjuntos de este
                  intake.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {intake.documents.length === 0 ? (
                  <div className="rounded-[1.5rem] border border-dashed border-border/80 bg-secondary/50 px-5 py-10 text-center">
                    <p className="text-base font-medium text-foreground">
                      Todavia no hay archivos asociados
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Puede cargar el primer PDF o imagen desde el panel lateral.
                    </p>
                  </div>
                ) : (
                  <>
                    <DocumentTable
                      documents={intake.documents}
                      publicId={intake.publicId}
                      selectedDocumentId={selectedDocument?.id ?? null}
                    />
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col gap-6">
            <Card className="border-primary/15">
              <CardHeader>
                <CardTitle>Transicion de estado</CardTitle>
                <CardDescription>
                  Cada cambio revalida la bandeja y deja este intake listo para
                  la siguiente etapa operativa.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-[1.4rem] border border-primary/15 bg-primary/8 px-4 py-4">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    Estado actual
                  </p>
                  <p className="mt-2 text-base font-semibold text-foreground">
                    {intakeStatusLabels[intake.status]}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {intakeStatusDescriptions[intake.status]}
                  </p>
                </div>

                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  Pase el cursor por cada opcion para ver la descripcion del
                  estado.
                </p>

                <div className="grid gap-3">
                  {intakeStatusOrder.map((nextStatus) => {
                    const isCurrentStatus = nextStatus === intake.status;
                    const action = updateIntakeStatusAction.bind(
                      null,
                      intake.publicId,
                      nextStatus,
                    );

                    return (
                      <div key={nextStatus} className="relative">
                        <form action={action}>
                          <Button
                            type="submit"
                            variant={isCurrentStatus ? "secondary" : "outline"}
                            className="h-13 w-full justify-start rounded-[1.3rem] px-4 pr-12 text-left"
                            disabled={isCurrentStatus}
                            aria-label={intakeStatusLabels[nextStatus]}
                          >
                            <span className="flex min-w-0 items-center gap-3">
                              <span className="truncate">
                                {intakeStatusLabels[nextStatus]}
                              </span>
                              {isCurrentStatus ? (
                                <Badge variant="outline" className="text-[0.65rem]">
                                  Actual
                                </Badge>
                              ) : null}
                            </span>
                          </Button>
                        </form>

                        <HelpTooltip
                          content={intakeStatusDescriptions[nextStatus]}
                          label={`Descripcion de ${intakeStatusLabels[nextStatus]}`}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                          side="top"
                        />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/15">
              <CardHeader>
                <CardTitle>Agregar documentacion</CardTitle>
                <CardDescription>
                  Carga manual para completar lo que el cliente envio por otro
                  canal o lo que incorpora administracion.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DocumentUploadForm publicId={intake.publicId} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {selectedDocument ? (
        <DocumentPreviewModal
          publicId={intake.publicId}
          document={selectedDocument}
        />
      ) : null}
    </div>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[1.4rem] border border-primary/15 bg-card/90 p-4">
      <p className="text-lg font-semibold text-foreground">{value}</p>
      <p className="mt-2 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function Definition({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.4rem] bg-secondary/60 p-4">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-base text-foreground">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: IntakeStatus }) {
  return <Badge variant="secondary">{intakeStatusLabels[status]}</Badge>;
}

function DocumentPreviewModal({
  publicId,
  document,
}: {
  publicId: string;
  document: IntakeDocumentRecord;
}) {
  const documentHref = createDocumentHref(publicId, document.id);
  const previewKind = getDocumentPreviewKind(document.mimeType);

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 px-4 py-6 backdrop-blur-[2px]">
      <Link
        href={`/admin/intakes/${publicId}`}
        className="absolute inset-0"
        aria-label="Cerrar vista previa"
      />

      <div className="relative z-[91] flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[1.7rem] border border-border/80 bg-card shadow-[0_30px_100px_-40px_rgba(0,0,0,0.55)]">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border/80 px-5 py-4">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Vista previa
            </p>
            <p className="text-base font-semibold text-foreground">
              {document.originalName}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{document.mimeType}</Badge>
            <Badge variant="secondary">{formatBytes(document.sizeBytes)}</Badge>
            <Button asChild size="icon-sm" variant="outline">
              <Link
                href={createDocumentHref(publicId, document.id, true)}
                aria-label="Descargar documento"
                title="Descargar"
              >
                <Download />
              </Link>
            </Button>
            <Button asChild size="icon-sm" variant="outline">
              <Link
                href={`/admin/intakes/${publicId}`}
                aria-label="Cerrar vista previa"
                title="Cerrar"
              >
                <X />
              </Link>
            </Button>
          </div>
        </div>

        <div className="overflow-auto p-5">
          {previewKind === "image" ? (
            <div className="overflow-hidden rounded-[1.4rem] border border-border/80 bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={documentHref}
                alt={document.originalName}
                className="h-auto max-h-[78vh] w-full object-contain"
              />
            </div>
          ) : null}

          {previewKind === "pdf" ? (
            <div className="overflow-hidden rounded-[1.4rem] border border-border/80 bg-white">
              <iframe
                src={`${documentHref}#toolbar=0&navpanes=0&scrollbar=1`}
                title={document.originalName}
                className="min-h-[78vh] w-full"
              />
            </div>
          ) : null}

          {previewKind === "other" ? (
            <div className="rounded-[1.4rem] border border-dashed border-border/80 bg-secondary/40 px-5 py-10 text-center">
              <p className="text-base font-medium text-foreground">
                No hay vista previa integrada para este formato.
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Descargue el archivo desde la tabla o desde el boton superior.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function getSearchParamValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

function parseDocumentId(value: string) {
  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    return null;
  }

  return parsedValue;
}

function createDocumentHref(
  publicId: string,
  documentId: number,
  download = false,
) {
  const search = download ? "?download=1" : "";
  return `/admin/intakes/${publicId}/documents/${documentId}${search}`;
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatBytes(value: number) {
  if (value < 1024) {
    return `${value} B`;
  }

  if (value < 1024 * 1024) {
    return `${(value / 1024).toFixed(1)} KB`;
  }

  return `${(value / 1024 / 1024).toFixed(1)} MB`;
}

function getDocumentPreviewKind(mimeType: string) {
  if (mimeType.startsWith("image/")) {
    return "image";
  }

  if (mimeType === "application/pdf") {
    return "pdf";
  }

  return "other";
}

const intakeStatusDescriptions: Record<IntakeStatus, string> = {
  pending_review: "Ingreso recibido y todavia sin clasificacion operativa.",
  awaiting_documents: "Hay que pedir o esperar mas respaldo antes de avanzar.",
  under_review: "El equipo ya esta evaluando el contenido y los adjuntos.",
  ready_for_case: "El intake tiene material suficiente para pasar a caso.",
  rejected: "El ingreso se descarto o no corresponde continuar por esta via.",
};
