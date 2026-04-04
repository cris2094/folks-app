-- ============================================
-- MOD-015: Control de Turnos del Personal
-- Ref: PERSONAL PDF, Cohabit.pdf
-- ============================================

CREATE TABLE staff_shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  staff_name TEXT NOT NULL,
  role TEXT NOT NULL,                          -- 'portero', 'aseo', 'mantenimiento', 'seguridad'
  shift_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled',    -- 'scheduled', 'in_progress', 'completed', 'absent'
  check_in_at TIMESTAMPTZ,
  check_out_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_staff_shifts_tenant ON staff_shifts(tenant_id);
CREATE INDEX idx_staff_shifts_date ON staff_shifts(tenant_id, shift_date);
CREATE INDEX idx_staff_shifts_role ON staff_shifts(tenant_id, role);

-- RLS
ALTER TABLE staff_shifts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "shifts_select" ON staff_shifts
  FOR SELECT USING (tenant_id = public.tenant_id());

CREATE POLICY "shifts_admin" ON staff_shifts
  FOR ALL USING (
    tenant_id = public.tenant_id()
    AND public.user_role() IN ('admin', 'super_admin')
  );
