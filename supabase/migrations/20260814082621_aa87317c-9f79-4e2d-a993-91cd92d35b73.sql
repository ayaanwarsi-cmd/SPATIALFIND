-- Re-create the has_role function with corrected types and security definer
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
BEGIN
  -- Service role always has access
  IF (current_setting('role') = 'service_role') THEN
    RETURN TRUE;
  END IF;

  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
END;
$$;

-- Ensure it's reachable
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- Now retry the table creation
CREATE TABLE IF NOT EXISTS public.guides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT,
    excerpt TEXT,
    banner_image TEXT,
    published BOOLEAN DEFAULT FALSE,
    author_id UUID REFERENCES auth.users(id),
    related_product_ids UUID[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    title TEXT,
    description TEXT,
    discount_percent NUMERIC,
    sale_price NUMERIC,
    starts_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;

-- Grants
GRANT SELECT ON public.guides TO authenticated;
GRANT ALL ON public.guides TO service_role;
GRANT SELECT ON public.guides TO anon;

GRANT SELECT ON public.deals TO authenticated;
GRANT ALL ON public.deals TO service_role;
GRANT SELECT ON public.deals TO anon;

-- Policies
DROP POLICY IF EXISTS "Allow public read of published guides" ON public.guides;
CREATE POLICY "Allow public read of published guides" ON public.guides FOR SELECT USING (published = true);

DROP POLICY IF EXISTS "Allow public read of active deals" ON public.deals;
CREATE POLICY "Allow public read of active deals" ON public.deals FOR SELECT USING (active = true);

DROP POLICY IF EXISTS "Admins can do anything with guides" ON public.guides;
CREATE POLICY "Admins can do anything with guides" ON public.guides FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can do anything with deals" ON public.deals;
CREATE POLICY "Admins can do anything with deals" ON public.deals FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));
