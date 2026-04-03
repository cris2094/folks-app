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
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900">Crear cuenta</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Registrate para acceder a tu conjunto
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 p-3 text-center text-sm text-red-600">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl bg-green-50 p-3 text-center text-sm text-green-600">
          Revisa tu correo para confirmar tu cuenta.
        </div>
      )}

      <form action={loginWithGoogle}>
        <Button
          variant="outline"
          className="w-full h-11 rounded-xl font-medium"
          type="submit"
        >
          Registrarse con Google
        </Button>
      </form>

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-muted-foreground text-xs">o con email</span>
        <Separator className="flex-1" />
      </div>

      <form action={registerWithEmail} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Nombre completo</Label>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Tu nombre"
            required
            className="h-11 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Correo electronico</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="tu@correo.com"
            required
            className="h-11 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Contrasena</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Minimo 8 caracteres"
            required
            className="h-11 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar contrasena</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Repite tu contrasena"
            required
            className="h-11 rounded-xl"
          />
        </div>
        <Button
          className="w-full h-11 rounded-xl bg-blue-600 font-medium hover:bg-blue-700"
          type="submit"
        >
          Crear cuenta
        </Button>
      </form>

      <p className="text-muted-foreground text-center text-sm">
        Ya tienes cuenta?{" "}
        <Link href="/login" className="font-medium text-blue-600 hover:underline">
          Inicia sesion
        </Link>
      </p>
    </div>
  );
}
