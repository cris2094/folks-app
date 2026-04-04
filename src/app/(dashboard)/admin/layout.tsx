import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/queries/get-current-user";
import { AdminSubNav } from "@/features/finanzas-admin/components/admin-sub-nav";
import type { UserRole } from "@/types/database";

const ADMIN_ROLES: UserRole[] = ["super_admin", "admin", "consejo"];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await getCurrentUser();
  const role = (data?.resident?.role ?? "residente") as UserRole;

  if (!data?.resident || !ADMIN_ROLES.includes(role)) {
    redirect("/home");
  }

  return (
    <div className="mx-auto max-w-md">
      {/* Header */}
      <div className="bg-gradient-to-br from-brand-dark to-brand-dark-lighter px-4 pb-4 pt-6 text-white">
        <h1 className="text-xl font-bold">Panel Administrativo</h1>
        <p className="text-sm text-white/70">Gestion financiera del conjunto</p>
      </div>

      {/* Sub-nav horizontal - filtered by role */}
      <AdminSubNav role={role} />

      {/* Content */}
      <div className="px-4 pb-6 pt-4">{children}</div>
    </div>
  );
}
