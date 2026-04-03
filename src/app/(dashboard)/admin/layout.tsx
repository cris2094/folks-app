import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/queries/get-current-user";
import { AdminSubNav } from "@/features/finanzas-admin/components/admin-sub-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await getCurrentUser();

  if (
    !data?.resident ||
    !["admin", "super_admin"].includes(data.resident.role)
  ) {
    redirect("/home");
  }

  return (
    <div className="mx-auto max-w-md">
      {/* Header */}
      <div className="bg-gradient-to-br from-brand-dark to-brand-dark-lighter px-4 pb-4 pt-6 text-white">
        <h1 className="text-xl font-bold">Panel Administrativo</h1>
        <p className="text-sm text-white/70">Gestion financiera del conjunto</p>
      </div>

      {/* Sub-nav horizontal */}
      <AdminSubNav />

      {/* Content */}
      <div className="px-4 pb-6 pt-4">{children}</div>
    </div>
  );
}
