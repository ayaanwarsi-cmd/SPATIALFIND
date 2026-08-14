
-- 1. Fix RLS Enabled No Policy (intelligence_signals and price_observations)
-- For intelligence_signals, we need to add the policy
CREATE POLICY "Admins can manage intelligence_signals" ON public.intelligence_signals 
FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- For price_observations
CREATE POLICY "Admins can manage price_observations" ON public.price_observations 
FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 2. Fix RLS Disabled in Public (settings table)
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
-- We don't want anyone to read settings directly except via service_role or specific functions.

-- 3. Fix Public/Authenticated Can Execute SECURITY DEFINER Function (has_role)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO service_role;
-- Note: Security definer functions are meant to be called by the owner, 
-- and we use it inside RLS policies which run with owner's privileges (if set up correctly)
-- but actually RLS policies run as the user. If we want RLS to use it, we need to allow it.
-- Let's grant to authenticated but ensure it only checks the user's OWN role if not admin? 
-- Actually, has_role is designed to be a helper. 
-- The linter warns because anyone can call it to check ANY user's role.
-- To fix, we can make it only allow checking YOUR OWN role unless you are admin.
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Allow service_role to check anything
  -- Allow users to check their own role
  -- Allow admins to check anything
  IF (auth.uid() = _user_id) OR (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')) OR (current_setting('role') = 'service_role') THEN
    RETURN EXISTS (
      SELECT 1
      FROM public.user_roles
      WHERE user_id = _user_id
        AND role = _role
    );
  ELSE
    RETURN FALSE;
  END IF;
END;
$$;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;
