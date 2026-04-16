"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteIntakeDocumentAction } from "@/app/admin/intakes/actions";
import {
  intakeDocumentSourceLabels,
  type IntakeDocumentSource,
} from "@/lib/intake-form";

type IntakeDocumentListItem = {
  id: number;
  originalName: string;
  uploadedBy: IntakeDocumentSource;
  note: string;
  createdAt: string;
};

type DocumentTableProps = {
  documents: IntakeDocumentListItem[];
  publicId: string;
  selectedDocumentId: number | null;
};

export function DocumentTable({
  documents,
  publicId,
  selectedDocumentId,
}: DocumentTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="overflow-x-auto rounded-[1.4rem] border border-border/80">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead className="bg-secondary/60 text-left">
          <tr className="border-b border-border/80">
            <TableHead>Documento</TableHead>
            <TableHead>Origen</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Nota</TableHead>
            <TableHead>Acciones</TableHead>
          </tr>
        </thead>
        <tbody>
          {documents.map((document) => {
            const isSelected = selectedDocumentId === document.id;

            return (
              <tr
                key={document.id}
                className={`border-b border-border/70 align-top transition-colors last:border-b-0 ${
                  isSelected
                    ? "bg-primary/6"
                    : "bg-card/80 hover:bg-accent/20"
                } ${isPending ? "opacity-70" : "cursor-pointer"}`}
                onClick={() =>
                  router.push(`/admin/intakes/${publicId}?document=${document.id}`)
                }
              >
                <td className="px-4 py-4">
                  <button
                    type="button"
                    className="font-medium text-foreground transition-colors hover:text-primary"
                    onClick={(event) => {
                      event.stopPropagation();
                      router.push(`/admin/intakes/${publicId}?document=${document.id}`);
                    }}
                  >
                    {document.originalName}
                  </button>
                </td>
                <td className="px-4 py-4 text-muted-foreground">
                  {intakeDocumentSourceLabels[document.uploadedBy]}
                </td>
                <td className="px-4 py-4 text-muted-foreground">
                  {formatDateTime(document.createdAt)}
                </td>
                <td className="px-4 py-4 text-muted-foreground">
                  {document.note || "Sin nota"}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon-sm"
                      variant="outline"
                      aria-label={`Descargar ${document.originalName}`}
                      title="Descargar"
                      onClick={(event) => {
                        event.stopPropagation();
                        window.location.href = `/admin/intakes/${publicId}/documents/${document.id}?download=1`;
                      }}
                    >
                      <Download />
                    </Button>

                    <Button
                      size="icon-sm"
                      variant="destructive"
                      aria-label={`Borrar ${document.originalName}`}
                      title="Borrar"
                      onClick={(event) => {
                        event.stopPropagation();

                        const confirmed = window.confirm(
                          "Se borrara este documento del intake. Desea continuar?",
                        );

                        if (!confirmed) {
                          return;
                        }

                        startTransition(async () => {
                          await deleteIntakeDocumentAction(publicId, document.id);
                          router.push(`/admin/intakes/${publicId}`);
                          router.refresh();
                        });
                      }}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
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
