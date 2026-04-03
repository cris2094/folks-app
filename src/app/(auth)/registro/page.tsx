import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { registerWithEmail } from "@/features/auth/actions/registro";
import { loginWithGoogle } from "@/features/auth/actions/login";

export default async function RegistroPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const { error, success } = await searchParams;

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Crear cuenta</CardTitle>
        <p className="text-muted-foreground text-sm">
          Registrate para acceder a tu conjunto
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <p className="rounded-md bg-red-50 p-3 text-center text-sm text-red-600">
            {error}
          </p>
        )}
        {success && (
          <p className="rounded-md bg-green-50 p-3 text-center text-sm text-green-600">
            Revisa tu correo para confirmar tu cuenta.
          </p>
        )}
        <form action={loginWithGoogle}>
          <Button variant="outline" className="w-full" type="submit">
            Registrarse con Google
          </Button>
        </form>
        <div className="flex items-center gap-2">
          <Separator className="flex-1" />
          <span className="text-muted-foreground text-xs">o</span>
          <Separator className="flex-1" />
        </div>
        <form action={registerWithEmail} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="fullName">Nombre completo</Label>
            <Input id="fullName" name="fullName" type="text" placeholder="Tu nombre" required />
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Correo electronico</Label>
            <Input id="email" name="email" type="email" placeholder="tu@correo.com" required />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Contrasena</Label>
            <Input id="password" name="password" type="password" placeholder="Minimo 8 caracteres" required />
          </div>
          <div className="space-y-1">
            <Label htmlFor="confirmPassword">Confirmar contrasena</Label>
            <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="Repite tu contrasena" required />
          </div>
          <Button className="w-full" type="submit">
            Crear cuenta
          </Button>
        </form>
        <p className="text-muted-foreground text-center text-xs">
          Ya tienes cuenta?{" "}
          <Link href="/login" className="text-primary underline">
            Inicia sesion
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
