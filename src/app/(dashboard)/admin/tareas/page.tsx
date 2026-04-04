import {
  Calendar,
  User,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  ListTodo,
} from "lucide-react";
import { getCommitments } from "@/features/asambleas/queries/get-commitments";
import type { CommitmentListItem } from "@/features/asambleas/queries/get-commitments";
import { TareasTabs } from "@/features/tareas/components/tareas-tabs";
import { FadeIn, FadeInUp } from "@/components/motion";

const PRIORITY_MAP: Record<
  string,
  { label: string; bg: string; text: string }
> = {
  high: { label: "Alta", bg: "bg-red-50", text: "text-red-700" },
  medium: { label: "Media", bg: "bg-amber-50", text: "text-amber-700" },
  low: { label: "Baja", bg: "bg-blue-50", text: "text-blue-700" },
};

function getPriority(task: CommitmentListItem): string {
  if (task.is_overdue) return "high";
  if (task.due_date) {
    const days =
      (new Date(task.due_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    if (days <= 3) return "high";
    if (days <= 7) return "medium";
  }
  return "low";
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
  });
}

function TaskCard({ task }: { task: CommitmentListItem }) {
  const priority = getPriority(task);
  const pc = PRIORITY_MAP[priority] ?? PRIORITY_MAP.low;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-apple-sm">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-[14px] font-semibold text-gray-900 line-clamp-1">
              {task.title}
            </h3>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${pc.bg} ${pc.text}`}
            >
              {pc.label}
            </span>
          </div>

          {task.description && (
            <p className="mt-1 line-clamp-2 text-[12px] text-gray-500">
              {task.description}
            </p>
          )}

          <div className="mt-3 flex items-center gap-4 text-[11px] text-gray-400">
            {(task.responsible_name || task.responsible) && (
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" strokeWidth={2} />
                {task.responsible_name ?? task.responsible}
              </span>
            )}
            {task.due_date && (
              <span
                className={`flex items-center gap-1 ${task.is_overdue ? "font-medium text-red-600" : ""}`}
              >
                <Calendar className="h-3 w-3" strokeWidth={2} />
                {formatDate(task.due_date)}
                {task.is_overdue && " (vencida)"}
              </span>
            )}
          </div>

          {/* Progress bar */}
          <div className="mt-3 flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full rounded-full transition-all ${
                  task.progress >= 100
                    ? "bg-emerald-500"
                    : task.progress >= 50
                      ? "bg-amber-500"
                      : "bg-gray-300"
                }`}
                style={{ width: `${task.progress}%` }}
              />
            </div>
            <span className="text-[10px] font-medium text-gray-400">
              {task.progress}%
            </span>
          </div>
        </div>

        <ChevronRight className="ml-2 h-4 w-4 shrink-0 text-gray-300" strokeWidth={2} />
      </div>
    </div>
  );
}

function TaskList({ tasks }: { tasks: CommitmentListItem[] }) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <ListTodo className="h-8 w-8 text-gray-400" strokeWidth={1.5} />
        </div>
        <p className="font-medium text-gray-700">Sin tareas</p>
        <p className="text-[13px] text-gray-500">
          No hay tareas en esta categoria
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}

export default async function TareasPage() {
  const { data: tasks } = await getCommitments({ limit: 100 });

  const pending = tasks.filter(
    (t) => t.status === "pending" || t.status === "overdue"
  );
  const inProgress = tasks.filter((t) => t.status === "in_progress");
  const completed = tasks.filter((t) => t.status === "completed");

  return (
    <div>
      {/* Stats row */}
      <FadeInUp delay={0.05}>
        <div className="mb-5 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-gray-100 bg-white p-3 text-center shadow-apple-sm">
            <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-amber-50">
              <AlertCircle className="h-4 w-4 text-amber-600" strokeWidth={2} />
            </div>
            <p className="text-lg font-bold text-gray-900">{pending.length}</p>
            <p className="text-[10px] text-gray-500">Pendientes</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-3 text-center shadow-apple-sm">
            <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-blue-50">
              <Clock className="h-4 w-4 text-blue-600" strokeWidth={2} />
            </div>
            <p className="text-lg font-bold text-gray-900">{inProgress.length}</p>
            <p className="text-[10px] text-gray-500">En progreso</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-3 text-center shadow-apple-sm">
            <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" strokeWidth={2} />
            </div>
            <p className="text-lg font-bold text-gray-900">{completed.length}</p>
            <p className="text-[10px] text-gray-500">Completadas</p>
          </div>
        </div>
      </FadeInUp>

      <FadeInUp delay={0.1}>
        <TareasTabs
          pendingCount={pending.length}
          inProgressCount={inProgress.length}
          completedCount={completed.length}
          pendingContent={<TaskList tasks={pending} />}
          inProgressContent={<TaskList tasks={inProgress} />}
          completedContent={<TaskList tasks={completed} />}
        />
      </FadeInUp>

      {/* Footer */}
      <div className="pb-8 pt-6 text-center">
        <p className="flex items-center justify-center gap-1 text-xs font-medium tracking-wider text-gray-300">
          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
          POTENCIADO POR FOLKS
        </p>
      </div>
    </div>
  );
}
