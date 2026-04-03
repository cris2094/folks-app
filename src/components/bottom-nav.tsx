"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CreditCard, ClipboardList, MessageCircle, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const navItems: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/home", label: "Inicio", icon: Home },
  { href: "/finanzas", label: "Pagos", icon: CreditCard },
  { href: "/tramites", label: "Tramites", icon: ClipboardList },
  { href: "/social", label: "Social", icon: MessageCircle },
  { href: "/perfil", label: "Perfil", icon: User },
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
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 text-[10px] transition-colors ${
                isActive
                  ? "font-semibold text-amber-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <item.icon
                className={`h-5 w-5 ${isActive ? "text-amber-600" : ""}`}
              />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
