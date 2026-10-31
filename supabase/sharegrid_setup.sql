-- ====================================================================
-- SHAREGRID CORRECTED SUPABASE SETUP
-- Purpose: secure, normalized schema for profiles, institutions, resources,
-- availability, bookings, waiting lists, check-ins, condition reports,
-- incidents, notifications, and audit logs.
--
-- IMPORTANT:
-- - This is a review migration file. It is not executed here.
-- - It intentionally does not overwrite the original schema.sql.
-- - Admin changes are protected by database triggers, not only by policy text.
-- ====================================================================

BEGIN;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Refuse the legacy schema.sql layout rather than silently skipping columns
-- with CREATE TABLE IF NOT EXISTS and failing later partway through setup.
DO $$
BEGIN
  IF to_regclass('public.resources') IS NOT NULL
     AND NOT EXISTS (
       SELECT 1
       FROM information_schema.columns
       WHERE table_schema = 'public'
         AND table_name = 'resources'
         AND column_name = 'institution_id'
     ) THEN
    RAISE EXCEPTION
      'Legacy SHAREGRID tables detected. Back up the database and use a dedicated data migration before applying sharegrid_setup.sql.';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND policyname IN (
        'Public profiles are readable',
        'Users can update own profile',
        'Admins have full profile access',
        'Public resources are readable',
        'Owners can manage own resources',
        'Borrowers can view own bookings',
        'Borrowers can insert bookings',
        'Owners and Borrowers can update booking',
        'Users can view own waiting list entries',
        'Users can join waiting lists',
        'Users view own notifications',
        'Admins view all audit logs'
      )
  ) THEN
    RAISE EXCEPTION
      'Legacy SHAREGRID RLS policies detected. Back up the database and use a dedicated data migration before applying sharegrid_setup.sql.';
  END IF;
END
$$;

-- --------------------------------------------------------------------
-- 1. Institutions
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.institutions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  short_name TEXT,
  country TEXT NOT NULL DEFAULT 'India',
  city TEXT NOT NULL,
  state TEXT,
  campus TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 2. Profiles
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('borrower', 'owner', 'admin')),
  institution_id UUID REFERENCES public.institutions(id) ON DELETE SET NULL,
  institution TEXT NOT NULL,
  department TEXT NOT NULL,
  title TEXT,
  phone TEXT,
  verification_status TEXT NOT NULL DEFAULT 'unverified'
    CHECK (verification_status IN ('unverified', 'pending', 'approved', 'rejected')),
  verification_documents TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.institution_memberships (
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  membership_role TEXT NOT NULL DEFAULT 'member'
    CHECK (membership_role IN ('member', 'manager')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (institution_id, user_id)
);

-- --------------------------------------------------------------------
-- 3. Resources
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.resources (
  id TEXT PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  institution_id UUID REFERENCES public.institutions(id) ON DELETE SET NULL,
  visibility TEXT NOT NULL DEFAULT 'public'
    CHECK (visibility IN ('public', 'institution')),
  title TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  category_label TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  image TEXT NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  institution_name TEXT NOT NULL,
  department TEXT NOT NULL,
  campus TEXT NOT NULL,
  building TEXT NOT NULL,
  city TEXT NOT NULL,
  room TEXT,
  hourly_rate NUMERIC(12,2),
  daily_rate NUMERIC(12,2),
  currency TEXT NOT NULL DEFAULT '₹',
  billing_type TEXT NOT NULL DEFAULT 'hourly' CHECK (billing_type IN ('hourly', 'daily', 'project')),
  subsidized_for_academia BOOLEAN NOT NULL DEFAULT TRUE,
  specifications JSONB NOT NULL DEFAULT '[]'::jsonb,
  availability_status TEXT NOT NULL DEFAULT 'available'
    CHECK (availability_status IN ('available', 'in-use', 'maintenance', 'restricted')),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  condition TEXT NOT NULL DEFAULT 'excellent'
    CHECK (condition IN ('new', 'excellent', 'good', 'certified')),
  condition_label TEXT NOT NULL DEFAULT 'Excellent',
  approval_requirement TEXT NOT NULL DEFAULT 'host-approval'
    CHECK (approval_requirement IN ('instant', 'host-approval', 'dept-signoff')),
  operator_assistance BOOLEAN NOT NULL DEFAULT FALSE,
  certification_required BOOLEAN NOT NULL DEFAULT FALSE,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (COALESCE(hourly_rate, 0) >= 0),
  CHECK (COALESCE(daily_rate, 0) >= 0)
);

-- --------------------------------------------------------------------
-- 4. Resource availability slots
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.resource_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resource_id TEXT NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (resource_id, session_date, time_slot)
);

