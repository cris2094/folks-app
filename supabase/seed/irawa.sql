-- ============================================
-- SEED: IRAWA - Conjunto Residencial Piloto
-- Floridablanca, Santander - 304 unidades
-- ============================================

-- Insert IRAWA tenant
INSERT INTO tenants (id, name, slug, address, city, department, nit, admin_email, admin_phone, total_units, primary_color, secondary_color)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'Conjunto Residencial IRAWA',
  'irawa',
  'Cra 15 #56-78, Canaveral',
  'Floridablanca',
  'Santander',
  '901234567-8',
  'admin@irawa.co',
  '+573001234567',
  304,
  '#2563eb',
  '#f97316'
);

-- Insert sample units (Tower 1, floors 1-17, 6 apts per floor)
-- Just a representative sample
INSERT INTO units (tenant_id, tower, apartment, admin_fee_cop) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Torre 1', '101', 167000),
  ('a0000000-0000-0000-0000-000000000001', 'Torre 1', '102', 185000),
  ('a0000000-0000-0000-0000-000000000001', 'Torre 1', '103', 210000),
  ('a0000000-0000-0000-0000-000000000001', 'Torre 1', '201', 167000),
  ('a0000000-0000-0000-0000-000000000001', 'Torre 1', '202', 185000),
  ('a0000000-0000-0000-0000-000000000001', 'Torre 1', '203', 210000),
  ('a0000000-0000-0000-0000-000000000001', 'Torre 2', '101', 230000),
  ('a0000000-0000-0000-0000-000000000001', 'Torre 2', '102', 250000),
  ('a0000000-0000-0000-0000-000000000001', 'Torre 2', '201', 230000),
  ('a0000000-0000-0000-0000-000000000001', 'Torre 2', '202', 250000),
  ('a0000000-0000-0000-0000-000000000001', 'Torre 3', '101', 290000),
  ('a0000000-0000-0000-0000-000000000001', 'Torre 3', '102', 341000),
  ('a0000000-0000-0000-0000-000000000001', 'Torre 3', '201', 290000),
  ('a0000000-0000-0000-0000-000000000001', 'Torre 3', '202', 341000);

