import Link from "next/link";
import {
  ChevronLeft,
  FileText,
  ListChecks,
  Wallet,
  MessageSquarePlus,
  Calendar,
  User,
} from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion";
import { Card, CardContent } from "@/components/ui/card";
import { getPublicInfo } from "@/features/transparencia/queries/get-public-info";
import type { CommitmentStatus } from "@/types/database";

const STATUS_STYLE: Record<
  CommitmentStatus,
  { bg: string; text: string; label: string }
> = {
  pending: { bg: "bg-gray-100", text: "text-gray-700", label: "Pendiente" },
  in_progress: {
    bg: "bg-amber-100",
    text: "text-amber-800",
    label: "En progreso",
  },
  completed: {
    bg: "bg-emerald-100",
    text: "text-emerald-800",
    label: "Completado",
  },
  overdue: { bg: "bg-red-100", text: "text-red-700", label: "Vencido" },
};

function formatCOP(value: number): string {
  return value.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function TransparenciaPage() {
  const info = await getPublicInfo();

  return (
    <div className="mx-auto max-w-md">
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
            Transparencia
          </h1>
          <div className="w-12" />
        </div>
      </header>

      <FadeIn>
      <div className="flex flex-col gap-5 px-4 pb-6 pt-4">
        {/* Section: Últimas decisiones del consejo */}
        <section>
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100">
              <FileText className="h-4 w-4 text-blue-600" />
            </div>
            <h2 className="text-sm font-semibold text-gray-900">
              Ultimas decisiones del consejo
            </h2>
          </div>

          {info.assemblies.length === 0 ? (
            <Card size="sm">
              <CardContent className="py-6 text-center">
                <p className="text-xs text-muted-foreground">
                  No hay asambleas publicadas aun
                </p>
              </CardContent>
            </Card>
          ) : (
            <StaggerContainer className="flex flex-col gap-2">
              {info.assemblies.map((assembly) => (
                <StaggerItem key={assembly.id}>
                <Card size="sm">
                  <CardContent className="flex flex-col gap-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-medium text-gray-900">
                        {assembly.title}
                      </p>
                      <span className="shrink-0 text-[10px] text-muted-foreground">
                        {formatDate(assembly.date)}
                      </span>
                    </div>
                    {assembly.summary && (
                      <p className="line-clamp-2 text-[11px] leading-relaxed text-gray-500">
                        {assembly.summary}
                      </p>
                    )}
                  </CardContent>
                </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </section>

        {/* Section: Compromisos activos */}
        <section>
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100">
              <ListChecks className="h-4 w-4 text-amber-600" />
            </div>
            <h2 className="text-sm font-semibold text-gray-900">
              Compromisos activos
            </h2>
          </div>

          {info.commitments.length === 0 ? (
            <Card size="sm">
              <CardContent className="py-6 text-center">
                <p className="text-xs text-muted-foreground">
                  No hay compromisos pendientes
                </p>
              </CardContent>
            </Card>
          ) : (
            <StaggerContainer className="flex flex-col gap-2">
              {info.commitments.map((commitment) => {
                const style = STATUS_STYLE[commitment.status];
                const isOverdue =
                  commitment.due_date &&
                  commitment.due_date < new Date().toISOString().split("T")[0] &&
                  commitment.status !== "completed";

                return (
                  <StaggerItem key={commitment.id}>
                  <Card size="sm">
                    <CardContent className="flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-medium text-gray-900">
                          {commitment.title}
                        </p>
                        <span
                          className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-medium ${style.bg} ${style.text}`}
                        >
                          {style.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                        {commitment.responsible && (
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {commitment.responsible}
                          </span>
                        )}
                        {commitment.due_date && (
                          <span
                            className={`flex items-center gap-1 ${
                              isOverdue ? "font-medium text-red-600" : ""
                            }`}
                          >
                            <Calendar className="h-3 w-3" />
                            {formatDate(commitment.due_date)}
                          </span>
                        )}
                      </div>

                      {/* Progress bar */}
                      <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className={`h-full rounded-full transition-all ${
                            commitment.progress >= 100
                              ? "bg-emerald-500"
                              : commitment.progress >= 50
                                ? "bg-amber-500"
                                : "bg-gray-300"
                          }`}
                          style={{ width: `${commitment.progress}%` }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          )}
        </section>

        {/* Section: Presupuesto público */}
        <section>
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100">
              <Wallet className="h-4 w-4 text-emerald-600" />
            </div>
            <h2 className="text-sm font-semibold text-gray-900">
              Presupuesto publico
            </h2>
          </div>

          <Card size="sm">
            <CardContent className="flex flex-col gap-3">
              {info.budget.periodName ? (
                <>
                  <p className="text-xs text-muted-foreground">
                    {info.budget.periodName}
                  </p>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-gray-50 p-2">
                      <p className="text-[10px] text-gray-500">
                        Presupuestado
                      </p>
                      <p className="text-xs font-bold text-gray-900">
                        {formatCOP(info.budget.totalBudgeted)}
                      </p>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-2">
                      <p className="text-[10px] text-gray-500">Ejecutado</p>
                      <p className="text-xs font-bold text-gray-900">
                        {formatCOP(info.budget.totalExecuted)}
                      </p>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-2">
                      <p className="text-[10px] text-gray-500">Ejecucion</p>
                      <p
                        className={`text-xs font-bold ${
                          info.budget.executionPercentage > 100
                            ? "text-red-600"
                            : "text-emerald-600"
                        }`}
                      >
                        {info.budget.executionPercentage}%
                      </p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full transition-all ${
                        info.budget.executionPercentage > 100
                          ? "bg-red-500"
                          : info.budget.executionPercentage > 80
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                      }`}
                      style={{
                        width: `${Math.min(info.budget.executionPercentage, 100)}%`,
                      }}
                    />
                  </div>
                </>
              ) : (
                <p className="py-4 text-center text-xs text-muted-foreground">
                  No hay presupuesto publicado para el periodo actual
                </p>
              )}
            </CardContent>
          </Card>
        </section>

        {/* CTA: Questions */}
        <Link
          href="/pqr/nueva?category=suggestion"
          className="flex items-center justify-center gap-2 rounded-xl bg-amber-600 py-3 text-sm font-semibold text-white shadow-md shadow-amber-600/25 transition-all hover:bg-amber-700"
        >
          <MessageSquarePlus className="h-4 w-4" />
          Tienes preguntas? Escribe aqui
        </Link>

        {/* Footer */}
        <p className="pb-2 text-center text-[10px] font-medium tracking-wider text-gray-300">
          POTENCIADO POR FOLKS
        </p>
      </div>
      </FadeIn>
    </div>
  );
}
