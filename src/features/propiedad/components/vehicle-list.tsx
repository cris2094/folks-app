import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car } from "lucide-react";

interface Vehicle {
  id: string;
  plate: string;
  type: string;
  color: string | null;
  brand: string | null;
  parking_spot: string | null;
}

export function VehicleList({ vehicles }: { vehicles: Vehicle[] }) {
  if (vehicles.length === 0) {
    return (
      <p className="text-muted-foreground py-4 text-center text-sm">
        No hay vehiculos registrados
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {vehicles.map((v) => (
        <Card key={v.id}>
          <CardContent className="flex items-center justify-between p-3">
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">{v.plate}</p>
                <p className="text-muted-foreground text-xs">
                  {v.brand} {v.color ? `· ${v.color}` : ""}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {v.parking_spot && (
                <span className="text-muted-foreground text-xs">P: {v.parking_spot}</span>
              )}
              <Badge variant="outline" className="text-xs capitalize">
                {v.type === "car" ? "Auto" : v.type === "motorcycle" ? "Moto" : "Bici"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
