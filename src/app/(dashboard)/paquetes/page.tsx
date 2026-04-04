"use client";

import { useState } from "react";
import Link from "next/link";
import { Package, Mail, Plus } from "lucide-react";

const pendingPackages = [
  {
    id: "1",
    type: "box",
    description: "Caja Mediana",
    sender: "Amazon Logistics",
    date: "Hoy, 10:45 AM",
    status: "Esperando en Porteria",
  },
  {
    id: "2",
    type: "envelope",
    description: "Sobre Documentos",
    sender: "Notaria 14",
    date: "Ayer, 04:30 PM",
    status: "Esperando en Porteria",
  },
];

// Simple QR-like grid for visual purposes
function QRCode() {
  const pattern = [
    [1, 1, 1, 0, 1, 0, 1, 1, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 1, 1, 0, 1, 0, 1, 1, 1],
    [0, 0, 0, 0, 1, 0, 0, 0, 0],
    [1, 0, 1, 1, 0, 1, 1, 0, 1],
    [0, 0, 0, 0, 1, 0, 0, 0, 0],
    [1, 1, 1, 0, 1, 0, 1, 1, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 1, 1, 0, 1, 0, 1, 1, 1],
  ];

  return (
    <div className="mx-auto flex flex-col gap-[3px]">
      {pattern.map((row, ri) => (
        <div key={ri} className="flex gap-[3px]">
          {row.map((cell, ci) => (
            <div
              key={ci}
              className={`h-3 w-3 rounded-[2px] ${
                cell ? "bg-gray-900" : "bg-transparent"
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function PaquetesPage() {
  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col bg-white pb-28">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pb-2 pt-14">
        <h1 className="text-[22px] font-bold tracking-tight text-gray-900">
          Mis Paquetes
        </h1>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50">
          <Package className="h-[18px] w-[18px] text-amber-600" strokeWidth={1.5} />
        </div>
      </header>

      {/* QR Code section */}
      <div className="mx-5 mt-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-apple-sm">
        <h2 className="text-center text-[15px] font-bold tracking-tight text-gray-900">
          Codigo de Recogida
        </h2>
        <p className="mt-1.5 text-center text-[13px] text-gray-500">
          Muestra este codigo al guarda de seguridad para recibir tus paquetes.
        </p>

        {/* QR placeholder */}
        <div className="mx-auto mt-5 flex h-28 w-28 items-center justify-center rounded-xl bg-white">
          <QRCode />
        </div>

        {/* Code ID */}
        <p className="mt-3 text-center text-[12px] text-gray-400">
          ID: <span className="font-mono font-medium">BR2A-CX94</span>
        </p>
      </div>

      {/* Pending packages */}
      <div className="mt-6 px-5">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-bold tracking-tight text-gray-900">
            Por recoger ({pendingPackages.length})
          </h2>
          <button className="text-[13px] font-medium text-amber-600">
            Historial
          </button>
        </div>

        <div className="mt-3 space-y-3">
          {pendingPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-apple-sm"
            >
              {/* Icon */}
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  pkg.type === "box"
                    ? "bg-amber-50 text-amber-600"
                    : "bg-blue-50 text-blue-600"
                }`}
              >
                {pkg.type === "box" ? (
                  <span className="text-lg font-bold">a</span>
                ) : (
                  <Mail className="h-5 w-5" strokeWidth={1.5} />
                )}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between">
                  <p className="text-[15px] font-semibold tracking-tight text-gray-900">
                    {pkg.description}
                  </p>
                  <span className="shrink-0 text-[11px] text-gray-400">
                    {pkg.date}
                  </span>
                </div>
                <p className="mt-0.5 text-[12px] text-gray-500">
                  Remitente: {pkg.sender}
                </p>
                <p className="mt-1 text-[12px] font-medium text-amber-600">
                  {pkg.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notify arrival */}
      <div className="mx-5 mt-4">
        <button className="flex w-full items-center gap-3 rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 p-4 text-left transition-colors hover:bg-gray-50">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white border border-gray-200">
            <Plus className="h-5 w-5 text-gray-400" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-gray-700">
              Aviso de llegada
            </p>
            <p className="text-[12px] text-gray-500">
              Notifica a porteria que esperas un envio
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
