import { getIntakeDocumentFile } from "@/lib/intakes";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type IntakeDocumentRouteProps = {
  params: Promise<{
    publicId: string;
    documentId: string;
  }>;
};

export async function GET(
  request: Request,
  { params }: IntakeDocumentRouteProps,
) {
  const { publicId, documentId } = await params;
  const numericDocumentId = Number(documentId);

  if (!Number.isFinite(numericDocumentId) || numericDocumentId <= 0) {
    return new Response("Not found", { status: 404 });
  }

  const document = getIntakeDocumentFile(publicId, numericDocumentId);

  if (!document) {
    return new Response("Not found", { status: 404 });
  }

  const requestUrl = new URL(request.url);
  const shouldDownload = requestUrl.searchParams.get("download") === "1";
  const asciiFilename = toAsciiFilename(document.originalName);
  const contentDisposition = shouldDownload ? "attachment" : "inline";

  return new Response(document.buffer, {
    status: 200,
    headers: {
      "Cache-Control": "no-store",
      "Content-Disposition": `${contentDisposition}; filename="${asciiFilename}"; filename*=UTF-8''${encodeURIComponent(document.originalName)}`,
      "Content-Length": String(document.sizeBytes),
      "Content-Type": document.mimeType || "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function toAsciiFilename(value: string) {
  const normalizedValue = value
    .normalize("NFKD")
    .replace(/[^\x00-\x7F]/g, "")
    .replace(/["\\]/g, "")
    .trim();

  return normalizedValue.length > 0 ? normalizedValue : "documento";
}
