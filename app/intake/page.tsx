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
import { IntakeForm } from "@/app/intake/intake-form";

export default function IntakePage() {
  return (
    <div className="relative flex-1 overflow-hidden px-5 py-12 sm:px-8 sm:py-16">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_top_left,rgba(171,128,87,0.2),transparent_36%),radial-gradient(circle_at_top_right,rgba(226,210,185,0.4),transparent_32%)]" />

      <div className="relative mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[minmax(0,1.2fr)_24rem]">
        <div className="space-y-8">
          <div className="space-y-4">
            <Badge>Fase 0 activa</Badge>
            <div className="space-y-4">
              <Link
                href="/"
                className="inline-flex text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Volver al inicio
              </Link>
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Carga inicial de intake para multas e infracciones
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
                Este primer flujo permite que una persona entre al sitio, deje
                los datos esenciales y cree un intake para que el estudio lo
                revise. Sin cuenta, sin pasos de mas y con estado inicial claro.
              </p>
            </div>
          </div>

          <Card className="border-primary/15">
            <CardHeader>
              <CardTitle>Datos que pedimos en esta etapa</CardTitle>
              <CardDescription>
                Minimo viable para abrir la revision y evitar idas y vueltas en
                el primer contacto.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {[
                "Nombre y apellido",
                "DNI",
                "Email",
                "Telefono o WhatsApp",
                "Patente",
                "Jurisdiccion",
                "Resumen del caso",
                "Indicacion opcional de documentacion disponible",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-secondary/80 px-4 py-3 text-sm text-foreground"
                >
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Crear intake</CardTitle>
              <CardDescription>
                El estado inicial sera <strong>pending_review</strong>, con
                etiqueta visible <strong>Pendiente de revision</strong>.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <IntakeForm />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="overflow-hidden border-primary/15">
            <CardHeader className="bg-[linear-gradient(180deg,rgba(249,245,240,0.94),rgba(255,255,255,0.92))]">
              <Badge variant="secondary">Modelo inicial</Badge>
              <CardTitle>Intake primero, case despues</CardTitle>
              <CardDescription>
                La persona crea un intake. Mas adelante, el estudio decide si
                eso se convierte en un case formal.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-6">
              {[
                "Entidad actual: intake",
                "Estado inicial: pending_review",
                "Sin cuentas de usuario por ahora",
                "SQLite local para desarrollo",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-border/80 bg-background px-4 py-3 text-sm text-muted-foreground"
                >
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vista interna disponible</CardTitle>
              <CardDescription>
                Mientras no haya autenticacion, la bandeja de revision queda
                como una vista local para desarrollo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-6 text-muted-foreground">
                Ya queda preparada una pagina interna para revisar los intakes
                cargados y validar el flujo extremo a extremo.
              </p>
              <Button asChild variant="outline">
                <Link href="/admin/intakes">Ver bandeja interna</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
