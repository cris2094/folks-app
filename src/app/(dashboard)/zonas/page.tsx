"use client";

import { useState } from "react";
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

const myReservations = [
  {
    id: "r1",
    zoneName: "Zona BBQ",
    date: "Sabado 5 Abr",
    time: "10:00 AM - 4:00 PM",
    guests: 8,
  },
];

type TabValue = "disponibles" | "mis_reservas";

export default function ZonasPage() {
  const [activeTab, setActiveTab] = useState<TabValue>("disponibles");

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
        <p className="px-5 pb-2 text-[13px] text-gray-500 text-center">
          Reserva espacios del conjunto
        </p>
      </FadeIn>

      {/* Tabs pill */}
      <div className="px-5 pb-4 pt-1">
        <div className="flex rounded-full border border-gray-200 bg-gray-100/80 p-1">
          <button
            onClick={() => setActiveTab("disponibles")}
            className={`flex-1 cursor-pointer rounded-full py-2 text-center text-[13px] font-medium transition-all duration-200 ${
              activeTab === "disponibles"
                ? "bg-white text-gray-900 shadow-apple-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Disponibles
          </button>
          <button
            onClick={() => setActiveTab("mis_reservas")}
            className={`flex-1 cursor-pointer rounded-full py-2 text-center text-[13px] font-medium transition-all duration-200 ${
              activeTab === "mis_reservas"
                ? "bg-white text-gray-900 shadow-apple-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Mis Reservas ({myReservations.length})
          </button>
        </div>
      </div>

      {/* Tab content */}
      {activeTab === "disponibles" ? (
        <>
          {/* Zone cards */}
          <StaggerContainer className="space-y-4 px-5">
            {zones.map((zone) => (
              <StaggerItem key={zone.id}>
                {/* Photo card */}
                <div className="relative h-48 overflow-hidden rounded-3xl bg-gray-200 shadow-apple-sm">
                  {/* Placeholder image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${zone.photo})`,
                      backgroundColor: "#d4d4d8",
                    }}
                  />
                  {/* Dark overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  {/* Capacity badge */}
                  <div className="absolute right-3 top-3">
                    <span className="flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-gray-700 backdrop-blur-sm">
                      <Users className="h-3 w-3" strokeWidth={2} />
                      {zone.capacity} max
                    </span>
                  </div>

                  {/* Maintenance badge */}
                  {zone.maintenance && (
                    <div className="absolute left-3 top-3">
                      <span className="rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                        MANTENIMIENTO
                      </span>
                    </div>
                  )}

                  {/* Bottom overlay content */}
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <h3 className="text-lg font-bold text-white">{zone.name}</h3>
                    <p className="mt-0.5 flex items-center gap-1.5 text-[13px] text-white/90">
                      Horario: 10:00 AM - 10:00 PM
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
                    className="cursor-pointer rounded-full bg-gray-900 px-5 py-1.5 text-[13px] font-medium text-white transition-colors duration-200 hover:bg-gray-800 active:bg-gray-700"
                  >
                    Reservar
                  </Link>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </>
      ) : (
        /* Mis Reservas tab */
        <div className="space-y-3 px-5">
          {myReservations.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <CalendarDays className="h-8 w-8 text-gray-400" strokeWidth={1.5} />
              </div>
              <p className="font-medium text-gray-700">Sin reservas activas</p>
              <p className="text-[13px] text-gray-500">
                Reserva una zona comun para verla aqui
              </p>
            </div>
          ) : (
            <FadeInUp>
              {myReservations.map((res) => (
                <div
                  key={res.id}
                  className="rounded-3xl border border-gray-100 bg-white p-4 shadow-apple-sm"
                >
                  <h3 className="text-[15px] font-semibold tracking-tight text-gray-900">
                    {res.zoneName}
                  </h3>
                  <p className="mt-1 text-[13px] text-gray-500">
                    {res.date} &middot; {res.time}
                  </p>
                  <p className="mt-0.5 text-[12px] text-gray-400">
                    {res.guests} invitados
                  </p>
                </div>
              ))}
            </FadeInUp>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="pb-2 pt-8 text-center">
        <p className="text-[10px] font-medium tracking-wider text-gray-300">
          POTENCIADO POR FOLKS
        </p>
      </div>
    </div>
  );
}