-- --------------------------------------------------------------------
-- 5. Bookings
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY,
  resource_id TEXT NOT NULL REFERENCES public.resources(id) ON DELETE RESTRICT,
  resource_title TEXT NOT NULL,
  resource_code TEXT NOT NULL,
  resource_image TEXT NOT NULL,
  borrower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  borrower_name TEXT NOT NULL,
  borrower_email TEXT NOT NULL,
  borrower_institution TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  institution_name TEXT NOT NULL,
  session_date DATE NOT NULL,
  session_time TEXT NOT NULL,
  duration_hours INTEGER NOT NULL CHECK (duration_hours BETWEEN 1 AND 24),
  with_operator BOOLEAN NOT NULL DEFAULT FALSE,
  project_brief TEXT NOT NULL,
  total_cost NUMERIC(12,2) NOT NULL CHECK (total_cost >= 0),
  currency TEXT NOT NULL DEFAULT '₹',
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled', 'checked-in', 'completed')),
  rejection_reason TEXT,
  approval_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (borrower_id <> owner_id),
  CHECK (session_time ~ '^([01][0-9]|2[0-3]):[0-5][0-9] - ([01][0-9]|2[0-3]):[0-5][0-9]$')
);

-- Prevent double-booking only for active / not-yet-completed bookings.
CREATE UNIQUE INDEX IF NOT EXISTS ux_bookings_active_slot
ON public.bookings (resource_id, session_date, session_time)
WHERE status IN ('pending', 'approved', 'checked-in');

-- --------------------------------------------------------------------
-- 6. Waiting lists
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.waiting_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resource_id TEXT NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
  resource_title TEXT NOT NULL,
  institution_name TEXT NOT NULL,
  borrower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  borrower_name TEXT NOT NULL,
  borrower_email TEXT NOT NULL,
  borrower_institution TEXT NOT NULL,
  requested_date DATE NOT NULL,
  requested_slot TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 1 CHECK (position >= 1),
  priority_score INTEGER NOT NULL DEFAULT 85 CHECK (priority_score BETWEEN 0 AND 100),
  allocation_reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'offered', 'expired', 'fulfilled')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (resource_id, borrower_id, requested_date, requested_slot)
);

-- --------------------------------------------------------------------
-- 7. Check-in and check-out
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.checkin_checkout (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id TEXT NOT NULL UNIQUE REFERENCES public.bookings(id) ON DELETE CASCADE,
  check_in_time TIMESTAMPTZ NOT NULL,
  check_in_verified_by TEXT NOT NULL,
  check_out_time TIMESTAMPTZ,
  check_out_verified_by TEXT,
  gate_pass_code TEXT NOT NULL,
  method TEXT NOT NULL DEFAULT 'qr-scan' CHECK (method IN ('qr-scan', 'manual-token')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (check_out_time IS NULL OR check_out_time >= check_in_time)
);

-- --------------------------------------------------------------------
-- 8. Condition reports
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.condition_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id TEXT NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  resource_id TEXT NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL CHECK (report_type IN ('before-use', 'after-use')),
  submitted_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  submitted_by_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  cleanliness_rating INTEGER NOT NULL CHECK (cleanliness_rating BETWEEN 1 AND 5),
  physical_defects_noted TEXT,
  accessories_present BOOLEAN NOT NULL DEFAULT TRUE,
  operational_check_passed BOOLEAN NOT NULL DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (booking_id, report_type)
);

-- --------------------------------------------------------------------
-- 9. Incidents
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.incidents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id TEXT REFERENCES public.bookings(id) ON DELETE SET NULL,
  resource_id TEXT NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
  resource_title TEXT NOT NULL,
  reported_by_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reported_by_email TEXT NOT NULL,
  reported_by_name TEXT NOT NULL,
  reported_by_role TEXT NOT NULL CHECK (reported_by_role IN ('borrower', 'owner', 'admin')),
  incident_type TEXT NOT NULL CHECK (incident_type IN ('equipment-damage', 'missing-component', 'calibration-loss', 'safety-violation')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'under-review' CHECK (status IN ('under-review', 'investigating', 'resolved')),
  admin_resolution_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 10. Notifications
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('booking', 'waiting_list', 'checkin', 'incident', 'verification')),
  read BOOLEAN NOT NULL DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 11. Audit logs
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  action TEXT NOT NULL,
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  actor_email TEXT NOT NULL,
  actor_role TEXT NOT NULL CHECK (actor_role IN ('borrower', 'owner', 'admin')),
  target_id TEXT,
  details TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('auth', 'booking', 'resource', 'verification', 'incident', 'allocation')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 12. Indexes
