import Link from "next/link";
import {
  ChevronLeft,
  CheckCircle,
  Clock,
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
  User,
  Flag,
} from "lucide-react";
import { getTicketDetail } from "@/features/pqr/queries/get-ticket-detail";
import { TicketChat } from "@/features/pqr/components/ticket-chat";
import { StarRating } from "@/features/pqr/components/star-rating";
import { notFound } from "next/navigation";

const categoryConfig: Record<
  string,
  { label: string; icon: typeof Wrench; color: string; bg: string }
> = {
  maintenance: {
    label: "Mantenimiento",
    icon: Wrench,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  noise: {
    label: "Ruido",
    icon: Volume2,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  security: {
    label: "Seguridad",
    icon: Shield,
    color: "text-red-600",
    bg: "bg-red-50",
  },
  billing: {
    label: "Cobros",
    icon: CreditCard,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  common_areas: {
    label: "Zonas comunes",
    icon: Trees,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  parking: {
    label: "Parqueadero",
    icon: Car,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  pets: {
    label: "Mascotas",
    icon: PawPrint,
    color: "text-pink-600",
    bg: "bg-pink-50",
  },
  suggestion: {
    label: "Sugerencia",
    icon: Lightbulb,
    color: "text-yellow-600",
    bg: "bg-yellow-50",
  },
  other: {
    label: "Otro",
    icon: HelpCircle,
    color: "text-gray-600",
    bg: "bg-gray-50",
  },
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

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { ticket, messages, currentResidentId } = await getTicketDetail(id);

  if (!ticket) notFound();

  const sc = statusConfig[ticket.status] ?? statusConfig.open;
  const cc = categoryConfig[ticket.category] ?? categoryConfig.other;
  const pc = priorityConfig[ticket.priority] ?? priorityConfig.medium;
  const CategoryIcon = cc.icon;
  const steps = getSteps(ticket.status);
  const isClosed = ticket.status === "resolved" || ticket.status === "rated";

  const residentName = Array.isArray(ticket.resident)
    ? ticket.resident[0]?.full_name
    : ticket.resident?.full_name;
  const unitInfo = Array.isArray(ticket.unit)
    ? ticket.unit[0]
    : ticket.unit;
  const assignedName = Array.isArray(ticket.assigned)
    ? ticket.assigned[0]?.full_name
    : ticket.assigned?.full_name;

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white px-4 pb-4 pt-4">
        <div className="flex items-center justify-between">
          <Link
            href="/pqr"
            className="flex items-center gap-1 text-sm font-medium text-amber-600"
          >
            <ChevronLeft className="h-4 w-4" />
            Incidencias
          </Link>
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${sc.badgeBg} ${sc.badgeColor}`}
          >
            {sc.label}
          </span>
        </div>
        <h1 className="mt-3 text-lg font-bold text-gray-900">
          {ticket.subject}
        </h1>
      </header>

      {/* Info card */}
      <div className="px-4 pt-4">
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
          <div className="grid grid-cols-2 gap-3">
            {/* Category */}
            <div className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-xl ${cc.bg}`}
              >
                <CategoryIcon className={`h-4 w-4 ${cc.color}`} />
              </div>
              <div>
                <p className="text-[10px] font-medium text-gray-400">
                  Categoria
                </p>
                <p className="text-xs font-semibold text-gray-900">
                  {cc.label}
                </p>
              </div>
            </div>

            {/* Priority */}
            <div className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-xl ${pc.bg}`}
              >
                <Flag className={`h-4 w-4 ${pc.color}`} />
              </div>
              <div>
                <p className="text-[10px] font-medium text-gray-400">
                  Prioridad
                </p>
                <p className="text-xs font-semibold text-gray-900">
                  {pc.label}
                </p>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-50">
                <Calendar className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <p className="text-[10px] font-medium text-gray-400">Fecha</p>
                <p className="text-xs font-semibold text-gray-900">
                  {new Date(ticket.created_at).toLocaleDateString("es-CO", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Assigned */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] font-medium text-gray-400">
                  Responsable
                </p>
                <p className="text-xs font-semibold text-gray-900">
                  {assignedName ?? "Sin asignar"}
                </p>
              </div>
            </div>
          </div>

          {/* Unit info */}
          {unitInfo && (
            <div className="mt-3 rounded-xl bg-gray-50 px-3 py-2">
              <p className="text-xs text-gray-500">
                Reportado por{" "}
                <span className="font-semibold text-gray-900">
                  {residentName}
                </span>{" "}
                - {unitInfo.tower} Apto {unitInfo.apartment}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Scheduled date */}
      {ticket.scheduled_date && (
        <div className="px-4 pt-3">
          <div className="flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2.5">
            <Calendar className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-xs font-medium text-blue-800">
                Reparacion programada para:
              </p>
              <p className="text-xs font-bold text-blue-900">
                {new Date(ticket.scheduled_date).toLocaleDateString("es-CO", {
                  weekday: "long",
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Progress steps */}
      <div className="px-4 pt-4">
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
          <p className="mb-3 text-xs font-semibold text-gray-900">
            Progreso
          </p>
          <div className="flex items-center justify-between">
            {steps.map((step, idx) => (
              <div key={step.label} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${
                      step.completed
                        ? "bg-amber-500 text-white"
                        : step.active
                          ? "border-2 border-amber-500 bg-amber-50 text-amber-600"
                          : "border-2 border-gray-200 bg-white text-gray-300"
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : step.active ? (
                      <Clock className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                  </div>
                  <span
                    className={`mt-1.5 text-[11px] font-medium ${
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
                    className={`mx-2 mb-5 h-0.5 w-10 sm:w-16 ${
                      step.completed ? "bg-amber-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat */}
      <div className="mt-4">
        <div className="px-4 pb-2">
          <p className="text-xs font-semibold text-gray-900">Conversacion</p>
        </div>
        <TicketChat
          ticketId={ticket.id}
          messages={messages}
          currentResidentId={currentResidentId ?? ""}
          disabled={isClosed}
        />
      </div>

      {/* Rating (when resolved) */}
      {(ticket.status === "resolved" || ticket.status === "rated") && (
        <div className="px-4 pt-4">
          <StarRating
            ticketId={ticket.id}
            currentRating={ticket.rating}
            readonly={ticket.status === "rated"}
          />
        </div>
      )}

      {/* Footer */}
      <div className="pb-24 pt-6 text-center">
        <p className="text-[10px] font-medium tracking-wider text-gray-400">
          <span className="mr-1">{"\u2726"}</span>
          POTENCIADO POR FOLKS
        </p>
      </div>
    </div>
  );
}
