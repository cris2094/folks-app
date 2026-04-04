import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Phone,
  FileText,
  Building2,
  Home,
  LogOut,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getCurrentUser } from "@/features/auth/queries/get-current-user";
import { logout } from "@/features/auth/actions/logout";
import Link from "next/link";
import { FadeIn, FadeInUp } from "@/components/motion";

export default async function PerfilPage() {
  const data = await getCurrentUser();
  const resident = data?.resident;

  const fullName = resident?.full_name ?? data?.user?.email ?? "Usuario";

  // Avatar initials
  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <div className="mx-auto max-w-md p-4">
      {/* Avatar header */}
      <FadeIn>
      <div className="mb-6 flex flex-col items-center gap-3 pt-2">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-2xl font-bold text-white shadow-lg shadow-amber-600/25">
          {initials || "U"}
        </div>
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900">{fullName}</h1>
          <Badge variant="secondary" className="mt-1">
            {resident?.is_owner ? "Propietario" : resident?.role ?? "Residente"}
          </Badge>
        </div>
      </div>
      </FadeIn>

      <FadeInUp delay={0.1}>
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-gray-500">Informacion Personal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <Separator className="mb-2" />
          <InfoRow
            icon={Mail}
            label="Correo"
            value={resident?.email ?? data?.user?.email ?? "-"}
          />
          <InfoRow
            icon={Phone}
            label="Telefono"
            value={resident?.phone ?? "-"}
          />
          <InfoRow
            icon={FileText}
            label="Documento"
            value={
              resident
                ? `${resident.document_type.toUpperCase()} ${resident.document_number}`
                : "-"
            }
          />
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-gray-500">Conjunto Residencial</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <Separator className="mb-2" />
          <InfoRow
            icon={Building2}
            label="Nombre"
            value={resident?.tenant?.name ?? "-"}
          />
          <InfoRow
            icon={Home}
            label="Unidad"
            value={
              resident?.unit
                ? `${resident.unit.tower} - Apto ${resident.unit.apartment}`
                : "Sin vincular"
            }
          />
        </CardContent>
      </Card>
      </FadeInUp>

      <FadeInUp delay={0.2}>
      <div className="space-y-2">
        <form action={logout}>
          <Button
            variant="outline"
            className="w-full h-11 rounded-xl border-red-200 text-red-600 font-medium hover:bg-red-50 hover:border-red-300 transition-all"
            type="submit"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar sesion
          </Button>
        </form>
      </div>

      </FadeInUp>

      <div className="mt-6 flex justify-center gap-4 text-xs text-gray-400">
        <Link href="/privacidad" className="hover:text-gray-600 hover:underline">
          Politica de Privacidad
        </Link>
        <span>|</span>
        <Link href="/terminos" className="hover:text-gray-600 hover:underline">
          Terminos y Condiciones
        </Link>
      </div>

      {/* Footer */}
      <div className="pb-24 pt-6 text-center">
        <p className="text-[10px] font-medium tracking-wider text-gray-300">
          POTENCIADO POR FOLKS
        </p>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-50">
        <Icon className="h-4 w-4 text-gray-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium truncate">{value}</p>
      </div>
    </div>
  );
}
