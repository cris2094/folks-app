"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

export function PasswordInput({
  id,
  name,
  required,
  className,
}: {
  id?: string;
  name?: string;
  required?: boolean;
  className?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        required={required}
        className={`h-11 w-full rounded-xl border border-input bg-transparent pl-10 pr-10 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 ${className ?? ""}`}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label={visible ? "Ocultar contrasena" : "Mostrar contrasena"}
      >
        {visible ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
