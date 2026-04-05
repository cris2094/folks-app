"use client";

import { useState, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, Plus, X, Trash2 } from "lucide-react";
import { addVehicle, removeVehicle } from "../actions/manage-vehicle";

interface Vehicle {
  id: string;
  plate: string;
  type: string;
  color: string | null;
  brand: string | null;
  parking_spot: string | null;
}

export function VehicleList({ vehicles, unitId }: { vehicles: Vehicle[]; unitId?: string }) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-2">
      {vehicles.length === 0 ? (
        <p className="text-muted-foreground py-4 text-center text-sm">
          No hay vehiculos registrados
        </p>
      ) : (
        vehicles.map((v) => (
          <VehicleCard key={v.id} vehicle={v} />
        ))
      )}

      {unitId && (
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-3 text-sm font-medium text-gray-500 transition-colors hover:border-amber-300 hover:text-amber-600"
        >
          <Plus className="h-4 w-4" />
          Agregar vehiculo
        </button>
      )}

      {showForm && <AddVehicleForm onClose={() => setShowForm(false)} />}
    </div>
  );
}

function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const [isPending, startTransition] = useTransition();

  function handleRemove() {
    if (!confirm("Eliminar este vehiculo?")) return;
    startTransition(async () => {
      await removeVehicle(vehicle.id);
    });
  }

  return (
    <Card>
      <CardContent className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <Car className="h-4 w-4 text-gray-500" />
          <div>
            <p className="text-sm font-medium">{vehicle.plate}</p>
            <p className="text-muted-foreground text-xs">
              {vehicle.brand} {vehicle.color ? `- ${vehicle.color}` : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {vehicle.parking_spot && (
            <span className="text-muted-foreground text-xs">P: {vehicle.parking_spot}</span>
          )}
          <Badge variant="outline" className="text-xs capitalize">
            {vehicle.type === "car" ? "Auto" : vehicle.type === "motorcycle" ? "Moto" : "Bici"}
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

function AddVehicleForm({ onClose }: { onClose: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await addVehicle(formData);
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
          <p className="text-sm font-medium">Nuevo vehiculo</p>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-2">
          <input name="plate" placeholder="Placa (ej: ABC123)" className="w-full rounded-lg border px-3 py-2 text-sm uppercase" required />
          <select name="type" className="w-full rounded-lg border px-3 py-2 text-sm">
            <option value="car">Auto</option>
            <option value="motorcycle">Moto</option>
            <option value="bicycle">Bicicleta</option>
          </select>
          <input name="brand" placeholder="Marca (opcional)" className="w-full rounded-lg border px-3 py-2 text-sm" />
          <input name="color" placeholder="Color (opcional)" className="w-full rounded-lg border px-3 py-2 text-sm" />
          <input name="parking_spot" placeholder="Parqueadero (opcional)" className="w-full rounded-lg border px-3 py-2 text-sm" />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button type="submit" disabled={isPending} className="w-full rounded-lg bg-amber-500 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50">
            {isPending ? "Agregando..." : "Agregar"}
          </button>
        </form>
      </CardContent>
    </Card>
  );
}
