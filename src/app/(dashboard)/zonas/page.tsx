import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const zonas = [
  {
    nombre: "Salon Comunal",
    icon: "🏠",
    color: "bg-blue-50",
    disponible: true,
    horario: "8:00 AM - 10:00 PM",
  },
  {
    nombre: "Piscina",
    icon: "🏊",
    color: "bg-cyan-50",
    disponible: true,
    horario: "6:00 AM - 8:00 PM",
  },
  {
    nombre: "Gimnasio",
    icon: "🏋️",
    color: "bg-orange-50",
    disponible: false,
    horario: "5:00 AM - 10:00 PM",
  },
  {
    nombre: "BBQ",
    icon: "🔥",
    color: "bg-red-50",
    disponible: true,
    horario: "10:00 AM - 9:00 PM",
  },
  {
    nombre: "Cancha Multiple",
    icon: "⚽",
    color: "bg-green-50",
    disponible: true,
    horario: "6:00 AM - 9:00 PM",
  },
  {
    nombre: "Salon de Juegos",
    icon: "🎮",
    color: "bg-purple-50",
    disponible: false,
    horario: "9:00 AM - 8:00 PM",
  },
];

export default function ZonasPage() {
  return (
    <div className="mx-auto max-w-md p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Zonas Sociales</h1>
        <p className="text-muted-foreground text-sm">
          Reserva las zonas comunes de tu conjunto
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3">
        {zonas.map((zona) => (
          <Card key={zona.nombre} className="transition-shadow hover:shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${zona.color} text-xl`}
                >
                  {zona.icon}
                </div>
                <Badge variant={zona.disponible ? "secondary" : "outline"}>
                  {zona.disponible ? "Disponible" : "No disponible"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="mb-1 text-sm">{zona.nombre}</CardTitle>
              <p className="text-muted-foreground mb-3 text-xs">
                {zona.horario}
              </p>
              <Button
                size="sm"
                className="w-full"
                disabled={!zona.disponible}
              >
                Reservar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
