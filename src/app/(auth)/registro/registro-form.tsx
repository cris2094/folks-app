"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerWithEmail } from "@/features/auth/actions/registro";

export function RegistroForm() {
  const [accepted, setAccepted] = useState(false);

  return (
    <form action={registerWithEmail} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Nombre completo</Label>
        <Input
          id="fullName"
          name="fullName"
          type="text"
          placeholder="Tu nombre"
          required
          className="h-11 rounded-xl"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Correo electronico</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="tu@correo.com"
          required
          className="h-11 rounded-xl"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Contrasena</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Minimo 8 caracteres"
          required
          className="h-11 rounded-xl"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar contrasena</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Repite tu contrasena"
          required
          className="h-11 rounded-xl"
        />
      </div>
      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          id="acceptTerms"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
        />
        <label htmlFor="acceptTerms" className="text-sm text-gray-600">
          Acepto la{" "}
          <a
            href="/privacidad"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-amber-600 hover:underline"
          >
            Politica de Privacidad
          </a>{" "}
          y los{" "}
          <a
            href="/terminos"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-amber-600 hover:underline"
          >
            Terminos y Condiciones
          </a>
        </label>
      </div>
      <Button
        className="w-full h-11 rounded-xl bg-amber-600 font-medium hover:bg-amber-700"
        type="submit"
        disabled={!accepted}
      >
        Crear cuenta
      </Button>
    </form>
  );
}