-- --------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_resources_owner_id ON public.resources(owner_id);
CREATE INDEX IF NOT EXISTS idx_resources_active ON public.resources(active);
CREATE INDEX IF NOT EXISTS idx_resources_institution ON public.resources(institution_id);
CREATE INDEX IF NOT EXISTS idx_institution_memberships_user_id ON public.institution_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_borrower_id ON public.bookings(borrower_id);
CREATE INDEX IF NOT EXISTS idx_bookings_owner_id ON public.bookings(owner_id);
CREATE INDEX IF NOT EXISTS idx_waiting_lists_resource_id ON public.waiting_lists(resource_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_condition_reports_booking_id ON public.condition_reports(booking_id);
CREATE INDEX IF NOT EXISTS idx_incidents_resource_id ON public.incidents(resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id ON public.audit_logs(actor_id);

-- --------------------------------------------------------------------
-- 13. Shared trigger: maintain updated_at
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'set_updated_at_institutions'
  ) THEN
    CREATE TRIGGER set_updated_at_institutions
    BEFORE UPDATE ON public.institutions
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'set_updated_at_profiles'
  ) THEN
    CREATE TRIGGER set_updated_at_profiles
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'set_updated_at_resources'
  ) THEN
    CREATE TRIGGER set_updated_at_resources
    BEFORE UPDATE ON public.resources
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'set_updated_at_resource_availability'
  ) THEN
    CREATE TRIGGER set_updated_at_resource_availability
    BEFORE UPDATE ON public.resource_availability
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'set_updated_at_bookings'
  ) THEN
    CREATE TRIGGER set_updated_at_bookings
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'set_updated_at_waiting_lists'
  ) THEN
    CREATE TRIGGER set_updated_at_waiting_lists
    BEFORE UPDATE ON public.waiting_lists
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'set_updated_at_checkin_checkout'
  ) THEN
    CREATE TRIGGER set_updated_at_checkin_checkout
    BEFORE UPDATE ON public.checkin_checkout
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'set_updated_at_condition_reports'
  ) THEN
    CREATE TRIGGER set_updated_at_condition_reports
    BEFORE UPDATE ON public.condition_reports
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'set_updated_at_incidents'
  ) THEN
    CREATE TRIGGER set_updated_at_incidents
    BEFORE UPDATE ON public.incidents
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'set_updated_at_notifications'
  ) THEN
    CREATE TRIGGER set_updated_at_notifications
    BEFORE UPDATE ON public.notifications
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- --------------------------------------------------------------------
-- 14. Admin-role protection trigger
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_sharegrid_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_sharegrid_institution_member(target_institution_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.institution_memberships
    WHERE institution_id = target_institution_id
      AND user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.is_sharegrid_approved_owner()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'owner'
      AND verification_status = 'approved'
  );
$$;

