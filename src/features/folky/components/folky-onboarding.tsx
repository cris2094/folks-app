"use client";

import { useState, useEffect } from "react";
import {
  Sparkles,
  Receipt,
  CalendarCheck,
  Package,
  MessageSquareWarning,
  X,
} from "lucide-react";

const ONBOARDING_KEY = "folky-onboarding-seen";

const capabilities = [
  {
    icon: Receipt,
    title: "Pagos",
    description: "Consulta y paga tu administracion",
  },
  {
    icon: CalendarCheck,
    title: "Reservas",
    description: "Reserva zonas comunes facilmente",
  },
  {
    icon: Package,
    title: "Paquetes",
    description: "Enterate cuando llegan tus paquetes",
  },
  {
    icon: MessageSquareWarning,
    title: "Incidencias",
    description: "Reporta problemas y haz seguimiento",
  },
];

export function FolkyOnboarding() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(ONBOARDING_KEY);
    if (!seen) {
      // Small delay so it appears after page load
      const timer = setTimeout(() => setShow(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  function handleDismiss() {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-sm animate-in fade-in zoom-in-95 rounded-3xl bg-white p-6 shadow-2xl duration-300">
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          aria-label="Cerrar"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Avatar */}
        <div className="mb-4 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
            <Sparkles className="h-10 w-10 text-amber-500 animate-pulse" />
          </div>
        </div>

        {/* Greeting */}
        <div className="mb-5 text-center">
          <h2 className="text-lg font-bold text-gray-900">
            Hola! Soy Folky
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Tu asistente virtual de Irawa. Estoy aqui para ayudarte con todo lo
            que necesites en tu conjunto.
          </p>
        </div>

        {/* Capabilities */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          {capabilities.map((cap) => (
            <div
              key={cap.title}
              className="flex flex-col items-center rounded-2xl border border-gray-100 bg-gray-50 p-3 text-center"
            >
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                <cap.icon className="h-5 w-5 text-amber-600" strokeWidth={1.5} />
              </div>
              <p className="text-xs font-semibold text-gray-800">{cap.title}</p>
              <p className="mt-0.5 text-[10px] text-gray-500">
                {cap.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={handleDismiss}
          className="w-full rounded-full bg-amber-500 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-amber-600 active:scale-[0.98]"
        >
          Empecemos!
        </button>
      </div>
    </div>
  );
}
