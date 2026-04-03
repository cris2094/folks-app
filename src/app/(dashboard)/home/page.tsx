import Link from "next/link";
import {
  Building2,
  Package,
  Receipt,
  AlertCircle,
  Home,
  Users,
  Headphones,
  Scale,
  Calendar,
  Bell,
  Settings,
  ChevronDown,
  Sparkles,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
    bgColor: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    href: "/paquetes",
    label: "Paquetes",
    icon: Package,
    bgColor: "bg-green-50",
    iconColor: "text-green-600",
    notification: true,
  },
  {
    href: "/incidencias",
    label: "Incidencias",
    icon: AlertCircle,
    bgColor: "bg-red-50",
    iconColor: "text-red-600",
  },
  {
    href: "/propiedad",
    label: "Mi Propiedad",
    icon: Home,
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    href: "/vecinos",
    label: "Vecinos",
    icon: Users,
    bgColor: "bg-cyan-50",
    iconColor: "text-cyan-600",
  },
  {
    href: "/admin",
    label: "Admin",
    icon: Headphones,
    bgColor: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    href: "/legal",
    label: "Temas Legales",
    icon: Scale,
    bgColor: "bg-gray-100",
    iconColor: "text-gray-600",
  },
  {
    href: "/zonas",
    label: "Reservas",
    icon: Calendar,
    bgColor: "bg-amber-50",
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

  const unitLabel = unit ? `${unit.tower}, ${unit.apartment}` : "Sin unidad";

  const totalPending =
    paymentSummary.totalPending + paymentSummary.totalOverdue;

  return (
    <div className="mx-auto max-w-md">
      {/* -- Header -- */}
      <div className="px-5 pb-3 pt-14">
        <div className="flex items-center justify-between">
          {/* Izquierda: logo + ubicacion */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-50 shadow-apple-sm">
              <Building2
                className="h-[18px] w-[18px] text-amber-500"
                strokeWidth={1.5}
              />
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-gray-400">
                MI HOGAR
              </p>
              <button className="flex items-center gap-1">
                <span className="text-[17px] font-semibold tracking-tight text-gray-900">
                  {unitLabel}
                </span>
                <ChevronDown
                  className="h-4 w-4 text-gray-400"
                  strokeWidth={1.5}
                />
              </button>
            </div>
          </div>

          {/* Derecha: bell + settings */}
          <div className="flex items-center gap-2">
            <Link href="/comunicados" className="relative">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-apple-sm">
                <Bell
                  className="h-[18px] w-[18px] text-gray-500"
                  strokeWidth={1.5}
                />
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
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-apple-sm">
                <Settings
                  className="h-[18px] w-[18px] text-gray-500"
                  strokeWidth={1.5}
                />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* -- Card Asistente Folky -- */}
      <div className="px-5 pt-2">
        <div className="rounded-[20px] border border-amber-200/30 bg-gradient-to-r from-amber-400 to-amber-500 p-4 shadow-apple">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500 shadow-sm">
              <Sparkles className="h-5 w-5 text-white" strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <h2 className="text-[17px] font-bold tracking-tight text-white">
                Hola, {name}!
              </h2>
              <p className="mt-0.5 text-[15px] leading-snug text-white/90">
                Soy tu asistente virtual.{"\n"}Te ayudo a revisar tus paquetes o
                pagos?
              </p>
            </div>
          </div>
          <button className="mt-3 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-gray-800 shadow-apple-sm transition-colors hover:bg-gray-50">
            <span className="text-base">🎙</span>
            Hablar ahora
          </button>
        </div>
      </div>

      {/* -- Servicios grid 4x2 -- */}
      <div className="px-5 pb-2 pt-7">
        <p className="mb-4 text-[15px] font-semibold tracking-tight text-gray-900">
          Servicios
        </p>
        <div className="grid grid-cols-4 gap-x-4 gap-y-5">
          {serviceItems.map((item) => (
            <Link
              key={item.href + item.label}
              href={item.href}
              className="flex flex-col items-center gap-2"
            >
              <div className="relative">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-apple-sm ${item.bgColor}`}
                >
                  <item.icon
                    className={`h-6 w-6 ${item.iconColor}`}
                    strokeWidth={1.5}
                  />
                </div>
                {item.notification && (
                  <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-[#F5F5F7] bg-red-500" />
                )}
              </div>
              <span className="text-center text-[11px] font-medium leading-tight text-gray-500">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* -- Cards horizontales -- */}
      <div className="px-5 pb-6 pt-5">
        <div className="grid grid-cols-2 gap-3">
          {/* Proximo Pago */}
          <Link href="/finanzas" className="block">
            <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-apple-sm">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50">
                  <Wallet
                    className="h-[18px] w-[18px] text-amber-600"
                    strokeWidth={1.5}
                  />
                </div>
                <span className="text-[11px] font-medium text-gray-500">
                  Proximo Pago
                </span>
              </div>
              <p className="mt-3 text-[20px] font-bold tracking-tight text-gray-900">
                ${totalPending.toLocaleString("es-CO")}
              </p>
              <p className="mt-0.5 text-[11px] text-gray-400">
                Vence en 5 dias
              </p>
            </div>
          </Link>

          {/* Tu Reserva */}
          <Link href="/zonas" className="block">
            <div className="overflow-hidden rounded-[20px] border border-gray-100 bg-white shadow-apple-sm">
              <div className="h-20 w-full bg-gradient-to-br from-cyan-400 to-blue-400">
                <div className="flex h-full items-center justify-center">
                  <span className="text-2xl">🏊</span>
                </div>
              </div>
              <div className="p-3.5">
                <p className="text-[13px] font-semibold tracking-tight text-gray-900">
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
