import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="flex-1 px-5 py-12 sm:px-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <Card className="border-primary/15">
          <CardHeader>
            <CardTitle>Intake no encontrado</CardTitle>
            <CardDescription>
              La referencia solicitada no existe o ya no esta disponible en el
              almacenamiento local.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/admin/intakes">Volver a la bandeja</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
