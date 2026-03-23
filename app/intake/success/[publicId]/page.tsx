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

type SuccessPageProps = {
  params: Promise<{
    publicId: string;
  }>;
};

export default async function IntakeSuccessPage({
  params,
}: SuccessPageProps) {
  const { publicId } = await params;

  return (
    <div className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8">
      <Card className="w-full max-w-2xl border-primary/15">
        <CardHeader>
          <Badge variant="secondary">Intake creado</Badge>
          <CardTitle className="text-3xl">
            Recibimos tu solicitud inicial
          </CardTitle>
          <CardDescription className="text-base">
            Nuestro equipo ya puede revisar la informacion cargada. No hace
            falta que crees una cuenta para este primer paso.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-[1.5rem] bg-secondary/80 p-5">
            <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
              Referencia
            </p>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {publicId}
            </p>
          </div>

          <div className="space-y-3 text-sm leading-6 text-muted-foreground">
            <p>
              Estado inicial: <strong className="text-foreground">Pendiente de revision</strong>
            </p>
            <p>
              Si indicaste que tenes documentacion disponible, ese dato ya queda
              asociado al intake para el siguiente paso del flujo.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/intake" className={buttonVariants({ size: "lg" })}>
              Cargar otro intake
            </Link>
            <Link
              href="/"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              Volver al inicio
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
