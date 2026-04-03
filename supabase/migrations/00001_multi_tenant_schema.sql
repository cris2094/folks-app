-- ============================================
-- FOLKS: Multi-Tenant Schema + RLS
-- Migration 00001: Foundation tables
-- ============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE user_role AS ENUM ('admin', 'residente', 'portero', 'super_admin');
CREATE TYPE document_type AS ENUM ('cc', 'ce', 'passport');
CREATE TYPE vehicle_type AS ENUM ('car', 'motorcycle', 'bicycle');
CREATE TYPE pet_species AS ENUM ('dog', 'cat', 'other');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'overdue', 'cancelled');
CREATE TYPE payment_concept AS ENUM ('admin_fee', 'zone_reservation', 'penalty', 'other');
CREATE TYPE package_status AS ENUM ('received', 'notified', 'delivered');
CREATE TYPE reservation_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'rated');
CREATE TYPE ticket_category AS ENUM ('maintenance', 'noise', 'security', 'billing', 'suggestion', 'other');
CREATE TYPE announcement_category AS ENUM ('general', 'maintenance', 'billing', 'event', 'emergency');
CREATE TYPE notification_type AS ENUM ('package', 'payment', 'announcement', 'visitor', 'reservation', 'pqr');

-- ============================================
-- HELPER FUNCTIONS FOR RLS
-- ============================================

CREATE OR REPLACE FUNCTION auth.tenant_id() RETURNS uuid AS $$
  SELECT COALESCE(
    (auth.jwt()->>'tenant_id')::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid
  )
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION auth.user_role() RETURNS text AS $$
  SELECT COALESCE(
    auth.jwt()->>'user_role',
    'residente'
  )
$$ LANGUAGE sql STABLE;

-- ============================================
-- TABLES
-- ============================================

