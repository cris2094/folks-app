import Link from "next/link";
import { ChevronLeft } from "lucide-react";
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
    <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col px-5 pb-8 pt-14">
      {/* Header */}
      <header className="mb-6">
        <Link
          href="/home"
          className="inline-flex items-center gap-0.5 text-[15px] font-medium text-amber-500"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={2} />
          Inicio
        </Link>
        <h1 className="mt-2 text-[28px] font-bold tracking-tight text-gray-900">
          Recibos
        </h1>
      </header>

      {/* Card de pago principal */}
      <div className="mb-6">
        <PaymentSummaryCard summary={summary} />
      </div>

      {/* Historial de pagos */}
      <section>
        <h2 className="mb-3 text-[17px] font-semibold tracking-tight text-gray-900">
          Historial de Pagos
        </h2>
        <PaymentList payments={payments} />
      </section>

      {/* Footer */}
      <p className="mt-8 text-center text-xs text-gray-300">
        <span className="mr-1">{"\u2726"}</span>
        POTENCIADO POR FOLKS
      </p>
    </div>
  );
}
