import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User } from "lucide-react";
import { getCurrentUser } from "@/features/auth/queries/get-current-user";
import { logout } from "@/features/auth/actions/logout";

export default async function PerfilPage() {
  const data = await getCurrentUser();
  const resident = data?.resident as Record<string, unknown> | null;
  const unit = resident?.unit as { tower: string; apartment: string } | null;
  const tenant = resident?.tenant as { name: string } | null;

  return (
    <div className="mx-auto max-w-md p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Mi Perfil</h1>
        <p className="text-muted-foreground text-sm">
          Informacion de tu cuenta
        </p>
      </header>

      <Card className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
              <User className="h-7 w-7 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-base">
                {(resident?.full_name as string) ?? data?.user?.email ?? "Usuario"}
              </CardTitle>
              <Badge variant="secondary">
                {(resident?.is_owner as boolean) ? "Propietario" : (resident?.role as string) ?? "Residente"}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Separator />
          <div className="space-y-2">
            <InfoRow
              label="Correo"
              value={(resident?.email as string) ?? data?.user?.email ?? "-"}
            />
            <InfoRow
              label="Telefono"
              value={(resident?.phone as string) ?? "-"}
            />
            <InfoRow
              label="Documento"
              value={
                resident
                  ? `${(resident.document_type as string)?.toUpperCase()} ${resident.document_number as string}`
                  : "-"
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Conjunto Residencial</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <InfoRow label="Nombre" value={tenant?.name ?? "-"} />
          <InfoRow
            label="Unidad"
            value={
              unit ? `${unit.tower} - Apto ${unit.apartment}` : "Sin vincular"
            }
          />
        </CardContent>
      </Card>

      <div className="space-y-2">
        <form action={logout}>
          <Button variant="outline" className="w-full text-red-600" type="submit">
            Cerrar sesion
          </Button>
        </form>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
