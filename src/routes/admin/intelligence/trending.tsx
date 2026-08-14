import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { useState, useEffect } from 'react';
import { getIntelligenceSignals } from '@/lib/admin/data/intelligence.functions';
import { promoteSignalToProduct } from '@/lib/admin/data/cms.functions';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/intelligence/trending')({
  component: TrendingIntelligence,
});

function TrendingIntelligence() {
  const getSignalsFn = useServerFn(getIntelligenceSignals);
  const promoteFn = useServerFn(promoteSignalToProduct);
  const navigate = useNavigate();
  
  const [signals, setSignals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const data = await getSignalsFn({ data: { type: 'trending' } });
      setSignals(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromote = async (signal: any) => {
    try {
      const product = await promoteFn({ 
        data: { 
          signalId: signal.id, 
          initialData: { 
            name: signal.entity_name, 
            category: signal.category_slug,
            metadata: signal.metadata 
          } 
        } 
      });
      toast.success(`Promoted "${signal.entity_name}" to Product Catalog`);
      navigate({ to: '/admin/products' });
    } catch (e: any) {
      toast.error(e.message || 'Promotion failed');
    }
  };

  if (isLoading) return <div className="p-12 animate-pulse text-slate-500 uppercase tracking-widest text-[10px] font-bold">Detecting Trends...</div>;

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      <header>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Trending Intelligence</h1>
        <p className="text-slate-400">Products and topics experiencing rapid growth in visibility</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {signals.length > 0 ? (
          signals.map((signal) => {
            const isProcessed = signal.metadata?.processed;
            return (
              <div key={signal.id} className="p-8 rounded-3xl bg-slate-900 border border-white/5 space-y-4">
                <div className="flex justify-between items-start">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${isProcessed ? 'bg-slate-800 text-slate-500' : 'bg-emerald-500/10 text-emerald-400'}`}>
                    {isProcessed ? 'Processed' : 'Growth Detected'}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{new Date(signal.created_at).toLocaleDateString()}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">{signal.entity_name}</h3>
                  <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest">{signal.category_slug}</p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="text-xs text-slate-400">Momentum Score: <span className="text-white font-bold">{signal.score}</span></div>
                  {!isProcessed && (
                    <button 
                      onClick={() => handlePromote(signal)}
                      className="text-[10px] font-bold text-primary uppercase hover:underline"
                    >
                      Create Product →
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="md:col-span-2 p-20 rounded-3xl border border-dashed border-white/10 text-center">
            <p className="text-slate-500 italic">No trending signals discovered yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}