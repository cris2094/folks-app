import { BottomNav } from "@/components/bottom-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main
        className="flex-1 pb-24"
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
