import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Top branding */}
      <div className="flex flex-col items-center pt-12 pb-8">
        <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-2xl">
          <Image
            src="/images/irawa-logo.jpg"
            alt="Irawa"
            width={80}
            height={80}
            className="rounded-2xl"
          />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Folks</h1>
        <p className="text-sm text-muted-foreground">
          Gestión Residencial Inteligente
        </p>
      </div>
      {/* Card container */}
      <div className="flex-1 rounded-t-3xl bg-white px-4 pt-8 pb-8 shadow-sm">
        <div className="mx-auto w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
