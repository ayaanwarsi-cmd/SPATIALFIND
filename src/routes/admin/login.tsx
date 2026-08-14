import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/login')({
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    try {
      const email = username.includes('@') ? username : `${username}@spatialfind.local`;
      
      console.log('Attempting login for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Supabase auth error:', error);
        throw error;
      }

      if (data.user) {
        console.log('Login successful, user:', data.user.id);
        toast.success('Authenticated. Entering Command Center...');
        // Force a small delay to ensure session is registered before navigation
        setTimeout(() => {
          navigate({ to: '/admin', replace: true });
        }, 500);
      } else {
        throw new Error('No user data returned from authentication');
      }
    } catch (error: any) {
      console.error('Login error detail:', error);
      toast.error(error.message || 'Access Denied: Invalid Credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900 border border-white/5 space-y-8 shadow-2xl">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter text-white">
            SPATIAL<span className="text-slate-400 font-light italic">CONTROL</span>
          </h1>
          <p className="text-slate-500 text-sm uppercase tracking-widest font-bold">Admin Authorization</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
              placeholder="admin"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
              placeholder="••••••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-primary/20"
          >
            {isLoading ? 'Verifying...' : 'Access Command Center'}
          </button>
        </form>

        <div className="pt-6 border-t border-white/5 text-center">
          <p className="text-[10px] text-slate-600 uppercase tracking-widest leading-relaxed">
            Unauthorized access is strictly prohibited.<br />All sessions are monitored and logged.
          </p>
        </div>
      </div>
    </div>
  );
}
