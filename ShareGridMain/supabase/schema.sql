-- ====================================================================
-- SHAREGRID INDIA PRODUCTION SUPABASE / POSTGRESQL SCHEMA
-- Integrated Resource Management, Fair Allocation & Verified Booking
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Profiles Table (Linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('borrower', 'owner', 'admin')),
  institution TEXT NOT NULL,
  department TEXT NOT NULL,
  title TEXT,
  phone TEXT,
  verification_status TEXT NOT NULL DEFAULT 'unverified' 
    CHECK (verification_status IN ('unverified', 'pending', 'approved', 'rejected')),
  verification_documents TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Resources Table
CREATE TABLE IF NOT EXISTS public.resources (
  id TEXT PRIMARY KEY,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  category_label TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  image TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  institution_name TEXT NOT NULL,
  department TEXT NOT NULL,
  campus TEXT NOT NULL,
  building TEXT NOT NULL,
  city TEXT NOT NULL,
  room TEXT,
  hourly_rate NUMERIC,
  daily_rate NUMERIC,
  currency TEXT DEFAULT '₹',
  billing_type TEXT DEFAULT 'hourly',
  subsidized_for_academia BOOLEAN DEFAULT TRUE,
  specifications JSONB DEFAULT '[]'::jsonb,
  availability_status TEXT DEFAULT 'available' CHECK (availability_status IN ('available', 'in-use', 'maintenance', 'restricted')),
  active BOOLEAN DEFAULT TRUE,
  condition TEXT DEFAULT 'excellent',
  condition_label TEXT DEFAULT 'Excellent',
  approval_requirement TEXT DEFAULT 'host-approval',
  operator_assistance BOOLEAN DEFAULT FALSE,
  certification_required BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Resource Availability Slots
CREATE TABLE IF NOT EXISTS public.resource_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resource_id TEXT REFERENCES public.resources(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Bookings & Reservations Table
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY,
  resource_id TEXT REFERENCES public.resources(id) ON DELETE CASCADE,
  resource_title TEXT NOT NULL,
  resource_code TEXT NOT NULL,
  resource_image TEXT NOT NULL,
  borrower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  borrower_name TEXT NOT NULL,
  borrower_email TEXT NOT NULL,
  borrower_institution TEXT NOT NULL,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  institution_name TEXT NOT NULL,
  session_date DATE NOT NULL,
  session_time TEXT NOT NULL,
  duration_hours INT NOT NULL DEFAULT 2,
  with_operator BOOLEAN DEFAULT FALSE,
  project_brief TEXT NOT NULL,
  total_cost NUMERIC NOT NULL,
  currency TEXT DEFAULT '₹',
  status TEXT NOT NULL DEFAULT 'pending' 
    CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled', 'checked-in', 'completed')),
  rejection_reason TEXT,
  approval_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- DATABASE-LEVEL DOUBLE BOOKING CONFLICT PREVENTION
-- Prevents overlapping active reservations for the same resource on the same date & time slot
CREATE UNIQUE INDEX IF NOT EXISTS unique_active_resource_slot 
ON public.bookings (resource_id, session_date, session_time) 
WHERE status IN ('pending', 'approved', 'checked-in');

-- 6. Fair Allocation Waiting Lists Table
CREATE TABLE IF NOT EXISTS public.waiting_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resource_id TEXT REFERENCES public.resources(id) ON DELETE CASCADE,
  resource_title TEXT NOT NULL,
  institution_name TEXT NOT NULL,
  borrower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  borrower_name TEXT NOT NULL,
  borrower_email TEXT NOT NULL,
  borrower_institution TEXT NOT NULL,
  requested_date DATE NOT NULL,
  requested_slot TEXT NOT NULL,
  position INT NOT NULL DEFAULT 1,
  priority_score INT NOT NULL DEFAULT 85,
  allocation_reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'offered', 'expired', 'fulfilled')),
  joined_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Check-In & Check-Out Table
CREATE TABLE IF NOT EXISTS public.checkin_checkout (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id TEXT REFERENCES public.bookings(id) ON DELETE CASCADE,
  check_in_time TIMESTAMPTZ NOT NULL,
  check_in_verified_by TEXT NOT NULL,
  check_out_time TIMESTAMPTZ,
  check_out_verified_by TEXT,
  gate_pass_code TEXT NOT NULL,
  method TEXT DEFAULT 'qr-scan',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Condition Reports Table (Before-use & After-use)
CREATE TABLE IF NOT EXISTS public.condition_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id TEXT REFERENCES public.bookings(id) ON DELETE CASCADE,
  resource_id TEXT REFERENCES public.resources(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL CHECK (report_type IN ('before-use', 'after-use')),
  submitted_by TEXT NOT NULL,
  submitted_by_name TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  cleanliness_rating INT NOT NULL CHECK (cleanliness_rating BETWEEN 1 AND 5),
  physical_defects_noted TEXT,
  accessories_present BOOLEAN DEFAULT TRUE,
  operational_check_passed BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Incidents & Damage Reporting Table
CREATE TABLE IF NOT EXISTS public.incidents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id TEXT REFERENCES public.bookings(id) ON DELETE CASCADE,
  resource_id TEXT REFERENCES public.resources(id) ON DELETE CASCADE,
  resource_title TEXT NOT NULL,
  reported_by_email TEXT NOT NULL,
  reported_by_name TEXT NOT NULL,
  reported_by_role TEXT NOT NULL,
  incident_type TEXT NOT NULL CHECK (incident_type IN ('equipment-damage', 'missing-component', 'calibration-loss', 'safety-violation')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'under-review' CHECK (status IN ('under-review', 'investigating', 'resolved')),
  admin_resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. In-App Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('booking', 'waiting_list', 'checkin', 'incident', 'verification')),
  read BOOLEAN DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Platform Audit Activity Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  action TEXT NOT NULL,
  actor_email TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  target_id TEXT,
  details TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('auth', 'booking', 'resource', 'verification', 'incident', 'allocation'))
);

-- 12. Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waiting_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkin_checkout ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.condition_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are readable" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins have full profile access" ON public.profiles USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Resources Policies
CREATE POLICY "Public resources are readable" ON public.resources FOR SELECT USING (true);
CREATE POLICY "Owners can manage own resources" ON public.resources FOR ALL USING (
  auth.uid() = owner_id OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Bookings Policies
CREATE POLICY "Borrowers can view own bookings" ON public.bookings FOR SELECT USING (
  auth.uid() = borrower_id OR 
  auth.uid() = owner_id OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Borrowers can insert bookings" ON public.bookings FOR INSERT WITH CHECK (
  auth.uid() = borrower_id
);
CREATE POLICY "Owners and Borrowers can update booking" ON public.bookings FOR UPDATE USING (
  auth.uid() = owner_id OR 
  auth.uid() = borrower_id OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Waiting Lists Policies
CREATE POLICY "Users can view own waiting list entries" ON public.waiting_lists FOR SELECT USING (
  auth.uid() = borrower_id OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'owner'))
);
CREATE POLICY "Users can join waiting lists" ON public.waiting_lists FOR INSERT WITH CHECK (
  auth.uid() = borrower_id
);

-- Notifications Policies
CREATE POLICY "Users view own notifications" ON public.notifications FOR ALL USING (
  user_email = (SELECT email FROM public.profiles WHERE id = auth.uid())
);

-- Audit Logs Policies
CREATE POLICY "Admins view all audit logs" ON public.audit_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
