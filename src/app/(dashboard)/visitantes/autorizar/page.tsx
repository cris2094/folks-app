import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { AuthorizeForm } from "@/features/visitantes/components/authorize-form";

export default function AutorizarVisitantePage() {
  return (
    <div className="mx-auto max-w-md">
      {/* Header Apple-style */}
      <header className="sticky top-0 z-10 bg-[#F5F5F7]/80 backdrop-blur-lg">
        <div className="flex items-center justify-between px-5 pb-2 pt-14">
          <Link
            href="/visitantes"
            className="flex items-center gap-0.5 text-[15px] font-medium text-amber-500"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2} />
            Visitantes
          </Link>
          <h1 className="text-[17px] font-bold tracking-tight text-gray-900">
            Autorizar Acceso
          </h1>
          <div className="w-8" />
        </div>
      </header>

      <div className="px-4 pt-4 pb-8">
        <AuthorizeForm />
      </div>

      {/* Footer */}
      <footer className="pb-24 pt-4 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-300">
          POTENCIADO POR FOLKS
        </p>
      </footer>
    </div>
  );
}
