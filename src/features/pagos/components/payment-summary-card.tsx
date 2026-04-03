import { Wallet } from "lucide-react";
import type { PaymentSummary } from "../queries/get-payment-summary";

export function PaymentSummaryCard({ summary }: { summary: PaymentSummary }) {
  const total = summary.totalPending + summary.totalOverdue;
  const hasDebt = total > 0;

  // Fecha de vencimiento
  const dueDateLabel = "15 Nov 2023";

  return (
    <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-amber-800 via-amber-900 to-amber-950 p-6 shadow-apple-lg">
      {/* Wallet icon - top right */}
      <div className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
        <Wallet className="h-5 w-5 text-white/80" strokeWidth={1.5} />
      </div>

      {/* Content */}
      <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-white/60">
        SALDO A PAGAR
      </p>
      <p className="mt-2 text-[36px] font-bold tracking-tight text-white">
        ${total.toLocaleString("es-CO")}
      </p>

      <div className="mt-3">
        <p className="text-[11px] text-white/50">Vencimiento</p>
        <p className="text-[13px] font-medium text-white/90">{dueDateLabel}</p>
      </div>

      {/* Pagar Ahora button - bottom right */}
      {hasDebt && (
        <div className="mt-5 flex justify-end">
          <button className="rounded-full bg-amber-500 px-6 py-2.5 text-[13px] font-semibold text-white shadow-apple-sm transition-all hover:bg-amber-400 active:scale-95">
            Pagar Ahora
          </button>
        </div>
      )}
    </div>
  );
}
