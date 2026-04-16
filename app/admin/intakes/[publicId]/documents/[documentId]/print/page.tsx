import { notFound } from "next/navigation";
import { PrintClient } from "@/app/admin/intakes/[publicId]/documents/[documentId]/print/print-client";
import { getIntakeDocumentRecord } from "@/lib/intakes";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type PrintDocumentPageProps = {
  params: Promise<{
    publicId: string;
    documentId: string;
  }>;
};

export default async function PrintDocumentPage({
  params,
}: PrintDocumentPageProps) {
  const { publicId, documentId } = await params;
  const numericDocumentId = Number(documentId);

  if (!Number.isFinite(numericDocumentId) || numericDocumentId <= 0) {
    notFound();
  }

  const document = getIntakeDocumentRecord(publicId, numericDocumentId);

  if (!document) {
    notFound();
  }

  const documentHref = `/admin/intakes/${publicId}/documents/${numericDocumentId}`;
  const previewKind = getDocumentPreviewKind(document.mimeType);

  return (
    <div className="min-h-screen bg-white p-4 text-black print:p-0">
      <PrintClient />

      {previewKind === "image" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={documentHref}
          alt={document.originalName}
          className="mx-auto h-auto max-w-full object-contain"
        />
      ) : null}

      {previewKind === "pdf" ? (
        <iframe
          src={`${documentHref}#toolbar=0&navpanes=0&scrollbar=0`}
          title={document.originalName}
          className="h-[calc(100vh-2rem)] w-full border-0 print:h-screen"
        />
      ) : null}

      {previewKind === "other" ? (
        <div className="mx-auto max-w-2xl space-y-3 rounded-xl border border-slate-200 p-6">
          <p className="text-lg font-semibold">{document.originalName}</p>
          <p className="text-sm text-slate-600">
            Este formato no tiene una vista de impresion integrada. Abra o
            descargue el archivo para imprimirlo manualmente.
          </p>
          <a
            href={documentHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-full border border-slate-300 px-4 py-2 text-sm font-medium"
          >
            Abrir documento
          </a>
        </div>
      ) : null}
    </div>
  );
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
