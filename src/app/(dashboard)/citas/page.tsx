import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { FadeIn, FadeInUp } from "@/components/motion";
import { CitasClient } from "./citas-client";

export default function CitasPage() {
  return (
    <div className="mx-auto w-full max-w-md min-h-screen bg-[#F5F5F7]">
      {/* Header */}
      <FadeIn>
        <div className="flex items-center gap-3 bg-white px-5 pt-4 pb-3">
          <Link
            href="/home"
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-gray-100 active:bg-gray-200"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" strokeWidth={1.5} />
          </Link>
          <h1 className="text-lg font-semibold tracking-tight text-gray-900">
            Agendar Cita
          </h1>
        </div>
      </FadeIn>

      <FadeInUp delay={0.1}>
        <CitasClient />
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
