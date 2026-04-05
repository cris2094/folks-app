import Link from "next/link";
import { CalendarDays, Users, Clock, MapPin } from "lucide-react";
import {
  FadeIn,
  FadeInUp,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getZones } from "@/features/zonas/queries/get-zones";
import { getMyReservations } from "@/features/zonas/queries/get-my-reservations";
import { getZoneAccessLogs } from "@/features/zonas/queries/get-zone-access-logs";
import { getCurrentUser } from "@/features/auth/queries/get-current-user";
import type { UserRole } from "@/types/database";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
  });
}

export default async function ZonasPage() {
  const [zones, reservations, accessLogs, userData] = await Promise.all([
    getZones(),
    getMyReservations(),
    getZoneAccessLogs(),
    getCurrentUser(),
  ]);

  const role = (userData?.resident?.role ?? "residente") as UserRole;
  const isAdmin =
    role === "admin" || role === "super_admin" || role === "consejo";

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
            <CalendarDays
              className="h-[18px] w-[18px] text-gray-600"
              strokeWidth={1.5}
            />
          </Link>
        </header>
        <p className="px-5 pb-2 text-center text-[13px] text-gray-500">
          Reserva espacios del conjunto
        </p>
      </FadeIn>

      <FadeInUp delay={0.1}>
        <div className="px-5 pt-2 pb-4">
          <Tabs defaultValue="disponibles">
            <TabsList className="w-full rounded-full border border-gray-200 bg-gray-100/80 p-1 h-auto">
              <TabsTrigger
                value="disponibles"
                className="flex-1 rounded-full py-2 text-center text-[13px] font-medium data-active:bg-white data-active:shadow-sm data-active:text-gray-900 transition-all duration-200"
              >
                Disponibles
              </TabsTrigger>
              <TabsTrigger
                value="mis_reservas"
                className="flex-1 rounded-full py-2 text-center text-[13px] font-medium data-active:bg-white data-active:shadow-sm data-active:text-gray-900 transition-all duration-200"
              >
                Mis Reservas ({reservations.length})
              </TabsTrigger>
              {isAdmin && (
                <TabsTrigger
                  value="historial"
                  className="flex-1 gap-1 rounded-full py-2 text-center text-[13px] font-medium data-active:bg-white data-active:shadow-sm data-active:text-gray-900 transition-all duration-200"
                >
                  <Clock className="h-3.5 w-3.5" />
                  Ingresos
                </TabsTrigger>
              )}
            </TabsList>

            {/* Tab Disponibles */}
            <TabsContent value="disponibles" className="mt-4">
              {zones.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                    <MapPin
                      className="h-8 w-8 text-gray-400"
                      strokeWidth={1.5}
                    />
                  </div>
                  <p className="font-medium text-gray-700">
                    Sin zonas disponibles
                  </p>
                  <p className="text-[13px] text-gray-500">
                    No hay zonas comunes configuradas
                  </p>
                </div>
              ) : (
                <StaggerContainer className="space-y-4">
                  {zones.map((zone) => (
                    <StaggerItem key={zone.id}>
                      {zone.photo_url ? (
                        <div className="relative h-48 overflow-hidden rounded-3xl bg-gray-200 shadow-apple-sm">
                          <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{
                              backgroundImage: `url(${zone.photo_url})`,
                              backgroundColor: "#d4d4d8",
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                          <div className="absolute right-3 top-3">
                            <span className="flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-gray-700 backdrop-blur-sm">
                              <Users className="h-3 w-3" strokeWidth={2} />
                              {zone.max_guests} max
                            </span>
                          </div>

                          {!zone.is_active && (
                            <div className="absolute left-3 top-3">
                              <span className="rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                                MANTENIMIENTO
                              </span>
                            </div>
                          )}

                          <div className="absolute inset-x-0 bottom-0 p-4">
                            <h3 className="text-lg font-bold text-white">
                              {zone.name}
                            </h3>
                            <p className="mt-0.5 text-[13px] text-white/90">
                              {zone.price_cop > 0
                                ? `$${zone.price_cop.toLocaleString("es-CO")} COP`
                                : "Gratis"}{" "}
                              · {zone.max_duration_hours}h max
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-3xl border border-gray-100 bg-white p-4 shadow-apple-sm">
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-2xl">
                              {zone.icon ?? "\uD83C\uDFCA"}
                            </div>
                            <div>
                              <h3 className="text-[15px] font-semibold text-gray-900">
                                {zone.name}
                              </h3>
                              <p className="text-[12px] text-gray-500">
                                {zone.price_cop > 0
                                  ? `$${zone.price_cop.toLocaleString("es-CO")} COP`
                                  : "Gratis"}{" "}
                                · {zone.max_duration_hours}h max
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="mt-2.5 flex items-center justify-between px-1">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`h-2 w-2 rounded-full ${zone.is_active ? "bg-green-500" : "bg-red-500"}`}
                          />
                          <span
                            className={`text-[13px] font-medium ${zone.is_active ? "text-green-600" : "text-red-500"}`}
                          >
                            {zone.is_active
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
              )}
            </TabsContent>

            {/* Tab Mis Reservas */}
            <TabsContent value="mis_reservas" className="mt-4">
              {reservations.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                    <CalendarDays
                      className="h-8 w-8 text-gray-400"
                      strokeWidth={1.5}
                    />
                  </div>
                  <p className="font-medium text-gray-700">
                    Sin reservas activas
                  </p>
                  <p className="text-[13px] text-gray-500">
                    Reserva una zona comun para verla aqui
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reservations.map((res: Record<string, unknown>) => {
                    const zone = Array.isArray(res.zone)
                      ? res.zone[0]
                      : (res.zone as Record<string, unknown> | null);
                    const zoneName =
                      (zone?.name as string) ?? "Zona";
                    return (
                      <div
                        key={res.id as string}
                        className="rounded-3xl border border-gray-100 bg-white p-4 shadow-apple-sm"
                      >
                        <h3 className="text-[15px] font-semibold tracking-tight text-gray-900">
                          {zoneName}
                        </h3>
                        <p className="mt-1 text-[13px] text-gray-500">
                          {formatDate(res.date as string)} &middot;{" "}
                          {res.start_time as string} - {res.end_time as string}
                        </p>
                        <p className="mt-0.5 text-[12px] text-gray-400">
                          {res.guests_count as number} invitados
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* Tab Historial de ingresos (admin) */}
            {isAdmin && (
              <TabsContent value="historial" className="mt-4">
                {accessLogs.length === 0 ? (
                  <div className="flex flex-col items-center gap-3 py-12 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                      <Clock
                        className="h-8 w-8 text-gray-400"
                        strokeWidth={1.5}
                      />
                    </div>
                    <p className="font-medium text-gray-700">
                      Sin registros de ingreso
                    </p>
                    <p className="text-[13px] text-gray-500">
                      Los ingresos a zonas comunes apareceran aqui
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Ultimos ingresos
                    </p>
                    {accessLogs.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 transition-colors hover:bg-gray-50"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-50">
                          <MapPin className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-900">
                            {log.resident_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {log.zone_name}
                            {log.unit_label && ` · ${log.unit_label}`}
                          </p>
                        </div>
                        <span className="shrink-0 text-xs text-gray-400">
                          {formatDate(log.checked_in_at)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            )}
          </Tabs>
        </div>
      </FadeInUp>

      {/* Footer */}
      <div className="pb-2 pt-8 text-center">
        <p className="text-[10px] font-medium tracking-wider text-gray-300">
          POTENCIADO POR FOLKS
        </p>
      </div>
    </div>
  );
}