REVOKE ALL ON FUNCTION public.is_sharegrid_admin() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_sharegrid_institution_member(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_sharegrid_approved_owner() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_sharegrid_admin() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_sharegrid_institution_member(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_sharegrid_approved_owner() TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.enforce_admin_role_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    IF NEW.role = 'admin'
       OR NEW.verification_status NOT IN ('unverified', 'pending') THEN
      RAISE EXCEPTION 'New profiles cannot assign admin role or approved verification.';
    END IF;
  ELSIF (
    NEW.role IS DISTINCT FROM OLD.role
    OR NEW.verification_status IS DISTINCT FROM OLD.verification_status
  ) AND NOT public.is_sharegrid_admin() THEN
    RAISE EXCEPTION 'Only admins may change user role or verification status.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

DROP TRIGGER IF EXISTS profiles_admin_role_guard ON public.profiles;
CREATE TRIGGER profiles_admin_role_guard
BEFORE INSERT OR UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.enforce_admin_role_changes();

CREATE OR REPLACE FUNCTION public.guard_booking_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  actual_owner_id UUID;
BEGIN
  IF auth.uid() IS NULL OR public.is_sharegrid_admin() THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    SELECT owner_id
    INTO actual_owner_id
    FROM public.resources
    WHERE id = NEW.resource_id
      AND active = TRUE;

    IF actual_owner_id IS NULL
       OR NEW.owner_id IS DISTINCT FROM actual_owner_id
       OR NEW.borrower_id <> auth.uid()
       OR NEW.borrower_id = actual_owner_id
       OR NEW.status <> 'pending' THEN
      RAISE EXCEPTION 'Booking request is not valid for this resource or user.';
    END IF;
    RETURN NEW;
  END IF;

  IF NEW.id IS DISTINCT FROM OLD.id
     OR NEW.resource_id IS DISTINCT FROM OLD.resource_id
     OR NEW.resource_title IS DISTINCT FROM OLD.resource_title
     OR NEW.resource_code IS DISTINCT FROM OLD.resource_code
     OR NEW.resource_image IS DISTINCT FROM OLD.resource_image
     OR NEW.borrower_id IS DISTINCT FROM OLD.borrower_id
     OR NEW.borrower_name IS DISTINCT FROM OLD.borrower_name
     OR NEW.borrower_email IS DISTINCT FROM OLD.borrower_email
     OR NEW.borrower_institution IS DISTINCT FROM OLD.borrower_institution
     OR NEW.owner_id IS DISTINCT FROM OLD.owner_id
     OR NEW.institution_name IS DISTINCT FROM OLD.institution_name
     OR NEW.session_date IS DISTINCT FROM OLD.session_date
     OR NEW.session_time IS DISTINCT FROM OLD.session_time
     OR NEW.duration_hours IS DISTINCT FROM OLD.duration_hours
     OR NEW.with_operator IS DISTINCT FROM OLD.with_operator
     OR NEW.project_brief IS DISTINCT FROM OLD.project_brief
     OR NEW.total_cost IS DISTINCT FROM OLD.total_cost
     OR NEW.currency IS DISTINCT FROM OLD.currency
     OR NEW.created_at IS DISTINCT FROM OLD.created_at THEN
    RAISE EXCEPTION 'Booking identity and request details cannot be changed.';
  END IF;

  IF auth.uid() = OLD.borrower_id THEN
    IF NEW.status <> 'cancelled'
       OR OLD.status NOT IN ('pending', 'approved')
       OR NEW.approval_notes IS DISTINCT FROM OLD.approval_notes
       OR NEW.rejection_reason IS DISTINCT FROM OLD.rejection_reason THEN
      RAISE EXCEPTION 'Borrowers may only cancel their own pending or approved bookings.';
    END IF;
  ELSIF auth.uid() = OLD.owner_id THEN
    IF OLD.status <> 'pending'
       OR NEW.status NOT IN ('approved', 'rejected')
       OR NEW.rejection_reason IS DISTINCT FROM OLD.rejection_reason
          AND NEW.status <> 'rejected' THEN
      RAISE EXCEPTION 'Owners may only approve or reject pending bookings.';
    END IF;
  ELSE
    RAISE EXCEPTION 'Not authorized to modify this booking.';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS bookings_guard_changes ON public.bookings;
CREATE TRIGGER bookings_guard_changes
BEFORE INSERT OR UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.guard_booking_changes();

CREATE OR REPLACE FUNCTION public.prevent_booking_overlap()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  requested_start TIME;
BEGIN
  IF NEW.status NOT IN ('pending', 'approved', 'checked-in') THEN
    RETURN NEW;
  END IF;

  requested_start := split_part(NEW.session_time, ' - ', 1)::TIME;
  PERFORM pg_advisory_xact_lock(
    hashtextextended(NEW.resource_id, 0)
  );

  IF EXISTS (
    SELECT 1
    FROM public.bookings b
    WHERE b.resource_id = NEW.resource_id
      AND b.session_date BETWEEN NEW.session_date - 1 AND NEW.session_date + 1
      AND b.status IN ('pending', 'approved', 'checked-in')
      AND (TG_OP = 'INSERT' OR b.id <> NEW.id)
      AND (b.session_date + split_part(b.session_time, ' - ', 1)::TIME)
          < (NEW.session_date + requested_start + make_interval(hours => NEW.duration_hours))
      AND (NEW.session_date + requested_start)
          < (b.session_date + split_part(b.session_time, ' - ', 1)::TIME
             + make_interval(hours => b.duration_hours))
  ) THEN
    RAISE EXCEPTION 'The requested booking overlaps an active reservation.';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS bookings_prevent_overlap ON public.bookings;
CREATE TRIGGER bookings_prevent_overlap
BEFORE INSERT OR UPDATE OF resource_id, session_date, session_time, duration_hours, status
ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.prevent_booking_overlap();

-- --------------------------------------------------------------------
-- 15. RLS enablement
-- --------------------------------------------------------------------
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institution_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waiting_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkin_checkout ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.condition_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Private Storage buckets. Resource images are served through authorized
-- object access or signed URLs; verification documents are never public.
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('sharegrid-resource-images', 'sharegrid-resource-images', FALSE),
  ('sharegrid-verification-documents', 'sharegrid-verification-documents', FALSE)
ON CONFLICT (id) DO UPDATE
SET public = EXCLUDED.public;

GRANT SELECT ON public.institutions, public.resources, public.resource_availability TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON
  public.institutions,
  public.profiles,
  public.institution_memberships,
  public.resources,
  public.resource_availability,
  public.bookings,
  public.waiting_lists,
  public.checkin_checkout,
  public.condition_reports,
  public.incidents,
  public.notifications
TO authenticated;
GRANT SELECT ON public.audit_logs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON storage.objects TO authenticated;
GRANT SELECT ON storage.objects TO anon;

-- --------------------------------------------------------------------
-- 16. Policies
-- --------------------------------------------------------------------
-- Institutions: public read, admin write.
DROP POLICY IF EXISTS "institutions_read_public" ON public.institutions;
CREATE POLICY "institutions_read_public"
ON public.institutions
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "institutions_admin_write" ON public.institutions;
CREATE POLICY "institutions_admin_write"
ON public.institutions
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.role = 'admin'
  )
);

