
-- Final RLS check for tables that might be missing policies
CREATE POLICY "Admins can manage settings" ON public.settings FOR ALL TO service_role USING (true);
-- If we want admins to manage it via server functions (using service_role), this is enough.
-- But if we want authenticated admin to manage it:
CREATE POLICY "Admins can manage settings auth" ON public.settings FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin'));

-- user_roles table policy
CREATE POLICY "Admins can manage user_roles" ON public.user_roles FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin'));
