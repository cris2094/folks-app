import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users } from "lucide-react";

interface ReservationCardProps {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  guestsCount: number;
  status: string;
  zoneName: string;
  zoneIcon: string | null;
  priceCop: number;
}

const statusLabels: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  pending: { label: "Pendiente", variant: "secondary" },
  confirmed: { label: "Confirmada", variant: "default" },
  cancelled: { label: "Cancelada", variant: "destructive" },
  completed: { label: "Completada", variant: "outline" },
};

export function ReservationCard({
  date,
  startTime,
  endTime,
  guestsCount,
  status,
  zoneName,
  zoneIcon,
  priceCop,
}: ReservationCardProps) {
  const s = statusLabels[status] ?? statusLabels.pending;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50 text-xl">
              {zoneIcon ?? "🏊"}
            </div>
            <div>
              <p className="text-sm font-semibold">{zoneName}</p>
              <p className="text-xs text-muted-foreground">
                {priceCop > 0
                  ? `$${priceCop.toLocaleString("es-CO")} COP`
                  : "Gratis"}
              </p>
            </div>
          </div>
          <Badge variant={s.variant}>{s.label}</Badge>
        </div>
        <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" /> {date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> {startTime} - {endTime}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" /> {guestsCount}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
