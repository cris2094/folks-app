"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Camera, UserCheck, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ResidentInfo {
  id: string;
  full_name: string;
  document_number: string;
  unit: string;
  tower: string;
}

export default function ScannerPage() {
  const [scanning, setScanning] = useState(false);
  const [resident, setResident] = useState<ResidentInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [registering, setRegistering] = useState(false);
  const scannerRef = useRef<HTMLDivElement>(null);
  const html5QrCodeRef = useRef<unknown>(null);

  const stopScanner = useCallback(async () => {
    if (html5QrCodeRef.current) {
      try {
        const scanner = html5QrCodeRef.current as { clear: () => Promise<void> };
        await scanner.clear();
      } catch {
        // Scanner already stopped
      }
      html5QrCodeRef.current = null;
    }
    setScanning(false);
  }, []);

  const onScanSuccess = useCallback(
    async (decodedText: string) => {
      await stopScanner();
      setError(null);
      setResident(null);

      try {
        const res = await fetch(`/api/residents/lookup?code=${encodeURIComponent(decodedText)}`);
        if (!res.ok) {
          setError("Residente no encontrado");
          return;
        }
        const data = await res.json();
        setResident(data);
      } catch {
        setError("Error al buscar residente");
      }
    },
    [stopScanner],
  );

  async function startScanner() {
    setError(null);
    setResident(null);
    setSuccess(false);
    setScanning(true);

    try {
      const { Html5QrcodeScanner } = await import("html5-qrcode");
      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          rememberLastUsedCamera: true,
        },
        false,
      );

      scanner.render(
        (decodedText: string) => onScanSuccess(decodedText),
        () => {
          // scan error - expected while scanning, ignore
        },
      );
      html5QrCodeRef.current = scanner;
    } catch {
      setError("No se pudo acceder a la camara");
      setScanning(false);
    }
  }

  async function registerEntry() {
    if (!resident) return;
    setRegistering(true);
    try {
      const res = await fetch("/api/access-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resident_id: resident.id,
          action: "entry",
          method: "qr",
        }),
      });
      if (res.ok) {
        setSuccess(true);
        setResident(null);
      } else {
        setError("Error al registrar ingreso");
      }
    } catch {
      setError("Error de conexion");
    }
    setRegistering(false);
  }

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, [stopScanner]);

  return (
    <div className="mx-auto w-full max-w-md min-h-screen bg-[#F5F5F7]">
      {/* Header */}
      <div className="bg-white px-5 pb-4 pt-14 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/home"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 active:bg-gray-200"
          >
            <ArrowLeft className="h-4 w-4 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Scanner QR</h1>
            <p className="text-xs text-gray-400">
              Escanea el QR del residente para registrar ingreso
            </p>
          </div>
        </div>
      </div>

      <div className="px-5 pt-6 pb-32">
        {/* Scanner area */}
        {!scanning && !resident && !success && (
          <div className="flex flex-col items-center gap-6 py-12">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-amber-50">
              <Camera className="h-12 w-12 text-amber-500" strokeWidth={1.5} />
            </div>
            <div className="text-center">
              <p className="text-base font-semibold text-gray-900">
                Listo para escanear
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Posiciona el codigo QR frente a la camara
              </p>
            </div>
            <button
              onClick={startScanner}
              className="rounded-2xl bg-amber-500 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-amber-600 active:scale-[0.97]"
            >
              Iniciar Scanner
            </button>
          </div>
        )}

        {scanning && (
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div id="qr-reader" ref={scannerRef} className="w-full" />
            <div className="p-4 text-center">
              <button
                onClick={stopScanner}
                className="text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
            <div>
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Resident info */}
        {resident && (
          <div className="mt-4 space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50">
                  <UserCheck className="h-7 w-7 text-green-600" />
                </div>
                <div>
                  <p className="text-base font-bold text-gray-900">
                    {resident.full_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {resident.document_number}
                  </p>
                  <p className="text-xs text-gray-400">
                    Torre {resident.tower} - Apto {resident.unit}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setResident(null);
                  startScanner();
                }}
                className="flex-1 rounded-xl border border-gray-200 bg-white py-3 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 active:scale-[0.98]"
              >
                Escanear otro
              </button>
              <button
                onClick={registerEntry}
                disabled={registering}
                className="flex-1 rounded-xl bg-amber-500 py-3 text-sm font-semibold text-white transition-all hover:bg-amber-600 active:scale-[0.98] disabled:opacity-50"
              >
                {registering ? "Registrando..." : "Registrar ingreso"}
              </button>
            </div>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mt-4 space-y-4">
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-green-100 bg-green-50 p-8">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
              <div className="text-center">
                <p className="text-base font-bold text-green-800">
                  Ingreso registrado
                </p>
                <p className="mt-1 text-sm text-green-600">
                  El acceso fue registrado exitosamente
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setSuccess(false);
                startScanner();
              }}
              className="w-full rounded-xl bg-amber-500 py-3 text-sm font-semibold text-white transition-all hover:bg-amber-600 active:scale-[0.98]"
            >
              Escanear otro
            </button>
          </div>
        )}

        {/* Reset after error */}
        {error && !scanning && !resident && (
          <button
            onClick={() => {
              setError(null);
              startScanner();
            }}
            className="mt-4 w-full rounded-xl bg-amber-500 py-3 text-sm font-semibold text-white transition-all hover:bg-amber-600 active:scale-[0.98]"
          >
            Intentar de nuevo
          </button>
        )}
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 pb-8 pt-4 text-center bg-[#F5F5F7]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-300">
          POTENCIADO POR FOLKS
        </p>
      </footer>
    </div>
  );
}
