import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Mail } from "lucide-react";
import Link from "next/link";
import { loginWithEmail, loginWithGoogle } from "@/features/auth/actions/login";
import { PasswordInput } from "@/features/auth/components/password-input";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900">Iniciar Sesion</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Ingresa a tu conjunto residencial
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 p-3 text-center text-sm text-red-600">
          {error}
        </div>
      )}

      <form action={loginWithGoogle}>
        <Button
          variant="outline"
          className="w-full h-11 rounded-xl font-medium"
          type="submit"
        >
          <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continuar con Google
        </Button>
      </form>

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-gray-300">o con email</span>
        <Separator className="flex-1" />
      </div>

      <form action={loginWithEmail} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Correo electronico</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              id="email"
              name="email"
              type="email"
              placeholder="tu@correo.com"
              required
              className="h-11 w-full rounded-xl border border-input bg-transparent pl-10 pr-3 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Contrasena</Label>
            <Link
              href="/recovery"
              className="text-xs text-amber-600 hover:underline"
            >
              Olvidaste tu contrasena?
            </Link>
          </div>
          <PasswordInput id="password" name="password" required />
        </div>
        <Button
          className="w-full h-12 rounded-xl bg-amber-600 font-semibold text-base hover:bg-amber-700 shadow-md shadow-amber-600/25 transition-all hover:shadow-lg hover:shadow-amber-600/30"
          type="submit"
        >
          Ingresar
        </Button>
      </form>

      <p className="text-muted-foreground text-center text-sm">
        No tienes cuenta?{" "}
        <Link href="/registro" className="font-medium text-amber-600 hover:underline">
          Registrate
        </Link>
      </p>
    </div>
  );
}
