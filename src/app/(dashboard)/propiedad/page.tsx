import { getUserUnits } from "@/features/propiedad/queries/get-user-units";
import { UnitCard } from "@/features/propiedad/components/unit-card";
import { Building2 } from "lucide-react";

export default async function PropiedadPage() {
  const userUnits = await getUserUnits();

  return (
    <div className="mx-auto max-w-md p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Mi Propiedad</h1>
        <p className="text-muted-foreground text-sm">
          Tus unidades y residentes
        </p>
      </header>

      {userUnits.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Building2 className="h-8 w-8 text-gray-400" />
          </div>
          <div>
            <p className="font-medium text-gray-700">Sin propiedades</p>
            <p className="text-muted-foreground text-sm">
              Contacta al administrador para vincular tu unidad
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {userUnits.map((item: any) => (
            <UnitCard
              key={item.id}
              unitId={item.unit.id}
              tower={item.unit.tower}
              apartment={item.unit.apartment}
              isOwner={item.is_owner}
              adminFee={item.unit.admin_fee_cop}
              parkingSpot={item.unit.parking_spot}
            />
          ))}
        </div>
      )}
    </div>
  );
}
