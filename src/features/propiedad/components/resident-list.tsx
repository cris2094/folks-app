import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Phone, Mail } from "lucide-react";

interface Resident {
  id: string;
  full_name: string;
  document_type: string;
  document_number: string;
  email: string | null;
  phone: string | null;
  role: string;
  is_owner: boolean;
}

export function ResidentList({ residents }: { residents: Resident[] }) {
  if (residents.length === 0) {
    return (
      <p className="text-muted-foreground py-4 text-center text-sm">
        No hay residentes vinculados
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {residents.map((r) => (
        <Card key={r.id}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">{r.full_name}</p>
                  <p className="text-muted-foreground text-xs">
                    {r.document_type.toUpperCase()} {r.document_number}
                  </p>
                </div>
              </div>
              <Badge variant={r.is_owner ? "default" : "outline"} className="text-xs">
                {r.is_owner ? "Propietario" : r.role}
              </Badge>
            </div>
            <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
              {r.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" /> {r.phone}
                </span>
              )}
              {r.email && (
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" /> {r.email}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
