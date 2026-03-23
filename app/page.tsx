import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IntakeForm } from "@/app/intake/intake-form";

export const metadata: Metadata = {
  title: "Gestion de multas",
  description:
    "Presente su consulta por multas o infracciones y reciba una referencia para el seguimiento.",
};

export default function Home() {
  return (
    <div id="top" className="relative flex-1 overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top_left,rgba(171,128,87,0.18),transparent_38%),radial-gradient(circle_at_top_right,rgba(226,210,185,0.42),transparent_34%)]" />

      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center px-5 py-4 sm:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
              Nomarys
            </p>
            <p className="text-sm text-muted-foreground">
              Consulta inicial por multas e infracciones
            </p>
          </div>
        </div>
      </header>

      <main className="px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[minmax(0,0.95fr)_36rem]">
          <div className="flex max-w-3xl flex-col gap-6 pt-2">
            <Badge>Consulta inicial</Badge>

            <div className="flex flex-col gap-4">
              <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Presente su consulta de forma directa.
              </h1>
              <p className="text-lg leading-8 text-muted-foreground sm:text-xl">
                Complete el formulario con la informacion necesaria para iniciar
                la revision del caso.
              </p>
            </div>

            <div className="rounded-[1.6rem] border border-primary/12 bg-[linear-gradient(180deg,rgba(249,245,240,0.86),rgba(255,255,255,0.9))] px-5 py-4">
              <p className="text-sm leading-6 text-muted-foreground">
                Datos habituales: patente, DNI, contacto, jurisdiccion y una
                breve descripcion de lo ocurrido. No es necesario crear una
                cuenta.
              </p>
            </div>

            <p className="text-sm leading-6 text-muted-foreground">
              Al finalizar, recibira una referencia para el seguimiento.
            </p>
          </div>

          <Card className="border-primary/15">
            <CardHeader>
              <CardTitle>Formulario de consulta</CardTitle>
              <CardDescription className="text-base">
                La informacion quedara registrada para su revision.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <IntakeForm />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
