import Link from "next/link";
import {
  ChevronLeft,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Wrench,
  Volume2,
  Shield,
  CreditCard,
  Trees,
  Car,
  PawPrint,
  Lightbulb,
  HelpCircle,
  AlertTriangle,
} from "lucide-react";
import { getMyTickets } from "@/features/pqr/queries/get-my-tickets";
import { PqrTabs } from "@/features/pqr/components/pqr-tabs";

const categoryIcons: Record<string, typeof Wrench> = {
  maintenance: Wrench,
  noise: Volume2,
  security: Shield,
  billing: CreditCard,
  common_areas: Trees,
  parking: Car,
  pets: PawPrint,
  suggestion: Lightbulb,
  other: HelpCircle,
};

const categoryLabels: Record<string, string> = {
  maintenance: "Mantenimiento",
  noise: "Ruido",
  security: "Seguridad",
  billing: "Cobros",
  common_areas: "Zonas comunes",
  parking: "Parqueadero",
  pets: "Mascotas",
  suggestion: "Sugerencia",
  other: "Otro",
};

const statusConfig: Record<
  string,
  { label: string; badgeColor: string; badgeBg: string }
> = {
  open: {
    label: "ABIERTO",
    badgeColor: "text-amber-700",
    badgeBg: "bg-amber-100",
  },
  in_progress: {
    label: "EN REVISION",
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

const priorityConfig: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  low: { label: "Baja", color: "text-green-700", bg: "bg-green-50" },
  medium: { label: "Media", color: "text-amber-700", bg: "bg-amber-50" },
  high: { label: "Alta", color: "text-orange-700", bg: "bg-orange-50" },
  urgent: { label: "Urgente", color: "text-red-700", bg: "bg-red-50" },
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

export default async function PqrPage() {
  const { tickets, counts } = await getMyTickets();

  const enProceso = tickets.filter(
    (t) => t.status === "open" || t.status === "in_progress"
  );
  const cerradas = tickets.filter(
    (t) => t.status === "resolved" || t.status === "rated"
  );

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white px-4 pb-4 pt-4">
        <div className="flex items-center justify-between">
          <Link
            href="/home"
            className="flex items-center gap-1 text-sm font-medium text-amber-600"
          >
            <ChevronLeft className="h-4 w-4" />
            Inicio
          </Link>
          <h1 className="text-lg font-bold text-gray-900">Incidencias</h1>
          <Link
            href="/pqr/nueva"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-white shadow-sm"
          >
            <Plus className="h-4 w-4" />
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
                <AlertTriangle className="h-8 w-8 text-gray-400" />
              </div>
              <p className="font-medium text-gray-700">Sin incidencias abiertas</p>
              <p className="text-sm text-gray-500">
                Todas tus incidencias han sido atendidas
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {enProceso.map((ticket) => {
                const sc =
                  statusConfig[ticket.status] ?? statusConfig.open;
                const steps = getSteps(ticket.status);
                const pc = priorityConfig[ticket.priority] ?? priorityConfig.medium;

                return (
                  <Link
                    key={ticket.id}
                    href={`/pqr/${ticket.id}`}
                    className="block rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 transition-shadow hover:shadow-md"
                  >
                    {/* Badge + Priority + Time */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${sc.badgeBg} ${sc.badgeColor}`}
                        >
                          {sc.label}
                        </span>
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${pc.bg} ${pc.color}`}
                        >
                          {pc.label}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {timeAgo(ticket.created_at)}
                      </span>
                    </div>

                    {/* Title + Description */}
                    <h3 className="mt-2.5 text-sm font-bold text-gray-900">
                      {ticket.subject}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-gray-500">
                      {ticket.description}
                    </p>

                    {/* Progress steps */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between">
                        {steps.map((step, idx) => (
                          <div key={step.label} className="flex items-center">
                            <div className="flex flex-col items-center">
                              <div
                                className={`flex h-7 w-7 items-center justify-center rounded-full ${
                                  step.completed
                                    ? "bg-amber-500 text-white"
                                    : step.active
                                      ? "border-2 border-amber-500 bg-amber-50 text-amber-600"
                                      : "border-2 border-gray-200 bg-white text-gray-300"
                                }`}
                              >
                                {step.completed ? (
                                  <CheckCircle className="h-4 w-4" />
                                ) : step.active ? (
                                  <Clock className="h-3.5 w-3.5" />
                                ) : (
                                  <AlertCircle className="h-3.5 w-3.5" />
                                )}
                              </div>
                              <span
                                className={`mt-1 text-[10px] font-medium ${
                                  step.completed || step.active
                                    ? "text-gray-700"
                                    : "text-gray-400"
                                }`}
                              >
                                {step.label}
                              </span>
                            </div>
                            {idx < steps.length - 1 && (
                              <div
                                className={`mx-1 mb-4 h-0.5 w-8 sm:w-12 ${
                                  step.completed ? "bg-amber-500" : "bg-gray-200"
                                }`}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Scheduled info */}
                    {ticket.scheduled_date && (
                      <div className="mt-3 flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2.5">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="text-xs font-medium text-blue-800">
                            Reparacion programada para:
                          </p>
                          <p className="text-xs font-bold text-blue-900">
                            {new Date(ticket.scheduled_date).toLocaleDateString(
                              "es-CO",
                              {
                                weekday: "long",
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
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
                <CheckCircle className="h-8 w-8 text-gray-400" />
              </div>
              <p className="font-medium text-gray-700">Sin incidencias cerradas</p>
              <p className="text-sm text-gray-500">
                Aun no se ha cerrado ninguna incidencia
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {cerradas.map((ticket) => {
                const sc =
                  statusConfig[ticket.status] ?? statusConfig.resolved;
                const steps = getSteps(ticket.status);

                return (
                  <Link
                    key={ticket.id}
                    href={`/pqr/${ticket.id}`}
                    className="block rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${sc.badgeBg} ${sc.badgeColor}`}
                      >
                        {sc.label}
                      </span>
                      <span className="text-xs text-gray-400">
                        {timeAgo(ticket.created_at)}
                      </span>
                    </div>
                    <h3 className="mt-2.5 text-sm font-bold text-gray-900">
                      {ticket.subject}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-gray-500">
                      {ticket.description}
                    </p>
                    <div className="mt-4">
                      <div className="flex items-center justify-between">
                        {steps.map((step, idx) => (
                          <div key={step.label} className="flex items-center">
                            <div className="flex flex-col items-center">
                              <div
                                className={`flex h-7 w-7 items-center justify-center rounded-full ${
                                  step.completed
                                    ? "bg-amber-500 text-white"
                                    : "border-2 border-gray-200 bg-white text-gray-300"
                                }`}
                              >
                                {step.completed ? (
                                  <CheckCircle className="h-4 w-4" />
                                ) : (
                                  <AlertCircle className="h-3.5 w-3.5" />
                                )}
                              </div>
                              <span
                                className={`mt-1 text-[10px] font-medium ${
                                  step.completed
                                    ? "text-gray-700"
                                    : "text-gray-400"
                                }`}
                              >
                                {step.label}
                              </span>
                            </div>
                            {idx < steps.length - 1 && (
                              <div
                                className={`mx-1 mb-4 h-0.5 w-8 sm:w-12 ${
                                  step.completed
                                    ? "bg-amber-500"
                                    : "bg-gray-200"
                                }`}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
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
                            fill={s <= ticket.rating! ? "currentColor" : "none"}
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
        <p className="text-[10px] font-medium tracking-wider text-gray-400">
          <span className="mr-1">{"\u2726"}</span>
          POTENCIADO POR FOLKS
        </p>
      </div>
    </div>
  );
}
