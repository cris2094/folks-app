-- ============================================
-- FOLKS: Financial Dashboard Schema
-- Migration 00002: MOD-006 Financial tables
-- ============================================
-- Decisions:
--   - Utility bills: SEPARATE table (not subcategory of expenses)
--   - Expense approval: DOUBLE approval (approved_by + second_approved_by)
--   - Budget transparency: residents can SELECT (Ley 675/2001, Art. 51)

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE expense_category AS ENUM (
  'maintenance',
  'security',
  'utilities',
  'cleaning',
  'insurance',
  'payroll',
  'legal',
  'reserve_fund',
  'extraordinary',
  'other'
);

CREATE TYPE expense_status AS ENUM (
  'pending',
  'approved',
  'rejected',
  'paid'
);

CREATE TYPE budget_period_status AS ENUM (
  'draft',
  'approved',
  'active',
  'closed'
);

CREATE TYPE utility_type AS ENUM (
  'agua',
  'energia',
  'gas',
  'internet',
  'telefono',
  'aseo'
);

CREATE TYPE reserve_movement_type AS ENUM (
  'income',
  'expense'
);

-- ============================================
-- TABLES
-- ============================================

-- Gastos/Egresos del conjunto
CREATE TABLE expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  category expense_category NOT NULL,
  subcategory text,
  description text NOT NULL,
  amount_cop numeric(12,2) NOT NULL,
  expense_date date NOT NULL DEFAULT CURRENT_DATE,
  vendor text,
  receipt_url text,
  status expense_status NOT NULL DEFAULT 'pending',
  requested_by uuid REFERENCES residents(id),
  approved_by uuid REFERENCES residents(id),
  second_approved_by uuid REFERENCES residents(id),
  approved_at timestamptz,
  paid_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Servicios publicos (tabla separada por decision de Cristhian)
CREATE TABLE utility_bills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  utility_type utility_type NOT NULL,
  provider text,
  bill_period text,
  amount_cop numeric(12,2) NOT NULL,
  due_date date,
  paid_at timestamptz,
  receipt_url text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Periodos de presupuesto
CREATE TABLE budget_periods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  total_income_cop numeric(14,2) DEFAULT 0,
  total_expense_cop numeric(14,2) DEFAULT 0,
  status budget_period_status NOT NULL DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Items del presupuesto
