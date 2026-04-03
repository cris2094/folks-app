import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Building2,
  Waves,
  Package,
  DoorOpen,
  Receipt,
  Megaphone,
  Bell,
  Pin,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getCurrentUser } from "@/features/auth/queries/get-current-user";
import { getUnreadCount } from "@/features/comunicados/queries/get-notifications";
import { getPaymentSummary } from "@/features/pagos/queries/get-payment-summary";
import { getAnnouncements } from "@/features/comunicados/queries/get-announcements";
import { PaymentHeroCard } from "@/features/pagos/components/payment-hero-card";

const quickActions: {
  href: string;
  label: string;
  icon: LucideIcon;
  color: string;
  iconColor: string;
}[] = [
  { href: "/propiedad", label: "Mi Propiedad", icon: Building2, color: "bg-amber-50", iconColor: "text-amber-600" },
  { href: "/zonas", label: "Reservar Zona", icon: Waves, color: "bg-cyan-50", iconColor: "text-cyan-600" },
  { href: "/paquetes", label: "Paquetes", icon: Package, color: "bg-amber-50", iconColor: "text-amber-600" },
  { href: "/visitantes", label: "Visitantes", icon: DoorOpen, color: "bg-green-50", iconColor: "text-green-600" },
  { href: "/finanzas", label: "Mis Recibos", icon: Receipt, color: "bg-emerald-50", iconColor: "text-emerald-600" },
  { href: "/comunicados", label: "Comunicados", icon: Megaphone, color: "bg-purple-50", iconColor: "text-purple-600" },
];

export default async function HomePage() {
  const [data, unreadCount, paymentSummary, announcements] = await Promise.all([
    getCurrentUser(),
    getUnreadCount(),
    getPaymentSummary(),
    getAnnouncements(),
  ]);

  const name = data?.resident?.full_name?.split(" ")[0] ?? "Residente";
  const tenantName = data?.resident?.tenant?.name ?? "tu conjunto";
  const recentAnnouncements = announcements.slice(0, 3);

  return (
    <div className="mx-auto max-w-md">
      {/* Header con gradiente */}
      <div className="bg-gradient-to-br from-brand-dark to-brand-dark-lighter px-4 pb-8 pt-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/70">Bienvenido a {tenantName}</p>
            <h1 className="text-2xl font-bold">Hola, {name}</h1>
          </div>
          <Link href="/comunicados" className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
              <Bell className="h-5 w-5" />
            </div>
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -right-1 -top-1 h-5 min-w-5 px-1 text-xs"
              >
                {unreadCount}
              </Badge>
            )}
          </Link>
        </div>
      </div>

      {/* Payment hero */}
      <div className="px-4 -mt-4">
        <PaymentHeroCard summary={paymentSummary} />
      </div>

      {/* Quick actions grid */}
      <div className="px-4 pt-6 pb-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Acceso rapido
        </p>
        <div className="grid grid-cols-3 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.href + action.label}
              href={action.href}
              className="flex flex-col items-center gap-1.5 rounded-xl p-2 transition-colors hover:bg-gray-100"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${action.color}`}
              >
                <action.icon className={`h-5 w-5 ${action.iconColor}`} />
              </div>
              <span className="text-center text-[10px] font-medium leading-tight text-gray-700">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Comunicados */}
      {recentAnnouncements.length > 0 && (
        <div className="px-4 pb-6">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Comunicados
            </p>
            <Link
              href="/comunicados"
              className="text-xs font-medium text-brand-dark hover:underline"
            >
              Ver todos
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {recentAnnouncements.map((a) => (
              <Link key={a.id} href="/comunicados">
                <Card
                  size="sm"
                  className="transition-shadow hover:shadow-md"
                >
                  <CardContent className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-50">
                      <Megaphone className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {a.title}
                        </p>
                        {a.is_pinned && (
                          <Badge
                            variant="secondary"
                            className="shrink-0 gap-1 text-[10px]"
                          >
                            <Pin className="h-2.5 w-2.5" />
                            Fijado
                          </Badge>
                        )}
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-xs text-gray-500">
                        {a.body}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
