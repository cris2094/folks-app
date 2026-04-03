// Supabase Auth Hook — Custom JWT Claims
// Inyecta tenant_id y user_role en el JWT al login.
// Deploy: npx supabase functions deploy auth-hook --linked
// Configurar en: Supabase Dashboard → Auth → Hooks → Custom Access Token

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface WebhookPayload {
  event: string;
  user_id: string;
  claims: Record<string, unknown>;
}

Deno.serve(async (req) => {
  const payload: WebhookPayload = await req.json();
  const { user_id, claims } = payload;

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Buscar el residente asociado a este user_id
  const { data: resident, error } = await supabase
    .from("residents")
    .select("tenant_id, role")
    .eq("user_id", user_id)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (error || !resident) {
    // Usuario sin residente asociado — retornar claims sin modificar
    return new Response(
      JSON.stringify({ claims }),
      { headers: { "Content-Type": "application/json" } },
    );
  }

  // Inyectar tenant_id y user_role en los claims del JWT
  return new Response(
    JSON.stringify({
      claims: {
        ...claims,
        tenant_id: resident.tenant_id,
        user_role: resident.role,
      },
    }),
    { headers: { "Content-Type": "application/json" } },
  );
});
