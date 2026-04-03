import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
  Building2,
  Waves,
  Package,
  DoorOpen,
  Receipt,
  AlertTriangle,
  Megaphone,
  BarChart3,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getCurrentUser } from "@/features/auth/queries/get-current-user";

const quickActions: {
  href: string;
  label: string;
  icon: LucideIcon;
  color: string;
}[] = [
  { href: "/propiedad", label: "Mi Propiedad", icon: Building2, color: "bg-blue-50" },
  { href: "/zonas", label: "Reservar Zona", icon: Waves, color: "bg-cyan-50" },
  { href: "/paquetes", label: "Paquetes", icon: Package, color: "bg-amber-50" },
  { href: "/visitantes", label: "Visitantes", icon: DoorOpen, color: "bg-green-50" },
  { href: "/finanzas", label: "Mis Recibos", icon: Receipt, color: "bg-emerald-50" },
  { href: "/pqr", label: "Incidencias", icon: AlertTriangle, color: "bg-red-50" },
  { href: "/comunicados", label: "Comunicados", icon: Megaphone, color: "bg-purple-50" },
  { href: "/finanzas", label: "Financiero", icon: BarChart3, color: "bg-orange-50" },
];

export default async function HomePage() {
  const data = await getCurrentUser();
  const name = data?.resident?.full_name?.split(" ")[0] ?? "Residente";
  const tenantName = data?.resident?.tenant?.name ?? "tu conjunto";

  return (
    <div className="mx-auto max-w-md p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Hola, {name}</h1>
        <p className="text-muted-foreground text-sm">
          Bienvenido a {tenantName}
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action) => (
          <Link key={action.href + action.label} href={action.href}>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex flex-col items-center gap-2 p-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${action.color}`}
                >
                  <action.icon className="h-6 w-6 text-gray-700" />
                </div>
                <span className="text-center text-xs font-medium">
                  {action.label}
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
