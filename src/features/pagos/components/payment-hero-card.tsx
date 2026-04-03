import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import type { PaymentSummary } from "../queries/get-payment-summary";

export function PaymentHeroCard({ summary }: { summary: PaymentSummary }) {
  const total = summary.totalPending + summary.totalOverdue;

  return (
    <Card className="border-0 bg-gradient-to-br from-brand-dark to-brand-dark-lighter text-white shadow-lg">
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <p className="text-sm text-white/70">Total a pagar</p>
          <p className="text-3xl font-bold">
            ${total.toLocaleString("es-CO")}
          </p>
          {summary.countOverdue > 0 && (
            <p className="mt-1 text-sm font-medium text-red-400">
              {summary.countOverdue} pago{summary.countOverdue > 1 ? "s" : ""}{" "}
              vencido{summary.countOverdue > 1 ? "s" : ""}
            </p>
          )}
        </div>
        <Link
          href="/finanzas"
          className="rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold transition-colors hover:bg-amber-700"
        >
          Pagar
        </Link>
      </CardContent>
    </Card>
  );
}
