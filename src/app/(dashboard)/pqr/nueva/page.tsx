import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { CreateTicketForm } from "@/features/pqr/components/create-ticket-form";

export default function NuevaIncidenciaPage() {
  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col">
      {/* Header */}
      <header className="px-5 pb-4 pt-14">
        <div className="flex items-center justify-between">
          <Link
            href="/pqr"
            className="flex items-center gap-0.5 text-[15px] font-medium text-amber-500"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2} />
            Inicio
          </Link>
          <h1 className="text-[17px] font-bold tracking-tight text-gray-900">
            Nueva Incidencia
          </h1>
          <div className="w-12" />
        </div>
      </header>

      {/* Form */}
      <div className="flex-1">
        <CreateTicketForm />
      </div>

      {/* Footer */}
      <div className="pb-24 pt-2 text-center">
        <p className="text-[10px] font-medium tracking-wider text-gray-400">
          <span className="mr-1">{"\u2726"}</span>
          POTENCIADO POR FOLKS
        </p>
      </div>
    </div>
  );
}