DROP POLICY IF EXISTS "institution_memberships_select_own_or_admin" ON public.institution_memberships;
CREATE POLICY "institution_memberships_select_own_or_admin"
ON public.institution_memberships
FOR SELECT
USING (
  user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

DROP POLICY IF EXISTS "institution_memberships_admin_manage" ON public.institution_memberships;
CREATE POLICY "institution_memberships_admin_manage"
ON public.institution_memberships
FOR ALL
USING (public.is_sharegrid_admin())
WITH CHECK (public.is_sharegrid_admin());

-- Profiles: users manage themselves; admins manage all; no user can self-promote to admin.
DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON public.profiles;
CREATE POLICY "profiles_select_own_or_admin"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_select_admin" ON public.profiles;
CREATE POLICY "profiles_select_admin"
ON public.profiles
FOR SELECT
USING (public.is_sharegrid_admin());

DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own"
ON public.profiles
FOR INSERT
WITH CHECK (
  auth.uid() = id
  AND role IN ('borrower', 'owner')
  AND verification_status IN ('unverified', 'pending')
);

DROP POLICY IF EXISTS "profiles_update_own_or_admin" ON public.profiles;
CREATE POLICY "profiles_update_own_or_admin"
ON public.profiles
FOR UPDATE
USING (
  auth.uid() = id
  OR EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
)
WITH CHECK (
  auth.uid() = id
  OR EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

DROP POLICY IF EXISTS "profiles_delete_admin_only" ON public.profiles;
CREATE POLICY "profiles_delete_admin_only"
ON public.profiles
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

-- Resources: public read of active resources, owners/admin write.
DROP POLICY IF EXISTS "resources_select_public_active" ON public.resources;
CREATE POLICY "resources_select_public_active"
ON public.resources
FOR SELECT
USING (
  (active = true AND (
    visibility = 'public'
    OR (
      visibility = 'institution'
      AND institution_id IS NOT NULL
      AND public.is_sharegrid_institution_member(institution_id)
    )
  ))
  OR owner_id = auth.uid()
  OR public.is_sharegrid_admin()
);

DROP POLICY IF EXISTS "resources_manage_own_or_admin" ON public.resources;
CREATE POLICY "resources_manage_own_or_admin"
ON public.resources
FOR ALL
USING (
  (
    owner_id = auth.uid()
    AND public.is_sharegrid_approved_owner()
    AND (institution_id IS NULL OR public.is_sharegrid_institution_member(institution_id))
  )
  OR public.is_sharegrid_admin()
)
WITH CHECK (
  (
    owner_id = auth.uid()
    AND public.is_sharegrid_approved_owner()
    AND (institution_id IS NULL OR public.is_sharegrid_institution_member(institution_id))
  )
  OR public.is_sharegrid_admin()
);

-- Resource availability: public read, owner/admin manage.
DROP POLICY IF EXISTS "resource_availability_select_public" ON public.resource_availability;
CREATE POLICY "resource_availability_select_public"
ON public.resource_availability
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.resources r
    WHERE r.id = resource_id
      AND (
        (r.active = TRUE AND r.visibility = 'public')
        OR (
          r.active = TRUE
          AND
          r.visibility = 'institution'
          AND r.institution_id IS NOT NULL
          AND public.is_sharegrid_institution_member(r.institution_id)
        )
        OR r.owner_id = auth.uid()
      )
  )
  OR EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

DROP POLICY IF EXISTS "resource_availability_manage_own_or_admin" ON public.resource_availability;
CREATE POLICY "resource_availability_manage_own_or_admin"
ON public.resource_availability
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.resources r
    WHERE r.id = resource_id
      AND (
        (r.owner_id = auth.uid() AND public.is_sharegrid_approved_owner())
        OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
      )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.resources r
    WHERE r.id = resource_id
      AND (
        (r.owner_id = auth.uid() AND public.is_sharegrid_approved_owner())
        OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
      )
  )
);

