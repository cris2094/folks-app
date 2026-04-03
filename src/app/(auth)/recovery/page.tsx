import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RecoveryPage() {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Recuperar contrasena</CardTitle>
        <p className="text-muted-foreground text-sm">
          Ingresa tu correo y te enviaremos un enlace para restablecer tu
          contrasena
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <form className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="email">Correo electronico</Label>
            <Input id="email" type="email" placeholder="tu@correo.com" />
          </div>
          <Button className="w-full" type="submit">
            Enviar enlace
          </Button>
        </form>
        <p className="text-muted-foreground text-center text-xs">
          <a href="/login" className="text-primary underline">
            Volver al inicio de sesion
          </a>
        </p>
      </CardContent>
    </Card>
  );
}
