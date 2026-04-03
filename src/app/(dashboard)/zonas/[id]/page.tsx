import { getZoneDetails } from "@/features/zonas/queries/get-zone-details";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Clock, Users, DollarSign, Calendar } from "lucide-react";
import Link from "next/link";

export default async function ZoneDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const zone = await getZoneDetails(id);

  if (!zone) {
    return (
      <div className="mx-auto max-w-md p-4 text-center">
        <p className="text-muted-foreground">Zona no encontrada</p>
        <Link href="/zonas" className="text-sm text-primary underline">
          Volver
        </Link>
      </div>
    );
  }

  const schedule = zone.schedule as Record<
    string,
    { open: string; close: string } | null
  > | null;
  const days = [
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
    "sabado",
    "domingo",
  ];

  return (
    <div className="mx-auto max-w-md p-4">
      <Link
        href="/zonas"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Volver
      </Link>

      <header className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-50 text-3xl">
            {zone.icon ?? "🏊"}
          </div>
          <div>
            <h1 className="text-xl font-bold">{zone.name}</h1>
            {zone.description && (
              <p className="text-sm text-muted-foreground">
                {zone.description}
              </p>
            )}
          </div>
        </div>
      </header>

      <div className="mb-4 flex flex-wrap gap-2">
        <Badge variant="outline" className="flex items-center gap-1">
          <DollarSign className="h-3 w-3" />
          {Number(zone.price_cop) > 0
            ? `$${Number(zone.price_cop).toLocaleString("es-CO")} COP`
            : "Gratis"}
        </Badge>
        <Badge variant="outline" className="flex items-center gap-1">
          <Clock className="h-3 w-3" /> Max {zone.max_duration_hours}h
        </Badge>
        <Badge variant="outline" className="flex items-center gap-1">
          <Users className="h-3 w-3" /> Max {zone.max_guests} invitados
        </Badge>
        <Badge variant="outline" className="flex items-center gap-1">
          <Calendar className="h-3 w-3" /> {zone.max_reservations_per_month}/mes
        </Badge>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Horarios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {days.map((day) => {
              const slot = schedule?.[day];
              return (
                <div key={day} className="flex justify-between text-sm">
                  <span className="capitalize text-muted-foreground">
                    {day}
                  </span>
                  <span className="font-medium">
                    {slot ? `${slot.open} - ${slot.close}` : "Cerrado"}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Separator className="my-4" />

      <p className="text-center text-sm text-muted-foreground">
        Formulario de reserva proximamente
      </p>
    </div>
  );
}
