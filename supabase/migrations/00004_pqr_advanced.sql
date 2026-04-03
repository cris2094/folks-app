-- ============================================
-- FOLKS: PQR Advanced (MOD-007)
-- Migration 00004: Priority, scheduling, rating metadata
-- ============================================

-- New enum for priority levels
CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- Extend tickets table with new columns
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS priority ticket_priority DEFAULT 'medium';
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS rated_at TIMESTAMPTZ;
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS scheduled_date TIMESTAMPTZ;

-- Extend ticket_categories enum with new values
ALTER TYPE ticket_category ADD VALUE IF NOT EXISTS 'common_areas';
ALTER TYPE ticket_category ADD VALUE IF NOT EXISTS 'parking';
ALTER TYPE ticket_category ADD VALUE IF NOT EXISTS 'pets';

-- Add tenant_id to ticket_messages for RLS
ALTER TABLE ticket_messages ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;

-- Backfill tenant_id from tickets
UPDATE ticket_messages SET tenant_id = t.tenant_id
FROM tickets t WHERE ticket_messages.ticket_id = t.id
AND ticket_messages.tenant_id IS NULL;

-- Make tenant_id NOT NULL after backfill
-- ALTER TABLE ticket_messages ALTER COLUMN tenant_id SET NOT NULL;

-- RLS for ticket_messages (add policies if not present)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'ticket_messages' AND policyname = 'messages_select'
  ) THEN
    CREATE POLICY "messages_select" ON ticket_messages
      FOR SELECT USING (tenant_id = public.tenant_id());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'ticket_messages' AND policyname = 'messages_insert'
  ) THEN
    CREATE POLICY "messages_insert" ON ticket_messages
      FOR INSERT WITH CHECK (tenant_id = public.tenant_id());
  END IF;
END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket ON ticket_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_tickets_category ON tickets(category);
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON tickets(priority);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
