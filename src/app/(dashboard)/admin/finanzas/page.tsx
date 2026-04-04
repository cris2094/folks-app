import { DollarSign, TrendingDown, Scale, Target } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/features/finanzas-admin/components/kpi-card";
import { IncomeExpenseChart } from "@/features/finanzas-admin/components/income-expense-chart";
import { getFinancialSummary } from "@/features/finanzas-admin/queries/get-financial-summary";
import { getMonthlySummary } from "@/features/finanzas-admin/queries/get-monthly-summary";
import { getPortfolio } from "@/features/finanzas-admin/queries/get-portfolio";

function formatCOP(value: number): string {
  return value.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
}

export default async function AdminFinanzasPage() {
  const [summary, monthly, portfolio] = await Promise.all([
    getFinancialSummary(),
    getMonthlySummary(),
    getPortfolio(),
  ]);

  return (
    <FadeIn>
    <div className="flex flex-col gap-4">
      {/* KPI Grid 2x2 */}
      <StaggerContainer className="grid grid-cols-2 gap-3">
        <StaggerItem>
        <KpiCard
          title="Ingresos del mes"
          value={formatCOP(summary.totalIncome)}
          icon={DollarSign}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        </StaggerItem>
        <StaggerItem>
        <KpiCard
          title="Egresos del mes"
          value={formatCOP(summary.totalExpenses)}
          icon={TrendingDown}
          iconBg="bg-red-50"
          iconColor="text-red-600"
        />
        </StaggerItem>
        <StaggerItem>
        <KpiCard
          title="Balance"
          value={formatCOP(summary.balance)}
          icon={Scale}
          iconBg="bg-blue-50"
          iconColor="text-blue-700"
        />
        </StaggerItem>
        <StaggerItem>
        <KpiCard
          title="% Recaudo"
          value={`${summary.collectionRate}%`}
          icon={Target}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        </StaggerItem>
      </StaggerContainer>

      {/* Grafico Ingresos vs Egresos */}
      <Card>
        <CardHeader>
          <CardTitle>Ingresos vs Egresos</CardTitle>
        </CardHeader>
        <CardContent>
          <IncomeExpenseChart data={monthly} />
        </CardContent>
      </Card>

      {/* Cartera morosa resumen */}
      <Card>
        <CardHeader>
          <CardTitle>Cartera Morosa</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <p className="text-2xl font-bold text-red-600">
              {formatCOP(portfolio.totalOverdue)}
            </p>
            <p className="text-xs text-muted-foreground">
              {portfolio.overdueUnitsCount} unidades
            </p>
          </div>

          {/* Aging breakdown */}
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="rounded-lg bg-amber-50 p-2">
              <p className="text-[10px] text-amber-700">0-30d</p>
              <p className="text-xs font-semibold">
                {formatCOP(portfolio.aging.overdue_0_30)}
              </p>
            </div>
            <div className="rounded-lg bg-orange-50 p-2">
              <p className="text-[10px] text-orange-700">31-60d</p>
              <p className="text-xs font-semibold">
                {formatCOP(portfolio.aging.overdue_31_60)}
              </p>
            </div>
            <div className="rounded-lg bg-red-50 p-2">
              <p className="text-[10px] text-red-700">61-90d</p>
              <p className="text-xs font-semibold">
                {formatCOP(portfolio.aging.overdue_61_90)}
              </p>
            </div>
            <div className="rounded-lg bg-red-100 p-2">
              <p className="text-[10px] text-red-800">90+d</p>
              <p className="text-xs font-semibold">
                {formatCOP(portfolio.aging.overdue_90_plus)}
              </p>
            </div>
          </div>

          <Link
            href="/admin/cartera"
            className="mt-1 text-center text-sm font-medium text-amber-600 hover:underline"
          >
            Ver cartera completa
          </Link>
        </CardContent>
      </Card>

      {/* Fondo de reserva */}
      <Card size="sm">
        <CardContent className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Fondo de Reserva</p>
          <p className="text-lg font-bold text-brand-dark">
            {formatCOP(summary.reserveFundBalance)}
          </p>
        </CardContent>
      </Card>

      <p className="pb-2 text-center text-[10px] font-medium tracking-wider text-gray-300">
        POTENCIADO POR FOLKS
      </p>
    </div>
    </FadeIn>
  );
}
