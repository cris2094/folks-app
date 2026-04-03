import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Building2, CheckCircle, Clock } from "lucide-react";
import type { PaymentWithUnit } from "../queries/get-my-payments";

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Pendiente", variant: "secondary" },
  paid: { label: "Pagado", variant: "default" },
  overdue: { label: "Vencido", variant: "destructive" },
  cancelled: { label: "Cancelado", variant: "outline" },
};

const conceptLabels: Record<string, string> = {
  admin_fee: "Administracion",
  zone_reservation: "Reserva zona",
  penalty: "Recargo",
  other: "Otro",
};

export function PaymentList({ payments }: { payments: PaymentWithUnit[] }) {
  if (payments.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center text-sm">
        No hay recibos
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {payments.map((p) => {
        const s = statusConfig[p.status] ?? statusConfig.pending;
        const unit = Array.isArray(p.unit) ? p.unit[0] : p.unit;
        const total = Number(p.amount_cop) + Number(p.late_fee_cop);

        return (
          <Card key={p.id}>
            <CardContent className="p-3">
              <div className="flex items-start justify-between">
                <div className="flex gap-2">
                  {p.status === "paid" && (
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                  )}
                  {p.status === "overdue" && (
                    <Clock className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium">
                      {conceptLabels[p.concept] ?? p.concept}
                    </p>
                    {p.description && (
                      <p className="text-muted-foreground text-xs">{p.description}</p>
                    )}
                    <div className="mt-1 flex gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Vence: {p.due_date}
                      </span>
                      {unit && (
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {unit.tower} - {unit.apartment}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">
                    ${total.toLocaleString("es-CO")}
                  </p>
                  {Number(p.late_fee_cop) > 0 && (
                    <p className="text-xs text-red-500">
                      +${Number(p.late_fee_cop).toLocaleString("es-CO")} mora
                    </p>
                  )}
                  <Badge variant={s.variant} className="mt-1 text-xs">
                    {s.label}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
