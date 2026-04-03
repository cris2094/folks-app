"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  CreditCard,
  ClipboardList,
  MessageCircle,
  User,
  Plus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const navItems: {
  href: string;
  label: string;
  icon: LucideIcon;
  fab?: boolean;
}[] = [
  { href: "/home", label: "Inicio", icon: Home },
  { href: "/finanzas", label: "Pagos", icon: CreditCard },
  { href: "/tramites", label: "Trámites", icon: ClipboardList, fab: true },
  { href: "/social", label: "Social", icon: MessageCircle },
  { href: "/perfil", label: "Perfil", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-100 bg-white">
      <div className="mx-auto flex max-w-md justify-around pb-[env(safe-area-inset-bottom)] pt-2 pb-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center gap-0.5 px-3 py-1"
            >
              {/* FAB verde para Trámites */}
              {item.fab && (
                <div className="absolute -top-5 left-1/2 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full bg-green-500 shadow-md">
                  <Plus className="h-4 w-4 text-white" strokeWidth={3} />
                </div>
              )}
              <item.icon
                className={`h-5 w-5 ${
                  isActive ? "text-amber-500" : "text-gray-400"
                }`}
                fill={isActive && item.icon === Home ? "currentColor" : "none"}
              />
              <span
                className={`text-[10px] ${
                  isActive
                    ? "font-semibold text-amber-500"
                    : "font-medium text-gray-400"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
