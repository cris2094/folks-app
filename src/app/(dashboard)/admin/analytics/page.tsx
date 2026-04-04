import {
  Users,
  Smartphone,
  Star,
  AlertCircle,
  TrendingUp,
  ShieldAlert,
  MapPin,
} from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion";
import { getAnalyticsDashboard } from "@/features/analytics/queries/get-analytics-dashboard";
import { getAiSummary } from "@/features/analytics/queries/get-ai-summary";
import { MorosityChart } from "@/features/analytics/components/morosity-chart";
import { PqrTrendsChart } from "@/features/analytics/components/pqr-trends-chart";
import { ZoneUsageChart } from "@/features/analytics/components/zone-usage-chart";
import { AiSummaryCard } from "@/features/analytics/components/ai-summary-card";

function RiskBadge({ level }: { level: string }) {
  const styles = {
    high: "bg-red-100 text-red-700",
    medium: "bg-amber-100 text-amber-700",
    low: "bg-green-100 text-green-700",
  };
  const labels = {
    high: "Alto",
    medium: "Medio",
    low: "Bajo",
  };
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${styles[level as keyof typeof styles] ?? "bg-gray-100 text-gray-600"}`}
    >
      {labels[level as keyof typeof labels] ?? level}
    </span>
  );
}

export default async function AnalyticsPage() {
  const dashboard = await getAnalyticsDashboard();
  const summary = await getAiSummary(dashboard);

  const { morosityRisk, pqrPatterns, zoneUsage, generalMetrics } = dashboard;

  const totalPqr = pqrPatterns.byCategory.reduce((s, c) => s + c.count, 0);
  const openPqr = totalPqr; // approximation since we have all tickets

  const kpis = [
    {
      label: "Residentes",
      value: generalMetrics.totalResidents,
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Adopcion App",
      value: `${generalMetrics.adoptionRate}%`,
      icon: Smartphone,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Satisfaccion",
      value: generalMetrics.avgSatisfaction > 0
        ? `${generalMetrics.avgSatisfaction}/5`
        : "N/A",
      icon: Star,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "PQR Total",
      value: openPqr,
      icon: AlertCircle,
      color: "bg-red-50 text-red-600",
    },
  ];

  return (
    <FadeIn>
    <div className="flex flex-col gap-5">
      {/* KPI Cards */}
      <StaggerContainer className="grid grid-cols-2 gap-3">
        {kpis.map((kpi) => (
          <StaggerItem key={kpi.label}>
          <div
            className="flex items-center gap-3 rounded-2xl bg-white p-3.5 ring-1 ring-gray-100"
          >
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${kpi.color}`}
            >
              <kpi.icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{kpi.value}</p>
              <p className="text-[10px] text-gray-500">{kpi.label}</p>
            </div>
          </div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Morosity Prediction */}
      <section className="rounded-2xl bg-white p-4 ring-1 ring-gray-100">
        <div className="mb-4 flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-red-500" />
          <h2 className="text-sm font-semibold text-gray-900">
            Prediccion de Morosidad
          </h2>
        </div>

        <MorosityChart
          highRisk={morosityRisk.highRisk}
          mediumRisk={morosityRisk.mediumRisk}
          lowRisk={morosityRisk.lowRisk}
        />

        {morosityRisk.predictions.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-xs font-medium text-gray-500">
              Unidades en riesgo
            </p>
            <div className="flex flex-col gap-1.5">
              {morosityRisk.predictions.map((pred) => (
                <div
                  key={pred.unitLabel}
                  className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2"
                >
                  <div>
                    <p className="text-xs font-medium text-gray-900">
                      {pred.unitLabel}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      Ultimo atraso:{" "}
                      {pred.lastLatePayment !== "N/A"
                        ? new Date(pred.lastLatePayment).toLocaleDateString(
                            "es-CO",
                            { day: "numeric", month: "short" },
                          )
                        : "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-700">
                      {Math.round(pred.probability * 100)}%
                    </span>
                    <RiskBadge level={pred.riskLevel} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* PQR Patterns */}
      <section className="rounded-2xl bg-white p-4 ring-1 ring-gray-100">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-amber-500" />
          <h2 className="text-sm font-semibold text-gray-900">
            Patrones PQR
          </h2>
        </div>

        <PqrTrendsChart
          byCategory={pqrPatterns.byCategory}
          monthlyTrend={pqrPatterns.monthlyTrend}
        />

        {pqrPatterns.topIssues.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-xs font-medium text-gray-500">
              Temas recurrentes
            </p>
            <div className="flex flex-wrap gap-1.5">
              {pqrPatterns.topIssues.map((issue) => (
                <span
                  key={issue}
                  className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-medium text-amber-700"
                >
                  {issue}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Zone Usage */}
      <section className="rounded-2xl bg-white p-4 ring-1 ring-gray-100">
        <div className="mb-4 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-emerald-500" />
          <h2 className="text-sm font-semibold text-gray-900">
            Uso de Zonas Comunes
          </h2>
        </div>

        <ZoneUsageChart
          byZone={zoneUsage.byZone}
          peakHours={zoneUsage.peakHours}
        />
      </section>

      {/* AI Summary */}
      <AiSummaryCard initialSummary={summary} />

      {/* Footer */}
      <div className="pb-4 text-center">
        <p className="text-[10px] font-medium tracking-wider text-gray-300">
          POTENCIADO POR FOLKS
        </p>
      </div>
    </div>
    </FadeIn>
  );
}
