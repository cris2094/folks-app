-- ============================================
-- FOLKS: Assemblies AI Schema
-- Migration 00003: MOD-013 Asambleas AI
-- ============================================
-- Decisions:
--   - Acta must comply with Art. 47 Ley 675/2001
--   - Audio → Whisper transcript → Claude generates minutes
--   - Commitments extracted as separate trackable entities
--   - Status machine: scheduled → in_progress → transcribing → generating → review → published

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE assembly_type AS ENUM ('ordinary', 'extraordinary');

CREATE TYPE assembly_status AS ENUM (
  'scheduled',
  'in_progress',
  'transcribing',
  'generating',
  'review',
  'published'
);

CREATE TYPE convocation_type AS ENUM ('first', 'second', 'universal');

CREATE TYPE attendee_role AS ENUM ('owner', 'delegate', 'tenant');

CREATE TYPE commitment_status AS ENUM ('pending', 'in_progress', 'completed', 'overdue');

-- ============================================
-- TABLES
-- ============================================

-- Asambleas
CREATE TABLE assemblies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  title text NOT NULL,
  type assembly_type NOT NULL DEFAULT 'ordinary',
  date timestamptz NOT NULL,
  location text,
  convocation_type convocation_type,
  quorum_required numeric(5,2),
  quorum_present numeric(5,2),
  total_units integer,
  units_present integer,
  status assembly_status NOT NULL DEFAULT 'scheduled',
  audio_url text,
  transcript text,
  minutes_html text,
  minutes_pdf_url text,
  president text,
  secretary text,
  created_by uuid REFERENCES residents(id),
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Asistentes de asamblea
CREATE TABLE assembly_attendees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assembly_id uuid NOT NULL REFERENCES assemblies(id) ON DELETE CASCADE,
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  resident_id uuid REFERENCES residents(id),
  unit_id uuid REFERENCES units(id),
  full_name text NOT NULL,
  role attendee_role NOT NULL DEFAULT 'owner',
  coefficient numeric(8,4),
  signature_url text,
  checked_in_at timestamptz DEFAULT now()
);

-- Puntos del orden del dia
CREATE TABLE agenda_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assembly_id uuid NOT NULL REFERENCES assemblies(id) ON DELETE CASCADE,
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  position integer NOT NULL,
  title text NOT NULL,
  description text,
  discussion_summary text,
  decision text,
  vote_for integer DEFAULT 0,
  vote_against integer DEFAULT 0,
  vote_abstain integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Compromisos extraidos de la asamblea
CREATE TABLE commitments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assembly_id uuid NOT NULL REFERENCES assemblies(id) ON DELETE CASCADE,
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  responsible text,
  responsible_id uuid REFERENCES residents(id),
  due_date date,
  status commitment_status NOT NULL DEFAULT 'pending',
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- INDEXES
-- ============================================

-- assemblies
CREATE INDEX idx_assemblies_tenant ON assemblies(tenant_id);
CREATE INDEX idx_assemblies_status ON assemblies(tenant_id, status);
CREATE INDEX idx_assemblies_date ON assemblies(tenant_id, date);

-- assembly_attendees
CREATE INDEX idx_assembly_attendees_assembly ON assembly_attendees(assembly_id);
CREATE INDEX idx_assembly_attendees_tenant ON assembly_attendees(tenant_id);

-- agenda_items
CREATE INDEX idx_agenda_items_assembly ON agenda_items(assembly_id);
CREATE INDEX idx_agenda_items_tenant ON agenda_items(tenant_id);

-- commitments
CREATE INDEX idx_commitments_assembly ON commitments(assembly_id);
CREATE INDEX idx_commitments_tenant ON commitments(tenant_id);
CREATE INDEX idx_commitments_status ON commitments(tenant_id, status);
CREATE INDEX idx_commitments_responsible ON commitments(responsible_id);
CREATE INDEX idx_commitments_due_date ON commitments(tenant_id, due_date);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE assemblies ENABLE ROW LEVEL SECURITY;
ALTER TABLE assembly_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE agenda_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE commitments ENABLE ROW LEVEL SECURITY;

-- Assemblies: residentes pueden ver (transparencia Ley 675), admin CRUD
CREATE POLICY "assemblies_select" ON assemblies
  FOR SELECT USING (tenant_id = public.tenant_id());

CREATE POLICY "assemblies_admin_manage" ON assemblies
  FOR ALL USING (
    tenant_id = public.tenant_id()
    AND public.user_role() IN ('admin', 'super_admin')
  );

-- Assembly attendees: residentes pueden ver, admin CRUD
CREATE POLICY "assembly_attendees_select" ON assembly_attendees
  FOR SELECT USING (tenant_id = public.tenant_id());

CREATE POLICY "assembly_attendees_admin_manage" ON assembly_attendees
  FOR ALL USING (
    tenant_id = public.tenant_id()
    AND public.user_role() IN ('admin', 'super_admin')
  );

-- Agenda items: residentes pueden ver, admin CRUD
CREATE POLICY "agenda_items_select" ON agenda_items
  FOR SELECT USING (tenant_id = public.tenant_id());

CREATE POLICY "agenda_items_admin_manage" ON agenda_items
  FOR ALL USING (
    tenant_id = public.tenant_id()
    AND public.user_role() IN ('admin', 'super_admin')
  );

-- Commitments: residentes pueden ver, admin CRUD
CREATE POLICY "commitments_select" ON commitments
  FOR SELECT USING (tenant_id = public.tenant_id());

CREATE POLICY "commitments_admin_manage" ON commitments
  FOR ALL USING (
    tenant_id = public.tenant_id()
    AND public.user_role() IN ('admin', 'super_admin')
  );

-- ============================================
-- UPDATED_AT TRIGGERS
-- ============================================

CREATE TRIGGER assemblies_updated_at BEFORE UPDATE ON assemblies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER commitments_updated_at BEFORE UPDATE ON commitments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
