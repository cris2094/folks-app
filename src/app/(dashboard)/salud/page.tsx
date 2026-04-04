import Link from "next/link";
import {
  ChevronLeft,
  DollarSign,
  Wrench,
  Shield,
  Heart,
  Lightbulb,
} from "lucide-react";
import { getBuildingHealth } from "@/features/salud-edificio/queries/get-building-health";
import type { HealthDimension } from "@/features/salud-edificio/queries/get-building-health";
import { HealthScoreCircle } from "@/features/salud-edificio/components/health-score-circle";
import {
  FadeIn,
  FadeInUp,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion";
import type { LucideIcon } from "lucide-react";

const DIMENSION_CONFIG: Record<
  string,
  { icon: LucideIcon; bg: string; iconColor: string; barColor: string }
> = {
  Financiero: {
    icon: DollarSign,
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    barColor: "bg-emerald-500",
  },
  Mantenimiento: {
    icon: Wrench,
    bg: "bg-blue-50",
    iconColor: "text-blue-600",
    barColor: "bg-blue-500",
  },
  Regulatorio: {
    icon: Shield,
    bg: "bg-purple-50",
    iconColor: "text-purple-600",
    barColor: "bg-purple-500",
  },
  Convivencia: {
    icon: Heart,
    bg: "bg-pink-50",
    iconColor: "text-pink-600",
    barColor: "bg-pink-500",
  },
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  green: { label: "Excelente", color: "text-emerald-600" },
  yellow: { label: "Bueno", color: "text-amber-600" },
  red: { label: "Necesita Atencion", color: "text-red-600" },
};

function DimensionCard({ dimension }: { dimension: HealthDimension }) {
  const config = DIMENSION_CONFIG[dimension.name] ?? {
    icon: Shield,
    bg: "bg-gray-50",
    iconColor: "text-gray-600",
    barColor: "bg-gray-500",
  };
  const Icon = config.icon;
  const statusDot =
    dimension.status === "green"
      ? "bg-emerald-400"
      : dimension.status === "yellow"
        ? "bg-amber-400"
        : "bg-red-400";

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-apple-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl ${config.bg}`}
          >
            <Icon className={`h-[18px] w-[18px] ${config.iconColor}`} strokeWidth={1.5} />
          </div>
          <span className="text-[13px] font-semibold text-gray-900">
            {dimension.name}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`h-2 w-2 rounded-full ${statusDot}`} />
          <span className="text-[15px] font-bold text-gray-900">
            {dimension.score}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-full rounded-full transition-all ${config.barColor}`}
          style={{ width: `${dimension.score}%` }}
        />
      </div>

      <p className="text-[11px] leading-relaxed text-gray-500">
        {dimension.details}
      </p>
    </div>
  );
}

export default async function SaludPage() {
  const health = await getBuildingHealth();
  const statusInfo = STATUS_LABELS[health.status];

  // Collect all recommendations
  const allRecommendations = health.dimensions.flatMap((d) => d.recommendations);

  return (
    <div className="mx-auto w-full max-w-md">
      {/* Header */}
      <header className="px-5 pb-4 pt-14">
        <div className="flex items-center justify-between">
          <Link
            href="/home"
            className="flex items-center gap-0.5 text-[15px] font-medium text-amber-500"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2} />
            Inicio
          </Link>
          <h1 className="text-[17px] font-bold tracking-tight text-gray-900">
            Salud del Edificio
          </h1>
          <div className="w-12" />
        </div>
      </header>

      {/* Score Circle */}
      <FadeIn>
        <div className="flex flex-col items-center px-5 pt-4 pb-2">
          <HealthScoreCircle
            score={health.overallScore}
            status={health.status}
          />
          <p className={`mt-3 text-[15px] font-semibold ${statusInfo.color}`}>
            Estado General: {statusInfo.label}
          </p>
          <p className="mt-1 text-[11px] text-gray-400">
            Actualizado: {new Date(health.lastUpdated).toLocaleDateString("es-CO", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </FadeIn>

      {/* Dimension Cards 2x2 */}
      <div className="px-4 pt-5">
        <FadeIn delay={0.1}>
          <p className="mb-3 text-[15px] font-semibold tracking-tight text-gray-900">
            Dimensiones
          </p>
        </FadeIn>
        <StaggerContainer className="grid grid-cols-2 gap-3">
          {health.dimensions.map((dimension) => (
            <StaggerItem key={dimension.name}>
              <DimensionCard dimension={dimension} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>

      {/* Recommendations */}
      {allRecommendations.length > 0 && (
        <FadeInUp delay={0.3}>
          <div className="px-4 pt-6">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100">
                <Lightbulb className="h-4 w-4 text-amber-600" />
              </div>
              <p className="text-[15px] font-semibold tracking-tight text-gray-900">
                Recomendaciones
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {allRecommendations.map((rec, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-apple-sm"
                >
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100">
                    <span className="text-[10px] font-bold text-amber-700">
                      {i + 1}
                    </span>
                  </div>
                  <p className="text-[13px] leading-relaxed text-gray-700">
                    {rec}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </FadeInUp>
      )}

      {/* Footer */}
      <div className="px-4 pb-6 pt-8">
        <p className="text-center text-[10px] font-medium tracking-wider text-gray-300">
          POTENCIADO POR FOLKS
        </p>
      </div>
    </div>
  );
}
