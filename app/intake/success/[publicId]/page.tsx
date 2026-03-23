import type { Metadata } from "next";
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
import { Separator } from "@/components/ui/separator";

type SuccessPageProps = {
  params: Promise<{
    publicId: string;
  }>;
};

export const metadata: Metadata = {
  title: "Consulta enviada",
  description:
    "Tu consulta fue recibida. Guarda la referencia para continuar el seguimiento.",
};

export default async function IntakeSuccessPage({
  params,
}: SuccessPageProps) {
  const { publicId } = await params;

  return (
    <div className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8">
      <Card className="w-full max-w-3xl border-primary/15">
        <CardHeader>
          <Badge variant="secondary">Consulta recibida</Badge>
          <CardTitle className="text-3xl">
            Hemos recibido su solicitud inicial.
          </CardTitle>
          <CardDescription className="text-base">
            La informacion ha quedado registrada y ya dispone de una referencia
            para continuar el seguimiento. No necesita crear una cuenta para
            este primer paso.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="rounded-[1.5rem] bg-secondary/80 p-5">
            <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
              Numero de referencia
            </p>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {publicId}
            </p>
          </div>

          <Separator />

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              "La informacion inicial ha quedado registrada.",
              "Si hace falta mas contexto o documentacion, continuaremos a partir de esta referencia.",
              "Puede volver al inicio o enviar otra consulta si lo necesita.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[1.2rem] border border-border/80 bg-background px-4 py-4 text-sm leading-6 text-muted-foreground"
              >
                {item}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="rounded-full px-6">
              <Link href="/intake">Enviar otra consulta</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full px-6"
            >
              <Link href="/">Volver al inicio</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
