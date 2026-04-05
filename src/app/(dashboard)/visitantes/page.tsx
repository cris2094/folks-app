import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, ChevronLeft, Shield, Users, Clock } from "lucide-react";
import { FadeIn, FadeInUp } from "@/components/motion";
import { getMyVisitors } from "@/features/visitantes/queries/get-my-visitors";
import { getFrequentContacts } from "@/features/visitantes/queries/get-frequent-contacts";
import { getAccessLog } from "@/features/visitantes/queries/get-access-log";
import { getMonthlyVisitorCount } from "@/features/visitantes/queries/get-monthly-visitor-count";
import { VisitorCard } from "@/features/visitantes/components/visitor-card";
import { AccessTimeline } from "@/features/visitantes/components/access-timeline";
import { FrequentContactCard } from "@/features/visitantes/components/frequent-contact-card";

function isActive(v: {
  expires_at: string | null;
  authorized_until: string | null;
  left_at: string | null;
}) {
  if (v.left_at) return false;
  const ref = v.expires_at ?? v.authorized_until;
  if (!ref) return true;
  return new Date(ref) >= new Date();
}

export default async function VisitantesPage() {
  const [visitors, contacts, accessLog, monthlyCount] = await Promise.all([
    getMyVisitors(),
    getFrequentContacts(),
    getAccessLog(),
    getMonthlyVisitorCount(),
  ]);

  const authorized = visitors.filter((v) => isActive(v));
  const favorites = contacts.filter((c) => c.is_favorite);

  return (
    <div className="mx-auto w-full max-w-md px-4">
      {/* Header Apple-style */}
      <header className="sticky top-0 z-10 bg-[#F5F5F7]/80 backdrop-blur-lg">
        <div className="flex items-center justify-between px-5 pb-2 pt-14">
          <Link
            href="/home"
            className="flex items-center gap-0.5 text-[15px] font-medium text-amber-500"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2} />
            Inicio
          </Link>
          <h1 className="text-[17px] font-bold tracking-tight text-gray-900">
            Visitantes
          </h1>
          <Link
            href="/visitantes/autorizar"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-white shadow-apple-sm transition-colors hover:bg-amber-600"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
          </Link>
        </div>
        <p className="px-5 pb-1 text-center text-[13px] text-gray-500">
          Autoriza y gestiona el acceso de visitantes
        </p>
        <div className="mx-5 mb-2 flex items-center justify-center">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
              monthlyCount >= 5
                ? "bg-red-50 text-red-600"
                : monthlyCount >= 4
                  ? "bg-amber-50 text-amber-600"
                  : "bg-gray-100 text-gray-600"
            }`}
          >
            {monthlyCount}/5 visitantes este mes
          </span>
        </div>
      </header>

      <FadeInUp delay={0.1}>
      <div className="px-4 pt-2 pb-8">
        <Tabs defaultValue="autorizados">
          <TabsList className="w-full rounded-full bg-gray-100/80 border border-gray-200 p-1 h-auto">
            <TabsTrigger
              value="autorizados"
              className="flex-1 gap-1.5 rounded-full py-2 text-[13px] font-medium data-active:bg-white data-active:shadow-sm data-active:text-gray-900 transition-all duration-200"
            >
              <Shield className="h-3.5 w-3.5" />
              Autorizados ({authorized.length})
            </TabsTrigger>
            <TabsTrigger
              value="favoritos"
              className="flex-1 gap-1.5 rounded-full py-2 text-[13px] font-medium data-active:bg-white data-active:shadow-sm data-active:text-gray-900 transition-all duration-200"
            >
              <Users className="h-3.5 w-3.5" />
              Favoritos ({favorites.length})
            </TabsTrigger>
            <TabsTrigger
              value="historial"
              className="flex-1 gap-1.5 rounded-full py-2 text-[13px] font-medium data-active:bg-white data-active:shadow-sm data-active:text-gray-900 transition-all duration-200"
            >
              <Clock className="h-3.5 w-3.5" />
              Historial
            </TabsTrigger>
          </TabsList>

          {/* Tab Autorizados */}
          <TabsContent value="autorizados" className="mt-4">
            {authorized.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <Shield className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-700">
                    Sin visitantes autorizados
                  </p>
                  <p className="text-sm text-gray-500">
                    Autoriza el acceso de visitantes con el boton +
                  </p>
                </div>
                <Link
                  href="/visitantes/autorizar"
                  className="mt-2 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-amber-600 active:bg-amber-700 active:scale-95"
                >
                  Autorizar visitante
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {authorized.map((v) => (
                  <VisitorCard
                    key={v.id}
                    id={v.id}
                    fullName={v.full_name}
                    documentNumber={v.document_number}
                    reason={v.reason}
                    isFavorite={v.is_favorite}
                    vehiclePlate={v.vehicle_plate}
                    authorizedUntil={v.authorized_until}
                    expiresAt={v.expires_at}
                    createdAt={v.created_at}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tab Favoritos */}
          <TabsContent value="favoritos" className="mt-4">
            {favorites.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-700">
                    Sin contactos favoritos
                  </p>
                  <p className="text-sm text-gray-500">
                    Marca visitantes como favoritos para acceso rapido
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {favorites.map((c) => (
                  <FrequentContactCard key={c.id} contact={c} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tab Historial */}
          <TabsContent value="historial" className="mt-4">
            <AccessTimeline logs={accessLog} />
          </TabsContent>
        </Tabs>
      </div>
      </FadeInUp>

      {/* Footer */}
      <footer className="pb-24 pt-4 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-300">
          POTENCIADO POR FOLKS
        </p>
      </footer>
    </div>
  );
}
