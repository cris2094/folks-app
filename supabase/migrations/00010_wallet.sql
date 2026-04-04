-- ============================================
-- FOLKS: Wallet (Presupuesto Personal)
-- Migration 00010: Personal budget tracking
-- ============================================

CREATE TABLE wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  resident_id UUID NOT NULL REFERENCES residents(id),
  type TEXT NOT NULL, -- 'income', 'expense'
  category TEXT NOT NULL, -- 'administracion', 'servicios', 'mercado', 'transporte', 'salud', 'educacion', 'entretenimiento', 'otros'
  description TEXT NOT NULL,
  amount_cop NUMERIC(12,2) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_recurring BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE wallet_budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  resident_id UUID NOT NULL REFERENCES residents(id),
  category TEXT NOT NULL,
  budget_cop NUMERIC(12,2) NOT NULL DEFAULT 0,
  month TEXT NOT NULL, -- '2026-04'
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(resident_id, category, month)
);

-- Indexes
CREATE INDEX idx_wallet_tx_resident ON wallet_transactions(resident_id);
CREATE INDEX idx_wallet_tx_date ON wallet_transactions(resident_id, date);
CREATE INDEX idx_wallet_budgets_resident ON wallet_budgets(resident_id, month);

-- RLS
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_budgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wallet_tx_own" ON wallet_transactions
  FOR ALL USING (resident_id IN (SELECT id FROM residents WHERE user_id = auth.uid()));

CREATE POLICY "wallet_budget_own" ON wallet_budgets
  FOR ALL USING (resident_id IN (SELECT id FROM residents WHERE user_id = auth.uid()));
