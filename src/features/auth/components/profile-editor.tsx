"use client";

import { useState } from "react";
import { Pencil, Check, X } from "lucide-react";
import { updateProfile } from "@/features/auth/actions/update-profile";

interface ProfileEditorProps {
  initialName: string;
  initialPhone: string;
}

export function ProfileEditor({ initialName, initialPhone }: ProfileEditorProps) {
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; error?: string } | null>(null);

  async function handleSave() {
    setSaving(true);
    setResult(null);
    const res = await updateProfile({ fullName, phone });
    setSaving(false);
    if (res.error) {
      setResult({ error: res.error });
    } else {
      setResult({ success: true });
      setEditing(false);
      setTimeout(() => setResult(null), 2000);
    }
  }

  function handleCancel() {
    setFullName(initialName);
    setPhone(initialPhone);
    setEditing(false);
    setResult(null);
  }

  if (!editing) {
    return (
      <div className="space-y-1">
        <EditableRow label="Nombre completo" value={fullName} />
        <EditableRow label="Telefono" value={phone || "Sin registrar"} />
        <button
          onClick={() => setEditing(true)}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 text-[13px] font-medium text-gray-600 transition hover:bg-gray-50 hover:border-gray-300"
        >
          <Pencil className="h-3.5 w-3.5" />
          Editar datos
        </button>
        {result?.success && (
          <p className="mt-2 text-center text-[12px] text-emerald-600 font-medium">
            Datos actualizados
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs text-gray-400 mb-1">Nombre completo</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-[14px] text-gray-900 focus:border-amber-300 focus:ring-2 focus:ring-amber-100 focus:outline-none transition-all"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-1">Telefono</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Ej: 3001234567"
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-[14px] text-gray-900 placeholder:text-gray-400 focus:border-amber-300 focus:ring-2 focus:ring-amber-100 focus:outline-none transition-all"
        />
      </div>

      {result?.error && (
        <p className="rounded-lg bg-red-50 p-3 text-xs text-red-600">
          {result.error}
        </p>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleCancel}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-2.5 text-[13px] font-medium text-gray-600 transition hover:bg-gray-50"
        >
          <X className="h-3.5 w-3.5" />
          Cancelar
        </button>
        <button
          onClick={handleSave}
          disabled={saving || !fullName.trim()}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-amber-500 py-2.5 text-[13px] font-semibold text-white transition hover:bg-amber-600 active:bg-amber-700 disabled:opacity-50"
        >
          <Check className="h-3.5 w-3.5" />
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}

function EditableRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-[14px] font-medium text-gray-900 truncate">{value}</p>
      </div>
    </div>
  );
}
