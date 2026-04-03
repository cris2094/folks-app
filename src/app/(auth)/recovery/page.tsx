import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { resetPassword } from "@/features/auth/actions/recovery";

export default async function RecoveryPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const { error, success } = await searchParams;

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
        {error && (
          <p className="rounded-md bg-red-50 p-3 text-center text-sm text-red-600">
            {error}
          </p>
        )}
        {success && (
          <p className="rounded-md bg-green-50 p-3 text-center text-sm text-green-600">
            Revisa tu correo para restablecer tu contrasena.
          </p>
        )}
        <form action={resetPassword} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="email">Correo electronico</Label>
            <Input id="email" name="email" type="email" placeholder="tu@correo.com" required />
          </div>
          <Button className="w-full" type="submit">
            Enviar enlace
          </Button>
        </form>
        <p className="text-muted-foreground text-center text-xs">
          <Link href="/login" className="text-primary underline">
            Volver al inicio de sesion
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
