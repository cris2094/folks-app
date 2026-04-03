import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPortfolio } from "@/features/finanzas-admin/queries/get-portfolio";
import { PortfolioChart } from "@/features/finanzas-admin/components/portfolio-chart";

function formatCOP(value: number): string {
  return value.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
}

function formatDate(date: string | null): string {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
  });
}

function getDaysSince(date: string | null): number {
  if (!date) return 0;
  const now = new Date();
  const d = new Date(date);
  return Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
}

export default async function CarteraPage() {
  const portfolio = await getPortfolio();

  const agingCards = [
    {
      label: "0-30 dias",
      value: portfolio.aging.overdue_0_30,
      bg: "bg-amber-50",
      text: "text-amber-800",
      border: "border-amber-200",
    },
    {
      label: "31-60 dias",
      value: portfolio.aging.overdue_31_60,
      bg: "bg-orange-50",
      text: "text-orange-800",
      border: "border-orange-200",
    },
    {
      label: "61-90 dias",
      value: portfolio.aging.overdue_61_90,
      bg: "bg-red-50",
      text: "text-red-800",
      border: "border-red-200",
    },
    {
      label: "90+ dias",
      value: portfolio.aging.overdue_90_plus,
      bg: "bg-red-100",
      text: "text-red-900",
      border: "border-red-300",
    },
  ];

  // Filter to only show units with actual overdue amounts
  const overdueUnits = portfolio.units.filter(
    (u) => Number(u.overdue_total) > 0,
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Resumen total */}
      <div className="flex items-center justify-between rounded-xl bg-red-50 p-4">
        <div>
          <p className="text-xs text-red-700">Cartera morosa total</p>
          <p className="text-2xl font-bold text-red-800">
            {formatCOP(portfolio.totalOverdue)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-red-700">Unidades</p>
          <p className="text-2xl font-bold text-red-800">
            {portfolio.overdueUnitsCount}
          </p>
        </div>
      </div>

      {/* Aging cards */}
      <div className="grid grid-cols-4 gap-2">
        {agingCards.map((card) => (
          <div
            key={card.label}
            className={`rounded-lg border p-2 text-center ${card.bg} ${card.border}`}
          >
            <p className={`text-[10px] ${card.text}`}>{card.label}</p>
            <p className={`text-xs font-bold ${card.text}`}>
              {formatCOP(card.value)}
            </p>
          </div>
        ))}
      </div>

      {/* Donut chart */}
      <Card>
        <CardHeader>
          <CardTitle>Distribucion por Aging</CardTitle>
        </CardHeader>
        <CardContent>
          <PortfolioChart aging={portfolio.aging} />
        </CardContent>
      </Card>

      {/* Lista de unidades morosas */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-700">
          Unidades Morosas ({overdueUnits.length})
        </h3>

        {overdueUnits.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
              <AlertTriangle className="h-7 w-7 text-emerald-400" />
            </div>
            <p className="text-sm text-muted-foreground">
              No hay unidades morosas
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {overdueUnits.map((unit) => {
              const daysMora = getDaysSince(unit.oldest_overdue_date);
              return (
                <Card key={unit.unit_id} size="sm">
                  <CardContent className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">
                        {unit.tower} - Apto {unit.apartment}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <span>{unit.overdue_count} cuotas</span>
                        <span>-</span>
                        <span>{daysMora} dias de mora</span>
                      </div>
                      {unit.oldest_overdue_date && (
                        <p className="text-[10px] text-muted-foreground">
                          Desde {formatDate(unit.oldest_overdue_date)}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-red-600">
                        {formatCOP(Number(unit.overdue_total))}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Cuota: {formatCOP(Number(unit.admin_fee_cop))}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
