import { CheckCircle, ChevronRight } from "lucide-react";
import type { PaymentWithUnit } from "../queries/get-my-payments";

const conceptLabels: Record<string, string> = {
  admin_fee: "Administracion",
  zone_reservation: "Reserva zona",
  penalty: "Recargo",
  other: "Otro",
};

function formatMonth(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  const month = date.toLocaleDateString("es-CO", { month: "long" });
  const year = date.getFullYear().toString();
  return `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
}

export function PaymentList({ payments }: { payments: PaymentWithUnit[] }) {
  if (payments.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray-400">
        No hay recibos
      </p>
    );
  }

  return (
    <div className="space-y-1">
      {payments.map((p) => {
        const isPaid = p.status === "paid";
        const total = Number(p.amount_cop) + Number(p.late_fee_cop);
        const concept = conceptLabels[p.concept] ?? conceptLabels.other;
        const monthYear = formatMonth(p.due_date);

        return (
          <button
            key={p.id}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-gray-50 active:bg-gray-100"
          >
            {/* Green circle icon */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900">{monthYear}</p>
              <p className="text-xs text-gray-500">{concept}</p>
            </div>

            {/* Amount + status */}
            <div className="shrink-0 text-right">
              <p className="text-sm font-semibold text-gray-900">
                ${total.toLocaleString("es-CO")}
              </p>
              {isPaid && (
                <p className="text-xs text-green-600">Pagado</p>
              )}
            </div>

            {/* Chevron */}
            <ChevronRight className="h-4 w-4 shrink-0 text-gray-300" />
          </button>
        );
      })}
    </div>
  );
}
