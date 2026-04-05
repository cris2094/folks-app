"use client";

import { useState, useTransition } from "react";
import { Calendar, User, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { CommitmentStatus } from "@/types/database";
import { updateCommitmentProgress } from "@/features/transparencia/actions/update-commitment-progress";

export interface DashboardCommitment {
  id: string;
  title: string;
  responsible: string | null;
  status: CommitmentStatus;
  progress: number;
  due_date: string | null;
  updated_at: string;
}

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

const STATUS_ORDER: CommitmentStatus[] = [
  "in_progress",
  "pending",
  "overdue",
  "completed",
];

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function CommitmentCard({
  commitment,
  isAdmin,
}: {
  commitment: DashboardCommitment;
  isAdmin: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [progress, setProgress] = useState(commitment.progress);
  const [status, setStatus] = useState(commitment.status);
  const [isPending, startTransition] = useTransition();

  const style = STATUS_STYLE[status];
  const isOverdue =
    commitment.due_date &&
    commitment.due_date < new Date().toISOString().split("T")[0] &&
    status !== "completed";

  function handleSave() {
    startTransition(async () => {
      const result = await updateCommitmentProgress(
        commitment.id,
        progress,
        status,
      );
      if (result.error) {
        // Reset on error
        setProgress(commitment.progress);
        setStatus(commitment.status);
      }
    });
  }

  return (
    <Card size="sm">
      <CardContent className="flex flex-col gap-2">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <button
            type="button"
            className="flex flex-1 items-start gap-1 text-left"
            onClick={() => setExpanded(!expanded)}
          >
            <p className="text-xs font-medium text-gray-900 flex-1">
              {commitment.title}
            </p>
            {expanded ? (
              <ChevronUp className="h-3.5 w-3.5 shrink-0 text-gray-400 mt-0.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 shrink-0 text-gray-400 mt-0.5" />
            )}
          </button>
          <span
            className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-medium ${style.bg} ${style.text}`}
          >
            {style.label}
          </span>
        </div>

        {/* Meta */}
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
              progress >= 100
                ? "bg-emerald-500"
                : progress >= 50
                  ? "bg-amber-500"
                  : "bg-gray-300"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-right text-[10px] text-gray-400">{progress}%</p>

        {/* Expanded: admin edit or timeline */}
        {expanded && (
          <div className="mt-1 space-y-3 border-t border-gray-100 pt-3">
            {/* Timeline */}
            <div className="text-[10px] text-gray-400">
              Ultima actualizacion: {formatDate(commitment.updated_at)}
            </div>

            {/* Admin edit controls */}
            {isAdmin && (
              <div className="space-y-2">
                <label className="text-[11px] font-medium text-gray-600">
                  Progreso
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />

                <label className="text-[11px] font-medium text-gray-600">
                  Estado
                </label>
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as CommitmentStatus)
                  }
                  className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-700"
                >
                  <option value="pending">Pendiente</option>
                  <option value="in_progress">En progreso</option>
                  <option value="completed">Completado</option>
                </select>

                <button
                  type="button"
                  disabled={isPending}
                  onClick={handleSave}
                  className="w-full rounded-lg bg-amber-500 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-amber-600 disabled:opacity-50"
                >
                  {isPending ? (
                    <Loader2 className="mx-auto h-3.5 w-3.5 animate-spin" />
                  ) : (
                    "Guardar cambios"
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function CommitmentsDashboard({
  commitments,
  isAdmin,
}: {
  commitments: DashboardCommitment[];
  isAdmin: boolean;
}) {
  if (commitments.length === 0) {
    return (
      <Card size="sm">
        <CardContent className="py-6 text-center">
          <p className="text-xs text-muted-foreground">
            No hay compromisos pendientes
          </p>
        </CardContent>
      </Card>
    );
  }

  // Sort by status order
  const sorted = [...commitments].sort(
    (a, b) =>
      STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status),
  );

  return (
    <div className="flex flex-col gap-2">
      {sorted.map((commitment) => (
        <CommitmentCard
          key={commitment.id}
          commitment={commitment}
          isAdmin={isAdmin}
        />
      ))}
    </div>
  );
}
