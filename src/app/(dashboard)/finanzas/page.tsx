"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import {
  FadeIn,
  FadeInUp,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion";

const detalles = [
  { concepto: "Cuota Administracion", valor: 420000 },
  { concepto: "Parqueadero Visitantes (Sep)", valor: 15000 },
  { concepto: "Cuota Extraordinaria (1/3)", valor: 15000 },
];

const total = detalles.reduce((s, d) => s + d.valor, 0);

const historial = [
  {
    id: "1",
    mes: "Septiembre 2023",
    detalle: "Pagado el 10 Sep \u00B7 Transferencia",
    monto: 420000,
  },
  {
    id: "2",
    mes: "Agosto 2023",
    detalle: "Pagado el 05 Ago \u00B7 PSE",
    monto: 420000,
  },
];

function fmt(n: number) {
  return `$ ${n.toLocaleString("es-CO")}`;
}

export default function FinanzasPage() {
  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col bg-white px-5 pb-28 pt-14">
      {/* Header */}
      <header className="mb-8 flex items-center">
        <Link
          href="/home"
          className="flex h-8 w-8 items-center justify-center"
        >
          <ArrowLeft className="h-5 w-5 text-gray-800" strokeWidth={2} />
        </Link>
        <h1 className="flex-1 text-center text-[17px] font-semibold tracking-tight text-gray-900">
          Estado de Cuenta
        </h1>
        <div className="w-8" />
      </header>

      {/* Month label */}
      <FadeIn>
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-400">
          ADMINISTRACION OCTUBRE
        </p>

        {/* Amount */}
        <p className="mt-2 text-center text-[32px] sm:text-[40px] font-bold tracking-tight text-gray-900">
          {fmt(total)}
        </p>

        {/* Due date badge */}
        <div className="mt-2 flex items-center justify-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-500" />
          <span className="text-[13px] font-medium text-red-500">
            Vence en 5 dias
          </span>
        </div>
      </FadeIn>

      {/* Divider */}
      <div className="my-6 border-t border-gray-100" />

      {/* Detalle del cobro */}
      <FadeInUp delay={0.1}>
        <h2 className="mb-4 text-[15px] font-semibold tracking-tight text-gray-900">
          Detalle del cobro
        </h2>

        <div className="space-y-3">
          {detalles.map((d) => (
            <div key={d.concepto} className="flex items-center justify-between">
              <span className="text-[14px] text-gray-600">{d.concepto}</span>
              <span className="text-[14px] text-gray-600">{fmt(d.valor)}</span>
            </div>
          ))}
          {/* Total row */}
          <div className="border-t border-gray-100 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-bold text-gray-900">Total</span>
              <span className="text-[15px] font-bold text-gray-900">
                {fmt(total)}
              </span>
            </div>
          </div>
        </div>

        {/* Pay button */}
        <button className="mt-8 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 py-4 text-[15px] font-semibold text-white shadow-lg shadow-amber-200/50 transition-all duration-200 hover:from-amber-500 hover:to-amber-600 active:scale-[0.98]">
          Realizar Pago Seguro
          <CheckCircle2 className="h-5 w-5" strokeWidth={2} />
        </button>

        {/* Payment provider note */}
        <p className="mt-3 text-center text-[11px] text-gray-400">
          Pagos procesados por PSE / Tarjeta
        </p>
      </FadeInUp>

      {/* Divider */}
      <div className="my-6 border-t border-gray-100" />

      {/* Historial */}
      <FadeIn delay={0.2}>
        <h2 className="mb-4 text-[15px] font-semibold tracking-tight text-gray-900">
          Historial de Pagos
        </h2>
      </FadeIn>

      <StaggerContainer className="space-y-3">
        {historial.map((h) => (
          <StaggerItem
            key={h.id}
          >
          <div
            className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4"
          >
            {/* Check icon */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2
                className="h-5 w-5 text-green-500"
                strokeWidth={2}
              />
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold tracking-tight text-gray-900">
                {h.mes}
              </p>
              <p className="text-[12px] text-gray-500">{h.detalle}</p>
            </div>

            {/* Amount */}
            <p className="shrink-0 text-[15px] font-semibold text-gray-900">
              {fmt(h.monto)}
            </p>
          </div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Footer */}
      <div className="pb-2 pt-8 text-center">
        <p className="text-[10px] font-medium tracking-wider text-gray-300">
          POTENCIADO POR FOLKS
        </p>
      </div>
    </div>
  );
}
