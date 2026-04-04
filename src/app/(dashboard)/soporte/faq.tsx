"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "Como pago mi administracion?",
    answer:
      "Puedes pagar tu cuota de administracion desde la seccion 'Pagos' en el menu principal. Aceptamos pagos con tarjeta de credito, debito y PSE a traves de nuestra pasarela segura.",
  },
  {
    question: "Como reservo una zona social?",
    answer:
      "Ve a la seccion 'Reservas' en el menu. Selecciona la zona que deseas, elige fecha y horario disponible, y confirma tu reserva. Recibiras una notificacion de confirmacion.",
  },
  {
    question: "Como reporto una incidencia?",
    answer:
      "En la seccion 'Incidencias' puedes crear un nuevo reporte. Describe el problema, adjunta fotos si es necesario, y el equipo de administracion lo atendera segun la prioridad.",
  },
  {
    question: "Como notifico un visitante?",
    answer:
      "Desde la seccion 'Visitantes' puedes pre-autorizar la entrada de tus invitados. Ingresa sus datos y se generara un codigo QR para facilitar su ingreso en porteria.",
  },
];

export function SoporteFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {FAQ_ITEMS.map((item, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl bg-white border border-gray-100"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-gray-50"
          >
            <span className="text-[14px] font-medium text-gray-900 pr-4">
              {item.question}
            </span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 ${
                openIndex === index ? "rotate-180" : ""
              }`}
              strokeWidth={2}
            />
          </button>
          {openIndex === index && (
            <div className="border-t border-gray-100 px-4 py-3">
              <p className="text-[13px] leading-relaxed text-gray-500">
                {item.answer}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
