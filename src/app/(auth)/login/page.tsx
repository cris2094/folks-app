import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Bienvenido a Folks</CardTitle>
        <p className="text-muted-foreground text-sm">
          Ingresa a tu conjunto residencial
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button variant="outline" className="w-full">
          Continuar con Google
        </Button>
        <div className="flex items-center gap-2">
          <Separator className="flex-1" />
          <span className="text-muted-foreground text-xs">o</span>
          <Separator className="flex-1" />
        </div>
        <form className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="email">Correo electronico</Label>
            <Input id="email" type="email" placeholder="tu@correo.com" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Contrasena</Label>
            <Input id="password" type="password" />
          </div>
          <Button className="w-full" type="submit">
            Iniciar sesion
          </Button>
        </form>
        <p className="text-muted-foreground text-center text-xs">
          ¿No tienes cuenta?{" "}
          <a href="/registro" className="text-primary underline">
            Registrate
          </a>
        </p>
      </CardContent>
    </Card>
  );
}
