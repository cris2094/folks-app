import { Card, CardContent } from "@/components/ui/card";
import type { PaymentSummary } from "../queries/get-payment-summary";

export function PaymentSummaryCard({ summary }: { summary: PaymentSummary }) {
  const total = summary.totalPending + summary.totalOverdue;
  const hasDebt = total > 0;

  return (
    <Card className="border-0 bg-gradient-to-br from-brand-dark to-brand-dark-lighter text-white">
      <CardContent className="p-4">
        <div>
          <p className="text-xs text-white/70">Saldo pendiente</p>
          <p className="text-3xl font-bold">
            ${total.toLocaleString("es-CO")}
            <span className="text-sm font-normal text-white/70"> COP</span>
          </p>
        </div>
        <div className="mt-2 flex gap-4 text-xs text-white/70">
          {summary.countPending > 0 && (
            <span>{summary.countPending} pendiente{summary.countPending > 1 ? "s" : ""}</span>
          )}
          {summary.countOverdue > 0 && (
            <span className="text-red-300">
              {summary.countOverdue} vencido{summary.countOverdue > 1 ? "s" : ""}
            </span>
          )}
          {!hasDebt && <span className="text-green-300">Al dia</span>}
        </div>
      </CardContent>
    </Card>
  );
}
