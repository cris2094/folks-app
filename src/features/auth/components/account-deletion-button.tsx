"use client";

import { useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import { requestAccountDeletion } from "@/features/auth/actions/request-account-deletion";

export function AccountDeletionButton() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; error?: string } | null>(null);

  async function handleDelete() {
    setLoading(true);
    const res = await requestAccountDeletion();
    setLoading(false);
    setResult(res);
    if (res.success) {
      setTimeout(() => {
        setShowModal(false);
        setResult(null);
      }, 3000);
    }
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:border-red-300"
      >
        <Trash2 className="h-4 w-4" />
        Solicitar eliminacion de cuenta
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            {result?.success ? (
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                  <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-900">
                  Solicitud enviada
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Un administrador revisara tu solicitud y te contactara para confirmar la eliminacion.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">
                      Eliminar cuenta
                    </h3>
                    <p className="text-xs text-gray-400">
                      Esta accion no se puede deshacer
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-sm text-gray-500">
                  Se enviara una solicitud al administrador de tu conjunto para eliminar
                  tu cuenta y todos los datos personales asociados. Este proceso puede
                  tomar hasta 15 dias habiles conforme a la Ley 1581 de 2012.
                </p>

                {result?.error && (
                  <p className="mt-3 rounded-lg bg-red-50 p-3 text-xs text-red-600">
                    {result.error}
                  </p>
                )}

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setResult(null);
                    }}
                    className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
                  >
                    {loading ? "Enviando..." : "Confirmar"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