CREATE TABLE budget_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_period_id uuid NOT NULL REFERENCES budget_periods(id) ON DELETE CASCADE,
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  category expense_category NOT NULL,
  description text NOT NULL,
  budgeted_cop numeric(12,2) NOT NULL DEFAULT 0,
  executed_cop numeric(12,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Movimientos del fondo de reserva
CREATE TABLE reserve_fund_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  type reserve_movement_type NOT NULL,
  amount_cop numeric(12,2) NOT NULL,
  description text NOT NULL,
  reference_id uuid,
  movement_date date NOT NULL DEFAULT CURRENT_DATE,
  balance_after_cop numeric(14,2),
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- INDEXES
-- ============================================

-- expenses
CREATE INDEX idx_expenses_tenant ON expenses(tenant_id);
CREATE INDEX idx_expenses_category ON expenses(tenant_id, category);
CREATE INDEX idx_expenses_date ON expenses(tenant_id, expense_date);
CREATE INDEX idx_expenses_status ON expenses(tenant_id, status);

-- utility_bills
CREATE INDEX idx_utility_bills_tenant ON utility_bills(tenant_id);
CREATE INDEX idx_utility_bills_type ON utility_bills(tenant_id, utility_type);
CREATE INDEX idx_utility_bills_period ON utility_bills(tenant_id, bill_period);

-- budget_periods
CREATE INDEX idx_budget_periods_tenant ON budget_periods(tenant_id);
CREATE INDEX idx_budget_periods_status ON budget_periods(tenant_id, status);

-- budget_items
CREATE INDEX idx_budget_items_period ON budget_items(budget_period_id);
CREATE INDEX idx_budget_items_tenant ON budget_items(tenant_id);

-- reserve_fund_movements
CREATE INDEX idx_reserve_fund_tenant ON reserve_fund_movements(tenant_id);
CREATE INDEX idx_reserve_fund_date ON reserve_fund_movements(tenant_id, movement_date);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE utility_bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reserve_fund_movements ENABLE ROW LEVEL SECURITY;

-- Expenses: residente puede ver (transparencia Ley 675), admin CRUD
CREATE POLICY "expenses_select" ON expenses
  FOR SELECT USING (tenant_id = public.tenant_id());

CREATE POLICY "expenses_admin_manage" ON expenses
  FOR ALL USING (
    tenant_id = public.tenant_id()
    AND public.user_role() IN ('admin', 'super_admin')
  );

-- Utility bills: residente puede ver, admin CRUD
CREATE POLICY "utility_bills_select" ON utility_bills
  FOR SELECT USING (tenant_id = public.tenant_id());

CREATE POLICY "utility_bills_admin_manage" ON utility_bills
  FOR ALL USING (
    tenant_id = public.tenant_id()
    AND public.user_role() IN ('admin', 'super_admin')
  );

-- Budget periods: residente puede ver, admin CRUD
CREATE POLICY "budget_periods_select" ON budget_periods
  FOR SELECT USING (tenant_id = public.tenant_id());

CREATE POLICY "budget_periods_admin_manage" ON budget_periods
  FOR ALL USING (
    tenant_id = public.tenant_id()
    AND public.user_role() IN ('admin', 'super_admin')
  );

-- Budget items: residente puede ver, admin CRUD
CREATE POLICY "budget_items_select" ON budget_items
  FOR SELECT USING (tenant_id = public.tenant_id());

CREATE POLICY "budget_items_admin_manage" ON budget_items
  FOR ALL USING (
    tenant_id = public.tenant_id()
    AND public.user_role() IN ('admin', 'super_admin')
  );

-- Reserve fund: residente puede ver, admin CRUD
CREATE POLICY "reserve_fund_select" ON reserve_fund_movements
  FOR SELECT USING (tenant_id = public.tenant_id());

CREATE POLICY "reserve_fund_admin_manage" ON reserve_fund_movements
  FOR ALL USING (
    tenant_id = public.tenant_id()
    AND public.user_role() IN ('admin', 'super_admin')
  );

-- ============================================
-- VIEW: Portfolio summary with aging buckets
-- ============================================

CREATE OR REPLACE VIEW v_portfolio_summary AS
SELECT
  p.tenant_id,
  u.id AS unit_id,
  u.tower,
  u.apartment,
  u.admin_fee_cop,
  COUNT(*) FILTER (WHERE p.status = 'overdue') AS overdue_count,
  COUNT(*) FILTER (WHERE p.status = 'pending') AS pending_count,
  COALESCE(SUM(p.amount_cop + p.late_fee_cop) FILTER (WHERE p.status = 'overdue'), 0) AS overdue_total,
  COALESCE(SUM(p.amount_cop + p.late_fee_cop) FILTER (WHERE p.status = 'pending'), 0) AS pending_total,
  MIN(p.due_date) FILTER (WHERE p.status = 'overdue') AS oldest_overdue_date,
  -- Aging buckets
  COALESCE(SUM(p.amount_cop + p.late_fee_cop) FILTER (
    WHERE p.status = 'overdue' AND p.due_date >= CURRENT_DATE - INTERVAL '30 days'
  ), 0) AS overdue_0_30,
  COALESCE(SUM(p.amount_cop + p.late_fee_cop) FILTER (
    WHERE p.status = 'overdue'
      AND p.due_date < CURRENT_DATE - INTERVAL '30 days'
      AND p.due_date >= CURRENT_DATE - INTERVAL '60 days'
  ), 0) AS overdue_31_60,
  COALESCE(SUM(p.amount_cop + p.late_fee_cop) FILTER (
    WHERE p.status = 'overdue'
      AND p.due_date < CURRENT_DATE - INTERVAL '60 days'
      AND p.due_date >= CURRENT_DATE - INTERVAL '90 days'
  ), 0) AS overdue_61_90,
  COALESCE(SUM(p.amount_cop + p.late_fee_cop) FILTER (
    WHERE p.status = 'overdue'
      AND p.due_date < CURRENT_DATE - INTERVAL '90 days'
  ), 0) AS overdue_90_plus
FROM payments p
JOIN units u ON u.id = p.unit_id
WHERE p.status IN ('pending', 'overdue')
GROUP BY p.tenant_id, u.id, u.tower, u.apartment, u.admin_fee_cop;

-- ============================================
-- UPDATED_AT TRIGGERS
-- ============================================

CREATE TRIGGER expenses_updated_at BEFORE UPDATE ON expenses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER budget_periods_updated_at BEFORE UPDATE ON budget_periods
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER budget_items_updated_at BEFORE UPDATE ON budget_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
