import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PawPrint } from "lucide-react";

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  vaccination_up_to_date: boolean;
}

export function PetList({ pets }: { pets: Pet[] }) {
  if (pets.length === 0) {
    return (
      <p className="text-muted-foreground py-4 text-center text-sm">
        No hay mascotas registradas
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {pets.map((p) => (
        <Card key={p.id}>
          <CardContent className="flex items-center justify-between p-3">
            <div className="flex items-center gap-2">
              <PawPrint className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">{p.name}</p>
                <p className="text-muted-foreground text-xs">
                  {p.species === "dog" ? "Perro" : p.species === "cat" ? "Gato" : "Otro"}
                  {p.breed ? ` · ${p.breed}` : ""}
                </p>
              </div>
            </div>
            <Badge variant={p.vaccination_up_to_date ? "default" : "destructive"} className="text-xs">
              {p.vaccination_up_to_date ? "Vacunado" : "Sin vacunas"}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
