"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, X, ChevronRight } from "lucide-react";

export interface FolkyAlert {
  id: string;
  message: string;
  action: {
    label: string;
    href: string;
  };
}

interface FolkyNotificationProps {
  alerts: FolkyAlert[];
}

export function FolkyNotification({ alerts }: FolkyNotificationProps) {
  const router = useRouter();
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const visible = alerts.filter((a) => !dismissed.has(a.id));
  if (visible.length === 0) return null;

  // Show only the first non-dismissed alert
  const alert = visible[0];

  function handleDismiss() {
    setDismissed((prev) => new Set(prev).add(alert.id));
  }

  function handleAction() {
    router.push(alert.action.href);
    handleDismiss();
  }

  return (
    <div className="mx-4 mt-2 animate-in slide-in-from-top-2 duration-300">
      <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 shadow-sm">
        {/* Avatar */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-500">
          <Sparkles className="h-4 w-4 text-white" strokeWidth={2} />
        </div>

        {/* Message */}
        <div className="min-w-0 flex-1">
          <p className="text-[13px] leading-snug text-gray-800">
            {alert.message}
          </p>
        </div>

        {/* Action */}
        <button
          onClick={handleAction}
          className="flex shrink-0 items-center gap-0.5 rounded-full bg-amber-500 px-3 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-amber-600 active:scale-95"
        >
          {alert.action.label}
          <ChevronRight className="h-3 w-3" />
        </button>

        {/* Close */}
        <button
          onClick={handleDismiss}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-amber-100 hover:text-gray-600"
          aria-label="Cerrar notificacion"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Example usage helper — generates sample alerts based on mock data
// ---------------------------------------------------------------------------

export function useFolkyAlerts(): FolkyAlert[] {
  // In production this would come from Supabase queries.
  // For now return sample alerts to demonstrate the component.
  return [
    {
      id: "pago-pendiente",
      message: "Tienes un pago pendiente de $185.000. Quieres pagarlo ahora?",
      action: { label: "Pagar", href: "/finanzas" },
    },
    {
      id: "paquete-nuevo",
      message: "Tienes 2 paquetes esperandote en porteria",
      action: { label: "Ver", href: "/paquetes" },
    },
    {
      id: "pqr-update",
      message: "Tu incidencia tiene una actualizacion",
      action: { label: "Ver", href: "/pqr" },
    },
  ];
}
