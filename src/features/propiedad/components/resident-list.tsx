"use client";

import { useState, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Phone, Mail, Plus, X } from "lucide-react";
import { updateResident } from "../actions/update-resident";

interface Resident {
  id: string;
  full_name: string;
  document_type: string;
  document_number: string;
  email: string | null;
  phone: string | null;
  role: string;
  is_owner: boolean;
}

export function ResidentList({ residents, unitId }: { residents: Resident[]; unitId?: string }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {residents.length === 0 ? (
        <p className="text-muted-foreground py-4 text-center text-sm">
          No hay residentes vinculados
        </p>
      ) : (
        residents.map((r) => (
          <Card key={r.id}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{r.full_name}</p>
                    <p className="text-muted-foreground text-xs">
                      {r.document_type.toUpperCase()} {r.document_number}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={r.is_owner ? "default" : "outline"} className="text-xs">
                    {r.is_owner ? "Propietario" : r.role}
                  </Badge>
                  <button
                    onClick={() => setEditingId(editingId === r.id ? null : r.id)}
                    className="text-xs text-amber-500 hover:text-amber-600 font-medium"
                  >
                    Editar
                  </button>
                </div>
              </div>
              <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                {r.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" /> {r.phone}
                  </span>
                )}
                {r.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" /> {r.email}
                  </span>
                )}
              </div>

              {editingId === r.id && (
                <EditResidentForm
                  resident={r}
                  onClose={() => setEditingId(null)}
                />
              )}
            </CardContent>
          </Card>
        ))
      )}

      {unitId && (
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-3 text-sm font-medium text-gray-500 transition-colors hover:border-amber-300 hover:text-amber-600"
        >
          <Plus className="h-4 w-4" />
          Agregar residente
        </button>
      )}

      {showForm && unitId && (
        <AddResidentForm unitId={unitId} onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}

function EditResidentForm({ resident, onClose }: { resident: Resident; onClose: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateResident(resident.id, formData);
      if (result.error) {
        setError(result.error);
      } else {
        onClose();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-2 border-t pt-3">
      <input
        name="full_name"
        defaultValue={resident.full_name}
        placeholder="Nombre completo"
        className="w-full rounded-lg border px-3 py-2 text-sm"
        required
      />
      <div className="flex gap-2">
        <select name="document_type" defaultValue={resident.document_type} className="rounded-lg border px-3 py-2 text-sm">
          <option value="cc">CC</option>
          <option value="ce">CE</option>
          <option value="passport">Pasaporte</option>
        </select>
        <input
          name="document_number"
          defaultValue={resident.document_number}
          placeholder="Documento"
          className="flex-1 rounded-lg border px-3 py-2 text-sm"
          required
        />
      </div>
      <input name="email" type="email" defaultValue={resident.email ?? ""} placeholder="Email" className="w-full rounded-lg border px-3 py-2 text-sm" />
      <input name="phone" defaultValue={resident.phone ?? ""} placeholder="Telefono" className="w-full rounded-lg border px-3 py-2 text-sm" />
      <input type="hidden" name="is_owner" value={resident.is_owner ? "true" : "false"} />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <div className="flex gap-2">
        <button type="button" onClick={onClose} className="flex-1 rounded-lg border py-2 text-sm text-gray-600 hover:bg-gray-50">
          Cancelar
        </button>
        <button type="submit" disabled={isPending} className="flex-1 rounded-lg bg-amber-500 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50">
          {isPending ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
}

function AddResidentForm({ unitId, onClose }: { unitId: string; onClose: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const { addResident } = await import("../actions/add-resident");
      const result = await addResident(unitId, formData);
      if (result.error) {
        setError(result.error);
      } else {
        onClose();
      }
    });
  }

  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium">Nuevo residente</p>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-2">
          <input name="full_name" placeholder="Nombre completo" className="w-full rounded-lg border px-3 py-2 text-sm" required />
          <div className="flex gap-2">
            <select name="document_type" className="rounded-lg border px-3 py-2 text-sm">
              <option value="cc">CC</option>
              <option value="ce">CE</option>
              <option value="passport">Pasaporte</option>
            </select>
            <input name="document_number" placeholder="Documento" className="flex-1 rounded-lg border px-3 py-2 text-sm" required />
          </div>
          <input name="email" type="email" placeholder="Email" className="w-full rounded-lg border px-3 py-2 text-sm" />
          <input name="phone" placeholder="Telefono" className="w-full rounded-lg border px-3 py-2 text-sm" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="is_owner" value="true" className="rounded" />
            Propietario
          </label>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button type="submit" disabled={isPending} className="w-full rounded-lg bg-amber-500 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50">
            {isPending ? "Agregando..." : "Agregar"}
          </button>
        </form>
      </CardContent>
    </Card>
  );
}
