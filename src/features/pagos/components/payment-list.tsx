import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Building2, CheckCircle, Clock, Receipt, AlertTriangle, CreditCard, Banknote } from "lucide-react";
import type { PaymentWithUnit } from "../queries/get-my-payments";

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Pendiente", variant: "secondary" },
  paid: { label: "Pagado", variant: "default" },
  overdue: { label: "Vencido", variant: "destructive" },
  cancelled: { label: "Cancelado", variant: "outline" },
};

const conceptConfig: Record<string, { label: string; icon: typeof Receipt; color: string; bgColor: string }> = {
  admin_fee: { label: "Administracion", icon: Banknote, color: "text-emerald-600", bgColor: "bg-emerald-50" },
  zone_reservation: { label: "Reserva zona", icon: CreditCard, color: "text-cyan-600", bgColor: "bg-cyan-50" },
  penalty: { label: "Recargo", icon: AlertTriangle, color: "text-red-500", bgColor: "bg-red-50" },
  other: { label: "Otro", icon: Receipt, color: "text-gray-500", bgColor: "bg-gray-50" },
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
        const c = conceptConfig[p.concept] ?? conceptConfig.other;
        const ConceptIcon = c.icon;
        const unit = Array.isArray(p.unit) ? p.unit[0] : p.unit;
        const total = Number(p.amount_cop) + Number(p.late_fee_cop);

        return (
          <Card key={p.id}>
            <CardContent className="p-3">
              <div className="flex items-start gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${c.bgColor}`}>
                  <ConceptIcon className={`h-5 w-5 ${c.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">
                        {c.label}
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
                    <div className="text-right shrink-0">
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
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
