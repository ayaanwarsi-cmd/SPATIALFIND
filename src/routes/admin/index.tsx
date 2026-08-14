import { createFileRoute, Link } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { useState, useEffect } from 'react';
import { getRecentJobs, getIntelligenceSignals } from '../../lib/admin/data/intelligence.functions';
import { getProducts } from '../../lib/admin/data/cms.functions';

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
});

function AdminDashboard() {
  const getJobsFn = useServerFn(getRecentJobs);
  const getProductsFn = useServerFn(getProducts);
  const getSignalsFn = useServerFn(getIntelligenceSignals);
  
  const [jobs, setJobs] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [signals, setSignals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [jobsData, productsData, signalsData] = await Promise.all([
          getJobsFn(),
          getProductsFn(),
          getSignalsFn({ data: {} })
        ]);
        setJobs(jobsData);
        setProducts(productsData);
        setSignals(signalsData);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const stats = {
    trending: signals.filter(s => s.type === 'trending').length,
    search: signals.filter(s => s.type === 'search_demand').length,
    deals: signals.filter(s => s.type === 'deal').length,
  };

  if (isLoading) {
    return <div className="p-12 text-center text-slate-500 uppercase tracking-widest font-bold text-xs animate-pulse">Initializing Control Room...</div>;
  }

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Command Center</h1>
          <p className="text-slate-400">What should you look at today?</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Active Intelligence</div>
          <div className="text-xs font-mono text-slate-300">
            {signals.length} Discovered Signals
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/admin/intelligence/trending" className="p-8 rounded-3xl bg-slate-900 border border-white/5 flex flex-col gap-4 hover:border-primary/20 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Trending Now</span>
            <span className="text-emerald-400 text-xs font-bold">🚀 {stats.trending > 0 ? 'Active' : 'Awaiting Data'}</span>
          </div>
          <div className="text-2xl font-bold">{stats.trending} Trends Found</div>
          <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300">
            {stats.trending > 0 ? `Analysis of ${stats.trending} recent trends detected by TinyFish.` : 'Launch a Trend Hunt job to see real-time momentum.'}
          </p>
        </Link>

        <Link to="/admin/intelligence/search-demand" className="p-8 rounded-3xl bg-slate-900 border border-white/5 flex flex-col gap-4 hover:border-primary/20 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Search Demand</span>
            <span className="text-sky-400 text-xs font-bold">{stats.search > 0 ? 'High' : 'Awaiting Data'}</span>
          </div>
          <div className="text-2xl font-bold">{stats.search} Intent Signals</div>
          <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300">
             {stats.search > 0 ? `Observed high interest across ${stats.search} categories.` : 'Execute a Search Demand Hunt to discover intent.'}
          </p>
        </Link>

        <Link to="/admin/intelligence/deals" className="p-8 rounded-3xl bg-slate-900 border border-white/5 flex flex-col gap-4 hover:border-primary/20 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Deal Velocity</span>
            <span className="text-orange-400 text-xs font-bold">🔥 {stats.deals > 0 ? 'Hot' : 'Awaiting Data'}</span>
          </div>
          <div className="text-2xl font-bold">{stats.deals} Price Drops</div>
          <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300">
            {stats.deals > 0 ? `Verified discounts detected in ${stats.deals} discovery signals.` : 'Start a Deal Hunt to track price drops.'}
          </p>
        </Link>
      </div>

      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold tracking-tight">Catalog Health</h2>
          <Link to="/admin/products" className="text-xs text-primary font-bold hover:underline">Manage Products →</Link>
        </div>
        <div className="rounded-3xl border border-white/5 bg-slate-900/30 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900 text-slate-400 font-medium border-b border-white/5">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.length > 0 ? products.slice(0, 5).map((product) => (
                <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-6">
                    <div className="font-bold text-white">{product.name}</div>
                    <div className="text-xs text-slate-500 mt-1">{product.category_slug}</div>
                  </td>
                  <td className="px-6 py-6">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tighter ${product.published ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                      {product.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-6 font-mono text-slate-300">₹{Number(product.price).toLocaleString()}</td>
                  <td className="px-6 py-6 text-slate-500 text-xs">{new Date(product.updated_at).toLocaleDateString()}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500 italic">No products in catalog.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}