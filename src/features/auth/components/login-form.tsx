"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  QrCode,
  AlertCircle,
  PhoneCall,
} from "lucide-react";
import Link from "next/link";
import { loginWithEmail, loginWithGoogle } from "@/features/auth/actions/login";
import { BiometricButton } from "@/features/auth/components/biometric-button";
import {
  FadeIn,
  FadeInUp,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion";

export function LoginForm({ error }: { error?: string }) {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  return (
    <div className="space-y-5">
      {error && (
        <div className="rounded-xl bg-red-50 p-3 text-center text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Login Card -- glassmorphism: translucent white with blur */}
      <FadeInUp delay={0.2}>
        <div className="mx-auto w-full max-w-sm rounded-3xl bg-white/90 backdrop-blur-xl px-6 py-6 shadow-apple-lg">
          <form action={loginWithEmail} className="space-y-3.5">
            {/* Email field */}
            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                Correo Electr&oacute;nico
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-300" />
                <input
                  name="email"
                  type="email"
                  placeholder="tu@apartamento.com"
                  required
                  autoComplete="email"
                  className="h-12 w-full rounded-xl border border-gray-100 bg-[#F9F9FB] pl-12 pr-4 text-sm text-gray-900 outline-none placeholder:text-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-shadow"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                Contrase&ntilde;a
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-300" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="h-12 w-full rounded-xl border border-gray-100 bg-[#F9F9FB] pl-12 pr-12 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-shadow"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition-colors"
                  aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
                >
                  {showPassword ? (
                    <EyeOff className="h-[18px] w-[18px]" />
                  ) : (
                    <Eye className="h-[18px] w-[18px]" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me + Forgot password row */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
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
                className="min-h-[44px] flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                &iquest;Olvidaste la clave?
              </Link>
            </div>

            {/* Submit button row */}
            <div className="flex items-center gap-3 pt-0.5">
              <button
                type="submit"
                className="h-14 flex-1 cursor-pointer rounded-2xl bg-gradient-to-b from-gray-800 to-gray-900 text-base font-semibold text-white shadow-apple transition-all duration-200 hover:from-gray-700 hover:to-gray-800 active:from-gray-900 active:to-black active:scale-[0.98]"
              >
                Ingresar
              </button>
              <BiometricButton />
            </div>
          </form>

          {/* Divider */}
          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-[11px] font-medium text-gray-400">o continuar con</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Google OAuth */}
          <form action={loginWithGoogle}>
            <button
              type="submit"
              className="flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 active:scale-[0.98]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continuar con Google
            </button>
          </form>
        </div>
      </FadeInUp>

      {/* Quick access section */}
      <FadeIn delay={0.35}>
        <div className="mx-auto w-full max-w-sm">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">
            Accesos R&aacute;pidos
          </p>
          <StaggerContainer className="grid grid-cols-3 gap-3" staggerDelay={0.07}>
            <StaggerItem>
              <QuickAccessButton
                icon={<QrCode className="h-7 w-7 text-blue-500" />}
                label="Pase de Visita"
                bgColor="bg-blue-50"
              />
            </StaggerItem>
            <StaggerItem>
              <QuickAccessButton
                icon={<AlertCircle className="h-7 w-7 text-red-500" />}
                label="Reportar Emergencia"
                bgColor="bg-red-50"
              />
            </StaggerItem>
            <StaggerItem>
              <QuickAccessButton
                icon={<PhoneCall className="h-7 w-7 text-green-500" />}
                label="Llamar a Porteria"
                bgColor="bg-green-50"
              />
            </StaggerItem>
          </StaggerContainer>
        </div>
      </FadeIn>

      {/* Footer */}
      <FadeIn delay={0.5}>
        <div className="mx-auto w-full max-w-sm pt-4 pb-4 text-center">
          <p className="text-sm text-gray-400">
            &iquest;Eres nuevo residente?
          </p>
          <Link
            href="/registro"
            className="mt-0.5 inline-block min-h-[44px] leading-[44px] text-sm font-bold text-gray-900 hover:underline"
          >
            Solicitar acceso a la administraci&oacute;n
          </Link>
        </div>
      </FadeIn>
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
      className="flex w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl bg-white p-3 shadow-apple-sm aspect-square border border-white/80 transition-all duration-200 hover:shadow-apple active:scale-[0.97]"
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-2xl ${bgColor}`}
      >
        {icon}
      </div>
      <span className="text-[11px] font-medium text-gray-500 leading-tight text-center">
        {label}
      </span>
    </button>
  );
}
