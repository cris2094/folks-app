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
    <div className="mx-auto w-full max-w-sm space-y-6">
      <Link
        href="/login"
        className="inline-flex min-h-[44px] items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Volver
      </Link>

      <div className="rounded-3xl bg-white/90 backdrop-blur-xl px-6 py-6 shadow-apple-lg">
        <div className="text-center mb-5">
          <h2 className="text-xl font-bold text-gray-900">
            Recuperar contrasena
          </h2>
          <p className="text-gray-400 mt-1 text-sm">
            Te enviaremos un enlace a tu correo
          </p>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 p-3 text-center text-sm text-red-600 mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-xl bg-green-50 p-3 text-center text-sm text-green-600 mb-4">
            Revisa tu correo para restablecer tu contrasena.
          </div>
        )}

        <form action={resetPassword} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Correo electronico
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="tu@correo.com"
              required
              className="h-12 rounded-xl border-gray-100 bg-[#F9F9FB]"
            />
          </div>
          <Button
            className="w-full h-14 rounded-2xl bg-gradient-to-b from-gray-800 to-gray-900 font-semibold text-white shadow-apple hover:from-gray-700 hover:to-gray-800 active:scale-[0.98] transition-all duration-200"
            type="submit"
          >
            Enviar enlace
          </Button>
        </form>
      </div>
    </div>
  );
}
