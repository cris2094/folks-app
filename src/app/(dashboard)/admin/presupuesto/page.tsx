import { getBudget } from "@/features/finanzas-admin/queries/get-budget";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion";
import { Card, CardContent } from "@/components/ui/card";

const CATEGORY_LABELS: Record<string, string> = {
  maintenance: "Mantenimiento",
  security: "Seguridad",
  utilities: "Servicios publicos",
  cleaning: "Aseo",
  insurance: "Seguros",
  payroll: "Nomina",
  legal: "Legal",
  reserve_fund: "Fondo de reserva",
  extraordinary: "Extraordinarios",
  other: "Otros",
};

function formatCOP(value: number): string {
  return value.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
}

export default async function PresupuestoPage() {
  const budget = await getBudget();

  return (
    <FadeIn>
    <div className="flex flex-col gap-4">
      {/* Period summary card */}
      {budget.period ? (
        <Card size="sm">
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-semibold text-gray-900">
                {budget.period.name}
              </h3>
              <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                Activo
              </span>
            </div>

            {/* Totals */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-gray-50 p-2">
                <p className="text-[10px] text-gray-500">Presupuestado</p>
                <p className="text-xs font-bold text-gray-900">
                  {formatCOP(budget.totalBudgeted)}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-2">
                <p className="text-[10px] text-gray-500">Ejecutado</p>
                <p className="text-xs font-bold text-gray-900">
                  {formatCOP(budget.totalExecuted)}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-2">
                <p className="text-[10px] text-gray-500">% Ejecucion</p>
                <p
                  className={`text-xs font-bold ${
                    budget.executionPercentage > 100
                      ? "text-red-600"
                      : budget.executionPercentage > 80
                        ? "text-amber-600"
                        : "text-emerald-600"
                  }`}
                >
                  {budget.executionPercentage}%
                </p>
              </div>
            </div>

            {/* Global progress bar */}
            <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full rounded-full transition-all ${
                  budget.executionPercentage > 100
                    ? "bg-red-500"
                    : budget.executionPercentage > 80
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                }`}
                style={{
                  width: `${Math.min(budget.executionPercentage, 100)}%`,
                }}
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card size="sm">
          <CardContent className="py-8 text-center">
            <p className="text-sm text-muted-foreground">
              No hay periodo de presupuesto activo
            </p>
          </CardContent>
        </Card>
      )}

      {/* Category breakdown */}
      {budget.items.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-gray-900">
            Ejecucion por categoria
          </h3>

          {/* Category progress bars */}
          <StaggerContainer className="flex flex-col gap-2">
            {budget.items.map((item) => (
              <StaggerItem key={item.id}>
              <Card size="sm">
                <CardContent className="flex flex-col gap-2">
                  <div className="flex items-baseline justify-between">
                    <p className="text-xs font-medium text-gray-900">
                      {CATEGORY_LABELS[item.category] ?? item.category}
                    </p>
                    <span
                      className={`text-[10px] font-semibold ${
                        item.percentage > 100
                          ? "text-red-600"
                          : item.percentage > 80
                            ? "text-amber-600"
                            : "text-gray-500"
                      }`}
                    >
                      {item.percentage}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full transition-all ${
                        item.percentage > 100
                          ? "bg-red-500"
                          : item.percentage > 80
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                      }`}
                      style={{
                        width: `${Math.min(item.percentage, 100)}%`,
                      }}
                    />
                  </div>

                  {/* Numbers */}
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-500">
                      {item.description}
                    </span>
                    <span
                      className={`font-medium ${
                        item.difference < 0
                          ? "text-red-600"
                          : "text-emerald-600"
                      }`}
                    >
                      {item.difference >= 0 ? "+" : ""}
                      {formatCOP(item.difference)}
                    </span>
                  </div>

                  <div className="flex justify-between text-[10px] text-gray-400">
                    <span>Ppto: {formatCOP(item.budgeted_cop)}</span>
                    <span>Ejec: {formatCOP(item.executed_cop)}</span>
                  </div>
                </CardContent>
              </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      )}

      {/* Footer */}
      <p className="pb-2 text-center text-[10px] font-medium tracking-wider text-gray-300">
        POTENCIADO POR FOLKS
      </p>
    </div>
    </FadeIn>
  );
}
