import { getUtilityBills } from "@/features/servicios/queries/get-utility-bills";
import { AdminServiciosClient } from "@/features/servicios/components/admin-servicios-client";

export default async function AdminServiciosPage() {
  const services = await getUtilityBills();

  return (
    <div>
      <h2 className="mb-1 text-lg font-bold text-gray-900">Servicios Publicos</h2>
      <p className="mb-4 text-sm text-gray-500">
        Registra y monitorea los pagos de servicios
      </p>
      <AdminServiciosClient services={services} />
    </div>
  );
}
