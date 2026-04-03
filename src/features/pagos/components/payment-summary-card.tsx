import { Wallet } from "lucide-react";
import type { PaymentSummary } from "../queries/get-payment-summary";

export function PaymentSummaryCard({ summary }: { summary: PaymentSummary }) {
  const total = summary.totalPending + summary.totalOverdue;
  const hasDebt = total > 0;

  // Fecha de vencimiento
  const dueDateLabel = "15 Nov 2023";

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-800 to-amber-900 p-5 shadow-lg">
      {/* Wallet icon - top right */}
      <div className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
        <Wallet className="h-5 w-5 text-white" />
      </div>

      {/* Content */}
      <p className="text-xs font-medium uppercase tracking-wider text-white/70">
        SALDO A PAGAR
      </p>
      <p className="mt-2 text-4xl font-bold text-white">
        ${total.toLocaleString("es-CO")}
      </p>

      <div className="mt-3">
        <p className="text-xs text-white/70">Vencimiento</p>
        <p className="text-sm font-medium text-white">{dueDateLabel}</p>
      </div>

      {/* Pagar Ahora button - bottom right */}
      {hasDebt && (
        <div className="mt-4 flex justify-end">
          <button className="rounded-full bg-amber-500 px-6 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-amber-400 active:scale-95">
            Pagar Ahora
          </button>
        </div>
      )}
    </div>
  );
}
