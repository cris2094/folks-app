import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getMyPayments } from "@/features/pagos/queries/get-my-payments";
import { getPaymentSummary } from "@/features/pagos/queries/get-payment-summary";
import { PaymentSummaryCard } from "@/features/pagos/components/payment-summary-card";
import { PaymentList } from "@/features/pagos/components/payment-list";

export default async function FinanzasPage() {
  const [payments, summary] = await Promise.all([
    getMyPayments(),
    getPaymentSummary(),
  ]);

  return (
    <div className="mx-auto max-w-md px-4 pb-8 pt-4">
      {/* Header */}
      <header className="mb-6">
        <Link
          href="/home"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Inicio
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Recibos</h1>
      </header>

      {/* Card de pago principal */}
      <div className="mb-6">
        <PaymentSummaryCard summary={summary} />
      </div>

      {/* Historial de pagos */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          Historial de Pagos
        </h2>
        <PaymentList payments={payments} />
      </section>

      {/* Footer */}
      <p className="mt-8 text-center text-xs text-gray-400">
        POTENCIADO POR FOLKS
      </p>
    </div>
  );
}
