import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F7]">
      {/* Top branding */}
      <div className="flex flex-col items-center pt-16 pb-6">
        <div className="shadow-apple rounded-3xl overflow-hidden">
          <Image
            src="/images/irawa-logo.jpg"
            alt="Irawa"
            width={100}
            height={100}
            className="h-[100px] w-[100px] object-cover"
            priority
          />
        </div>
        <h1 className="mt-5 text-[26px] text-apple-title text-gray-900 text-center">
          Bienvenido a su Copropiedad
        </h1>
        <p className="mt-1.5 text-[15px] text-gray-400 text-center tracking-tight">
          Inicie sesion para continuar
        </p>
      </div>
      {/* Content card */}
      <div className="flex-1 px-5 pb-8">
        <div className="mx-auto w-full max-w-sm rounded-[28px] bg-white p-7 shadow-apple">
          {children}
        </div>
      </div>
    </div>
  );
}
