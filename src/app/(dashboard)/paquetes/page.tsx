"use client";

import Link from "next/link";
import { ChevronLeft, Package, CheckCircle } from "lucide-react";

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

export default function PaquetesPage() {
  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white px-4 pb-4 pt-4">
        <div className="flex items-center justify-between">
          <Link
            href="/home"
            className="flex items-center gap-1 text-sm font-medium text-amber-600"
          >
            <ChevronLeft className="h-4 w-4" />
            Inicio
          </Link>
          <h1 className="text-lg font-bold text-gray-900">Paqueteria</h1>
          <div className="w-12" />
        </div>
      </header>

      {/* Pending notice */}
      <div className="px-4 pt-4">
        <p className="text-sm text-gray-600">
          Tienes{" "}
          <span className="font-semibold text-gray-900">
            1 paquete pendiente
          </span>{" "}
          por recoger en porteria.
        </p>
      </div>

      {/* Main package card */}
      <div className="px-4 pt-4">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 p-5 shadow-lg">
          {/* Header row */}
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-900/60">
              Entregado por
            </p>
            <span className="rounded-full bg-white/30 px-2.5 py-0.5 text-[11px] font-bold text-white">
              HOY
            </span>
          </div>

          {/* Carrier info */}
          <div className="mt-2 flex items-center gap-2">
            <span className="text-lg">{"\uD83D\uDCE6"}</span>
            <p className="text-lg font-bold text-white">Servientrega</p>
          </div>
          <p className="mt-0.5 text-sm text-white/80">Caja Mediana</p>
          <p className="mt-1 text-xs text-white/70">
            Recibido a las 10:30 AM por Carlos (Seguridad)
          </p>

          {/* Divider */}
          <div className="my-4 border-t border-white/30" />

          {/* Barcode section */}
          <p className="text-center text-xs font-medium text-white/80">
            Muestra este codigo en porteria
          </p>

          {/* Barcode placeholder */}
          <div className="mx-auto mt-3 flex h-16 w-48 items-center justify-center rounded-lg bg-white/95">
            <div className="flex items-end gap-[2px]">
              {[4, 2, 6, 3, 5, 1, 4, 6, 2, 5, 3, 7, 2, 4, 6, 3, 5, 1, 4, 2, 6, 3, 5, 7, 2, 4, 3, 5, 6, 2].map(
                (h, i) => (
                  <div
                    key={i}
                    className="bg-gray-900"
                    style={{
                      width: i % 3 === 0 ? "2px" : "1px",
                      height: `${h * 5 + 8}px`,
                    }}
                  />
                )
              )}
            </div>
          </div>
          <p className="mt-2 text-center font-mono text-lg font-bold tracking-[0.2em] text-white">
            A84H-902K
          </p>

          {/* Confirm button */}
          <button className="mt-4 w-full rounded-full border-2 border-white py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10">
            Confirmar entrega
          </button>
        </div>
      </div>

      {/* History section */}
      <div className="px-4 pt-6">
        <h2 className="text-sm font-semibold text-gray-900">Historial</h2>
        <div className="mt-3 space-y-2">
          {historyItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-xl bg-white p-3 ring-1 ring-gray-100"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    {item.carrier}
                  </p>
                  <span className="text-[11px] text-gray-400">{item.date}</span>
                </div>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pb-24 pt-6 text-center">
        <p className="text-[10px] font-medium tracking-wider text-gray-400">
          <span className="mr-1">{"\u2726"}</span>
          POTENCIADO POR FOLKS
        </p>
      </div>
    </div>
  );
}