-- Bookings: borrower sees own, owner sees bookings for their resources, admin sees all.
DROP POLICY IF EXISTS "bookings_select_own_or_related" ON public.bookings;
CREATE POLICY "bookings_select_own_or_related"
ON public.bookings
FOR SELECT
USING (
  borrower_id = auth.uid()
  OR owner_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

DROP POLICY IF EXISTS "bookings_insert_own" ON public.bookings;
CREATE POLICY "bookings_insert_own"
ON public.bookings
FOR INSERT
WITH CHECK (
  borrower_id = auth.uid()
  AND EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.role = 'borrower'
      AND p.verification_status = 'approved'
  )
  AND EXISTS (
    SELECT 1 FROM public.resources r
    WHERE r.id = resource_id
      AND r.active = true
      AND r.owner_id = bookings.owner_id
  )
);

DROP POLICY IF EXISTS "bookings_update_own_owner_or_admin" ON public.bookings;
CREATE POLICY "bookings_update_own_owner_or_admin"
ON public.bookings
FOR UPDATE
USING (
  borrower_id = auth.uid()
  OR owner_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
)
WITH CHECK (
  borrower_id = auth.uid()
  OR owner_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

-- Waiting lists: borrower sees own, resource owner/admin sees relevant rows.
DROP POLICY IF EXISTS "waiting_lists_select_own_or_related" ON public.waiting_lists;
CREATE POLICY "waiting_lists_select_own_or_related"
ON public.waiting_lists
FOR SELECT
USING (
  borrower_id = auth.uid()
  OR EXISTS (
    SELECT 1
    FROM public.resources r
    WHERE r.id = resource_id AND r.owner_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

DROP POLICY IF EXISTS "waiting_lists_insert_own" ON public.waiting_lists;
CREATE POLICY "waiting_lists_insert_own"
ON public.waiting_lists
FOR INSERT
WITH CHECK (
  borrower_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.resources r
    WHERE r.id = resource_id
  )
);

DROP POLICY IF EXISTS "waiting_lists_update_own_or_related" ON public.waiting_lists;
CREATE POLICY "waiting_lists_update_own_or_related"
ON public.waiting_lists
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM public.resources r
    WHERE r.id = resource_id AND r.owner_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.resources r
    WHERE r.id = resource_id AND r.owner_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

DROP POLICY IF EXISTS "waiting_lists_delete_own_or_admin" ON public.waiting_lists;
CREATE POLICY "waiting_lists_delete_own_or_admin"
ON public.waiting_lists
FOR DELETE
USING (
  borrower_id = auth.uid()
  OR public.is_sharegrid_admin()
);

-- Check-in/out: borrower, owner, or admin can see; owner/admin generally perform the action.
DROP POLICY IF EXISTS "checkin_checkout_select_related" ON public.checkin_checkout;
CREATE POLICY "checkin_checkout_select_related"
ON public.checkin_checkout
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.bookings b
    WHERE b.id = booking_id
      AND (b.borrower_id = auth.uid() OR b.owner_id = auth.uid())
  )
  OR EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

DROP POLICY IF EXISTS "checkin_checkout_insert_related" ON public.checkin_checkout;
CREATE POLICY "checkin_checkout_insert_related"
ON public.checkin_checkout
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.bookings b
    JOIN public.resources r ON r.id = b.resource_id
    WHERE b.id = booking_id
      AND (
        b.owner_id = auth.uid()
        OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
      )
  )
);