-- Tenants (conjuntos residenciales)
CREATE TABLE tenants (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  logo_url text,
  primary_color text DEFAULT '#2563eb',
  secondary_color text DEFAULT '#f97316',
  address text NOT NULL,
  city text NOT NULL,
  department text NOT NULL,
  nit text,
  admin_email text NOT NULL,
  admin_phone text,
  total_units integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Units (apartamentos/casas)
CREATE TABLE units (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  tower text NOT NULL,
  apartment text NOT NULL,
  cadastral_number text,
  area_m2 numeric(8,2),
  parking_spot text,
  admin_fee_cop numeric(12,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(tenant_id, tower, apartment)
);

-- Residents (residentes vinculados a unidades)
CREATE TABLE residents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  unit_id uuid NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  document_type document_type NOT NULL DEFAULT 'cc',
  document_number text NOT NULL,
  email text,
  phone text,
  role user_role NOT NULL DEFAULT 'residente',
  is_owner boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Vehicles
CREATE TABLE vehicles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  unit_id uuid NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  resident_id uuid NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
  plate text NOT NULL,
  type vehicle_type NOT NULL DEFAULT 'car',
  color text,
  brand text,
  parking_spot text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(tenant_id, plate)
);

-- Pets
CREATE TABLE pets (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  unit_id uuid NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  resident_id uuid NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
  name text NOT NULL,
  species pet_species NOT NULL DEFAULT 'dog',
  breed text,
  vaccination_up_to_date boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Zones (zonas sociales)
CREATE TABLE zones (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  icon text,
  photo_url text,
  price_cop numeric(12,2) DEFAULT 0,
  max_duration_hours integer DEFAULT 4,
  max_guests integer DEFAULT 10,
  max_reservations_per_month integer DEFAULT 2,
  is_active boolean DEFAULT true,
  schedule jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Reservations
CREATE TABLE reservations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  zone_id uuid NOT NULL REFERENCES zones(id) ON DELETE CASCADE,
  unit_id uuid NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  resident_id uuid NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
  date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  guests_count integer DEFAULT 0,
  status reservation_status NOT NULL DEFAULT 'pending',
  payment_id uuid,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Reservation guests
CREATE TABLE reservation_guests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  reservation_id uuid NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  document_number text,
  created_at timestamptz DEFAULT now()
);

-- Payments
CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  unit_id uuid NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  concept payment_concept NOT NULL DEFAULT 'admin_fee',
  description text,
  amount_cop numeric(12,2) NOT NULL,
  due_date date NOT NULL,
  paid_at timestamptz,
  status payment_status NOT NULL DEFAULT 'pending',
  payment_ref text,
  wompi_transaction_id text,
  receipt_url text,
  late_fee_cop numeric(12,2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Packages
CREATE TABLE packages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  unit_id uuid NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  description text NOT NULL,
  photo_url text,
  received_by text NOT NULL,
  received_at timestamptz DEFAULT now(),
  delivered_at timestamptz,
  delivered_to text,
  signature_url text,
  status package_status NOT NULL DEFAULT 'received',
  created_at timestamptz DEFAULT now()
);

-- Announcements
CREATE TABLE announcements (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text NOT NULL,
  category announcement_category NOT NULL DEFAULT 'general',
  created_by uuid NOT NULL REFERENCES residents(id),
  is_pinned boolean DEFAULT false,
  attachments text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Notifications
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  data jsonb DEFAULT '{}',
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Tickets (PQR)
CREATE TABLE tickets (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  unit_id uuid NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  resident_id uuid NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
  category ticket_category NOT NULL DEFAULT 'other',
  subject text NOT NULL,
  description text NOT NULL,
  status ticket_status NOT NULL DEFAULT 'open',
  rating integer CHECK (rating >= 1 AND rating <= 5),
  assigned_to uuid REFERENCES residents(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

-- Ticket messages (chat)
CREATE TABLE ticket_messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id uuid NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES residents(id),
  message text NOT NULL,
  attachments text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Visitors
CREATE TABLE visitors (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  unit_id uuid NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  authorized_by uuid NOT NULL REFERENCES residents(id),
  full_name text NOT NULL,
  document_number text,
  phone text,
  reason text,
  is_favorite boolean DEFAULT false,
  group_name text,
  authorized_until timestamptz,
  arrived_at timestamptz,
  left_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_units_tenant ON units(tenant_id);
CREATE INDEX idx_residents_tenant ON residents(tenant_id);
CREATE INDEX idx_residents_unit ON residents(unit_id);
CREATE INDEX idx_residents_user ON residents(user_id);
CREATE INDEX idx_vehicles_tenant ON vehicles(tenant_id);
CREATE INDEX idx_pets_tenant ON pets(tenant_id);
CREATE INDEX idx_zones_tenant ON zones(tenant_id);
CREATE INDEX idx_reservations_tenant ON reservations(tenant_id);
CREATE INDEX idx_reservations_zone_date ON reservations(zone_id, date);
CREATE INDEX idx_payments_tenant ON payments(tenant_id);
CREATE INDEX idx_payments_unit_status ON payments(unit_id, status);
CREATE INDEX idx_payments_due_date ON payments(due_date);
CREATE INDEX idx_packages_tenant ON packages(tenant_id);
CREATE INDEX idx_packages_unit_status ON packages(unit_id, status);
CREATE INDEX idx_announcements_tenant ON announcements(tenant_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, read);
CREATE INDEX idx_tickets_tenant ON tickets(tenant_id);
CREATE INDEX idx_tickets_unit ON tickets(unit_id);
CREATE INDEX idx_visitors_tenant ON visitors(tenant_id);
CREATE INDEX idx_visitors_unit ON visitors(unit_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE residents ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservation_guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;

-- Tenants: users can see their own tenant
CREATE POLICY "tenant_select" ON tenants
  FOR SELECT USING (id = auth.tenant_id());

-- Super admin can see all tenants
CREATE POLICY "tenant_super_admin" ON tenants
  FOR ALL USING (auth.user_role() = 'super_admin');

-- Units: filtered by tenant
CREATE POLICY "units_tenant" ON units
  FOR SELECT USING (tenant_id = auth.tenant_id());

CREATE POLICY "units_admin_manage" ON units
  FOR ALL USING (tenant_id = auth.tenant_id() AND auth.user_role() IN ('admin', 'super_admin'));

-- Residents: filtered by tenant, residents see their unit only
CREATE POLICY "residents_select_own" ON residents
  FOR SELECT USING (
    tenant_id = auth.tenant_id() AND (
      user_id = auth.uid() OR
      auth.user_role() IN ('admin', 'portero', 'super_admin')
    )
  );

CREATE POLICY "residents_admin_manage" ON residents
  FOR ALL USING (tenant_id = auth.tenant_id() AND auth.user_role() IN ('admin', 'super_admin'));

-- Vehicles: same pattern
CREATE POLICY "vehicles_select" ON vehicles
  FOR SELECT USING (tenant_id = auth.tenant_id());

CREATE POLICY "vehicles_admin_manage" ON vehicles
  FOR ALL USING (tenant_id = auth.tenant_id() AND auth.user_role() IN ('admin', 'super_admin'));

-- Pets: same pattern
CREATE POLICY "pets_select" ON pets
  FOR SELECT USING (tenant_id = auth.tenant_id());

CREATE POLICY "pets_admin_manage" ON pets
  FOR ALL USING (tenant_id = auth.tenant_id() AND auth.user_role() IN ('admin', 'super_admin'));

-- Zones: all residents can see, admin manages
CREATE POLICY "zones_select" ON zones
  FOR SELECT USING (tenant_id = auth.tenant_id());

CREATE POLICY "zones_admin_manage" ON zones
  FOR ALL USING (tenant_id = auth.tenant_id() AND auth.user_role() IN ('admin', 'super_admin'));

-- Reservations: residents see own, admin sees all
CREATE POLICY "reservations_select" ON reservations
  FOR SELECT USING (
    tenant_id = auth.tenant_id() AND (
      resident_id IN (SELECT id FROM residents WHERE user_id = auth.uid()) OR
      auth.user_role() IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "reservations_insert" ON reservations
  FOR INSERT WITH CHECK (tenant_id = auth.tenant_id());

CREATE POLICY "reservations_admin_manage" ON reservations
  FOR ALL USING (tenant_id = auth.tenant_id() AND auth.user_role() IN ('admin', 'super_admin'));

-- Reservation guests: via reservation access
CREATE POLICY "reservation_guests_select" ON reservation_guests
  FOR SELECT USING (
    reservation_id IN (
      SELECT id FROM reservations WHERE tenant_id = auth.tenant_id()
    )
  );

CREATE POLICY "reservation_guests_insert" ON reservation_guests
  FOR INSERT WITH CHECK (
    reservation_id IN (
      SELECT id FROM reservations WHERE tenant_id = auth.tenant_id()
    )
  );

-- Payments: residents see own unit, admin sees all
CREATE POLICY "payments_select" ON payments
  FOR SELECT USING (
    tenant_id = auth.tenant_id() AND (
      unit_id IN (SELECT unit_id FROM residents WHERE user_id = auth.uid()) OR
      auth.user_role() IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "payments_admin_manage" ON payments
  FOR ALL USING (tenant_id = auth.tenant_id() AND auth.user_role() IN ('admin', 'super_admin'));

-- Packages: residents see own unit, portero and admin manage
CREATE POLICY "packages_select" ON packages
  FOR SELECT USING (
    tenant_id = auth.tenant_id() AND (
      unit_id IN (SELECT unit_id FROM residents WHERE user_id = auth.uid()) OR
      auth.user_role() IN ('admin', 'portero', 'super_admin')
    )
  );

CREATE POLICY "packages_portero_manage" ON packages
  FOR ALL USING (tenant_id = auth.tenant_id() AND auth.user_role() IN ('admin', 'portero', 'super_admin'));

-- Announcements: all can see, admin creates
CREATE POLICY "announcements_select" ON announcements
  FOR SELECT USING (tenant_id = auth.tenant_id());

CREATE POLICY "announcements_admin_manage" ON announcements
  FOR ALL USING (tenant_id = auth.tenant_id() AND auth.user_role() IN ('admin', 'super_admin'));

-- Notifications: users see own only
CREATE POLICY "notifications_select" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "notifications_update" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

-- Tickets: residents see own, admin sees all
CREATE POLICY "tickets_select" ON tickets
  FOR SELECT USING (
    tenant_id = auth.tenant_id() AND (
      resident_id IN (SELECT id FROM residents WHERE user_id = auth.uid()) OR
      auth.user_role() IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "tickets_insert" ON tickets
  FOR INSERT WITH CHECK (tenant_id = auth.tenant_id());

CREATE POLICY "tickets_admin_manage" ON tickets
  FOR ALL USING (tenant_id = auth.tenant_id() AND auth.user_role() IN ('admin', 'super_admin'));

-- Ticket messages: via ticket access
CREATE POLICY "ticket_messages_select" ON ticket_messages
  FOR SELECT USING (
    ticket_id IN (
      SELECT id FROM tickets WHERE tenant_id = auth.tenant_id()
    )
  );

CREATE POLICY "ticket_messages_insert" ON ticket_messages
  FOR INSERT WITH CHECK (
    ticket_id IN (
      SELECT id FROM tickets WHERE tenant_id = auth.tenant_id()
    )
  );

-- Visitors: residents see own unit, portero and admin manage
CREATE POLICY "visitors_select" ON visitors
  FOR SELECT USING (
    tenant_id = auth.tenant_id() AND (
      unit_id IN (SELECT unit_id FROM residents WHERE user_id = auth.uid()) OR
      auth.user_role() IN ('admin', 'portero', 'super_admin')
    )
  );

CREATE POLICY "visitors_insert" ON visitors
  FOR INSERT WITH CHECK (tenant_id = auth.tenant_id());

CREATE POLICY "visitors_admin_manage" ON visitors
  FOR ALL USING (tenant_id = auth.tenant_id() AND auth.user_role() IN ('admin', 'portero', 'super_admin'));

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tenants_updated_at BEFORE UPDATE ON tenants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER residents_updated_at BEFORE UPDATE ON residents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER announcements_updated_at BEFORE UPDATE ON announcements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tickets_updated_at BEFORE UPDATE ON tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
