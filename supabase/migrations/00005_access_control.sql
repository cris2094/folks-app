-- ============================================
-- MOD-008: Access Control / Visitors
-- Migration 00005: access_logs, frequent_contacts + visitors columns
-- ============================================

-- Visitors: add missing columns (table already exists in 00001)
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT false;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS group_name TEXT;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS vehicle_plate TEXT;

-- ============================================
-- ACCESS LOGS
-- ============================================

CREATE TABLE IF NOT EXISTS access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  visitor_id UUID REFERENCES visitors(id),
  unit_id UUID REFERENCES units(id),
  action TEXT NOT NULL, -- 'entry', 'exit', 'denied'
  method TEXT DEFAULT 'manual', -- 'manual', 'qr', 'app', 'whatsapp'
  registered_by UUID REFERENCES residents(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- FREQUENT CONTACTS
-- ============================================

CREATE TABLE IF NOT EXISTS frequent_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  resident_id UUID NOT NULL REFERENCES residents(id),
  name TEXT NOT NULL,
  document TEXT,
  phone TEXT,
  relationship TEXT, -- 'family', 'friend', 'service', 'delivery'
  photo_url TEXT,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE frequent_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "access_logs_select" ON access_logs
  FOR SELECT USING (tenant_id = public.tenant_id());

CREATE POLICY "access_logs_insert" ON access_logs
  FOR INSERT WITH CHECK (tenant_id = public.tenant_id());

CREATE POLICY "contacts_select" ON frequent_contacts
  FOR SELECT USING (tenant_id = public.tenant_id());

CREATE POLICY "contacts_all" ON frequent_contacts
  FOR ALL USING (tenant_id = public.tenant_id());

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_access_logs_tenant ON access_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_access_logs_visitor ON access_logs(visitor_id);
CREATE INDEX IF NOT EXISTS idx_frequent_contacts_resident ON frequent_contacts(resident_id);
