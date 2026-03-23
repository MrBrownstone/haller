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
import { cn } from "@/lib/utils";

const capabilityGroups = [
  {
    title: "Ingreso y apertura",
    description:
      "El sistema recibe consultas, valida datos basicos y abre el intake con la informacion minima necesaria.",
    items: ["C1 Ingreso de datos", "C2 Gestion de casos", "C6 Ingesta documental"],
  },
  {
    title: "Modelo operativo",
    description:
      "Se estructuran infracciones, relaciones legales y seguimiento para dar trazabilidad end-to-end.",
    items: [
      "C3 Registro de infracciones",
      "C4 Clasificacion",
      "C7 Identidad legal",
      "C10 Presentacion y seguimiento",
    ],
  },
  {
    title: "Asistencia profesional",
    description:
      "El modulo automatiza lo repetitivo y deja el criterio juridico en manos del administrador.",
    items: ["C5 Presupuesto asistido", "C8 Estrategia", "C9 Escritos automaticos"],
  },
];

const processSteps = [
  "El usuario inicia una consulta.",
  "El sistema solicita datos minimos.",
  "Se crea un intake en el sistema.",
  "Administrador o asistente revisan infracciones.",
  "Se define el presupuesto.",
  "El usuario acepta o rechaza.",
  "Se solicita documentacion adicional.",
  "Se define la estrategia.",
  "Se genera el escrito correspondiente.",
  "Se presenta y se hace seguimiento.",
];

const roadmapItems = [
  {
    code: "C1",
    title: "Ingreso de datos basicos",
    priority: "Alta",
    type: "CRUD",
  },
  {
    code: "C2",
    title: "Gestion y persistencia de casos",
    priority: "Alta",
    type: "CRUD + workflow",
  },
  {
    code: "C3",
    title: "Registro de infracciones",
    priority: "Media / Alta",
    type: "Modelo especifico",
  },
  {
    code: "C4",
    title: "Clasificacion de infracciones",
    priority: "Media",
    type: "Reglas simples",
  },
  {
    code: "C5",
    title: "Presupuesto y valuacion",
    priority: "Media",
    type: "Logica asistida",
  },
  {
    code: "C6",
    title: "Ingesta de documentacion",
    priority: "Alta",
    type: "CRUD + storage",
  },
  {
    code: "C7",
    title: "Identidad legal del caso",
    priority: "Media",
    type: "Consistencia",
  },
  {
    code: "C8",
    title: "Seleccion de estrategia",
    priority: "Media",
    type: "Dominio juridico",
  },
  {
    code: "C9",
    title: "Generacion de escritos",
    priority: "Alta",
    type: "Motor de templates",
  },
  {
    code: "C10",
    title: "Presentacion y seguimiento",
    priority: "Media",
    type: "Workflow",
  },
];

const implementationPhases = [
  {
    phase: "Fase 1",
    title: "Core operativo",
    description:
      "Base de casos, datos iniciales y documentos para que el estudio pueda operar con trazabilidad desde el dia uno.",
    items: ["C1", "C2", "C6"],
  },
  {
    phase: "Fase 2",
    title: "Modelo de infracciones",
    description:
      "Estructuracion del dominio para que las infracciones, personas y vehiculos queden conectados con consistencia.",
    items: ["C3", "C4", "C7", "C10"],
  },
  {
    phase: "Fase 3",
    title: "Asistencia y escritos",
    description:
      "Presupuestos asistidos, reglas progresivas de estrategia y automatizacion prioritaria de escritos.",
    items: ["C5", "C8", "C9"],
  },
  {
    phase: "Fase 4",
    title: "Canal WhatsApp",
    description:
      "Entrada conversacional para consultas y documentos, con IA opcional solo si aporta valor real.",
    items: ["Base sin IA", "Extraccion opcional"],
  },
];

const summaryStats = [
  { value: "10", label: "capacidades core" },
  { value: "235 h", label: "estimacion inicial" },
  { value: "USD 7.050", label: "sistema core" },
  { value: "USD 170-340", label: "operacion mensual" },
];

