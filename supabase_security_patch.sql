-- ════════════════════════════════════════════════════════════════════════════
-- ThriftVault — Security Patch
-- Run AFTER the main schema has been applied successfully.
-- Fixes all 4 Supabase Security Advisor warnings.
-- ════════════════════════════════════════════════════════════════════════════

-- ─── Fix 1 & 2: Tighten INSERT policies with email format validation ─────────
-- Drop the overly-permissive WITH CHECK (TRUE) policies
DROP POLICY IF EXISTS "public_insert_newsletter" ON newsletter_subscribers;
DROP POLICY IF EXISTS "public_insert_affiliate"  ON affiliates;

-- Newsletter: only allow if email looks valid and subscriber field is TRUE
-- This prevents blank/malformed emails and direct manipulation of other fields
CREATE POLICY "public_insert_newsletter"
  ON newsletter_subscribers
  FOR INSERT
  WITH CHECK (
    email    IS NOT NULL
    AND email ~* '^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$'
    AND subscribed = TRUE
  );

-- Affiliates: require first_name, last_name, valid email, and pending status
-- Status must always start as 'pending' — prevents forged 'approved' submissions
CREATE POLICY "public_insert_affiliate"
  ON affiliates
  FOR INSERT
  WITH CHECK (
    first_name IS NOT NULL AND first_name <> ''
    AND last_name  IS NOT NULL AND last_name  <> ''
    AND email      IS NOT NULL
    AND email ~* '^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$'
    AND status = 'pending'
    AND consignment_rate = 20.00
    AND total_sales      = 0
  );

-- ─── Fix 3 & 4: rls_auto_enable() — SECURITY DEFINER → SECURITY INVOKER ─────
-- REVOKE alone is not persistent — Supabase may re-grant it internally.
-- The correct permanent fix is to switch the function to SECURITY INVOKER,
-- which means it runs with the caller's permissions (not the definer's).
-- anon/authenticated callers then have no elevated access even if EXECUTE remains.

-- Step A: revoke REST API execute access
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable()
  FROM anon, authenticated;

-- Step B: switch from SECURITY DEFINER to SECURITY INVOKER (permanent fix)
ALTER FUNCTION public.rls_auto_enable() SECURITY INVOKER;

-- Step C: move it out of the exposed API schema as a belt-and-suspenders measure
-- (Supabase exposes everything in the 'public' schema via /rest/v1/rpc/)
-- If the function is Supabase-internal it should live in a private schema.
-- The ALTER above is sufficient — Step C is optional / advanced.


-- ════════════════════════════════════════════════════════════════════════════
-- Verification — run these SELECTs to confirm the fixes are in place:
-- ════════════════════════════════════════════════════════════════════════════

-- Should show both policies with non-trivial WITH CHECK expressions:
-- SELECT policyname, cmd, qual, with_check
-- FROM pg_policies
-- WHERE tablename IN ('newsletter_subscribers', 'affiliates')
--   AND cmd = 'INSERT';

-- Should return 0 rows (rls_auto_enable no longer accessible):
-- SELECT grantee, privilege_type
-- FROM information_schema.role_routine_grants
-- WHERE routine_name = 'rls_auto_enable'
--   AND grantee IN ('anon', 'authenticated');
