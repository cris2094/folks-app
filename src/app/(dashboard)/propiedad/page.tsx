import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const propiedades = [
  {
    unidad: "Apto 301",
    torre: "Torre A",
    tipo: "Apartamento",
    area: "72 m2",
    estado: "Al dia",
  },
  {
    unidad: "Parqueadero 15",
    torre: "Sotano 1",
    tipo: "Parqueadero",
    area: "12 m2",
    estado: "Al dia",
  },
];

export default function PropiedadPage() {
  return (
    <div className="mx-auto max-w-md p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Mi Propiedad</h1>
        <p className="text-muted-foreground text-sm">
          Unidades asociadas a tu cuenta
        </p>
      </header>

      <div className="space-y-3">
        {propiedades.map((prop) => (
          <Card key={prop.unidad}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{prop.unidad}</CardTitle>
                <Badge variant="secondary">{prop.estado}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground grid grid-cols-2 gap-1 text-sm">
                <span>Torre: {prop.torre}</span>
                <span>Tipo: {prop.tipo}</span>
                <span>Area: {prop.area}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
