import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ZoneCardProps {
  id: string;
  name: string;
  icon: string | null;
  photoUrl: string | null;
  priceCop: number;
  maxGuests: number;
  maxDurationHours: number;
  isActive: boolean;
}

export function ZoneCard({
  id,
  name,
  icon,
  photoUrl,
  priceCop,
  maxGuests,
  maxDurationHours,
  isActive,
}: ZoneCardProps) {
  if (photoUrl) {
    return (
      <Link href={`/zonas/${id}`} className="block">
        <div className="group relative h-44 overflow-hidden rounded-xl">
          <Image
            src={photoUrl}
            alt={name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

          {/* Badge capacidad */}
          <div className="absolute top-3 right-3">
            <Badge className="bg-black/50 text-white backdrop-blur-sm border-0 gap-1">
              <Users className="h-3 w-3" />
              {maxGuests} max
            </Badge>
          </div>

          {/* Contenido inferior */}
          <div className="absolute inset-x-0 bottom-0 p-4">
            <div className="flex items-end justify-between">
              <div>
                <h3 className="text-base font-semibold text-white">{name}</h3>
                <p className="text-xs text-white/80">
                  {priceCop > 0
                    ? `$${priceCop.toLocaleString("es-CO")} COP`
                    : "Gratis"}
                  {" · "}
                  {maxDurationHours}h max
                </p>
                <Badge
                  className={`mt-1.5 border-0 text-xs ${
                    isActive
                      ? "bg-green-500/20 text-green-300"
                      : "bg-red-500/20 text-red-300"
                  }`}
                >
                  {isActive ? "Disponible" : "Cerrada"}
                </Badge>
              </div>
              <Button
                size="sm"
                className="bg-amber-500 text-white hover:bg-amber-600 shrink-0"
              >
                Reservar
              </Button>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Fallback sin foto: diseno con emoji
  return (
    <Link href={`/zonas/${id}`} className="block">
      <div className="group rounded-xl border bg-card p-4 transition-shadow hover:shadow-md">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-2xl">
              {icon ?? "🏊"}
            </div>
            <div>
              <h3 className="text-sm font-semibold">{name}</h3>
              <p className="text-xs text-muted-foreground">
                {priceCop > 0
                  ? `$${priceCop.toLocaleString("es-CO")} COP`
                  : "Gratis"}
                {" · "}
                {maxDurationHours}h max
              </p>
              <Badge
                variant="outline"
                className={`mt-1 text-xs ${
                  isActive
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {isActive ? "Disponible" : "Cerrada"}
              </Badge>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant="outline" className="gap-1 text-xs">
              <Users className="h-3 w-3" />
              {maxGuests} max
            </Badge>
            <Button
              size="sm"
              className="bg-amber-500 text-white hover:bg-amber-600"
            >
              Reservar
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
