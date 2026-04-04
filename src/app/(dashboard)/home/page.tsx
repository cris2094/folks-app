import Link from "next/link";
import {
  Bell,
  Clock,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser } from "@/features/auth/queries/get-current-user";
import { getUnreadCount } from "@/features/comunicados/queries/get-notifications";
import { getPaymentSummary } from "@/features/pagos/queries/get-payment-summary";
import { getAnnouncements } from "@/features/comunicados/queries/get-announcements";
import {
  FadeIn,
  FadeInUp,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion";
import { getHomeActions } from "@/lib/permissions";
import type { UserRole } from "@/types/database";

function formatCurrency(amount: number) {
  return `$${amount.toLocaleString("es-CO")}`;
}

function formatAnnouncementTime(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const time = date.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return isToday ? `Hoy, ${time}` : date.toLocaleDateString("es-CO", { day: "numeric", month: "short" }) + `, ${time}`;
}

function getCategoryBadge(category: string) {
  const map: Record<string, { label: string; className: string }> = {
    urgent: { label: "IMPORTANTE", className: "bg-red-500 text-white" },
    maintenance: { label: "MANTENIMIENTO", className: "bg-amber-500 text-white" },
    general: { label: "GENERAL", className: "bg-blue-500 text-white" },
    event: { label: "EVENTO", className: "bg-green-500 text-white" },
  };
  return map[category] ?? { label: category.toUpperCase(), className: "bg-gray-500 text-white" };
}

export default async function HomePage() {
  const [data, unreadCount, paymentSummary, announcements] = await Promise.all([
    getCurrentUser(),
    getUnreadCount(),
    getPaymentSummary(),
    getAnnouncements(),
  ]);

  const role = (data?.resident?.role ?? "residente") as UserRole;
  const quickActions = getHomeActions(role);

  const fullName = data?.resident?.full_name ?? "";
  const name = fullName.split(" ")[0] || "Residente";
  const unit = data?.resident?.unit;
  const unitLabel = unit ? `Torre ${unit.tower} - Apto ${unit.apartment}` : "Sin unidad";

  const totalPending = paymentSummary.totalPending + paymentSummary.totalOverdue;

  // Get initials for avatar fallback
  const initials = fullName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const latestAnnouncement = announcements[0] ?? null;

  return (
    <div className="mx-auto w-full max-w-md bg-white min-h-screen">
      {/* -- Header -- */}
      <FadeIn>
        <div className="px-5 pb-3 pt-14">
          <div className="flex items-center justify-between">
            {/* Left: Avatar + greeting */}
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">
                {initials || "RE"}
              </div>
              <div>
                <p className="text-[13px] text-gray-500">
                  Hola, {name}
                </p>
                <p className="text-[15px] font-semibold tracking-tight text-gray-900">
                  {unitLabel}
                </p>
              </div>
            </div>

            {/* Right: Notifications */}
            <Link href="/comunicados" className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                <Bell className="h-5 w-5 text-gray-600" strokeWidth={1.5} />
              </div>
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-0.5 -top-0.5 h-4 min-w-4 px-1 text-[10px]"
                >
                  {unreadCount}
                </Badge>
              )}
            </Link>
          </div>
        </div>
      </FadeIn>

      {/* -- Payment Card (Dark gradient) -- */}
      <FadeInUp delay={0.1}>
        <div className="px-5 pt-3">
          <div className="rounded-2xl bg-gradient-to-br from-[#2D2D2D] to-[#1A1A1A] p-5">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-white/60">Total a pagar</p>
                <p className="mt-1 text-3xl font-bold tracking-tight text-white">
                  {formatCurrency(totalPending)}
                </p>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-green-400" />
                  <span className="text-xs text-green-400">
                    Vence: 15 de Octubre
                  </span>
                </div>
              </div>
              <Link
                href="/finanzas"
                className="rounded-full bg-amber-500 px-5 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-amber-600 active:bg-amber-700"
              >
                Pagar
              </Link>
            </div>
          </div>
        </div>
      </FadeInUp>

      {/* -- Quick Actions -- */}
      <div className="px-5 pt-7">
        <FadeIn delay={0.15}>
          <p className="mb-4 text-[15px] font-semibold tracking-tight text-gray-900">
            Acciones rapidas
          </p>
        </FadeIn>
        <StaggerContainer className="grid grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <StaggerItem key={action.href}>
              <Link
                href={action.href}
                className="flex flex-col items-center gap-2"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-gray-100 shadow-apple-sm">
                  <action.icon
                    className="h-6 w-6 text-gray-600"
                    strokeWidth={1.5}
                  />
                </div>
                <span className="text-center text-[11px] font-medium leading-tight text-gray-500">
                  {action.label}
                </span>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>

      {/* -- Comunicados -- */}
      <FadeInUp delay={0.3}>
        <div className="px-5 pt-7 pb-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[15px] font-semibold tracking-tight text-gray-900">
              Comunicados
            </p>
            <Link
              href="/comunicados"
              className="flex items-center gap-0.5 text-[13px] font-medium text-amber-600"
            >
              Ver todos
              <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />
            </Link>
          </div>

          {latestAnnouncement ? (
            <Link href={`/comunicados`} className="block">
              <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-apple-sm">
                {/* Image placeholder - uses attachments or gradient fallback */}
                <div className="relative h-40 w-full bg-gradient-to-br from-emerald-400 to-teal-500">
                  {latestAnnouncement.attachments?.[0] ? (
                    <img
                      src={latestAnnouncement.attachments[0]}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-4xl opacity-50">🏊</span>
                    </div>
                  )}
                  {/* Category badge */}
                  <div className="absolute left-3 top-3">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${getCategoryBadge(latestAnnouncement.category).className}`}
                    >
                      {getCategoryBadge(latestAnnouncement.category).label}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Clock className="h-3 w-3" strokeWidth={2} />
                    <span className="text-[11px]">
                      {formatAnnouncementTime(latestAnnouncement.created_at)}
                    </span>
                  </div>
                  <h3 className="mt-1.5 text-[15px] font-semibold tracking-tight text-gray-900">
                    {latestAnnouncement.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-gray-500">
                    {latestAnnouncement.body}
                  </p>
                </div>
              </div>
            </Link>
          ) : (
            <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-apple-sm">
              <p className="text-sm text-gray-400">No hay comunicados recientes</p>
            </div>
          )}
        </div>
      </FadeInUp>

      {/* Footer */}
      <div className="pb-24 pt-4 text-center">
        <p className="text-[10px] font-medium tracking-wider text-gray-300">
          POTENCIADO POR FOLKS
        </p>
      </div>
    </div>
  );
}
