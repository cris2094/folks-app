import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Building2,
  Waves,
  Package,
  DoorOpen,
  Receipt,
  AlertTriangle,
  Megaphone,
  Bot,
  Bell,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getCurrentUser } from "@/features/auth/queries/get-current-user";
import { getUnreadCount } from "@/features/comunicados/queries/get-notifications";

const quickActions: {
  href: string;
  label: string;
  icon: LucideIcon;
  color: string;
  iconColor: string;
}[] = [
  { href: "/propiedad", label: "Mi Propiedad", icon: Building2, color: "bg-blue-50", iconColor: "text-blue-600" },
  { href: "/zonas", label: "Reservar Zona", icon: Waves, color: "bg-cyan-50", iconColor: "text-cyan-600" },
  { href: "/paquetes", label: "Paquetes", icon: Package, color: "bg-amber-50", iconColor: "text-amber-600" },
  { href: "/visitantes", label: "Visitantes", icon: DoorOpen, color: "bg-green-50", iconColor: "text-green-600" },
  { href: "/finanzas", label: "Mis Recibos", icon: Receipt, color: "bg-emerald-50", iconColor: "text-emerald-600" },
  { href: "/pqr", label: "Incidencias", icon: AlertTriangle, color: "bg-red-50", iconColor: "text-red-500" },
  { href: "/comunicados", label: "Comunicados", icon: Megaphone, color: "bg-purple-50", iconColor: "text-purple-600" },
  { href: "/folky", label: "Folky IA", icon: Bot, color: "bg-indigo-50", iconColor: "text-indigo-600" },
];

export default async function HomePage() {
  const [data, unreadCount] = await Promise.all([
    getCurrentUser(),
    getUnreadCount(),
  ]);

  const name = data?.resident?.full_name?.split(" ")[0] ?? "Residente";
  const tenantName = data?.resident?.tenant?.name ?? "tu conjunto";

  return (
    <div className="mx-auto max-w-md">
      {/* Header con gradiente */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 px-4 pb-8 pt-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-200 text-sm">Bienvenido a {tenantName}</p>
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

      {/* Folky banner */}
      <div className="px-4 -mt-4">
        <Link href="/folky">
          <Card className="border-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transition-shadow hover:shadow-xl">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <Bot className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">Preguntale a Folky</p>
                <p className="text-blue-100 text-xs">
                  Tu asistente IA del conjunto
                </p>
              </div>
              <div className="flex h-8 items-center rounded-full bg-white/20 px-3 text-xs font-medium">
                Chatear
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Quick actions grid */}
      <div className="px-4 pt-6 pb-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Acceso rapido
        </p>
        <div className="grid grid-cols-4 gap-3">
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
    </div>
  );
}
