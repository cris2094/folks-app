import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, CheckCircle } from "lucide-react";
import type { PaymentSummary } from "../queries/get-payment-summary";

export function PaymentSummaryCard({ summary }: { summary: PaymentSummary }) {
  const total = summary.totalPending + summary.totalOverdue;
  const hasDebt = total > 0;

  return (
    <Card className={hasDebt ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-xs">Saldo pendiente</p>
            <p className="text-2xl font-bold">
              ${total.toLocaleString("es-CO")}
              <span className="text-sm font-normal text-muted-foreground"> COP</span>
            </p>
          </div>
          {hasDebt ? (
            <AlertTriangle className="h-8 w-8 text-red-400" />
          ) : (
            <CheckCircle className="h-8 w-8 text-green-400" />
          )}
        </div>
        <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
          {summary.countPending > 0 && (
            <span>{summary.countPending} pendiente{summary.countPending > 1 ? "s" : ""}</span>
          )}
          {summary.countOverdue > 0 && (
            <span className="text-red-600">
              {summary.countOverdue} vencido{summary.countOverdue > 1 ? "s" : ""}
            </span>
          )}
          {!hasDebt && <span className="text-green-600">Al dia</span>}
        </div>
      </CardContent>
    </Card>
  );
}
