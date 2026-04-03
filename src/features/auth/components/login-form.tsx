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
  AlertTriangle,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { loginWithEmail } from "@/features/auth/actions/login";

export function LoginForm({ error }: { error?: string }) {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-2xl bg-red-50 p-3 text-center text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Login Form */}
      <form action={loginWithEmail} className="space-y-4">
        {/* Email / Document input */}
        <input
          name="email"
          type="text"
          placeholder="Correo electrónico o Documento"
          required
          className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
        />

        {/* Password input */}
        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            required
            className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 pr-12 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
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
              className="h-4 w-4 rounded border-gray-300 text-amber-600 accent-amber-600"
            />
            <span className="text-sm text-gray-600">Recordarme</span>
          </label>
          <Link
            href="/recovery"
            className="text-sm font-medium text-amber-600 hover:underline"
          >
            ¿Olvidó su clave?
          </Link>
        </div>

        {/* Submit button row */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="flex-1 h-12 rounded-2xl bg-gray-900 text-sm font-semibold text-white transition-colors hover:bg-gray-800 active:bg-black"
          >
            Ingresar
          </button>
          <button
            type="button"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50"
            aria-label="Ingreso biométrico"
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
        className="flex w-full items-center gap-3 rounded-2xl bg-green-50/70 p-4 text-left transition-colors hover:bg-green-50"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500">
          <MessageCircle className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900">
            ¿Necesita ayuda para entrar?
          </p>
          <p className="text-xs text-gray-500 leading-snug">
            Toque aquí para hablar o escribir con el asistente virtual Irawa.
          </p>
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 text-gray-400" />
      </button>

      {/* Quick access section */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Accesos Rápidos
        </p>
        <div className="grid grid-cols-4 gap-3">
          <QuickAccessButton
            icon={<LayoutGrid className="h-5 w-5 text-blue-600" />}
            label="Pase Visitas"
            bgColor="bg-blue-100"
          />
          <QuickAccessButton
            icon={<Phone className="h-5 w-5 text-green-600" />}
            label="Llamar Portería"
            bgColor="bg-green-100"
          />
          <QuickAccessButton
            icon={<Package className="h-5 w-5 text-amber-600" />}
            label="Mis Paquetes"
            bgColor="bg-amber-100"
          />
          <QuickAccessButton
            icon={<AlertTriangle className="h-5 w-5 text-red-600" />}
            label="SOS Ayuda"
            bgColor="bg-red-100"
          />
        </div>
      </div>

      {/* Footer */}
      <p className="pt-2 text-center text-xs text-gray-300">
        Potenciado por Folks
      </p>
    </div>
  );
}

function QuickAccessButton({
  icon,
  label,
  bgColor,
}: {
  icon: React.ReactNode;
  label: string;
  bgColor: string;
}) {
  return (
    <button
      type="button"
      className="flex flex-col items-center gap-2 rounded-2xl bg-white border border-gray-100 p-3 transition-colors hover:bg-gray-50"
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${bgColor}`}
      >
        {icon}
      </div>
      <span className="text-[11px] font-medium text-gray-700 leading-tight text-center">
        {label}
      </span>
    </button>
  );
}