DROP POLICY IF EXISTS "checkin_checkout_update_related" ON public.checkin_checkout;
CREATE POLICY "checkin_checkout_update_related"
ON public.checkin_checkout
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM public.bookings b
    JOIN public.resources r ON r.id = b.resource_id
    WHERE b.id = booking_id
      AND (
        b.owner_id = auth.uid()
        OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
      )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.bookings b
    JOIN public.resources r ON r.id = b.resource_id
    WHERE b.id = booking_id
      AND (
        b.owner_id = auth.uid()
        OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
      )
  )
);

-- Condition reports: borrower or owner/admin may access; borrower or owner/admin can insert when related.
DROP POLICY IF EXISTS "condition_reports_select_related" ON public.condition_reports;
CREATE POLICY "condition_reports_select_related"
ON public.condition_reports
FOR SELECT
USING (
  submitted_by = auth.uid()
  OR EXISTS (
    SELECT 1
    FROM public.bookings b
    WHERE b.id = booking_id
      AND (b.borrower_id = auth.uid() OR b.owner_id = auth.uid())
  )
  OR EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

DROP POLICY IF EXISTS "condition_reports_insert_related" ON public.condition_reports;
CREATE POLICY "condition_reports_insert_related"
ON public.condition_reports
FOR INSERT
WITH CHECK (
  public.is_sharegrid_admin()
  OR (
    submitted_by = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM public.bookings b
      WHERE b.id = booking_id
        AND b.resource_id = condition_reports.resource_id
        AND (b.borrower_id = auth.uid() OR b.owner_id = auth.uid())
    )
  )
);

DROP POLICY IF EXISTS "condition_reports_update_related" ON public.condition_reports;
CREATE POLICY "condition_reports_update_related"
ON public.condition_reports
FOR UPDATE
USING (public.is_sharegrid_admin())
WITH CHECK (public.is_sharegrid_admin());

-- Incidents: related borrower/owner/admin access, creator or owner/admin insert/update.
DROP POLICY IF EXISTS "incidents_select_related" ON public.incidents;
CREATE POLICY "incidents_select_related"
ON public.incidents
FOR SELECT
USING (
  reported_by_id = auth.uid()
  OR EXISTS (
    SELECT 1
    FROM public.bookings b
    WHERE b.id = booking_id
      AND (b.borrower_id = auth.uid() OR b.owner_id = auth.uid())
  )
  OR EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

DROP POLICY IF EXISTS "incidents_insert_related" ON public.incidents;
CREATE POLICY "incidents_insert_related"
ON public.incidents
FOR INSERT
WITH CHECK (
  reported_by_id = auth.uid()
  AND (
    EXISTS (
      SELECT 1
      FROM public.bookings b
      WHERE b.id = booking_id
        AND b.borrower_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1
      FROM public.resources r
      WHERE r.id = resource_id
        AND r.owner_id = auth.uid()
    )
  )
);

DROP POLICY IF EXISTS "incidents_update_admin_or_reporter" ON public.incidents;
CREATE POLICY "incidents_update_admin_or_reporter"
ON public.incidents
FOR UPDATE
USING (public.is_sharegrid_admin())
WITH CHECK (public.is_sharegrid_admin());

-- Notifications: users see only their own rows; admins may create notifications.
DROP POLICY IF EXISTS "notifications_select_own_or_admin" ON public.notifications;
CREATE POLICY "notifications_select_own_or_admin"
ON public.notifications
FOR SELECT
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "notifications_insert_own_or_admin" ON public.notifications;
CREATE POLICY "notifications_insert_own_or_admin"
ON public.notifications
FOR INSERT
WITH CHECK (public.is_sharegrid_admin());

DROP POLICY IF EXISTS "notifications_update_own" ON public.notifications;
CREATE POLICY "notifications_update_own"
ON public.notifications
FOR UPDATE
USING (
  user_id = auth.uid()
)
WITH CHECK (user_id = auth.uid());

-- Audit logs: admins may read; trusted server-side code is the only writer.
DROP POLICY IF EXISTS "audit_logs_admin_only" ON public.audit_logs;
CREATE POLICY "audit_logs_admin_read"
ON public.audit_logs
FOR SELECT
USING (public.is_sharegrid_admin());

REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.audit_logs FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.audit_logs TO authenticated;

-- Storage object keys must use <resource_id>/<filename> for resource images
-- and <auth.uid()>/<filename> for verification documents.
DROP POLICY IF EXISTS "sharegrid_resource_images_read" ON storage.objects;
CREATE POLICY "sharegrid_resource_images_read"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'sharegrid-resource-images'
  AND EXISTS (
    SELECT 1
    FROM public.resources r
    WHERE r.id = (storage.foldername(name))[1]
      AND (
        (r.active = TRUE AND (
          r.visibility = 'public'
          OR (
            r.visibility = 'institution'
            AND r.institution_id IS NOT NULL
            AND public.is_sharegrid_institution_member(r.institution_id)
          )
        ))
        OR r.owner_id = auth.uid()
        OR public.is_sharegrid_admin()
      )
  )
);

