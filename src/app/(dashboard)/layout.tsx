import { BottomNav } from "@/components/bottom-nav";
import { FolkyOnboarding } from "@/features/folky/components/folky-onboarding";
import { getCurrentUser } from "@/features/auth/queries/get-current-user";
import type { UserRole } from "@/types/database";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await getCurrentUser();
  const role = (data?.resident?.role ?? "residente") as UserRole;

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F7]">
      <main
        className="flex-1 pb-24"
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        {children}
      </main>
      <BottomNav role={role} />
      <FolkyOnboarding />
    </div>
  );
}
