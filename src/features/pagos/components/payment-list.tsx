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
      <p className="py-8 text-center text-[13px] text-gray-400">
        No hay recibos
      </p>
    );
  }

  return (
    <div className="space-y-1.5">
      {payments.map((p) => {
        const isPaid = p.status === "paid";
        const total = Number(p.amount_cop) + Number(p.late_fee_cop);
        const concept = conceptLabels[p.concept] ?? conceptLabels.other;
        const monthYear = formatMonth(p.due_date);

        return (
          <button
            key={p.id}
            className="flex w-full items-center gap-3 rounded-[16px] p-4 text-left transition-colors hover:bg-gray-50 active:bg-gray-100"
          >
            {/* Green circle icon */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-50 shadow-apple-sm">
              <CheckCircle className="h-[18px] w-[18px] text-green-500" strokeWidth={1.5} />
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold tracking-tight text-gray-900">
                {monthYear}
              </p>
              <p className="text-[12px] text-gray-500">{concept}</p>
            </div>

            {/* Amount + status */}
            <div className="shrink-0 text-right">
              <p className="text-[15px] font-semibold tracking-tight text-gray-900">
                ${total.toLocaleString("es-CO")}
              </p>
              {isPaid && (
                <p className="text-[11px] font-medium text-green-500">
                  Pagado
                </p>
              )}
            </div>

            {/* Chevron */}
            <ChevronRight
              className="h-4 w-4 shrink-0 text-gray-300"
              strokeWidth={1.5}
            />
          </button>
        );
      })}
    </div>
  );
}
