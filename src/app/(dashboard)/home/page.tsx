import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Building2,
  Package,
  Receipt,
  AlertTriangle,
  Users,
  Headset,
  Scale,
  CalendarCheck,
  Bell,
  Settings,
  ChevronDown,
  Mic,
  Star,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getCurrentUser } from "@/features/auth/queries/get-current-user";
import { getUnreadCount } from "@/features/comunicados/queries/get-notifications";
import { getPaymentSummary } from "@/features/pagos/queries/get-payment-summary";

const serviceItems: {
  href: string;
  label: string;
  icon: LucideIcon;
  bgColor: string;
  iconColor: string;
  notification?: boolean;
}[] = [
  {
    href: "/finanzas",
    label: "Recibos",
    icon: Receipt,
    bgColor: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    href: "/paquetes",
    label: "Paquetes",
    icon: Package,
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
    notification: true,
  },
  {
    href: "/incidencias",
    label: "Incidencias",
    icon: AlertTriangle,
    bgColor: "bg-red-100",
    iconColor: "text-red-600",
  },
  {
    href: "/propiedad",
    label: "Mi Propiedad",
    icon: Building2,
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    href: "/vecinos",
    label: "Vecinos",
    icon: Users,
    bgColor: "bg-sky-100",
    iconColor: "text-sky-600",
  },
  {
    href: "/admin",
    label: "Admin",
    icon: Headset,
    bgColor: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    href: "/legal",
    label: "Temas Legales",
    icon: Scale,
    bgColor: "bg-gray-200",
    iconColor: "text-gray-600",
  },
  {
    href: "/zonas",
    label: "Reservas",
    icon: CalendarCheck,
    bgColor: "bg-amber-100",
    iconColor: "text-amber-600",
  },
];

export default async function HomePage() {
  const [data, unreadCount, paymentSummary] = await Promise.all([
    getCurrentUser(),
    getUnreadCount(),
    getPaymentSummary(),
  ]);

  const fullName = data?.resident?.full_name ?? "";
  const name = fullName.split(" ")[0] || "Residente";
  const unit = data?.resident?.unit;

  const unitLabel = unit
    ? `${unit.tower}, ${unit.apartment}`
    : "Sin unidad";

  const totalPending = paymentSummary.totalPending + paymentSummary.totalOverdue;

  return (
    <div className="mx-auto max-w-md">
      {/* Header blanco */}
      <div className="bg-white px-4 pb-2 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
              <Building2 className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                MI HOGAR
              </p>
              <button className="flex items-center gap-1">
                <span className="text-sm font-bold text-gray-900">
                  {unitLabel}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/comunicados" className="relative">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
                <Bell className="h-4.5 w-4.5 text-gray-600" />
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
            <Link href="/configuracion">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
                <Settings className="h-4.5 w-4.5 text-gray-600" />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Card Asistente Folky */}
      <div className="px-4 pt-3">
        <div className="rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 p-4 shadow-md">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500 shadow-sm">
              <Star className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-white">
                Hola, {name}!
              </h2>
              <p className="mt-0.5 text-sm leading-snug text-white/90">
                Soy tu asistente virtual. Te ayudo a revisar tus paquetes o pagos?
              </p>
            </div>
          </div>
          <button className="mt-3 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm transition-colors hover:bg-gray-50">
            <Mic className="h-4 w-4 text-amber-600" />
            Hablar ahora
          </button>
        </div>
      </div>

      {/* Servicios - Grid 4x2 */}
      <div className="px-4 pt-6 pb-2">
        <p className="mb-3 text-sm font-semibold text-gray-900">Servicios</p>
        <div className="grid grid-cols-4 gap-3">
          {serviceItems.map((item) => (
            <Link
              key={item.href + item.label}
              href={item.href}
              className="flex flex-col items-center gap-1.5"
            >
              <div className="relative">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.bgColor}`}
                >
                  <item.icon className={`h-6 w-6 ${item.iconColor}`} />
                </div>
                {item.notification && (
                  <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-red-500" />
                )}
              </div>
              <span className="text-center text-[10px] font-medium leading-tight text-gray-600">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Cards horizontales */}
      <div className="px-4 pt-4 pb-6">
        <div className="grid grid-cols-2 gap-3">
          {/* Proximo Pago */}
          <Link href="/finanzas" className="block">
            <div className="rounded-2xl bg-white p-3 ring-1 ring-gray-100 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
                  <Wallet className="h-4 w-4 text-amber-600" />
                </div>
                <span className="text-xs font-medium text-gray-500">
                  Proximo Pago
                </span>
              </div>
              <p className="mt-2 text-lg font-bold text-gray-900">
                ${totalPending.toLocaleString("es-CO")}
              </p>
              <p className="mt-0.5 text-[11px] text-gray-400">
                Vence en 5 dias
              </p>
            </div>
          </Link>

          {/* Tu Reserva */}
          <Link href="/zonas" className="block">
            <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-gray-100 shadow-sm">
              <div className="h-20 w-full bg-gradient-to-br from-cyan-400 to-blue-400">
                <div className="flex h-full items-center justify-center">
                  <span className="text-2xl">🏊</span>
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs font-semibold text-gray-900">
                  Piscina Sur
                </p>
                <p className="mt-0.5 text-[11px] text-gray-400">
                  Hoy, 3:00 PM
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
