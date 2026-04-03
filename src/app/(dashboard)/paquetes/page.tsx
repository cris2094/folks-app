import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package } from "lucide-react";
import { getMyPackages } from "@/features/paquetes/queries/get-my-packages";
import { PackageCard } from "@/features/paquetes/components/package-card";

export default async function PaquetesPage() {
  const packages = await getMyPackages();

  const pending = packages.filter((p) => p.status !== "delivered");
  const delivered = packages.filter((p) => p.status === "delivered");

  return (
    <div className="mx-auto max-w-md p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Paqueteria</h1>
        <p className="text-muted-foreground text-sm">
          Tus paquetes y correspondencia
        </p>
      </header>

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
        </TabsContent>
        <TabsContent value="entregados" className="mt-4">
          {delivered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <Package className="h-8 w-8 text-gray-400" />
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
