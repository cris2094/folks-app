import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  FileText,
  Building2,
  Home,
  LogOut,
  Shield,
  ChevronLeft,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getCurrentUser } from "@/features/auth/queries/get-current-user";
import { logout } from "@/features/auth/actions/logout";
import Link from "next/link";
import { FadeIn, FadeInUp } from "@/components/motion";
import { getRoleLabel, getRoleColor } from "@/lib/permissions";
import type { UserRole } from "@/types/database";
import { AccountDeletionButton } from "@/features/auth/components/account-deletion-button";
import { ExportDataButton } from "@/features/auth/components/export-data-button";
import { ProfileEditor } from "@/features/auth/components/profile-editor";

export default async function PerfilPage() {
  const data = await getCurrentUser();
  const resident = data?.resident;

  const role = (resident?.role ?? "residente") as UserRole;
  const fullName = resident?.full_name ?? data?.user?.email ?? "Usuario";

  // Avatar initials
  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <div className="mx-auto w-full max-w-md min-h-screen bg-[#F5F5F7]">
      {/* Header */}
      <FadeIn>
        <div className="bg-white">
          <div className="flex items-center gap-3 px-5 pt-4 pb-2">
            <Link
              href="/home"
              className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-gray-100 active:bg-gray-200"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" strokeWidth={1.5} />
            </Link>
            <h1 className="text-lg font-semibold tracking-tight text-gray-900">
              Perfil
            </h1>
          </div>

          {/* Avatar + Name */}
          <div className="flex flex-col items-center gap-3 pb-5 pt-3">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-2xl font-bold text-white shadow-lg shadow-amber-500/20">
              {initials || "U"}
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold tracking-tight text-gray-900">
                {fullName}
              </h2>
              <div className="mt-1.5 flex items-center justify-center gap-2">
                <span
                  className={`inline-block rounded-full px-3 py-0.5 text-[11px] font-semibold ${getRoleColor(role)}`}
                >
                  {getRoleLabel(role)}
                </span>
                {resident?.is_owner && (
                  <Badge variant="secondary" className="text-[10px]">
                    Propietario
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Editable Personal Info */}
      <FadeInUp delay={0.1}>
        <div className="px-5 pt-5">
          <div className="overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="text-[13px] font-semibold text-gray-400 uppercase tracking-wide">
                Informacion Personal
              </h3>
            </div>
            <div className="px-4 py-2">
              <ProfileEditor
                initialName={resident?.full_name ?? ""}
                initialPhone={resident?.phone ?? ""}
              />
            </div>
          </div>
        </div>
      </FadeInUp>

      {/* Read-only info */}
      <FadeInUp delay={0.15}>
        <div className="px-5 pt-4">
          <div className="overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="text-[13px] font-semibold text-gray-400 uppercase tracking-wide">
                Cuenta
              </h3>
            </div>
            <div className="px-4 py-1">
              <InfoRow
                icon={Mail}
                label="Correo"
                value={resident?.email ?? data?.user?.email ?? "-"}
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
            </div>
          </div>
        </div>
      </FadeInUp>

      {/* Conjunto info */}
      <FadeInUp delay={0.2}>
        <div className="px-5 pt-4">
          <div className="overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="text-[13px] font-semibold text-gray-400 uppercase tracking-wide">
                Conjunto Residencial
              </h3>
            </div>
            <div className="px-4 py-1">
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
                    ? `Torre ${resident.unit.tower} - Apto ${resident.unit.apartment}`
                    : "Sin vincular"
                }
              />
            </div>
          </div>
        </div>
      </FadeInUp>

      {/* Data rights */}
      <FadeInUp delay={0.25}>
        <div className="px-5 pt-4">
          <div className="overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-400 uppercase tracking-wide">
                <Shield className="h-3.5 w-3.5" />
                Datos Personales
              </h3>
            </div>
            <div className="px-4 py-3 space-y-3">
              <p className="text-xs text-gray-400 leading-relaxed">
                Conforme a la Ley 1581 de 2012, tienes derecho a acceder,
                rectificar y solicitar la eliminacion de tus datos personales.
              </p>
              <div className="flex flex-col gap-2">
                <ExportDataButton />
                <AccountDeletionButton />
              </div>
            </div>
          </div>
        </div>
      </FadeInUp>

      {/* Logout */}
      <FadeInUp delay={0.3}>
        <div className="px-5 pt-5">
          <form action={logout}>
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-white py-3 text-[14px] font-medium text-red-600 transition-all hover:bg-red-50 hover:border-red-300 active:scale-[0.98]"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesion
            </button>
          </form>
        </div>

        <div className="mt-5 flex justify-center gap-4 text-xs text-gray-400">
          <Link
            href="/privacidad"
            className="hover:text-gray-600 hover:underline"
          >
            Politica de Privacidad
          </Link>
          <span>|</span>
          <Link href="/terminos" className="hover:text-gray-600 hover:underline">
            Terminos y Condiciones
          </Link>
        </div>
      </FadeInUp>

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
    <div className="flex items-center gap-3 py-2.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-50">
        <Icon className="h-4 w-4 text-gray-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-[14px] font-medium text-gray-900 truncate">{value}</p>
      </div>
    </div>
  );
}