DROP POLICY IF EXISTS "sharegrid_resource_images_insert" ON storage.objects;
CREATE POLICY "sharegrid_resource_images_insert"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'sharegrid-resource-images'
  AND EXISTS (
    SELECT 1
    FROM public.resources r
    WHERE r.id = (storage.foldername(name))[1]
      AND (r.owner_id = auth.uid() OR public.is_sharegrid_admin())
  )
);

DROP POLICY IF EXISTS "sharegrid_resource_images_update" ON storage.objects;
CREATE POLICY "sharegrid_resource_images_update"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'sharegrid-resource-images'
  AND EXISTS (
    SELECT 1
    FROM public.resources r
    WHERE r.id = (storage.foldername(name))[1]
      AND (r.owner_id = auth.uid() OR public.is_sharegrid_admin())
  )
)
WITH CHECK (
  bucket_id = 'sharegrid-resource-images'
  AND EXISTS (
    SELECT 1
    FROM public.resources r
    WHERE r.id = (storage.foldername(name))[1]
      AND (r.owner_id = auth.uid() OR public.is_sharegrid_admin())
  )
);

DROP POLICY IF EXISTS "sharegrid_resource_images_delete" ON storage.objects;
CREATE POLICY "sharegrid_resource_images_delete"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'sharegrid-resource-images'
  AND EXISTS (
    SELECT 1
    FROM public.resources r
    WHERE r.id = (storage.foldername(name))[1]
      AND (r.owner_id = auth.uid() OR public.is_sharegrid_admin())
  )
);

DROP POLICY IF EXISTS "sharegrid_verification_documents_read" ON storage.objects;
CREATE POLICY "sharegrid_verification_documents_read"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'sharegrid-verification-documents'
  AND (
    (storage.foldername(name))[1] = auth.uid()::TEXT
    OR public.is_sharegrid_admin()
  )
);

DROP POLICY IF EXISTS "sharegrid_verification_documents_insert" ON storage.objects;
CREATE POLICY "sharegrid_verification_documents_insert"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'sharegrid-verification-documents'
  AND (storage.foldername(name))[1] = auth.uid()::TEXT
);

DROP POLICY IF EXISTS "sharegrid_verification_documents_update" ON storage.objects;
CREATE POLICY "sharegrid_verification_documents_update"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'sharegrid-verification-documents'
  AND (
    (storage.foldername(name))[1] = auth.uid()::TEXT
    OR public.is_sharegrid_admin()
  )
)
WITH CHECK (
  bucket_id = 'sharegrid-verification-documents'
  AND (
    (storage.foldername(name))[1] = auth.uid()::TEXT
    OR public.is_sharegrid_admin()
  )
);

DROP POLICY IF EXISTS "sharegrid_verification_documents_delete" ON storage.objects;
CREATE POLICY "sharegrid_verification_documents_delete"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'sharegrid-verification-documents'
  AND (
    (storage.foldername(name))[1] = auth.uid()::TEXT
    OR public.is_sharegrid_admin()
  )
);

-- --------------------------------------------------------------------
-- 17. Operational security notes
-- --------------------------------------------------------------------
-- Admins must be bootstrapped by a trusted database operator or server-side
-- service-role process. Never expose the service-role key to a browser client.
-- Public resources intentionally support cross-institution discovery;
-- institution-scoped resources require an institution_memberships row.
-- The legacy schema.sql is not upgraded by this fresh-install setup. Back up
-- existing data and write a separate, reviewed migration before upgrading.
-- Storage resource image paths use <resource_id>/<filename>. Verification
-- document paths use <auth.uid()>/<filename>.

COMMIT;
