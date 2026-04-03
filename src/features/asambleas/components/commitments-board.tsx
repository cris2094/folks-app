"use client";

import { useState, useTransition } from "react";
import { Calendar, User, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { CommitmentStatus } from "@/types/database";
import type { CommitmentWithUnit } from "@/features/asambleas/queries/get-assembly-detail";
import { updateCommitmentStatus } from "@/features/asambleas/actions/update-commitment-status";

interface CommitmentsBoardProps {
  commitments: CommitmentWithUnit[];
  assemblyId: string;
}

const COLUMNS: {
  status: CommitmentStatus;
  label: string;
  headerBg: string;
  headerText: string;
}[] = [
  {
    status: "pending",
    label: "Pendiente",
    headerBg: "bg-gray-100",
    headerText: "text-gray-700",
  },
  {
    status: "in_progress",
    label: "En Progreso",
    headerBg: "bg-amber-100",
    headerText: "text-amber-800",
  },
  {
    status: "completed",
    label: "Completado",
    headerBg: "bg-emerald-100",
    headerText: "text-emerald-800",
  },
];

const STATUS_BUTTON_LABEL: Record<CommitmentStatus, string> = {
  pending: "Iniciar",
  in_progress: "Completar",
  completed: "Reabrir",
  overdue: "Retomar",
};

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
  });
}

export function CommitmentsBoard({
  commitments: initialCommitments,
  assemblyId,
}: CommitmentsBoardProps) {
  const [commitments, setCommitments] = useState(initialCommitments);
  const [isPending, startTransition] = useTransition();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  function handleStatusChange(commitmentId: string) {
    setUpdatingId(commitmentId);
    startTransition(async () => {
      const result = await updateCommitmentStatus(commitmentId, assemblyId);
      if (result.success && result.newStatus) {
        setCommitments((prev) =>
          prev.map((c) =>
            c.id === commitmentId
              ? {
                  ...c,
                  status: result.newStatus as CommitmentStatus,
                  progress:
                    result.newStatus === "completed"
                      ? 100
                      : result.newStatus === "in_progress"
                        ? 50
                        : 0,
                }
              : c,
          ),
        );
      }
      setUpdatingId(null);
    });
  }

  if (commitments.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No hay compromisos registrados
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {COLUMNS.map((column) => {
        // Include overdue items in pending column
        const items = commitments.filter((c) =>
          column.status === "pending"
            ? c.status === "pending" || c.status === "overdue"
            : c.status === column.status,
        );

        return (
          <div key={column.status} className="flex flex-col gap-2">
            {/* Column header */}
            <div
              className={`flex items-center justify-between rounded-lg px-3 py-1.5 ${column.headerBg}`}
            >
              <span
                className={`text-xs font-semibold ${column.headerText}`}
              >
                {column.label}
              </span>
              <span
                className={`text-[10px] font-medium ${column.headerText}`}
              >
                {items.length}
              </span>
            </div>

            {/* Cards */}
            {items.length === 0 ? (
              <p className="py-3 text-center text-[10px] text-muted-foreground">
                Sin compromisos
              </p>
            ) : (
              items.map((commitment) => {
                const isUpdating = updatingId === commitment.id;
                const isOverdue =
                  commitment.status !== "completed" &&
                  commitment.due_date &&
                  commitment.due_date <
                    new Date().toISOString().split("T")[0];

                return (
                  <Card key={commitment.id} size="sm">
                    <CardContent className="flex flex-col gap-2">
                      <p className="text-xs font-medium">
                        {commitment.title}
                      </p>

                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                        {(commitment.responsible_name ||
                          commitment.responsible) && (
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {commitment.responsible_name ??
                              commitment.responsible}
                          </span>
                        )}
                        {commitment.due_date && (
                          <span
                            className={`flex items-center gap-1 ${
                              isOverdue
                                ? "font-medium text-red-600"
                                : ""
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
                          style={{
                            width: `${commitment.progress}%`,
                          }}
                        />
                      </div>

                      {/* Status change button */}
                      <button
                        type="button"
                        disabled={isUpdating || isPending}
                        onClick={() =>
                          handleStatusChange(commitment.id)
                        }
                        className="rounded-lg border border-gray-200 py-1 text-[10px] font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
                      >
                        {isUpdating ? (
                          <Loader2 className="mx-auto h-3 w-3 animate-spin" />
                        ) : (
                          STATUS_BUTTON_LABEL[commitment.status]
                        )}
                      </button>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        );
      })}
    </div>
  );
}
