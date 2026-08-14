
-- Roles Enum
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- User Roles Table
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role public.app_role NOT NULL,
    UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- has_role security definer function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      and role = _role
  )
$$;

-- Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image TEXT,
    parent_category UUID REFERENCES public.categories(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

GRANT SELECT ON public.categories TO anon, authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read categories" ON public.categories FOR SELECT TO anon, authenticated USING (true);

-- Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    brand TEXT,
    category_slug TEXT REFERENCES public.categories(slug),
    description TEXT,
    price NUMERIC NOT NULL,
    original_price NUMERIC,
    discount_percent NUMERIC,
    rating NUMERIC DEFAULT 0,
    merchant TEXT,
    affiliate_url TEXT,
    product_image TEXT,
    three_d_asset TEXT,
    specifications JSONB DEFAULT '{}'::jsonb,
    features TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

GRANT SELECT ON public.products TO anon, authenticated;
GRANT ALL ON public.products TO service_role;
GRANT ALL ON public.products TO authenticated;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published products" ON public.products FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "Admins can manage products" ON public.products FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Research Jobs
CREATE TABLE IF NOT EXISTS public.research_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'queued',
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    queries TEXT[],
    sources_count INTEGER DEFAULT 0,
    results_count INTEGER DEFAULT 0,
    errors TEXT[],
    created_by UUID REFERENCES auth.users(id),
    tinyfish_requests INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

GRANT ALL ON public.research_jobs TO authenticated;
GRANT ALL ON public.research_jobs TO service_role;
ALTER TABLE public.research_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage jobs" ON public.research_jobs FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Intelligence Signals
CREATE TABLE IF NOT EXISTS public.intelligence_signals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id),
    job_id UUID REFERENCES public.research_jobs(id),
    type TEXT NOT NULL, -- 'trending', 'search_demand', 'bestseller', 'deal', 'price_drop'
    strength NUMERIC,
    confidence NUMERIC,
    evidence JSONB DEFAULT '[]'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

GRANT SELECT ON public.intelligence_signals TO anon, authenticated;
GRANT ALL ON public.intelligence_signals TO service_role;
GRANT ALL ON public.intelligence_signals TO authenticated;
ALTER TABLE public.intelligence_signals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage signals" ON public.intelligence_signals FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Price Observations
CREATE TABLE IF NOT EXISTS public.price_observations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id),
    price NUMERIC NOT NULL,
    merchant TEXT,
    source_url TEXT,
    observed_at TIMESTAMPTZ DEFAULT now()
);

GRANT ALL ON public.price_observations TO authenticated;
GRANT ALL ON public.price_observations TO service_role;
ALTER TABLE public.price_observations ENABLE ROW LEVEL SECURITY;

-- Settings Table (for API keys, etc.)
CREATE TABLE IF NOT EXISTS public.settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

GRANT ALL ON public.settings TO service_role;

-- Seed data for testing
INSERT INTO public.categories (name, slug, description) VALUES
('Computers', 'computers', 'High-performance laptops and desktops.'),
('PC Components', 'pc-components', 'Build your dream rig.'),
('Gaming', 'gaming', 'Consoles, peripherals, and more.'),
('Audio', 'audio', 'Premium sound experiences.'),
('Smartphones', 'smartphones', 'The latest mobile tech.');
