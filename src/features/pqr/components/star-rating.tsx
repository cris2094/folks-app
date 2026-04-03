"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { rateTicket } from "../actions/rate-ticket";

interface StarRatingProps {
  ticketId: string;
  currentRating: number | null;
  readonly?: boolean;
}

export function StarRating({
  ticketId,
  currentRating,
  readonly = false,
}: StarRatingProps) {
  const [hoveredStar, setHoveredStar] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(!!currentRating);
  const [rating, setRating] = useState(currentRating ?? 0);

  async function handleRate(value: number) {
    if (readonly || submitting || submitted) return;
    setSubmitting(true);

    const fd = new FormData();
    fd.set("ticket_id", ticketId);
    fd.set("rating", String(value));

    const result = await rateTicket(fd);
    if (result.success) {
      setRating(value);
      setSubmitted(true);
    }
    setSubmitting(false);
  }

  const displayValue = hoveredStar || rating;

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
      <p className="text-center text-sm font-semibold text-gray-900">
        {submitted ? "Gracias por tu calificacion" : "Califica la atencion"}
      </p>
      <div className="mt-3 flex justify-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={readonly || submitting || submitted}
            onMouseEnter={() => !submitted && setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(0)}
            onClick={() => handleRate(star)}
            className="p-1 transition-transform hover:scale-110 disabled:cursor-default"
          >
            <Star
              className={`h-8 w-8 ${
                star <= displayValue
                  ? "fill-amber-400 text-amber-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
      {submitting && (
        <p className="mt-2 text-center text-xs text-gray-400">Enviando...</p>
      )}
    </div>
  );
}
