import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Clock, CheckCircle, User } from "lucide-react";
import type { PackageItem } from "../queries/get-my-packages";

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: typeof Package }> = {
  received: { label: "En porteria", variant: "secondary", icon: Clock },
  notified: { label: "Notificado", variant: "outline", icon: Package },
  delivered: { label: "Entregado", variant: "default", icon: CheckCircle },
};

export function PackageCard({ pkg }: { pkg: PackageItem }) {
  const s = statusConfig[pkg.status] ?? statusConfig.received;
  const StatusIcon = s.icon;
  const unit = Array.isArray(pkg.unit) ? pkg.unit[0] : pkg.unit;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("es-CO", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="shadow-sm transition-shadow duration-200 hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50">
            <StatusIcon className="h-5 w-5 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">{pkg.description}</p>
                {unit && (
                  <p className="text-muted-foreground text-xs">
                    {unit.tower} - Apto {unit.apartment}
                  </p>
                )}
              </div>
              <Badge variant={s.variant} className="shrink-0 text-xs">
                {s.label}
              </Badge>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Recibido: {formatDate(pkg.received_at)}
              </span>
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                Por: {pkg.received_by}
              </span>
              {pkg.delivered_at && (
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Entregado: {formatDate(pkg.delivered_at)}
                  {pkg.delivered_to ? ` a ${pkg.delivered_to}` : ""}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
