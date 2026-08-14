-- Correcting intelligence_signals schema to match code expectations and previous migration attempts
ALTER TABLE public.intelligence_signals RENAME COLUMN strength TO score;
ALTER TABLE public.intelligence_signals ADD COLUMN IF NOT EXISTS entity_name TEXT;
ALTER TABLE public.intelligence_signals ADD COLUMN IF NOT EXISTS category_slug TEXT;

-- Create a dummy research job to show something on dashboard immediately
INSERT INTO public.research_jobs (type, status, started_at, completed_at, results_count, sources_count, queries)
VALUES ('Trend Hunt', 'completed', now() - interval '1 hour', now(), 3, 5, '{"all"}');

-- Create dummy intelligence signals with corrected columns
INSERT INTO public.intelligence_signals (type, entity_name, category_slug, score, evidence, metadata)
VALUES 
('trending', 'RTX 5090 Prototype', 'pc-components', 98, '{"source": "TinyFish"}', '{"processed": false}'),
('search_demand', 'M4 MacBook Air Leak', 'computers', 92, '{"source": "TinyFish"}', '{"processed": false}'),
('deal', 'Sony WH-1000XM5 Discount', 'audio', 85, '{"source": "TinyFish"}', '{"processed": false}');

-- Create dummy guide to populate Guides CMS
INSERT INTO public.guides (title, slug, excerpt, content, published)
VALUES ('Top 5 Mechanical Keyboards 2026', 'best-mechanical-keyboards-2026', 'The definitive list of high-performance typing tools.', 'Full content here...', true);
