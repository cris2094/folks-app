import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Receipt, Wallet } from "lucide-react";
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

  const pending = payments.filter((p) => p.status === "pending" || p.status === "overdue");
  const paid = payments.filter((p) => p.status === "paid");

  return (
    <div className="mx-auto max-w-md p-4">
      <header className="mb-6">
        <div className="flex items-center gap-2">
          <Link href="/home" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
              <Wallet className="h-4 w-4 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold">Estado de Cuenta</h1>
          </div>
        </div>
        <p className="text-muted-foreground text-sm mt-1 ml-[3.75rem]">
          Pagos de administracion y servicios
        </p>
      </header>

      <div className="mb-4">
        <PaymentSummaryCard summary={summary} />
      </div>

      {/* Separador visual */}
      <div className="mb-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      <div className="mb-4">
        <Link
          href="/finanzas"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-amber-600 py-3 font-semibold text-white shadow-md shadow-amber-600/25 transition-all hover:bg-amber-700 hover:shadow-lg hover:shadow-amber-600/30"
        >
          Realizar Pago Seguro
        </Link>
        <p className="mt-1 text-center text-xs text-muted-foreground">
          Pagos procesados por PSE / Tarjeta
        </p>
      </div>

      <Tabs defaultValue="pendientes">
        <TabsList className="w-full">
          <TabsTrigger value="pendientes" className="flex-1">
            Pendientes ({pending.length})
          </TabsTrigger>
          <TabsTrigger value="pagados" className="flex-1">
            Pagados ({paid.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="pendientes" className="mt-4">
          {pending.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-50">
                <Receipt className="h-7 w-7 text-gray-300" />
              </div>
              <p className="text-muted-foreground text-sm">Sin pagos pendientes</p>
            </div>
          ) : (
            <PaymentList payments={pending} />
          )}
        </TabsContent>
        <TabsContent value="pagados" className="mt-4">
          <PaymentList payments={paid} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
