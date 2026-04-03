import { Card, CardContent } from "@/components/ui/card";
import { Wallet } from "lucide-react";
import type { PaymentSummary } from "../queries/get-payment-summary";

export function PaymentSummaryCard({ summary }: { summary: PaymentSummary }) {
  const total = summary.totalPending + summary.totalOverdue;
  const hasDebt = total > 0;

  // Fecha de vencimiento formateada (placeholder — se puede conectar al proximo due_date real)
  const nextDueLabel = summary.lastPaymentDate
    ? `Ultimo pago: ${new Date(summary.lastPaymentDate).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" })}`
    : null;

  return (
    <Card className="relative border-0 bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg overflow-hidden">
      <CardContent className="relative z-10 p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-medium uppercase tracking-wider text-white/80">
              Saldo a Pagar
            </p>
            <p className="mt-1 text-4xl font-bold">
              ${total.toLocaleString("es-CO")}
            </p>
            <div className="mt-2 text-sm text-white/80">
              {summary.countOverdue > 0 && (
                <p className="font-medium text-white">
                  {summary.countOverdue} vencido{summary.countOverdue > 1 ? "s" : ""}
                </p>
              )}
              {summary.countPending > 0 && (
                <p>
                  {summary.countPending} pendiente{summary.countPending > 1 ? "s" : ""}
                </p>
              )}
              {!hasDebt && <p className="font-medium text-white">Al dia</p>}
              {nextDueLabel && (
                <p className="mt-1 text-xs text-white/60">{nextDueLabel}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            {/* Icono billetera */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            {/* Boton Pagar Ahora */}
            {hasDebt && (
              <button className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-amber-700 shadow-md transition-all hover:bg-white/90 hover:shadow-lg active:scale-95">
                Pagar Ahora
              </button>
            )}
          </div>
        </div>
      </CardContent>
      {/* Decoracion circular sutil */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-white/5" />
    </Card>
  );
}
