"use client";

import Link from "next/link";
import { CheckCircle, ChevronLeft } from "lucide-react";

interface HistoryItem {
  id: string;
  carrier: string;
  description: string;
  date: string;
  status: string;
}

const historyItems: HistoryItem[] = [
  {
    id: "1",
    carrier: "MercadoLibre",
    description: "Sobre Grande",
    date: "28 Oct, 2:15 PM",
    status: "Entregado",
  },
  {
    id: "2",
    carrier: "Amazon",
    description: "Caja Pequena",
    date: "25 Oct, 9:30 AM",
    status: "Entregado",
  },
  {
    id: "3",
    carrier: "Rappi",
    description: "Bolsa",
    date: "20 Oct, 4:00 PM",
    status: "Entregado",
  },
];

// Barcode bars pattern - more realistic with varied widths
const barWidths = [
  3, 1, 2, 1, 1, 3, 1, 2, 1, 3, 1, 1, 2, 3, 1, 2, 1, 1, 3, 2, 1, 1, 2, 1,
  3, 1, 2, 1, 3, 1, 1, 2, 1, 3, 1, 2, 1, 1, 3, 2, 1, 1, 2, 1, 3, 1, 2, 1,
  1, 3, 1, 2, 3, 1, 1, 2, 1, 3, 1, 2,
];
const barHeights = [
  36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36,
  36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36,
  36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36,
  36, 36, 36,
];

export default function PaquetesPage() {
  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col">
      {/* Header */}
      <header className="px-5 pb-2 pt-14">
        <Link
          href="/home"
          className="inline-flex items-center gap-0.5 text-[15px] font-medium text-amber-500"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={2} />
          Inicio
        </Link>
        <h1 className="mt-2 text-[28px] font-bold tracking-tight text-gray-900">
          Paqueteria
        </h1>
      </header>

      {/* Pending notice */}
      <div className="px-5 pt-3">
        <p className="text-[15px] text-gray-600">
          Tienes{" "}
          <span className="font-bold text-gray-900">1 paquete</span>{" "}
          pendiente por recoger en porteria.
        </p>
      </div>

      {/* Main package card */}
      <div className="px-5 pt-4">
        <div className="overflow-hidden rounded-[24px] bg-gradient-to-br from-amber-500 to-amber-600 p-5 shadow-apple-lg">
          {/* Header row */}
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/70">
              ENTREGADO POR
            </p>
            <span className="rounded-full bg-white px-3 py-0.5 text-[11px] font-bold text-amber-600">
              HOY
            </span>
          </div>

          {/* Carrier info */}
          <div className="mt-2 flex items-center gap-2">
            <span className="text-2xl">{"\uD83D\uDCE6"}</span>
            <p className="text-[22px] font-bold tracking-tight text-white">
              Servientrega
            </p>
          </div>
          <p className="mt-0.5 text-[13px] text-white/80">Caja Mediana</p>
          <p className="mt-1 text-[11px] text-white/70">
            Recibido a las 10:30 AM por Carlos (Seguridad)
          </p>

          {/* Divider */}
          <div className="my-4 border-t border-white/20" />

          {/* Barcode section */}
          <p className="text-center text-[13px] text-white/80">
            Muestra este codigo en porteria
          </p>

          {/* Barcode visual */}
          <div className="mx-auto mt-3 flex h-20 w-60 items-center justify-center rounded-xl bg-white p-3">
            <div className="flex items-end gap-[1px]">
              {barWidths.map((w, i) => (
                <div
                  key={i}
                  className="bg-gray-900"
                  style={{
                    width: `${w}px`,
                    height: `${barHeights[i]}px`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Code */}
          <p className="mt-2 text-center font-mono text-lg font-bold tracking-widest text-white">
            A84H-902K
          </p>

          {/* Confirm button */}
          <button className="mt-4 w-full rounded-full border-2 border-white py-3 text-[13px] font-semibold text-white transition-colors hover:bg-white/10">
            Confirmar entrega
          </button>
        </div>
      </div>

      {/* History section */}
      <div className="px-5 pt-6">
        <h2 className="text-[15px] font-semibold tracking-tight text-gray-900">
          Historial
        </h2>
        <div className="mt-3 space-y-2">
          {historyItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-[16px] border border-gray-100 bg-white p-4 shadow-apple-sm"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50 shadow-apple-sm">
                <CheckCircle
                  className="h-5 w-5 text-green-500"
                  strokeWidth={1.5}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-medium tracking-tight text-gray-900">
                  {item.carrier}
                </p>
                <p className="text-[12px] text-gray-500">{item.description}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-gray-400">{item.date}</p>
                <span className="text-[11px] font-medium text-green-500">
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pb-24 pt-6 text-center">
        <p className="text-xs font-medium tracking-wider text-gray-300">
          <span className="mr-1">{"\u2726"}</span>
          POTENCIADO POR FOLKS
        </p>
      </div>
    </div>
  );
}
