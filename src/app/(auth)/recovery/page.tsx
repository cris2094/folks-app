import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { resetPassword } from "@/features/auth/actions/recovery";

export default async function RecoveryPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const { error, success } = await searchParams;

  return (
    <div className="space-y-6">
      <Link
        href="/login"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="h-4 w-4" /> Volver
      </Link>

      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900">
          Recuperar contrasena
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Te enviaremos un enlace a tu correo
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 p-3 text-center text-sm text-red-600">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl bg-green-50 p-3 text-center text-sm text-green-600">
          Revisa tu correo para restablecer tu contrasena.
        </div>
      )}

      <form action={resetPassword} className="space-y-4">
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
        <Button
          className="w-full h-11 rounded-xl bg-blue-600 font-medium hover:bg-blue-700"
          type="submit"
        >
          Enviar enlace
        </Button>
      </form>
    </div>
  );
}
