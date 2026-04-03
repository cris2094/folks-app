import { CheckCircle, Clock, ChevronRight } from "lucide-react";
import type { PaymentWithUnit } from "../queries/get-my-payments";

const conceptLabels: Record<string, string> = {
  admin_fee: "Administracion",
  zone_reservation: "Reserva zona",
  penalty: "Recargo",
  other: "Otro",
};

function formatMonth(dateStr: string): { month: string; year: string } {
  const date = new Date(dateStr + "T00:00:00");
  const month = date.toLocaleDateString("es-CO", { month: "long" });
  const year = date.getFullYear().toString();
  return {
    month: month.charAt(0).toUpperCase() + month.slice(1),
    year,
  };
}

export function PaymentList({ payments }: { payments: PaymentWithUnit[] }) {
  if (payments.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center text-sm">
        No hay recibos
      </p>
    );
  }

  return (
    <div className="space-y-1">
      {payments.map((p) => {
        const isPaid = p.status === "paid";
        const isOverdue = p.status === "overdue";
        const total = Number(p.amount_cop) + Number(p.late_fee_cop);
        const concept = conceptLabels[p.concept] ?? conceptLabels.other;
        const { month, year } = formatMonth(p.due_date);

        return (
          <button
            key={p.id}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-gray-50 active:bg-gray-100"
          >
            {/* Status icon */}
            {isPaid ? (
              <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500" />
            ) : (
              <Clock className={`h-5 w-5 shrink-0 ${isOverdue ? "text-red-500" : "text-amber-500"}`} />
            )}

            {/* Info */}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900">
                {month} {year}
              </p>
              <p className="text-xs text-gray-500">{concept}</p>
            </div>

            {/* Amount + status */}
            <div className="shrink-0 text-right">
              <p className="text-sm font-bold text-gray-900">
                ${total.toLocaleString("es-CO")}
              </p>
              <p className={`text-xs font-medium ${
                isPaid
                  ? "text-emerald-600"
                  : isOverdue
                    ? "text-red-600"
                    : "text-amber-600"
              }`}>
                {isPaid ? "Pagado" : isOverdue ? "Vencido" : "Pendiente"}
              </p>
            </div>

            {/* Chevron */}
            <ChevronRight className="h-4 w-4 shrink-0 text-gray-400" />
          </button>
        );
      })}
    </div>
  );
}
