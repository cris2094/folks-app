import Link from "next/link";
import { Package, Mail, Clock, CheckCircle, User, Shield } from "lucide-react";
import {
  FadeIn,
  FadeInUp,
  ScaleIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMyPackages } from "@/features/paquetes/queries/get-my-packages";
import { getPendingPackages } from "@/features/paquetes/queries/get-pending-packages";
import { getCurrentUser } from "@/features/auth/queries/get-current-user";
import { DeliveryCheckbox } from "@/features/paquetes/components/delivery-checkbox";
import type { UserRole } from "@/types/database";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

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

export default async function PaquetesPage() {
  const [packages, userData, porteroPkgs] = await Promise.all([
    getMyPackages(),
    getCurrentUser(),
    getPendingPackages(),
  ]);

  const role = (userData?.resident?.role ?? "residente") as UserRole;
  const isPortero =
    role === "portero" || role === "admin" || role === "super_admin";

  const pending = packages.filter(
    (p) => p.status === "received" || p.status === "notified",
  );
  const delivered = packages.filter((p) => p.status === "delivered");

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col bg-white pb-28">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pb-2 pt-14">
        <h1 className="text-[22px] font-bold tracking-tight text-gray-900">
          Mis Paquetes
        </h1>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50">
          <Package
            className="h-[18px] w-[18px] text-amber-600"
            strokeWidth={1.5}
          />
        </div>
      </header>
      <p className="px-5 pb-2 text-[13px] text-gray-500">
        Consulta y recoge tus paquetes
      </p>

      {/* QR Code section */}
      <ScaleIn>
        <div className="mx-5 mt-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-apple-sm">
          <h2 className="text-center text-[15px] font-bold tracking-tight text-gray-900">
            Codigo de Recogida
          </h2>
          <p className="mt-1.5 text-center text-[13px] text-gray-500">
            Muestra este codigo al guarda de seguridad para recibir tus
            paquetes.
          </p>
          <div className="mx-auto mt-5 flex h-32 w-32 items-center justify-center rounded-2xl bg-gray-50 p-2">
            <QRCode />
          </div>
          <p className="mt-3 text-center text-[12px] text-gray-400">
            ID:{" "}
            <span className="rounded-lg bg-gray-100 px-2 py-0.5 font-mono font-medium text-gray-600">
              BR2A-CX94
            </span>
          </p>
        </div>
      </ScaleIn>

      {/* Tabs */}
      <FadeInUp delay={0.15}>
        <div className="mt-6 px-5">
          <Tabs defaultValue="pendientes">
            <TabsList className="w-full rounded-full border border-gray-200 bg-gray-100/80 p-1 h-auto">
              <TabsTrigger
                value="pendientes"
                className="flex-1 gap-1 rounded-full py-2 text-[13px] font-medium data-active:bg-white data-active:shadow-sm data-active:text-gray-900 transition-all duration-200"
              >
                <Package className="h-3.5 w-3.5" />
                Por recoger ({pending.length})
              </TabsTrigger>
              <TabsTrigger
                value="historial"
                className="flex-1 gap-1 rounded-full py-2 text-[13px] font-medium data-active:bg-white data-active:shadow-sm data-active:text-gray-900 transition-all duration-200"
              >
                <Clock className="h-3.5 w-3.5" />
                Historial ({delivered.length})
              </TabsTrigger>
            </TabsList>

            {/* Tab Pendientes */}
            <TabsContent value="pendientes" className="mt-4">
              {pending.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                    <Package
                      className="h-8 w-8 text-gray-400"
                      strokeWidth={1.5}
                    />
                  </div>
                  <p className="font-medium text-gray-700">
                    Sin paquetes pendientes
                  </p>
                  <p className="text-[13px] text-gray-500">
                    Tus paquetes por recoger apareceran aqui
                  </p>
                </div>
              ) : (
                <StaggerContainer className="space-y-3">
                  {pending.map((pkg) => {
                    const unit = Array.isArray(pkg.unit)
                      ? pkg.unit[0]
                      : pkg.unit;
                    return (
                      <StaggerItem key={pkg.id}>
                        <div className="flex items-start gap-3 rounded-3xl border border-gray-100 bg-white p-4 shadow-apple-sm transition-shadow duration-200 hover:shadow-apple">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                            <Mail className="h-5 w-5" strokeWidth={1.5} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between">
                              <p className="text-[15px] font-semibold tracking-tight text-gray-900">
                                {pkg.description}
                              </p>
                              <span className="shrink-0 text-[11px] text-gray-400">
                                {formatDate(pkg.received_at)}
                              </span>
                            </div>
                            {unit && (
                              <p className="mt-0.5 text-[12px] text-gray-500">
                                {unit.tower} - Apto {unit.apartment}
                              </p>
                            )}
                            <p className="mt-0.5 text-[12px] text-gray-400">
                              Recibido por: {pkg.received_by}
                            </p>
                            <p className="mt-1 text-[12px] font-medium text-amber-600">
                              Esperando en Porteria
                            </p>
                          </div>
                        </div>
                      </StaggerItem>
                    );
                  })}
                </StaggerContainer>
              )}
            </TabsContent>

            {/* Tab Historial */}
            <TabsContent value="historial" className="mt-4">
              {delivered.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                    <CheckCircle
                      className="h-8 w-8 text-gray-400"
                      strokeWidth={1.5}
                    />
                  </div>
                  <p className="font-medium text-gray-700">Sin historial</p>
                  <p className="text-[13px] text-gray-500">
                    Los paquetes entregados apareceran aqui
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {delivered.map((pkg) => {
                    const unit = Array.isArray(pkg.unit)
                      ? pkg.unit[0]
                      : pkg.unit;
                    return (
                      <div
                        key={pkg.id}
                        className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-3.5"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[14px] font-medium text-gray-900">
                              {pkg.description}
                            </p>
                            <div className="flex flex-wrap gap-x-3 text-[11px] text-gray-400">
                              {pkg.delivered_at && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatDate(pkg.delivered_at)}
                                </span>
                              )}
                              {pkg.delivered_to && (
                                <span className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {pkg.delivered_to}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <span className="shrink-0 text-[11px] font-medium text-green-500">
                          Entregado
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>
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
