import { createFileRoute, Link, Outlet, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
});

function AdminLayout() {
  const [authStatus, setAuthStatus] = useState<'initializing' | 'authenticated' | 'unauthenticated' | 'error'>('initializing');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = window.location.pathname;

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        console.log('AdminLayout: Checking session...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;

        if (!session) {
          console.log('AdminLayout: No session found');
          if (mounted) {
            setAuthStatus('unauthenticated');
            if (location !== '/admin/login') {
              navigate({ to: '/admin/login', replace: true });
            }
          }
          return;
        }

        console.log('AdminLayout: Session found, user:', session.user.id, 'checking role...');
        
        // Check for admin role
        const { data: hasRole, error: roleError } = await (supabase as any).rpc('has_role', {
          _user_id: session.user.id,
          _role: 'admin'
        });

        if (roleError) {
          console.error('AdminLayout: Role check RPC error:', roleError);
          throw roleError;
        }

        console.log('AdminLayout: Role check result:', hasRole);

        if (!hasRole) {
          if (mounted) {
            console.log('AdminLayout: Access denied - not an admin');
            setErrorMessage('Unauthorized: Admin access required');
            setAuthStatus('error');
            await supabase.auth.signOut();
            setTimeout(() => navigate({ to: '/admin/login', replace: true }), 2000);
          }
          return;
        }

        if (mounted) {
          console.log('AdminLayout: Authenticated successfully');
          setAuthStatus('authenticated');
          if (location === '/admin/login') {
            navigate({ to: '/admin', replace: true });
          }
        }
      } catch (error: any) {
        console.error('AdminLayout: Auth initialization error:', error);
        if (mounted) {
          setErrorMessage(error.message || 'Authentication failed');
          setAuthStatus('error');
        }
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('AdminLayout: Auth state change:', event, session?.user?.id);
      if (event === 'SIGNED_IN' && session) {
        checkAuth();
      } else if (event === 'SIGNED_OUT' && location !== '/admin/login') {
        setAuthStatus('unauthenticated');
        navigate({ to: '/admin/login', replace: true });
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, location]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out successfully');
    navigate({ to: '/admin/login' });
  };

  // If we're on the login page, we can always render the outlet regardless of auth status
  // (unless we're authenticated, in which case we redirect above)
  if (location === '/admin/login') {
    return <Outlet />;
  }

  if (authStatus === 'initializing') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <div className="text-slate-500 font-bold tracking-widest uppercase text-[10px]">
            Initializing Command Center...
          </div>
        </div>
      </div>
    );
  }

  if (authStatus === 'error') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 rounded-3xl bg-red-500/5 border border-red-500/10 text-center space-y-6">
          <div className="text-red-400 font-bold uppercase tracking-widest text-xs">Security Error</div>
          <p className="text-slate-400 text-sm leading-relaxed">{errorMessage}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (authStatus !== 'authenticated') return null;

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-50">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-slate-900/50 backdrop-blur-xl p-6 flex flex-col gap-8 sticky top-0 h-screen">
        <div>
          <Link to="/admin" className="text-xl font-bold tracking-tighter text-white">
            SPATIAL<span className="text-slate-400 font-light italic">CONTROL</span>
          </Link>
          <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold">Intelligence Center</div>
        </div>

        <nav className="flex-1 flex flex-col gap-1 overflow-y-auto pr-2 custom-scrollbar">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2 ml-2">Main</div>
          <Link to="/admin" className="px-4 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm font-medium [&.active]:bg-primary [&.active]:text-primary-foreground">Dashboard</Link>
          
          <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-6 mb-2 ml-2">Intelligence</div>
          <Link to="/admin/intelligence/search-demand" className="px-4 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm font-medium [&.active]:bg-primary [&.active]:text-primary-foreground">Search Demand</Link>
          <Link to="/admin/intelligence/trending" className="px-4 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm font-medium [&.active]:bg-primary [&.active]:text-primary-foreground">Trending</Link>
          <Link to="/admin/intelligence/deals" className="px-4 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm font-medium [&.active]:bg-primary [&.active]:text-primary-foreground">Deals & Price Drops</Link>
          
          <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-6 mb-2 ml-2">Management</div>
          <Link to="/admin/research" className="px-4 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm font-medium [&.active]:bg-primary [&.active]:text-primary-foreground">Research Jobs</Link>
          <Link to="/admin/products" className="px-4 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm font-medium [&.active]:bg-primary [&.active]:text-primary-foreground">Products CMS</Link>
          <Link to="/admin/guides" className="px-4 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm font-medium [&.active]:bg-primary [&.active]:text-primary-foreground">Guides CMS</Link>
          
          <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-6 mb-2 ml-2">System</div>
          <Link to="/admin/settings" className="px-4 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm font-medium [&.active]:bg-primary [&.active]:text-primary-foreground">Settings</Link>
        </nav>

        <div className="pt-6 border-t border-white/5 space-y-4">
          <button 
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-xs text-slate-500 hover:text-red-400 transition-colors flex items-center gap-2"
          >
            <span>Log Out</span>
          </button>
          <Link to="/" className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-2 px-4">
            <span>← Exit to Public Site</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-12">
        <Outlet />
      </main>
    </div>
  );
}
