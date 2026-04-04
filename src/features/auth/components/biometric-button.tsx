"use client";

import { useEffect, useState } from "react";
import { ScanFace } from "lucide-react";

export function BiometricButton() {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    async function check() {
      try {
        if (
          typeof window !== "undefined" &&
          window.PublicKeyCredential &&
          typeof window.PublicKeyCredential
            .isUserVerifyingPlatformAuthenticatorAvailable === "function"
        ) {
          const result =
            await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
          setAvailable(result);
        }
      } catch {
        setAvailable(false);
      }
    }
    check();
  }, []);

  if (!available) return null;

  return (
    <button
      type="button"
      onClick={() => {
        alert("Biometria proximamente");
      }}
      className="flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center rounded-full bg-amber-500 text-white shadow-apple transition-all duration-200 hover:bg-amber-600 active:bg-amber-700 active:scale-95"
      aria-label="Ingreso biometrico"
    >
      <ScanFace className="h-7 w-7" />
    </button>
  );
}
