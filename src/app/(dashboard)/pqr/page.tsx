import Link from "next/link";
import {
  Plus,
  Paperclip,
  Settings,
  AlertTriangle,
  CheckCircle,
  ChevronLeft,
} from "lucide-react";
import { getMyTickets } from "@/features/pqr/queries/get-my-tickets";
import { PqrTabs } from "@/features/pqr/components/pqr-tabs";

const statusConfig: Record<
  string,
  { label: string; badgeColor: string; badgeBg: string }
> = {
  open: {
    label: "EN REVISION",
    badgeColor: "text-amber-700",
    badgeBg: "bg-amber-100",
  },
  in_progress: {
    label: "PROGRAMADO",
    badgeColor: "text-blue-700",
    badgeBg: "bg-blue-100",
  },
  resolved: {
    label: "RESUELTO",
    badgeColor: "text-green-700",
    badgeBg: "bg-green-100",
  },
  rated: {
    label: "CALIFICADO",
    badgeColor: "text-green-700",
    badgeBg: "bg-green-100",
  },
};

function getSteps(status: string) {
  const steps = [
    { label: "Reportado", completed: false, active: false },
    { label: "Revision", completed: false, active: false },
    { label: "Resuelto", completed: false, active: false },
  ];
  if (status === "open") {
    steps[0].completed = true;
    steps[1].active = true;
  } else if (status === "in_progress") {
    steps[0].completed = true;
    steps[1].completed = true;
    steps[2].active = true;
  } else if (status === "resolved" || status === "rated") {
    steps[0].completed = true;
    steps[1].completed = true;
    steps[2].completed = true;
  }
  return steps;
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `Hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Hace ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `Hace ${days} dias`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `Hace ${weeks} semanas`;
  const months = Math.floor(days / 30);
  return `Hace ${months} meses`;
}

function ProgressSteps({ status }: { status: string }) {
  const steps = getSteps(status);

  return (
    <div className="mt-4 flex items-center">
      {steps.map((step, idx) => (
        <div key={step.label} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`flex h-3 w-3 rounded-full ${
                step.completed || step.active
                  ? "bg-amber-500"
                  : "bg-gray-200"
              }`}
            />
            <span
              className={`mt-1.5 text-[10px] font-medium ${
                step.completed || step.active
                  ? "text-amber-600"
                  : "text-gray-400"
              } ${step.active ? "font-bold" : ""}`}
            >
              {step.label}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div
              className={`mx-2 mb-4 h-[2.5px] w-10 rounded-full ${
                step.completed ? "bg-amber-500" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default async function PqrPage() {
  const { tickets } = await getMyTickets();

  const enProceso = tickets.filter(
    (t) => t.status === "open" || t.status === "in_progress"
  );
  const cerradas = tickets.filter(
    (t) => t.status === "resolved" || t.status === "rated"
  );

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col">
      {/* Header */}
      <header className="px-5 pb-4 pt-14">
        <div className="flex items-center justify-between">
          <Link
            href="/home"
            className="inline-flex items-center gap-0.5 text-[15px] font-medium text-amber-500"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2} />
            Inicio
          </Link>
          <h1 className="text-[17px] font-bold tracking-tight text-gray-900">
            Incidencias
          </h1>
          <Link
            href="/pqr/nueva"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-white shadow-apple-sm"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
          </Link>
        </div>
      </header>

      <PqrTabs
        enProcesoCount={enProceso.length}
        cerradasCount={cerradas.length}
        enProcesoContent={
          enProceso.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <AlertTriangle className="h-8 w-8 text-gray-400" strokeWidth={1.5} />
              </div>
              <p className="font-medium text-gray-700">
                Sin incidencias abiertas
              </p>
              <p className="text-[13px] text-gray-500">
                Todas tus incidencias han sido atendidas
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {enProceso.map((ticket) => {
                const sc =
                  statusConfig[ticket.status] ?? statusConfig.open;
                const isScheduled = ticket.status === "in_progress";

                return (
                  <Link
                    key={ticket.id}
                    href={`/pqr/${ticket.id}`}
                    className="block rounded-[20px] border border-gray-100 bg-white p-4 shadow-apple-sm transition-shadow hover:shadow-apple"
                  >
                    {/* Badge row */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-[11px] font-medium ${sc.badgeBg} ${sc.badgeColor}`}
                      >
                        {sc.label}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-gray-400">
                          {timeAgo(ticket.created_at)}
                        </span>
                        {!isScheduled && (
                          <Paperclip className="h-4 w-4 text-gray-300" strokeWidth={1.5} />
                        )}
                        {isScheduled && (
                          <Settings className="h-4 w-4 text-gray-300" strokeWidth={1.5} />
                        )}
                      </div>
                    </div>

                    {/* Title + Description */}
                    <h3 className="mt-3 text-[15px] font-semibold tracking-tight text-gray-900">
                      {ticket.subject}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-gray-500">
                      {ticket.description}
                    </p>

                    {/* Progress steps */}
                    <ProgressSteps status={ticket.status} />

                    {/* Scheduled info */}
                    {ticket.scheduled_date && (
                      <div className="mt-3 rounded-[14px] bg-blue-50 p-3">
                        <p className="text-[13px] text-blue-800">
                          <span className="mr-1">{"\uD83D\uDD27"}</span>
                          Reparacion programada para:{" "}
                          <span className="font-bold">
                            {new Date(
                              ticket.scheduled_date
                            ).toLocaleDateString("es-CO", {
                              weekday: "long",
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </p>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          )
        }
        cerradasContent={
          cerradas.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <CheckCircle className="h-8 w-8 text-gray-400" strokeWidth={1.5} />
              </div>
              <p className="font-medium text-gray-700">
                Sin incidencias cerradas
              </p>
              <p className="text-[13px] text-gray-500">
                Aun no se ha cerrado ninguna incidencia
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {cerradas.map((ticket) => {
                const sc =
                  statusConfig[ticket.status] ?? statusConfig.resolved;

                return (
                  <Link
                    key={ticket.id}
                    href={`/pqr/${ticket.id}`}
                    className="block rounded-[20px] border border-gray-100 bg-white p-4 shadow-apple-sm transition-shadow hover:shadow-apple"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-[11px] font-medium ${sc.badgeBg} ${sc.badgeColor}`}
                      >
                        {sc.label}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        {timeAgo(ticket.created_at)}
                      </span>
                    </div>
                    <h3 className="mt-3 text-[15px] font-semibold tracking-tight text-gray-900">
                      {ticket.subject}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-gray-500">
                      {ticket.description}
                    </p>
                    <ProgressSteps status={ticket.status} />

                    {/* Rating display */}
                    {ticket.rating && (
                      <div className="mt-3 flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <svg
                            key={s}
                            className={`h-4 w-4 ${
                              s <= ticket.rating!
                                ? "fill-amber-400 text-amber-400"
                                : "text-gray-200"
                            }`}
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                            fill={
                              s <= ticket.rating! ? "currentColor" : "none"
                            }
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                            />
                          </svg>
                        ))}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          )
        }
      />

      {/* Footer */}
      <div className="pb-24 pt-2 text-center">
        <p className="text-xs font-medium tracking-wider text-gray-300">
          <span className="mr-1">{"\u2726"}</span>
          POTENCIADO POR FOLKS
        </p>
      </div>
    </div>
  );
}
