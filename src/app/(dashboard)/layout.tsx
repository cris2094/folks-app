"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Megaphone, Waves, User, Bot } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const navItems: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/home", label: "Inicio", icon: Home },
  { href: "/comunicados", label: "Avisos", icon: Megaphone },
  { href: "/zonas", label: "Zonas", icon: Waves },
  { href: "/folky", label: "Folky", icon: Bot },
  { href: "/perfil", label: "Perfil", icon: User },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <main className="flex-1 pb-20">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-md justify-around py-1.5">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 text-xs transition-colors ${
                  isActive
                    ? "font-semibold text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <item.icon
                  className={`h-5 w-5 ${isActive ? "text-blue-600" : ""}`}
                />
                {item.label}
                {isActive && (
                  <span className="absolute -top-0 h-0.5 w-8 rounded-full bg-blue-600" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
