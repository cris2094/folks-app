"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/admin/finanzas", label: "Resumen" },
  { href: "/admin/gastos", label: "Gastos" },
  { href: "/admin/cartera", label: "Cartera" },
];

export function AdminSubNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto border-b bg-white px-4 py-2">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-amber-600 text-white"
                : "text-gray-600 hover:bg-gray-100",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
