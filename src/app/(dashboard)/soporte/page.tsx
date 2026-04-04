import Link from "next/link";
import {
  ChevronLeft,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { FadeIn, FadeInUp } from "@/components/motion";
import { SoporteFAQ } from "./faq";

export default function SoportePage() {
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
            Soporte
          </h1>
        </div>
      </FadeIn>

      {/* Admin Contact Card */}
      <FadeInUp delay={0.1}>
        <div className="px-5 pt-5">
          <div className="overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm">
            <div className="p-5">
              <h2 className="text-[15px] font-semibold text-gray-900">
                Administracion
              </h2>
              <p className="mt-1 text-[13px] text-gray-400">
                Contacta a la administracion de tu conjunto
              </p>

              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50">
                    <Phone className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Telefono</p>
                    <p className="text-sm font-medium text-gray-900">
                      (601) 555-0123
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
                    <Mail className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="text-sm font-medium text-gray-900">
                      admin@miconjunto.com
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50">
                    <Clock className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Horario</p>
                    <p className="text-sm font-medium text-gray-900">
                      Lun - Vie, 8:00 AM - 5:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex border-t border-gray-100">
              <a
                href="tel:+576015550123"
                className="flex flex-1 items-center justify-center gap-2 py-3.5 text-[13px] font-semibold text-amber-600 transition-colors hover:bg-amber-50 active:bg-amber-100"
              >
                <Phone className="h-4 w-4" />
                Llamar
              </a>
              <div className="w-px bg-gray-100" />
              <a
                href="https://wa.me/576015550123"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 py-3.5 text-[13px] font-semibold text-green-600 transition-colors hover:bg-green-50 active:bg-green-100"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </FadeInUp>

      {/* Folky Card */}
      <FadeInUp delay={0.15}>
        <div className="px-5 pt-4">
          <Link href="/folky" className="block group">
            <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#2D2D2D] to-[#1A1A1A] p-5 shadow-sm transition-shadow group-hover:shadow-md">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <Sparkles className="h-6 w-6 text-amber-400" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-white">
                    Folky esta aqui para ayudarte
                  </h3>
                  <p className="mt-0.5 text-[13px] text-white/60">
                    Tu asistente inteligente 24/7
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </FadeInUp>

      {/* FAQ */}
      <FadeInUp delay={0.2}>
        <div className="px-5 pt-6">
          <h2 className="mb-3 text-[15px] font-semibold tracking-tight text-gray-900">
            Preguntas frecuentes
          </h2>
          <SoporteFAQ />
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
