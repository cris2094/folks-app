import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Package, Plus } from "lucide-react";
import { getMyPackages } from "@/features/paquetes/queries/get-my-packages";
import { PackageCard } from "@/features/paquetes/components/package-card";

export default async function PaquetesPage() {
  const packages = await getMyPackages();

  const pending = packages.filter((p) => p.status !== "delivered");
  const delivered = packages.filter((p) => p.status === "delivered");

  return (
    <div className="mx-auto max-w-md p-4">
      <header className="mb-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
            <Package className="h-4 w-4 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold">Paqueteria</h1>
        </div>
        <p className="text-muted-foreground text-sm mt-1 ml-10">
          Tus paquetes y correspondencia
        </p>
      </header>

      <Card className="mb-6 border-0 bg-gradient-to-br from-brand-dark to-brand-dark-lighter text-white shadow-lg">
        <CardContent className="flex flex-col items-center p-5">
          <p className="text-sm font-semibold">Codigo de Recogida</p>
          <p className="mt-1 text-xs text-white/70">
            Muestra este codigo al guarda de seguridad
          </p>
          <div className="mt-3 flex h-28 w-28 items-center justify-center rounded-2xl bg-white shadow-inner">
            <p className="text-2xl font-bold text-gray-900">QR</p>
          </div>
          <p className="mt-2 font-mono text-sm tracking-wider">
            {Math.random().toString(36).substring(2, 6).toUpperCase()}-{Math.random().toString(36).substring(2, 6).toUpperCase()}
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="pendientes">
        <TabsList className="w-full">
          <TabsTrigger value="pendientes" className="flex-1">
            Pendientes ({pending.length})
          </TabsTrigger>
          <TabsTrigger value="entregados" className="flex-1">
            Entregados ({delivered.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="pendientes" className="mt-4">
          {pending.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <p className="font-medium text-gray-700">Sin paquetes pendientes</p>
                <p className="text-muted-foreground text-sm">
                  Te notificaremos cuando llegue algo
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {pending.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          )}
          <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-amber-600 py-2.5 text-sm font-medium text-amber-600 transition-all hover:bg-amber-50 hover:shadow-sm">
            <Plus className="h-4 w-4" />
            Aviso de llegada
          </button>
        </TabsContent>
        <TabsContent value="entregados" className="mt-4">
          {delivered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-50">
                <Package className="h-7 w-7 text-gray-300" />
              </div>
              <p className="text-muted-foreground text-sm">Sin entregas recientes</p>
            </div>
          ) : (
            <div className="space-y-2">
              {delivered.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
