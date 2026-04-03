import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const quickActions = [
  { href: "/propiedad", label: "Mi Propiedad", icon: "🏢", color: "bg-blue-50" },
  { href: "/zonas", label: "Reservar Zona", icon: "🏊", color: "bg-cyan-50" },
  { href: "/paquetes", label: "Paquetes", icon: "📦", color: "bg-amber-50" },
  { href: "/visitantes", label: "Visitantes", icon: "🚪", color: "bg-green-50" },
  { href: "/finanzas", label: "Mis Recibos", icon: "💰", color: "bg-emerald-50" },
  { href: "/pqr", label: "Incidencias", icon: "⚠️", color: "bg-red-50" },
  { href: "/comunicados", label: "Comunicados", icon: "📢", color: "bg-purple-50" },
  { href: "/finanzas", label: "Financiero", icon: "📊", color: "bg-orange-50" },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-md p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Hola, Residente</h1>
        <p className="text-muted-foreground text-sm">
          Bienvenido a tu conjunto
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action) => (
          <Link key={action.href + action.label} href={action.href}>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex flex-col items-center gap-2 p-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${action.color} text-2xl`}
                >
                  {action.icon}
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
