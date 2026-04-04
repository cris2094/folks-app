import Link from "next/link";
import { ChevronLeft, Wallet, Construction } from "lucide-react";
import { FadeIn, FadeInUp } from "@/components/motion";

export default function PresupuestoPage() {
  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col">
      {/* Header */}
      <FadeIn>
        <header className="px-5 pb-4 pt-14">
          <div className="flex items-center justify-between">
            <Link
              href="/home"
              className="inline-flex items-center gap-0.5 text-[15px] font-medium text-amber-500"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2} />
              Inicio
            </Link>
            <h1 className="text-[17px] font-bold tracking-tight text-gray-900">
              Presupuesto
            </h1>
            <div className="w-14" />
          </div>
        </header>
      </FadeIn>

      {/* Content */}
      <FadeInUp delay={0.15}>
        <div className="flex flex-1 flex-col items-center justify-center px-5 pt-20">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-50">
            <Wallet className="h-10 w-10 text-amber-500" strokeWidth={1.5} />
          </div>
          <h2 className="mt-5 text-lg font-semibold text-gray-900">
            Presupuesto del Conjunto
          </h2>
          <p className="mt-2 text-center text-sm leading-relaxed text-gray-500">
            Consulta el presupuesto anual, gastos ejecutados y proyecciones
            financieras de tu conjunto.
          </p>
          <div className="mt-6 flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-3">
            <Construction className="h-4 w-4 text-gray-400" strokeWidth={1.5} />
            <span className="text-[13px] text-gray-400">
              Proximamente disponible
            </span>
          </div>
        </div>
      </FadeInUp>

      {/* Footer */}
      <div className="pb-24 pt-8 text-center">
        <p className="text-[10px] font-medium tracking-wider text-gray-300">
          POTENCIADO POR FOLKS
        </p>
      </div>
    </div>
  );
}
