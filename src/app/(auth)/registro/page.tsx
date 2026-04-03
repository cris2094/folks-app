import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function RegistroPage() {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Crear cuenta</CardTitle>
        <p className="text-muted-foreground text-sm">
          Registrate para acceder a tu conjunto
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button variant="outline" className="w-full">
          Registrarse con Google
        </Button>
        <div className="flex items-center gap-2">
          <Separator className="flex-1" />
          <span className="text-muted-foreground text-xs">o</span>
          <Separator className="flex-1" />
        </div>
        <form className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="name">Nombre completo</Label>
            <Input id="name" type="text" placeholder="Tu nombre" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Correo electronico</Label>
            <Input id="email" type="email" placeholder="tu@correo.com" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Contrasena</Label>
            <Input id="password" type="password" placeholder="Minimo 8 caracteres" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="confirm-password">Confirmar contrasena</Label>
            <Input id="confirm-password" type="password" />
          </div>
          <Button className="w-full" type="submit">
            Crear cuenta
          </Button>
        </form>
        <p className="text-muted-foreground text-center text-xs">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="text-primary underline">
            Inicia sesion
          </a>
        </p>
      </CardContent>
    </Card>
  );
}
