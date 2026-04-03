import { Building2 } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Top branding */}
      <div className="flex flex-col items-center pt-12 pb-6">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100">
          <Building2 className="h-8 w-8 text-amber-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenido a su Copropiedad
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Inicie sesión para continuar
        </p>
      </div>
      {/* Content */}
      <div className="flex-1 px-6 pb-8">
        <div className="mx-auto w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
