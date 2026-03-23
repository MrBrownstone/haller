import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IntakeForm } from "@/app/intake/intake-form";

type IntakePageProps = {
  searchParams: Promise<{
    dni?: string | string[];
    vehiclePlate?: string | string[];
  }>;
};

export const metadata: Metadata = {
  title: "Iniciar consulta",
  description:
    "Complete sus datos para abrir una consulta por multas o infracciones sin crear una cuenta.",
};

export default async function IntakePage({ searchParams }: IntakePageProps) {
  const resolvedSearchParams = await searchParams;
  const initialValues = {
    dni: normalizePrefilledDni(getSearchParamValue(resolvedSearchParams.dni)),
    vehiclePlate: normalizePrefilledVehiclePlate(
      getSearchParamValue(resolvedSearchParams.vehiclePlate),
    ),
  };
  const hasPrefilledValues = Boolean(
    initialValues.dni || initialValues.vehiclePlate,
  );

  return (
    <div className="relative flex-1 overflow-hidden px-5 py-12 sm:px-8 sm:py-16">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[30rem] bg-[radial-gradient(circle_at_top_left,rgba(171,128,87,0.2),transparent_36%),radial-gradient(circle_at_top_right,rgba(226,210,185,0.4),transparent_32%)]" />

      <div className="relative mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[minmax(0,1.15fr)_24rem]">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="inline-flex text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Volver al inicio
            </Link>
            <Badge>Formulario de consulta</Badge>
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Complete sus datos y presente su consulta.
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
              Este formulario deja la consulta lista para revision. Se
              solicitan datos de contacto, jurisdiccion y una breve descripcion
              para comprender el caso desde el inicio.
            </p>
            {hasPrefilledValues ? (
              <div className="flex flex-wrap gap-3">
                {initialValues.vehiclePlate ? (
                  <div className="rounded-full border border-border/80 bg-background/80 px-4 py-2 text-sm text-muted-foreground shadow-sm">
                    Patente:{" "}
                    <strong className="text-foreground">
                      {initialValues.vehiclePlate}
                    </strong>
                  </div>
                ) : null}
                {initialValues.dni ? (
                  <div className="rounded-full border border-border/80 bg-background/80 px-4 py-2 text-sm text-muted-foreground shadow-sm">
                    DNI:{" "}
                    <strong className="text-foreground">{initialValues.dni}</strong>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          <Card id="intake-form" className="border-primary/15">
            <CardHeader>
              <CardTitle>Datos de contacto y contexto</CardTitle>
              <CardDescription className="text-base">
                Si ya ingreso patente y DNI en la pantalla anterior, esos datos
                quedan precargados para no tener que ingresarlos nuevamente.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <IntakeForm
                key={`${initialValues.vehiclePlate}-${initialValues.dni}`}
                initialValues={initialValues}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="overflow-hidden border-primary/15">
            <CardHeader className="bg-[linear-gradient(180deg,rgba(249,245,240,0.94),rgba(255,255,255,0.92))]">
              <Badge variant="secondary">Antes de enviar</Badge>
              <CardTitle>Informacion conveniente</CardTitle>
              <CardDescription>
                No necesita un expediente completo. Solo la informacion minima
                para presentar la consulta de forma ordenada.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 pt-6">
              {[
                "Patente y DNI.",
                "Un telefono o WhatsApp donde podamos continuar.",
                "La jurisdiccion o el lugar donde surgio la multa.",
                "Un resumen breve con fechas, montos o notificaciones si dispone de ellas.",
                "Al finalizar recibira una referencia para el seguimiento.",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[1.2rem] border border-border/80 bg-background px-4 py-3 text-sm leading-6 text-muted-foreground"
                >
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>
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

function normalizePrefilledDni(value: string) {
  return value.replace(/\D/g, "").slice(0, 10);
}

function normalizePrefilledVehiclePlate(value: string) {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
}
