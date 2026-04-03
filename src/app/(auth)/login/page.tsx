import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { loginWithEmail, loginWithGoogle } from "@/features/auth/actions/login";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Bienvenido a Folks</CardTitle>
        <p className="text-muted-foreground text-sm">
          Ingresa a tu conjunto residencial
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <p className="rounded-md bg-red-50 p-3 text-center text-sm text-red-600">
            {error}
          </p>
        )}
        <form action={loginWithGoogle}>
          <Button variant="outline" className="w-full" type="submit">
            Continuar con Google
          </Button>
        </form>
        <div className="flex items-center gap-2">
          <Separator className="flex-1" />
          <span className="text-muted-foreground text-xs">o</span>
          <Separator className="flex-1" />
        </div>
        <form action={loginWithEmail} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="email">Correo electronico</Label>
            <Input id="email" name="email" type="email" placeholder="tu@correo.com" required />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Contrasena</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          <Button className="w-full" type="submit">
            Iniciar sesion
          </Button>
        </form>
        <div className="flex items-center justify-between text-xs">
          <Link href="/recovery" className="text-primary underline">
            Olvidaste tu contrasena?
          </Link>
          <p className="text-muted-foreground">
            No tienes cuenta?{" "}
            <Link href="/registro" className="text-primary underline">
              Registrate
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
