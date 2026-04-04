import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Background image with blur */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/building-bg.jpg"
          alt=""
          fill
          className="object-cover blur-[2px] scale-105"
          priority
        />
        {/* Semi-transparent overlay for readability */}
        <div className="absolute inset-0 bg-white/40" />
      </div>

      {/* Content over background */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Top branding */}
        <div className="flex flex-col items-center pt-14 pb-5">
          <div className="shadow-apple-lg rounded-2xl overflow-hidden">
            <Image
              src="/images/irawa-logo.jpg"
              alt="Irawa"
              width={96}
              height={96}
              className="h-24 w-24 object-cover"
              priority
            />
          </div>
          <h1 className="mt-5 text-[28px] text-apple-title text-gray-900 text-center">
            Bienvenido a casa
          </h1>
          <p className="mt-1 text-[15px] text-gray-400 text-center">
            Copropiedad Inteligente
          </p>
        </div>

        {/* Content card */}
        <div className="flex-1 px-5 pb-8">
          {children}
        </div>
      </div>
    </div>
  );
}
