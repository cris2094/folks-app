"use client";

import Link from "next/link";
import { CalendarDays, Users } from "lucide-react";
import { FadeIn, FadeInUp, StaggerContainer, StaggerItem } from "@/components/motion";

const zones = [
  {
    id: "1",
    name: "Zona BBQ",
    photo: "/images/zones/bbq.jpg",
    capacity: 25,
    available: true,
    maintenance: false,
  },
  {
    id: "2",
    name: "Piscina Climatizada",
    photo: "/images/zones/pool.jpg",
    capacity: 15,
    available: false,
    maintenance: true,
  },
  {
    id: "3",
    name: "Gimnasio Torre B",
    photo: "/images/zones/gym.jpg",
    capacity: 20,
    available: true,
    maintenance: false,
  },
];

export default function ZonasPage() {
  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col bg-white pb-28">
      {/* Header */}
      <FadeIn>
        <header className="flex items-center justify-between px-5 pb-2 pt-14">
          <div className="w-8" />
          <h1 className="text-[17px] font-bold tracking-tight text-gray-900">
            Zonas Comunes
          </h1>
          <Link
            href="/zonas"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white"
          >
            <CalendarDays className="h-[18px] w-[18px] text-gray-600" strokeWidth={1.5} />
          </Link>
        </header>

        {/* Subtitle */}
        <p className="px-5 pb-5 pt-1 text-[14px] text-gray-500">
          Selecciona el area que deseas reservar.
        </p>
      </FadeIn>

      {/* Zone cards */}
      <StaggerContainer className="space-y-4 px-5">
        {zones.map((zone) => (
          <StaggerItem key={zone.id}>
            {/* Photo card */}
            <div className="relative h-48 overflow-hidden rounded-2xl bg-gray-200">
              {/* Placeholder image — in production, use next/image with real URLs */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${zone.photo})`,
                  backgroundColor: "#d4d4d8",
                }}
              />
              {/* Dark overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

              {/* Maintenance badge */}
              {zone.maintenance && (
                <div className="absolute right-3 top-3">
                  <span className="rounded bg-red-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                    MANTENIMIENTO
                  </span>
                </div>
              )}

              {/* Bottom overlay content */}
              <div className="absolute inset-x-0 bottom-0 p-4">
                <h3 className="text-lg font-bold text-white">{zone.name}</h3>
                <p className="mt-0.5 flex items-center gap-1.5 text-[13px] text-white/90">
                  <Users className="h-3.5 w-3.5" strokeWidth={2} />
                  Capacidad: {zone.capacity} pers.
                </p>
              </div>
            </div>

            {/* Status + Reserve button row */}
            <div className="mt-2.5 flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5">
                <span
                  className={`h-2 w-2 rounded-full ${
                    zone.available ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <span
                  className={`text-[13px] font-medium ${
                    zone.available ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {zone.available
                    ? "Disponible hoy"
                    : "Cerrado temporalmente"}
                </span>
              </div>
              <Link
                href={`/zonas/${zone.id}`}
                className="cursor-pointer rounded-lg border border-gray-300 px-5 py-1.5 text-[13px] font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50 active:bg-gray-100"
              >
                Reservar
              </Link>
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
