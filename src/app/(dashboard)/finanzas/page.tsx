import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Receipt } from "lucide-react";
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
        <h1 className="text-2xl font-bold">Mis Recibos</h1>
        <p className="text-muted-foreground text-sm">
          Pagos de administracion y servicios
        </p>
      </header>

      <div className="mb-4">
        <PaymentSummaryCard summary={summary} />
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
              <Receipt className="h-8 w-8 text-gray-400" />
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
