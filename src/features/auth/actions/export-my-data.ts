"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

interface ResidentUnit {
  id: string;
  tower: string;
  apartment: string;
  area_m2: number | null;
  parking_spot: string | null;
  admin_fee_cop: number;
}

interface ResidentTenant {
  id: string;
  name: string;
  slug: string;
}

export async function exportMyData() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get resident profile
  const { data: resident } = await supabase
    .from("residents")
    .select(
      `
      id,
      full_name,
      email,
      phone,
      role,
      is_owner,
      document_type,
      document_number,
      tenant_id,
      unit_id,
      created_at,
      updated_at,
      unit:units (
        id,
        tower,
        apartment,
        area_m2,
        parking_spot,
        admin_fee_cop
      ),
      tenant:tenants (
        id,
        name,
        slug
      )
    `,
    )
    .eq("user_id", user.id)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (!resident) {
    return { error: "No se encontro tu perfil de residente." };
  }

  const unitId = resident.unit_id ?? "";
  const unit = resident.unit as unknown as ResidentUnit | null;
  const tenant = resident.tenant as unknown as ResidentTenant | null;

  // Fetch related data in parallel
  const [payments, packages, tickets] = await Promise.all([
    supabase
      .from("payments")
      .select("id, concept, description, amount_cop, due_date, paid_at, status, created_at")
      .eq("tenant_id", resident.tenant_id)
      .eq("unit_id", unitId)
      .order("created_at", { ascending: false })
      .limit(200),

    supabase
      .from("packages")
      .select("id, description, status, received_at, delivered_at, delivered_to, created_at")
      .eq("tenant_id", resident.tenant_id)
      .eq("unit_id", unitId)
      .order("created_at", { ascending: false })
      .limit(200),

    supabase
      .from("tickets")
      .select("id, category, priority, subject, description, status, created_at, resolved_at")
      .eq("tenant_id", resident.tenant_id)
      .eq("resident_id", resident.id)
      .order("created_at", { ascending: false })
      .limit(200),
  ]);

  const exportData = {
    _meta: {
      exported_at: new Date().toISOString(),
      platform: "Folks - Gestion Residencial Inteligente",
      format_version: "1.0",
      note: "Datos exportados conforme al derecho de acceso (Ley 1581 de 2012, Art. 8)",
    },
    cuenta: {
      email: user.email,
      creada_en: user.created_at,
    },
    perfil: {
      nombre: resident.full_name,
      email: resident.email,
      telefono: resident.phone,
      tipo_documento: resident.document_type,
      numero_documento: resident.document_number,
      rol: resident.role,
      es_propietario: resident.is_owner,
      registrado_desde: resident.created_at,
    },
    conjunto: tenant
      ? { nombre: tenant.name }
      : null,
    unidad: unit
      ? {
          torre: unit.tower,
          apartamento: unit.apartment,
          area_m2: unit.area_m2,
          parqueadero: unit.parking_spot,
        }
      : null,
    pagos: payments.data ?? [],
    paquetes: packages.data ?? [],
    pqr: tickets.data ?? [],
  };

  return { data: exportData };
}
