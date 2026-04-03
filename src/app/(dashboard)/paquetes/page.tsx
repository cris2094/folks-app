import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const pendientes = [
  {
    id: "PKG-001",
    remitente: "Amazon",
    fecha: "2 abr 2026",
    descripcion: "Caja mediana",
  },
  {
    id: "PKG-002",
    remitente: "MercadoLibre",
    fecha: "1 abr 2026",
    descripcion: "Sobre grande",
  },
];

const entregados = [
  {
    id: "PKG-003",
    remitente: "Rappi",
    fecha: "30 mar 2026",
    descripcion: "Bolsa pequena",
    recibidoPor: "Juan Perez",
  },
  {
    id: "PKG-004",
    remitente: "Servientrega",
    fecha: "28 mar 2026",
    descripcion: "Caja grande",
    recibidoPor: "Maria Lopez",
  },
];

export default function PaquetesPage() {
  return (
    <div className="mx-auto max-w-md p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Paqueteria</h1>
        <p className="text-muted-foreground text-sm">
          Paquetes recibidos en porteria
        </p>
      </header>

      <Tabs defaultValue="pendientes">
        <TabsList className="w-full">
          <TabsTrigger value="pendientes" className="flex-1">
            Pendientes
            <Badge variant="secondary" className="ml-2">
              {pendientes.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="entregados" className="flex-1">
            Entregados
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pendientes" className="mt-4 space-y-3">
          {pendientes.map((pkg) => (
            <Card key={pkg.id}>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-xl">
                  📦
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{pkg.remitente}</p>
                  <p className="text-muted-foreground text-xs">
                    {pkg.descripcion} - {pkg.fecha}
                  </p>
                </div>
                <Badge>Pendiente</Badge>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="entregados" className="mt-4 space-y-3">
          {entregados.map((pkg) => (
            <Card key={pkg.id}>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-xl">
                  ✅
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{pkg.remitente}</p>
                  <p className="text-muted-foreground text-xs">
                    {pkg.descripcion} - {pkg.fecha}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Recibido por: {pkg.recibidoPor}
                  </p>
                </div>
                <Badge variant="outline">Entregado</Badge>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
