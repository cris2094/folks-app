import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const enConjunto = [
  {
    nombre: "Carlos Ramirez",
    tipo: "Familiar",
    llegada: "10:30 AM",
    destino: "Apto 301",
  },
];

const historial = [
  {
    nombre: "Ana Garcia",
    tipo: "Delivery",
    llegada: "2 abr 2026 - 9:15 AM",
    salida: "2 abr 2026 - 9:25 AM",
  },
  {
    nombre: "Pedro Martinez",
    tipo: "Tecnico",
    llegada: "1 abr 2026 - 2:00 PM",
    salida: "1 abr 2026 - 4:30 PM",
  },
  {
    nombre: "Laura Sanchez",
    tipo: "Familiar",
    llegada: "31 mar 2026 - 11:00 AM",
    salida: "31 mar 2026 - 6:00 PM",
  },
];

export default function VisitantesPage() {
  return (
    <div className="mx-auto max-w-md p-4">
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Visitantes</h1>
            <p className="text-muted-foreground text-sm">
              Control de acceso de visitantes
            </p>
          </div>
          <Button size="sm">Pre-autorizar</Button>
        </div>
      </header>

      <Tabs defaultValue="en-conjunto">
        <TabsList className="w-full">
          <TabsTrigger value="en-conjunto" className="flex-1">
            En el conjunto
            <Badge variant="secondary" className="ml-2">
              {enConjunto.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="historial" className="flex-1">
            Historial
          </TabsTrigger>
        </TabsList>

        <TabsContent value="en-conjunto" className="mt-4 space-y-3">
          {enConjunto.map((v) => (
            <Card key={v.nombre}>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-xl">
                  🚪
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{v.nombre}</p>
                  <p className="text-muted-foreground text-xs">
                    Llegada: {v.llegada} - {v.destino}
                  </p>
                </div>
                <Badge variant="secondary">{v.tipo}</Badge>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="historial" className="mt-4 space-y-3">
          {historial.map((v) => (
            <Card key={v.nombre + v.llegada}>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-xl">
                  👤
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{v.nombre}</p>
                  <p className="text-muted-foreground text-xs">
                    {v.llegada}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Salida: {v.salida}
                  </p>
                </div>
                <Badge variant="outline">{v.tipo}</Badge>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
