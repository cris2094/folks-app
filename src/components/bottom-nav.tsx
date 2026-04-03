"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CreditCard, CalendarDays, Package } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const navItems: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/home", label: "Inicio", icon: Home },
  { href: "/finanzas", label: "Pagos", icon: CreditCard },
  { href: "/zonas", label: "Reservas", icon: CalendarDays },
  { href: "/paquetes", label: "Paquetes", icon: Package },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
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
                  ? "font-semibold text-amber-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <item.icon
                className={`h-5 w-5 ${isActive ? "text-amber-600" : ""}`}
              />
              {item.label}
              {isActive && (
                <span className="absolute -top-0 h-0.5 w-8 rounded-full bg-amber-600" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
