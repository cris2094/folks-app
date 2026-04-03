import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Car } from "lucide-react";
import Link from "next/link";

interface UnitCardProps {
  unitId: string;
  tower: string;
  apartment: string;
  isOwner: boolean;
  adminFee: number;
  parkingSpot: string | null;
}

export function UnitCard({ unitId, tower, apartment, isOwner, adminFee, parkingSpot }: UnitCardProps) {
  return (
    <Link href={`/propiedad/${unitId}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold">{tower} - Apto {apartment}</p>
                <p className="text-muted-foreground text-sm">
                  Cuota: ${adminFee.toLocaleString("es-CO")} COP
                </p>
              </div>
            </div>
            <Badge variant={isOwner ? "default" : "secondary"}>
              {isOwner ? "Propietario" : "Arrendatario"}
            </Badge>
          </div>
          {parkingSpot && (
            <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
              <Car className="h-3 w-3" />
              Parqueadero: {parkingSpot}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
