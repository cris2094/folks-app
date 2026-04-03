import { Bot } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
      {/* Top branding */}
      <div className="flex flex-col items-center pt-12 pb-8">
        <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
          <Bot className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white">Folks</h1>
        <p className="text-blue-200 text-sm">Gestion de tu conjunto</p>
      </div>
      {/* Card container */}
      <div className="flex-1 rounded-t-3xl bg-white px-4 pt-8 pb-8">
        <div className="mx-auto w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
