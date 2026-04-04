import { getUserUnits } from "@/features/propiedad/queries/get-user-units";
import { UnitCard } from "@/features/propiedad/components/unit-card";
import { Building2 } from "lucide-react";
import { FadeIn, FadeInUp } from "@/components/motion";

interface UserUnit {
  id: string;
  is_owner: boolean;
  unit: {
    id: string;
    tower: string;
    apartment: string;
    admin_fee_cop: number;
    parking_spot: string | null;
  }[];
}

export default async function PropiedadPage() {
  const userUnits = await getUserUnits();

  return (
    <div className="mx-auto max-w-md p-4">
      <FadeIn>
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Mi Propiedad</h1>
          <p className="text-muted-foreground text-sm">
            Tus unidades y residentes
          </p>
        </header>
      </FadeIn>

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
        <FadeInUp delay={0.1}>
          <div className="space-y-3">
            {(userUnits as UserUnit[]).map((item) => {
              const unit = Array.isArray(item.unit) ? item.unit[0] : item.unit;
              if (!unit) return null;
              return (
                <UnitCard
                  key={item.id}
                  unitId={unit.id}
                  tower={unit.tower}
                  apartment={unit.apartment}
                  isOwner={item.is_owner}
                  adminFee={unit.admin_fee_cop}
                  parkingSpot={unit.parking_spot}
                />
              );
            })}
          </div>
        </FadeInUp>
      )}

      <p className="pb-2 pt-8 text-center text-[10px] font-medium tracking-wider text-gray-300">
        POTENCIADO POR FOLKS
      </p>
    </div>
  );
}
