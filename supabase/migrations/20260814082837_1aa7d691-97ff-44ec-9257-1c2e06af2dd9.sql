INSERT INTO public.user_roles (user_id, role)
VALUES ('dd787f0c-34f2-4ea4-82ad-54e836231335', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
