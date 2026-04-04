"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Wallet,
  Sparkles,
  LayoutGrid,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  isFab?: boolean;
}

const navItems: NavItem[] = [
  { href: "/home", label: "Inicio", icon: Home },
  { href: "/finanzas", label: "Pagos", icon: Wallet },
  { href: "/folky", label: "Folky", icon: Sparkles, isFab: true },
  { href: "/zonas", label: "Zonas", icon: LayoutGrid },
  { href: "/perfil", label: "Perfil", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-100/50 bg-white/95 backdrop-blur-xl"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="mx-auto flex max-w-md items-end justify-around py-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          // FAB central (camera/assistant button)
          if (item.isFab) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative -mt-6 flex cursor-pointer flex-col items-center px-3"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-b from-[#3D3225] to-[#2A2118] shadow-lg shadow-black/25 ring-4 ring-white transition-transform duration-200 active:scale-95">
                  <Sparkles className="h-6 w-6 text-white" strokeWidth={1.5} />
                </div>
                <span className="mt-0.5 text-[10px] font-medium tracking-tight text-gray-400">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex cursor-pointer flex-col items-center gap-0.5 px-3 py-1 transition-colors duration-200"
            >
              <item.icon
                className={`h-6 w-6 transition-colors duration-200 ${
                  isActive ? "text-amber-500" : "text-gray-400"
                }`}
                strokeWidth={1.5}
                fill={isActive ? "currentColor" : "none"}
              />
              <span
                className={`text-[10px] tracking-tight transition-colors duration-200 ${
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
