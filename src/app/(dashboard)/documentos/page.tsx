import { getCurrentUser } from "@/features/auth/queries/get-current-user";
import { DocumentosClient } from "@/features/documentos/components/documentos-client";

export default async function DocumentosPage() {
  const data = await getCurrentUser();
  const role = data?.resident?.role ?? "residente";
  const isAdmin = ["super_admin", "admin", "consejo"].includes(role);

  return <DocumentosClient isAdmin={isAdmin} />;
}
