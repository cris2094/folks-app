-- MOD-010: Gamificacion - Sistema de puntos y badges
-- Incentiva participacion: pagar a tiempo, reportar incidencias, asistir asambleas, reservar zonas

-- Puntos del residente
CREATE TABLE resident_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  resident_id UUID NOT NULL REFERENCES residents(id),
  points INTEGER NOT NULL DEFAULT 0,
  level TEXT NOT NULL DEFAULT 'bronce', -- 'bronce', 'plata', 'oro', 'platino'
  total_earned INTEGER NOT NULL DEFAULT 0,
  total_spent INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(resident_id)
);

-- Historial de transacciones de puntos
CREATE TABLE point_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  resident_id UUID NOT NULL REFERENCES residents(id),
  type TEXT NOT NULL, -- 'earn', 'spend', 'expire'
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL, -- 'payment_ontime', 'pqr_created', 'assembly_attended', 'reservation', 'redeem_discount'
  reference_id UUID, -- ID del pago/ticket/asamblea
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Badges/logros
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL, -- lucide icon name
  requirement TEXT NOT NULL, -- 'payments_3_ontime', 'pqr_first', 'assembly_attended'
  points_reward INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Badges ganados
CREATE TABLE resident_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  resident_id UUID NOT NULL REFERENCES residents(id),
  badge_id UUID NOT NULL REFERENCES badges(id),
  earned_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(resident_id, badge_id)
);

-- RLS
ALTER TABLE resident_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE resident_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "points_select" ON resident_points FOR SELECT USING (tenant_id = public.tenant_id());
CREATE POLICY "points_all" ON resident_points FOR ALL USING (tenant_id = public.tenant_id());
CREATE POLICY "transactions_select" ON point_transactions FOR SELECT USING (tenant_id = public.tenant_id());
CREATE POLICY "transactions_insert" ON point_transactions FOR INSERT WITH CHECK (tenant_id = public.tenant_id());
CREATE POLICY "badges_select" ON badges FOR SELECT USING (tenant_id = public.tenant_id());
CREATE POLICY "resident_badges_select" ON resident_badges FOR SELECT USING (tenant_id = public.tenant_id());

-- Seed badges basicos
INSERT INTO badges (tenant_id, name, description, icon, requirement, points_reward)
SELECT t.id, b.name, b.description, b.icon, b.requirement, b.points_reward
FROM tenants t
CROSS JOIN (VALUES
  ('Vecino Puntual', 'Pagaste 3 meses seguidos a tiempo', 'clock', 'payments_3_ontime', 50),
  ('Primera Incidencia', 'Reportaste tu primera incidencia', 'flag', 'pqr_first', 10),
  ('Vecino Social', 'Reservaste tu primera zona social', 'calendar', 'reservation_first', 15),
  ('Ciudadano Activo', 'Asististe a tu primera asamblea', 'users', 'assembly_attended', 30),
  ('Vecino Estrella', 'Alcanzaste nivel Oro', 'star', 'level_gold', 100)
) AS b(name, description, icon, requirement, points_reward);
