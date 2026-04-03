"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  ScanFace,
  ChevronRight,
  LayoutGrid,
  Phone,
  Package,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { loginWithEmail } from "@/features/auth/actions/login";

export function LoginForm({ error }: { error?: string }) {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  return (
    <div className="space-y-7">
      {error && (
        <div className="rounded-xl bg-red-50 p-3 text-center text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Login Form */}
      <form action={loginWithEmail} className="space-y-3.5">
        {/* Email / Document input */}
        <input
          name="email"
          type="text"
          placeholder="Correo electronico o Documento"
          required
          className="h-12 w-full rounded-xl border border-gray-100 bg-[#F9F9F9] px-4 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
        />

        {/* Password input */}
        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Contrasena"
            required
            className="h-12 w-full rounded-xl border border-gray-100 bg-[#F9F9F9] px-4 pr-12 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Remember me + Forgot password row */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-green-500 accent-green-500"
            />
            <span className="text-sm text-gray-600">Recordarme</span>
          </label>
          <Link
            href="/recovery"
            className="text-sm font-medium text-amber-600 hover:underline"
          >
            Olvido su clave?
          </Link>
        </div>

        {/* Submit button row */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="h-12 flex-1 rounded-2xl bg-gray-900 text-sm font-semibold text-white shadow-apple-sm transition-colors hover:bg-gray-800 active:bg-black"
          >
            Ingresar
          </button>
          <button
            type="button"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gray-100 bg-[#F9F9F9] text-gray-500 shadow-apple-sm transition-colors hover:bg-gray-100"
            aria-label="Ingreso biometrico"
          >
            <ScanFace className="h-5 w-5" />
          </button>
        </div>
      </form>

      {/* Separator */}
      <div className="border-t border-gray-100" />

      {/* Virtual assistant card */}
      <button
        type="button"
        className="flex w-full items-center gap-3 rounded-[20px] bg-[#F0FAF0] p-4 text-left transition-colors hover:bg-green-100/60"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500">
          <MessageCircle className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-gray-900">
            Necesita ayuda para entrar?
          </p>
          <p className="text-sm leading-snug text-gray-600">
            Toque aqui para hablar o escribir con el asistente virtual Irawa.
          </p>
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 text-gray-400" />
      </button>

      {/* Quick access section */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400 mt-6">
          ACCESOS RAPIDOS
        </p>
        <div className="grid grid-cols-4 gap-3">
          <QuickAccessButton
            icon={<LayoutGrid className="h-6 w-6 text-white" />}
            label="Pase Visitas"
            bgColor="bg-blue-500"
          />
          <QuickAccessButton
            icon={<Phone className="h-6 w-6 text-white" />}
            label="Llamar Porteria"
            bgColor="bg-green-500"
          />
          <QuickAccessButton
            icon={<Package className="h-6 w-6 text-white" />}
            label="Mis Paquetes"
            bgColor="bg-amber-500"
          />
          <QuickAccessButton
            label="SOS Ayuda"
            bgColor="bg-red-500"
            isSOS
          />
        </div>
      </div>

      {/* Footer */}
      <p className="mt-8 text-center text-xs tracking-wider text-gray-300">
        Potenciado por Folks
      </p>
    </div>
  );
}

function QuickAccessButton({
  icon,
  label,
  bgColor,
  isSOS = false,
}: {
  icon?: React.ReactNode;
  label: string;
  bgColor: string;
  isSOS?: boolean;
}) {
  return (
    <button
      type="button"
      className="flex flex-col items-center gap-1.5"
    >
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-[18px] shadow-apple-sm ${bgColor}`}
      >
        {isSOS ? (
          <span className="text-sm font-bold text-white">SOS</span>
        ) : (
          icon
        )}
      </div>
      <span className="text-[10px] text-gray-500 leading-tight text-center">
        {label}
      </span>
    </button>
  );
}
