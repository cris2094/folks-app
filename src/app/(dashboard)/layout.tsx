import { BottomNav } from "@/components/bottom-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F7]">
      <main className="flex-1 pb-24">{children}</main>
      <BottomNav />
    </div>
  );
}
