"use client";

import { useState, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PawPrint, Plus, X, Trash2 } from "lucide-react";
import { addPet, removePet } from "../actions/manage-pet";

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  vaccination_up_to_date: boolean;
}

export function PetList({ pets, unitId }: { pets: Pet[]; unitId?: string }) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-2">
      {pets.length === 0 ? (
        <p className="text-muted-foreground py-4 text-center text-sm">
          No hay mascotas registradas
        </p>
      ) : (
        pets.map((p) => (
          <PetCard key={p.id} pet={p} />
        ))
      )}

      {unitId && (
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-3 text-sm font-medium text-gray-500 transition-colors hover:border-amber-300 hover:text-amber-600"
        >
          <Plus className="h-4 w-4" />
          Agregar mascota
        </button>
      )}

      {showForm && <AddPetForm onClose={() => setShowForm(false)} />}
    </div>
  );
}

function PetCard({ pet }: { pet: Pet }) {
  const [isPending, startTransition] = useTransition();

  function handleRemove() {
    if (!confirm("Eliminar esta mascota?")) return;
    startTransition(async () => {
      await removePet(pet.id);
    });
  }

  return (
    <Card>
      <CardContent className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <PawPrint className="h-4 w-4 text-gray-500" />
          <div>
            <p className="text-sm font-medium">{pet.name}</p>
            <p className="text-muted-foreground text-xs">
              {pet.species === "dog" ? "Perro" : pet.species === "cat" ? "Gato" : "Otro"}
              {pet.breed ? ` - ${pet.breed}` : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={pet.vaccination_up_to_date ? "default" : "destructive"} className="text-xs">
            {pet.vaccination_up_to_date ? "Vacunado" : "Sin vacunas"}
          </Badge>
          <button
            onClick={handleRemove}
            disabled={isPending}
            className="text-gray-400 hover:text-red-500 disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

function AddPetForm({ onClose }: { onClose: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await addPet(formData);
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
          <p className="text-sm font-medium">Nueva mascota</p>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-2">
          <input name="name" placeholder="Nombre" className="w-full rounded-lg border px-3 py-2 text-sm" required />
          <select name="species" className="w-full rounded-lg border px-3 py-2 text-sm">
            <option value="dog">Perro</option>
            <option value="cat">Gato</option>
            <option value="other">Otro</option>
          </select>
          <input name="breed" placeholder="Raza (opcional)" className="w-full rounded-lg border px-3 py-2 text-sm" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="vaccination_up_to_date" value="true" className="rounded" />
            Vacunas al dia
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