export default function Home() {
  return (
    <div className="relative flex-1 overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(circle_at_top_left,rgba(171,128,87,0.18),transparent_40%),radial-gradient(circle_at_top_right,rgba(226,210,185,0.45),transparent_36%)]" />

      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
              Nomarys
            </p>
            <p className="text-sm text-muted-foreground">
              Modulo independiente de Gestion de Multas
            </p>
          </div>

          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#alcance" className="transition-colors hover:text-foreground">
              Alcance
            </a>
            <a href="#roadmap" className="transition-colors hover:text-foreground">
              Roadmap
            </a>
            <a href="#fases" className="transition-colors hover:text-foreground">
              Fases
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section className="px-5 pb-18 pt-16 sm:px-8 sm:pt-24">
          <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[minmax(0,1.1fr)_28rem]">
            <div className="space-y-8">
              <Badge>Roadmap funcional v2</Badge>

              <div className="space-y-5">
                <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  Gestion de Multas para operar mejor, automatizar lo repetitivo
                  y mantener el criterio profesional en el centro.
                </h1>
                <p className="max-w-3xl text-lg leading-8 text-muted-foreground sm:text-xl">
                  El roadmap define un modulo separado, pero claramente alineado
                  al universo visual y operativo de Nomarys: intakes,
                  infracciones, documentos, estrategia y escritos dentro de un
                  flujo controlado.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="h-12 rounded-full px-6">
                  <Link href="/intake">Crear intake</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full px-6"
                >
                  <a href="#fases">Revisar fases sugeridas</a>
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {summaryStats.map((stat) => (
                  <Card key={stat.label} className="border-primary/10 bg-card/90">
                    <CardContent className="pt-6">
                      <p className="text-2xl font-semibold text-foreground">
                        {stat.value}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {stat.label}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <Card className="overflow-hidden border-primary/20">
                <CardHeader className="bg-[linear-gradient(135deg,rgba(120,76,45,0.13),rgba(255,255,255,0.15))]">
                  <Badge variant="secondary">Recomendacion del roadmap</Badge>
                  <CardTitle className="text-2xl">
                    Primer corte de construccion
                  </CardTitle>
                  <CardDescription className="text-base">
                    Empezar por el sistema core minimo y priorizar la
                    automatizacion de escritos cuando el modelo base este firme.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  {[
                    "C1 para capturar intakes rapido con dominio y DNI.",
                    "C2 para ordenar estados, datos y trazabilidad.",
                    "C6 para adjuntar documentacion desde el inicio.",
                    "C9 como automatizacion prioritaria una vez estabilizado el flujo.",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 rounded-2xl bg-secondary/80 p-4"
                    >
                      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                      <p className="text-sm leading-6 text-foreground">{item}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Encaje con Nomarys</CardTitle>
                  <CardDescription>
                    La extraccion es viable porque la UI existente ya esta
                    organizada en tokens y primitivas reutilizables.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    "Misma paleta, tipografia y ritmo visual.",
                    "Primitivas reutilizables para cards, badges y botones.",
                    "Separacion clara entre capa visual compartida y logica del modulo.",
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
            </div>
          </div>
        </section>

        <section id="alcance" className="px-5 py-18 sm:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <div className="mb-10 max-w-3xl">
              <Badge variant="outline">Alcance</Badge>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Un modulo operativo, no un asesor legal automatico
              </h2>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">
                El sistema esta pensado para ordenar informacion, reducir tareas
                manuales y escalar volumen. El juicio profesional sigue siendo
                la ultima capa de validacion.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {capabilityGroups.map((group) => (
                <Card key={group.title} className="h-full">
                  <CardHeader>
                    <CardTitle>{group.title}</CardTitle>
                    <CardDescription>{group.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className="rounded-2xl bg-secondary/75 px-4 py-3 leading-6"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-18 sm:px-8">
          <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[22rem_minmax(0,1fr)]">
            <Card className="border-primary/15 bg-[linear-gradient(180deg,rgba(249,245,240,0.95),rgba(255,255,255,0.92))]">
              <CardHeader>
                <Badge variant="secondary">Flujo</Badge>
                <CardTitle className="text-2xl">
                  Recorrido operativo completo
                </CardTitle>
                <CardDescription>
                  Desde la consulta inicial hasta la presentacion y el
                  seguimiento posterior.
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {processSteps.map((step, index) => (
                <Card key={step} className="relative overflow-hidden">
                  <CardContent className="pt-6">
                    <span className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                      Paso {index + 1}
                    </span>
                    <p className="mt-4 text-base leading-7 text-foreground">
                      {step}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="roadmap" className="px-5 py-18 sm:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <Badge variant="outline">Roadmap</Badge>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Capacidades funcionales del sistema core
                </h2>
                <p className="mt-4 text-lg leading-8 text-muted-foreground">
                  El roadmap ya delimita muy bien que automatizar, que dejar
                  asistido y donde preservar control humano.
                </p>
              </div>
              <Card className="min-w-full lg:min-w-[20rem]">
                <CardContent className="grid gap-3 pt-6 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Total estimado</span>
                    <span className="font-semibold text-foreground">235 h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Sistema core</span>
                    <span className="font-semibold text-foreground">
                      USD 7.050
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>WhatsApp base</span>
                    <span className="font-semibold text-foreground">
                      USD 1.350
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {roadmapItems.map((item) => (
                <Card key={item.code} className="h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between gap-4">
                      <Badge>{item.code}</Badge>
                      <span className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        {item.priority}
                      </span>
                    </div>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.type}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="fases" className="px-5 py-18 sm:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <div className="mb-10 max-w-3xl">
              <Badge variant="outline">Fases sugeridas</Badge>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                La construccion puede arrancar ya sin que vos tengas que extraer
                la UI primero
              </h2>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">
                Lo mas sano es portar la base visual compartida y despues
                construir el modulo con contenido y flujos propios. Eso nos da
                coherencia con Nomarys sin atarnos a su codigo de dominio.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
              {implementationPhases.map((phase) => (
                <Card key={phase.title} className="h-full">
                  <CardHeader>
                    <span className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                      {phase.phase}
                    </span>
                    <CardTitle>{phase.title}</CardTitle>
                    <CardDescription>{phase.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {phase.items.map((item) => (
                        <span
                          key={item}
                          className={cn(
                            "rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-foreground",
                          )}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
