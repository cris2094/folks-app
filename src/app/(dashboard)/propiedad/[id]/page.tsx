import { getUnitDetails } from "@/features/propiedad/queries/get-unit-details";
import { ResidentList } from "@/features/propiedad/components/resident-list";
import { VehicleList } from "@/features/propiedad/components/vehicle-list";
import { PetList } from "@/features/propiedad/components/pet-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Building2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { FadeIn, FadeInUp } from "@/components/motion";

export default async function UnitDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { unit, residents, vehicles, pets } = await getUnitDetails(id);

  if (!unit) {
    return (
      <div className="mx-auto max-w-md p-4 text-center">
        <p className="text-muted-foreground">Unidad no encontrada</p>
        <Link href="/propiedad" className="text-primary text-sm underline">
          Volver
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md p-4">
      <Link
        href="/propiedad"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Volver
      </Link>

      <FadeIn>
      <header className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50">
            <Building2 className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold">
              {unit.tower} - Apto {unit.apartment}
            </h1>
            <p className="text-muted-foreground text-sm">
              Cuota: ${Number(unit.admin_fee_cop).toLocaleString("es-CO")} COP/mes
            </p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {unit.area_m2 && <Badge variant="outline">{unit.area_m2} m²</Badge>}
          {unit.parking_spot && <Badge variant="outline">P: {unit.parking_spot}</Badge>}
          {unit.cadastral_number && (
            <Badge variant="outline">Cat: {unit.cadastral_number}</Badge>
          )}
        </div>
      </header>
      </FadeIn>

      <FadeInUp delay={0.1}>
      <Tabs defaultValue="residentes">
        <TabsList className="w-full">
          <TabsTrigger value="residentes" className="flex-1">
            Residentes ({residents.length})
          </TabsTrigger>
          <TabsTrigger value="vehiculos" className="flex-1">
            Vehiculos ({vehicles.length})
          </TabsTrigger>
          <TabsTrigger value="mascotas" className="flex-1">
            Mascotas ({pets.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="residentes" className="mt-4">
          <ResidentList residents={residents} unitId={id} />
        </TabsContent>
        <TabsContent value="vehiculos" className="mt-4">
          <VehicleList vehicles={vehicles} unitId={id} />
        </TabsContent>
        <TabsContent value="mascotas" className="mt-4">
          <PetList pets={pets} unitId={id} />
        </TabsContent>
      </Tabs>
      </FadeInUp>

      <p className="pb-2 pt-8 text-center text-[10px] font-medium tracking-wider text-gray-300">
        POTENCIADO POR FOLKS
      </p>
    </div>
  );
}
