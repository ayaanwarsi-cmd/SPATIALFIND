
-- Properly replace policies and move function
DROP POLICY IF EXISTS "Admins can manage signals" ON public.intelligence_signals;

CREATE SCHEMA IF NOT EXISTS private;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (auth.uid() = _user_id) OR (current_setting('role') = 'service_role') OR (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')) THEN
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

-- Re-apply all admin policies using the private function
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products" ON public.products FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can manage jobs" ON public.research_jobs;
CREATE POLICY "Admins can manage jobs" ON public.research_jobs FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can manage intelligence_signals" ON public.intelligence_signals;
CREATE POLICY "Admins can manage intelligence_signals" ON public.intelligence_signals FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can manage price_observations" ON public.price_observations;
CREATE POLICY "Admins can manage price_observations" ON public.price_observations FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin'));

-- Clean up old function
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role);
