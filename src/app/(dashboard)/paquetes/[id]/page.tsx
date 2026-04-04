"use client";

import Link from "next/link";
import { ChevronLeft, CheckCircle2 } from "lucide-react";
import { FadeIn, FadeInUp, StaggerContainer, StaggerItem } from "@/components/motion";

// Barcode bars pattern
const barWidths = [
  3, 1, 2, 1, 1, 3, 1, 2, 1, 3, 1, 1, 2, 3, 1, 2, 1, 1, 3, 2, 1, 1, 2, 1,
  3, 1, 2, 1, 3, 1, 1, 2, 1, 3, 1, 2, 1, 1, 3, 2, 1, 1, 2, 1, 3, 1, 2, 1,
  1, 3, 1, 2, 3, 1, 1, 2, 1, 3, 1, 2,
];

const historyItems = [
  {
    id: "1",
    description: "Sobre Manila",
    date: "28 Oct",
    status: "Entregado",
  },
  {
    id: "2",
    description: "Caja X Correspondencia",
    date: "20 Oct",
    status: "Entregado",
  },
];

export default function PaqueteDetailPage() {
  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col bg-white pb-28">
      {/* Header */}
      <header className="px-5 pb-2 pt-14">
        <Link
          href="/paquetes"
          className="inline-flex items-center gap-0.5 text-[14px] font-medium text-amber-500"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={2} />
          Inicio
        </Link>
        <h1 className="mt-2 text-[28px] font-bold tracking-tight text-gray-900">
          Paqueteria
        </h1>
        <p className="mt-1 text-[14px] text-gray-600">
          Tienes{" "}
          <span className="font-bold text-gray-900">1 paquete</span>{" "}
          pendiente por recoger en porteria.
        </p>
      </header>

      {/* Main package card */}
      <FadeInUp delay={0.1}>
      <div className="mx-5 mt-4">
        <div className="overflow-hidden rounded-[20px] bg-gradient-to-br from-amber-400 to-amber-500 shadow-lg shadow-amber-200/40">
          {/* Top section */}
          <div className="p-5 pb-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/70">
              SERVIENTREGA
            </p>
            <div className="mt-1.5 flex items-center gap-2">
              <span className="text-xl">{"\uD83D\uDCE6"}</span>
              <div>
                <p className="text-[20px] font-bold text-white">
                  Caja Mediana
                </p>
                <p className="text-[12px] text-white/70">
                  Recibido a las 10:30 AM por Carlos (Seguridad)
                </p>
              </div>
            </div>
          </div>

          {/* Barcode section - white card inset */}
          <div className="mx-4 mb-4 rounded-2xl bg-white p-5">
            <p className="text-center text-[13px] text-gray-500">
              Muestra este codigo en porteria
            </p>

            {/* Barcode */}
            <div className="mx-auto mt-3 flex h-14 w-52 items-center justify-center">
              <div className="flex items-end gap-[1px]">
                {barWidths.map((w, i) => (
                  <div
                    key={i}
                    className="bg-gray-900"
                    style={{
                      width: `${w}px`,
                      height: "36px",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Code */}
            <p className="mt-2 text-center font-mono text-sm font-bold tracking-[0.2em] text-gray-900">
              A84H-902K
            </p>
          </div>

          {/* Confirm button */}
          <div className="px-5 pb-5">
            <button className="w-full rounded-full bg-white py-3 text-[14px] font-semibold text-amber-600 transition-all hover:bg-white/90 active:scale-[0.98]">
              Confirmar entrega
            </button>
          </div>
        </div>
      </div>

      </FadeInUp>

      {/* History */}
      <FadeInUp delay={0.2}>
      <div className="mt-6 px-5">
        <h2 className="text-[15px] font-semibold tracking-tight text-gray-900">
          Historial
        </h2>
        <div className="mt-3 space-y-2">
          {historyItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-3.5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50">
                  <CheckCircle2
                    className="h-4 w-4 text-green-500"
                    strokeWidth={2}
                  />
                </div>
                <div>
                  <p className="text-[14px] font-medium text-gray-900">
                    {item.description}
                  </p>
                  <p className="text-[11px] text-gray-400">{item.date}</p>
                </div>
              </div>
              <span className="text-[11px] font-medium text-green-500">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
      </FadeInUp>

      {/* Footer */}
      <div className="pb-2 pt-8 text-center">
        <p className="text-[10px] font-medium tracking-wider text-gray-300">
          POTENCIADO POR FOLKS
        </p>
      </div>
    </div>
  );
}
