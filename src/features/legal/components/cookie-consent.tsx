"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X } from "lucide-react";

const STORAGE_KEY = "folks-cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) {
      // Small delay so it doesn't flash on page load
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  }

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "dismissed");
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-x-0 bottom-0 z-50 p-4 md:p-6"
        >
          <div className="mx-auto max-w-lg rounded-2xl border border-gray-200 bg-white p-5 shadow-xl shadow-gray-200/50">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  Cookies y privacidad
                </p>
                <p className="mt-1 text-xs leading-relaxed text-gray-500">
                  Usamos cookies para mejorar tu experiencia, analizar el uso de la
                  plataforma y personalizar contenido. Al continuar, aceptas nuestra
                  politica de cookies.
                </p>
              </div>
              <button
                onClick={dismiss}
                className="mt-0.5 rounded-lg p-1 text-gray-300 transition hover:bg-gray-100 hover:text-gray-500"
                aria-label="Cerrar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={accept}
                className="rounded-full bg-gray-900 px-5 py-2 text-xs font-semibold text-white transition hover:bg-gray-800"
              >
                Aceptar
              </button>
              <Link
                href="/privacidad"
                className="text-xs font-medium text-gray-400 transition hover:text-gray-600"
              >
                Mas informacion
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
