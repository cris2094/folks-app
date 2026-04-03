import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const recibos = [
  {
    mes: "Abril 2026",
    valor: "$450.000",
    vencimiento: "15 abr 2026",
    estado: "Pendiente",
  },
  {
    mes: "Marzo 2026",
    valor: "$450.000",
    vencimiento: "15 mar 2026",
    estado: "Pagado",
  },
  {
    mes: "Febrero 2026",
    valor: "$430.000",
    vencimiento: "15 feb 2026",
    estado: "Pagado",
  },
  {
    mes: "Enero 2026",
    valor: "$430.000",
    vencimiento: "15 ene 2026",
    estado: "Pagado",
  },
];

const estadoColor: Record<string, "default" | "secondary" | "outline"> = {
  Pendiente: "default",
  Pagado: "secondary",
  Vencido: "outline",
};

export default function FinanzasPage() {
  return (
    <div className="mx-auto max-w-md p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Mis Recibos</h1>
        <p className="text-muted-foreground text-sm">
          Historial de cuotas de administracion
        </p>
      </header>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Resumen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">$0</p>
              <p className="text-muted-foreground text-xs">Saldo a favor</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">$450.000</p>
              <p className="text-muted-foreground text-xs">Pendiente</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {recibos.map((recibo) => (
          <Card key={recibo.mes}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium">{recibo.mes}</p>
                <p className="text-muted-foreground text-xs">
                  Vence: {recibo.vencimiento}
                </p>
                <p className="mt-1 text-base font-semibold">{recibo.valor}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge variant={estadoColor[recibo.estado]}>
                  {recibo.estado}
                </Badge>
                {recibo.estado === "Pendiente" && (
                  <Button size="sm" variant="outline">
                    Pagar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
