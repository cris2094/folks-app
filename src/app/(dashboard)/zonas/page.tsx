import { getZones } from "@/features/zonas/queries/get-zones";
import { ZoneCard } from "@/features/zonas/components/zone-card";
import { Waves } from "lucide-react";

export default async function ZonasPage() {
  const zones = await getZones();

  return (
    <div className="mx-auto max-w-md p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Zonas Comunes</h1>
        <p className="text-sm text-muted-foreground">
          Reserva espacios comunes
        </p>
      </header>

      {zones.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Waves className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-sm text-muted-foreground">
            No hay zonas disponibles
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {zones.map((zone) => (
            <ZoneCard
              key={zone.id}
              id={zone.id}
              name={zone.name}
              icon={zone.icon}
              photoUrl={zone.photo_url}
              priceCop={Number(zone.price_cop)}
              maxGuests={zone.max_guests}
              maxDurationHours={zone.max_duration_hours}
              isActive={zone.is_active}
            />
          ))}
        </div>
      )}
    </div>
  );
}
