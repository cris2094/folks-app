import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Top branding */}
      <div className="flex flex-col items-center pt-12 pb-4">
        <Image
          src="/images/irawa-logo.jpg"
          alt="Irawa"
          width={80}
          height={80}
          className="h-20 w-20 rounded-2xl object-cover"
          priority
        />
        <h1 className="mt-4 text-2xl font-bold text-gray-900 text-center">
          Bienvenido a su Copropiedad
        </h1>
        <p className="mt-1 text-sm text-gray-500 text-center">
          Inicie sesión para continuar
        </p>
      </div>
      {/* Content */}
      <div className="flex-1 px-6 pb-8">
        <div className="mx-auto w-full max-w-sm rounded-3xl bg-white p-6 shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
