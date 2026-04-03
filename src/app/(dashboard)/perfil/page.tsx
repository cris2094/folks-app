import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const usuario = {
  nombre: "Cristhian Duran",
  email: "cristhian@ejemplo.com",
  telefono: "+57 300 123 4567",
  documento: "CC 1.234.567.890",
  rol: "Propietario",
  conjunto: "Conjunto Residencial Los Pinos",
  unidad: "Apto 301 - Torre A",
  desde: "Enero 2024",
};

export default function PerfilPage() {
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
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-2xl">
              👤
            </div>
            <div>
              <CardTitle className="text-base">{usuario.nombre}</CardTitle>
              <Badge variant="secondary">{usuario.rol}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Separator />
          <div className="space-y-2">
            <InfoRow label="Correo" value={usuario.email} />
            <InfoRow label="Telefono" value={usuario.telefono} />
            <InfoRow label="Documento" value={usuario.documento} />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Conjunto Residencial</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <InfoRow label="Nombre" value={usuario.conjunto} />
          <InfoRow label="Unidad" value={usuario.unidad} />
          <InfoRow label="Residente desde" value={usuario.desde} />
        </CardContent>
      </Card>

      <div className="space-y-2">
        <Button variant="outline" className="w-full">
          Editar perfil
        </Button>
        <Button variant="outline" className="w-full text-red-600">
          Cerrar sesion
        </Button>
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
