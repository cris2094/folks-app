import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface ZoneCardProps {
  id: string;
  name: string;
  icon: string | null;
  priceCop: number;
  maxGuests: number;
  maxDurationHours: number;
  isActive: boolean;
}

export function ZoneCard({
  id,
  name,
  icon,
  priceCop,
  maxGuests,
  maxDurationHours,
  isActive,
}: ZoneCardProps) {
  return (
    <Link href={`/zonas/${id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50 text-xl">
                {icon ?? "🏊"}
              </div>
              <div>
                <p className="text-sm font-semibold">{name}</p>
                <p className="text-xs text-muted-foreground">
                  {priceCop > 0
                    ? `$${priceCop.toLocaleString("es-CO")} COP`
                    : "Gratis"}
                  {" · "}
                  {maxDurationHours}h max · {maxGuests} invitados
                </p>
              </div>
            </div>
            <Badge variant={isActive ? "default" : "secondary"}>
              {isActive ? "Abierta" : "Cerrada"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
