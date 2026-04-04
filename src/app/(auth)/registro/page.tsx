import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { loginWithGoogle } from "@/features/auth/actions/login";
import { RegistroForm } from "./registro-form";

export default async function RegistroPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const { error, success } = await searchParams;

  return (
    <div className="mx-auto w-full max-w-sm space-y-5">
      <div className="rounded-3xl bg-white/90 backdrop-blur-xl px-6 py-6 shadow-apple-lg">
        <div className="text-center mb-5">
          <h2 className="text-xl font-bold text-gray-900">Crear cuenta</h2>
          <p className="text-gray-400 mt-1 text-sm">
            Registrate para acceder a tu conjunto
          </p>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 p-3 text-center text-sm text-red-600 mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-xl bg-green-50 p-3 text-center text-sm text-green-600 mb-4">
            Revisa tu correo para confirmar tu cuenta.
          </div>
        )}

        <form action={loginWithGoogle}>
          <Button
            variant="outline"
            className="w-full h-12 rounded-xl font-medium"
            type="submit"
          >
            Registrarse con Google
          </Button>
        </form>

        <div className="flex items-center gap-3 my-4">
          <Separator className="flex-1" />
          <span className="text-gray-400 text-xs">o con email</span>
          <Separator className="flex-1" />
        </div>

        <RegistroForm />
      </div>

      <p className="text-gray-400 text-center text-sm">
        Ya tienes cuenta?{" "}
        <Link href="/login" className="font-medium text-gray-900 hover:underline">
          Inicia sesion
        </Link>
      </p>
    </div>
  );
}
