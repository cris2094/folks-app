"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerWithEmail } from "@/features/auth/actions/registro";

export function RegistroForm() {
  const [accepted, setAccepted] = useState(false);

  return (
    <form action={registerWithEmail} className="space-y-3.5">
      <div className="space-y-1.5">
        <Label htmlFor="fullName" className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
          Nombre completo
        </Label>
        <Input
          id="fullName"
          name="fullName"
          type="text"
          placeholder="Tu nombre"
          required
          className="h-12 rounded-xl border-gray-100 bg-[#F9F9FB]"
        />
      </div>
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
      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
          Contrasena
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Minimo 8 caracteres"
          required
          className="h-12 rounded-xl border-gray-100 bg-[#F9F9FB]"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword" className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
          Confirmar contrasena
        </Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Repite tu contrasena"
          required
          className="h-12 rounded-xl border-gray-100 bg-[#F9F9FB]"
        />
      </div>
      <div className="flex items-start gap-2 min-h-[44px]">
        <input
          type="checkbox"
          id="acceptTerms"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
        />
        <label htmlFor="acceptTerms" className="text-sm text-gray-600 cursor-pointer">
          Acepto la{" "}
          <a
            href="/privacidad"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-amber-600 hover:underline"
          >
            Politica de Privacidad
          </a>
          , los{" "}
          <a
            href="/terminos"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-amber-600 hover:underline"
          >
            Terminos y Condiciones
          </a>{" "}
          y autorizo el tratamiento de mis datos personales conforme a la Ley 1581 de 2012
        </label>
      </div>
      <Button
        className="w-full h-14 rounded-2xl bg-gradient-to-b from-gray-800 to-gray-900 font-semibold text-white shadow-apple hover:from-gray-700 hover:to-gray-800 active:scale-[0.98] transition-all duration-200"
        type="submit"
        disabled={!accepted}
      >
        Crear cuenta
      </Button>
    </form>
  );
}
