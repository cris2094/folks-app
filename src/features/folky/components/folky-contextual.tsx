"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sparkles, X } from "lucide-react";

const ROUTE_GREETINGS: Record<string, string> = {
  "/finanzas": "¿Necesitas ayuda con tus pagos?",
  "/pqr": "¿Quieres reportar una incidencia?",
  "/zonas": "¿Te ayudo a reservar una zona?",
  "/paquetes": "¿Tienes un paquete por recoger?",
  "/comunicados": "¿Quieres ver las novedades?",
  "/mantenimiento": "¿Necesitas reportar un daño?",
  "/salud": "¿Quieres saber más sobre la salud del edificio?",
  "/votaciones": "¿Necesitas ayuda para votar?",
};

const DEFAULT_GREETING = "¡Hola! ¿En qué te puedo ayudar?";

export function FolkyContextual() {
  const pathname = usePathname();
  const router = useRouter();
  const [showTooltip, setShowTooltip] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Don't render on /folky — it has its own full chat
  if (pathname === "/folky") return null;

  // Show contextual tooltip after 3 seconds on each page
  useEffect(() => {
    setDismissed(false);
    const timer = setTimeout(() => setShowTooltip(true), 3000);
    return () => {
      clearTimeout(timer);
      setShowTooltip(false);
    };
  }, [pathname]);

  const greeting =
    Object.entries(ROUTE_GREETINGS).find(([route]) =>
      pathname.startsWith(route)
    )?.[1] ?? DEFAULT_GREETING;

  return (
    <>
      {/* Contextual tooltip */}
      {showTooltip && !dismissed && (
        <div className="fixed bottom-[88px] right-4 z-40 max-w-[240px] animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="relative rounded-2xl bg-white px-4 py-3 shadow-apple-lg border border-gray-100">
            <button
              onClick={() => setDismissed(true)}
              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-gray-500"
              aria-label="Cerrar"
            >
              <X className="h-3 w-3" />
            </button>
            <p className="text-[13px] leading-snug text-gray-700">{greeting}</p>
            <button
              onClick={() => router.push("/folky")}
              className="mt-2 text-[12px] font-semibold text-amber-600"
            >
              Hablar con Folky →
            </button>
          </div>
          {/* Triangle pointer */}
          <div className="absolute -bottom-1.5 right-6 h-3 w-3 rotate-45 bg-white border-b border-r border-gray-100" />
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => router.push("/folky")}
        className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 shadow-lg shadow-amber-500/30 transition-transform duration-200 hover:scale-105 active:scale-95"
        aria-label="Abrir asistente Folky"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <Sparkles className="h-6 w-6 text-white" strokeWidth={1.5} />
      </button>
    </>
  );
}