-- Insert IRAWA zones (13 amenities)
INSERT INTO zones (tenant_id, name, description, icon, price_cop, max_duration_hours, max_guests, max_reservations_per_month, is_active, schedule) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Piscina', 'Piscina para adultos y ninos', '🏊', 0, 4, 6, 4, true,
   '{"lunes":{"open":"08:00","close":"20:00"},"martes":{"open":"08:00","close":"20:00"},"miercoles":{"open":"08:00","close":"20:00"},"jueves":{"open":"08:00","close":"20:00"},"viernes":{"open":"08:00","close":"20:00"},"sabado":{"open":"08:00","close":"21:00"},"domingo":{"open":"08:00","close":"21:00"}}'),

  ('a0000000-0000-0000-0000-000000000001', 'BBQ', 'Zona de asados con parrilla y meson', '🔥', 100000, 6, 20, 2, true,
   '{"lunes":{"open":"10:00","close":"22:00"},"martes":{"open":"10:00","close":"22:00"},"miercoles":{"open":"10:00","close":"22:00"},"jueves":{"open":"10:00","close":"22:00"},"viernes":{"open":"10:00","close":"22:00"},"sabado":{"open":"10:00","close":"23:00"},"domingo":{"open":"10:00","close":"22:00"}}'),

  ('a0000000-0000-0000-0000-000000000001', 'Terraza ZEN', 'Espacio de relajacion y meditacion', '🧘', 0, 2, 4, 4, true,
   '{"lunes":{"open":"06:00","close":"21:00"},"martes":{"open":"06:00","close":"21:00"},"miercoles":{"open":"06:00","close":"21:00"},"jueves":{"open":"06:00","close":"21:00"},"viernes":{"open":"06:00","close":"21:00"},"sabado":{"open":"06:00","close":"21:00"},"domingo":{"open":"06:00","close":"21:00"}}'),

  ('a0000000-0000-0000-0000-000000000001', 'Salon Social', 'Salon para eventos y reuniones', '🎉', 150000, 8, 50, 1, true,
   '{"lunes":{"open":"08:00","close":"23:00"},"martes":{"open":"08:00","close":"23:00"},"miercoles":{"open":"08:00","close":"23:00"},"jueves":{"open":"08:00","close":"23:00"},"viernes":{"open":"08:00","close":"23:00"},"sabado":{"open":"08:00","close":"24:00"},"domingo":{"open":"08:00","close":"22:00"}}'),

  ('a0000000-0000-0000-0000-000000000001', 'Cancha Multiple', 'Futbol, basquetbol, voleibol', '⚽', 0, 2, 12, 4, true,
   '{"lunes":{"open":"06:00","close":"22:00"},"martes":{"open":"06:00","close":"22:00"},"miercoles":{"open":"06:00","close":"22:00"},"jueves":{"open":"06:00","close":"22:00"},"viernes":{"open":"06:00","close":"22:00"},"sabado":{"open":"06:00","close":"22:00"},"domingo":{"open":"06:00","close":"22:00"}}'),

  ('a0000000-0000-0000-0000-000000000001', 'Coworking', 'Espacio de trabajo compartido', '💻', 0, 4, 2, 8, true,
   '{"lunes":{"open":"07:00","close":"21:00"},"martes":{"open":"07:00","close":"21:00"},"miercoles":{"open":"07:00","close":"21:00"},"jueves":{"open":"07:00","close":"21:00"},"viernes":{"open":"07:00","close":"21:00"},"sabado":{"open":"08:00","close":"18:00"},"domingo":null}'),

  ('a0000000-0000-0000-0000-000000000001', 'Gimnasio', 'Equipos de cardio y fuerza', '🏋️', 0, 2, 15, 30, true,
   '{"lunes":{"open":"05:00","close":"22:00"},"martes":{"open":"05:00","close":"22:00"},"miercoles":{"open":"05:00","close":"22:00"},"jueves":{"open":"05:00","close":"22:00"},"viernes":{"open":"05:00","close":"22:00"},"sabado":{"open":"06:00","close":"20:00"},"domingo":{"open":"06:00","close":"20:00"}}'),

  ('a0000000-0000-0000-0000-000000000001', 'Sauna', 'Sauna humedo', '🧖', 0, 1, 6, 4, true,
   '{"lunes":{"open":"06:00","close":"21:00"},"martes":{"open":"06:00","close":"21:00"},"miercoles":{"open":"06:00","close":"21:00"},"jueves":{"open":"06:00","close":"21:00"},"viernes":{"open":"06:00","close":"21:00"},"sabado":{"open":"06:00","close":"21:00"},"domingo":{"open":"06:00","close":"21:00"}}'),

  ('a0000000-0000-0000-0000-000000000001', 'Turco', 'Bano turco', '♨️', 0, 1, 6, 4, true,
   '{"lunes":{"open":"06:00","close":"21:00"},"martes":{"open":"06:00","close":"21:00"},"miercoles":{"open":"06:00","close":"21:00"},"jueves":{"open":"06:00","close":"21:00"},"viernes":{"open":"06:00","close":"21:00"},"sabado":{"open":"06:00","close":"21:00"},"domingo":{"open":"06:00","close":"21:00"}}'),

  ('a0000000-0000-0000-0000-000000000001', 'Mini-golf', 'Campo de mini-golf 9 hoyos', '⛳', 0, 2, 8, 4, true,
   '{"lunes":{"open":"08:00","close":"20:00"},"martes":{"open":"08:00","close":"20:00"},"miercoles":{"open":"08:00","close":"20:00"},"jueves":{"open":"08:00","close":"20:00"},"viernes":{"open":"08:00","close":"20:00"},"sabado":{"open":"08:00","close":"21:00"},"domingo":{"open":"08:00","close":"21:00"}}'),

  ('a0000000-0000-0000-0000-000000000001', 'Parque Infantil', 'Juegos para ninos de 2 a 12 anos', '🎠', 0, 3, 10, 30, true,
   '{"lunes":{"open":"07:00","close":"20:00"},"martes":{"open":"07:00","close":"20:00"},"miercoles":{"open":"07:00","close":"20:00"},"jueves":{"open":"07:00","close":"20:00"},"viernes":{"open":"07:00","close":"20:00"},"sabado":{"open":"07:00","close":"21:00"},"domingo":{"open":"07:00","close":"21:00"}}'),

  ('a0000000-0000-0000-0000-000000000001', 'Salon de Juegos', 'Billar, ping-pong, futbolin', '🎱', 0, 2, 8, 4, true,
   '{"lunes":{"open":"08:00","close":"22:00"},"martes":{"open":"08:00","close":"22:00"},"miercoles":{"open":"08:00","close":"22:00"},"jueves":{"open":"08:00","close":"22:00"},"viernes":{"open":"08:00","close":"22:00"},"sabado":{"open":"08:00","close":"23:00"},"domingo":{"open":"08:00","close":"22:00"}}'),

  ('a0000000-0000-0000-0000-000000000001', 'Parque de Mascotas', 'Area cercada para mascotas', '🐕', 0, 2, 4, 30, true,
   '{"lunes":{"open":"06:00","close":"21:00"},"martes":{"open":"06:00","close":"21:00"},"miercoles":{"open":"06:00","close":"21:00"},"jueves":{"open":"06:00","close":"21:00"},"viernes":{"open":"06:00","close":"21:00"},"sabado":{"open":"06:00","close":"21:00"},"domingo":{"open":"06:00","close":"21:00"}}');
