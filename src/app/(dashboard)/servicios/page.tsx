import { getUtilityBills } from "@/features/servicios/queries/get-utility-bills";
import { ServiciosClient } from "@/features/servicios/components/servicios-client";

export default async function ServiciosPage() {
  const services = await getUtilityBills();
  return <ServiciosClient services={services} />;
}
