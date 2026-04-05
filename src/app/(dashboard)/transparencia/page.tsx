import Link from "next/link";
import {
  ChevronLeft,
  FileText,
  ListChecks,
  Wallet,
  MessageSquarePlus,
} from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion";
import { Card, CardContent } from "@/components/ui/card";
import { getPublicInfo } from "@/features/transparencia/queries/get-public-info";
import { getCurrentUser } from "@/features/auth/queries/get-current-user";
import { CommitmentsDashboard } from "@/features/transparencia/components/commitments-dashboard";
import type { UserRole } from "@/types/database";

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
  const [info, userData] = await Promise.all([
    getPublicInfo(),
    getCurrentUser(),
  ]);

  const role = (userData?.resident?.role ?? "residente") as UserRole;
  const isAdmin = role === "admin" || role === "super_admin";

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
            Transparencia
          </h1>
          <div className="w-12" />
        </div>
      </header>

      <FadeIn>
        <div className="flex flex-col gap-5 px-4 pb-6 pt-4">
          {/* Section: Ultimas decisiones del consejo */}
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

          {/* Section: Compromisos activos -- Interactive Dashboard */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100">
                  <ListChecks className="h-4 w-4 text-amber-600" />
                </div>
                <h2 className="text-sm font-semibold text-gray-900">
                  Seguimiento de compromisos
                </h2>
              </div>
              {info.commitments.length > 0 && (
                <span className="text-[10px] font-medium text-gray-400">
                  {info.commitments.length} activos
                </span>
              )}
            </div>

            <CommitmentsDashboard
              commitments={info.commitments.map((c) => ({
                id: c.id,
                title: c.title,
                responsible: c.responsible,
                status: c.status,
                progress: c.progress,
                due_date: c.due_date,
                updated_at: c.updated_at,
              }))}
              isAdmin={isAdmin}
            />
          </section>

          {/* Section: Presupuesto publico */}
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
