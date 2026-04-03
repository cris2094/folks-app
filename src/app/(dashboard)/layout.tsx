import Link from "next/link";

const navItems = [
  { href: "/home", label: "Inicio", icon: "🏠" },
  { href: "/comunicados", label: "Avisos", icon: "📢" },
  { href: "/zonas", label: "Zonas", icon: "🏊" },
  { href: "/perfil", label: "Perfil", icon: "👤" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <main className="flex-1 pb-20">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 border-t bg-white">
        <div className="mx-auto flex max-w-md justify-around py-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-0.5 px-3 py-1 text-xs text-gray-600 transition-colors hover:text-blue-600"
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
