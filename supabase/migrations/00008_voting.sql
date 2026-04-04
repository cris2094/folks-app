-- ============================================
-- MOD-014: Votaciones Electronicas
-- Ref: Cohabit.pdf p.11, REC-010 Marco Legal
-- ============================================

-- Polls (encuestas/votaciones)
CREATE TABLE polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  assembly_id UUID REFERENCES assemblies(id),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'simple',        -- 'simple' (si/no), 'multiple' (opciones), 'weighted' (por coeficiente)
  status TEXT NOT NULL DEFAULT 'draft',       -- 'draft', 'open', 'closed', 'cancelled'
  requires_quorum BOOLEAN DEFAULT true,
  quorum_percentage NUMERIC(5,2) DEFAULT 51.00,
  restricted BOOLEAN DEFAULT false,           -- true = requiere asamblea presencial (70% coeficientes)
  opens_at TIMESTAMPTZ,
  closes_at TIMESTAMPTZ,
  created_by UUID REFERENCES residents(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Poll options
CREATE TABLE poll_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  label TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Votes
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  option_id UUID NOT NULL REFERENCES poll_options(id),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  resident_id UUID NOT NULL REFERENCES residents(id),
  unit_id UUID REFERENCES units(id),
  coefficient NUMERIC(8,4),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(poll_id, resident_id)
);

-- Indexes
CREATE INDEX idx_polls_tenant ON polls(tenant_id);
CREATE INDEX idx_polls_status ON polls(tenant_id, status);
CREATE INDEX idx_poll_options_poll ON poll_options(poll_id);
CREATE INDEX idx_votes_poll ON votes(poll_id);
CREATE INDEX idx_votes_resident ON votes(resident_id);
CREATE INDEX idx_votes_tenant ON votes(tenant_id);

-- RLS
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Polls: everyone can see, admin can manage
CREATE POLICY "polls_select" ON polls
  FOR SELECT USING (tenant_id = public.tenant_id());

CREATE POLICY "polls_admin" ON polls
  FOR ALL USING (
    tenant_id = public.tenant_id()
    AND public.user_role() IN ('admin', 'super_admin')
  );

-- Poll options: everyone can see, admin can manage
CREATE POLICY "poll_options_select" ON poll_options
  FOR SELECT USING (tenant_id = public.tenant_id());

CREATE POLICY "poll_options_admin" ON poll_options
  FOR ALL USING (
    tenant_id = public.tenant_id()
    AND public.user_role() IN ('admin', 'super_admin')
  );

-- Votes: residents can see and insert their own, admin can see all
CREATE POLICY "votes_select" ON votes
  FOR SELECT USING (tenant_id = public.tenant_id());

CREATE POLICY "votes_insert" ON votes
  FOR INSERT WITH CHECK (
    tenant_id = public.tenant_id()
    AND resident_id = public.current_resident_id()
  );

CREATE POLICY "votes_admin" ON votes
  FOR ALL USING (
    tenant_id = public.tenant_id()
    AND public.user_role() IN ('admin', 'super_admin')
  );
