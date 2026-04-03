import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const tickets = [
  {
    id: "PQR-001",
    titulo: "Filtracion en techo del parqueadero",
    tipo: "Queja",
    estado: "Abierto",
    fecha: "1 abr 2026",
    prioridad: "Alta",
  },
  {
    id: "PQR-002",
    titulo: "Solicitud de fumigacion en areas comunes",
    tipo: "Peticion",
    estado: "En proceso",
    fecha: "28 mar 2026",
    prioridad: "Media",
  },
  {
    id: "PQR-003",
    titulo: "Ruido excesivo piso superior",
    tipo: "Reclamo",
    estado: "Cerrado",
    fecha: "20 mar 2026",
    prioridad: "Baja",
  },
];

const estadoColor: Record<string, "default" | "secondary" | "outline"> = {
  Abierto: "default",
  "En proceso": "secondary",
  Cerrado: "outline",
};

export default function PqrPage() {
  return (
    <div className="mx-auto max-w-md p-4">
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">PQR</h1>
            <p className="text-muted-foreground text-sm">
              Peticiones, quejas y reclamos
            </p>
          </div>
          <Button size="sm">Nuevo PQR</Button>
        </div>
      </header>

      <div className="space-y-3">
        {tickets.map((ticket) => (
          <Card key={ticket.id}>
            <CardContent className="p-4">
              <div className="mb-2 flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium">{ticket.titulo}</p>
                  <p className="text-muted-foreground text-xs">
                    {ticket.id} - {ticket.fecha}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={estadoColor[ticket.estado]}>
                  {ticket.estado}
                </Badge>
                <Badge variant="outline">{ticket.tipo}</Badge>
                <Badge variant="outline">{ticket.prioridad}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
