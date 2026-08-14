import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { useState, useEffect } from 'react';
import { getIntelligenceSignals } from '@/lib/admin/data/intelligence.functions';
import { promoteSignalToProduct } from '@/lib/admin/data/cms.functions';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/intelligence/search-demand')({
  component: SearchDemandIntelligence,
});

function SearchDemandIntelligence() {
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
      const data = await getSignalsFn({ data: { type: 'search_demand' } });
      setSignals(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromote = async (signal: any) => {
    try {
      await promoteFn({ 
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

  if (isLoading) return <div className="p-12 animate-pulse text-slate-500 uppercase tracking-widest text-[10px] font-bold">Querying Search Demand...</div>;

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      <header>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Search Demand</h1>
        <p className="text-slate-400">High-intent commercial search signals from live-web research</p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {signals.length > 0 ? (
          signals.map((signal) => {
            const isProcessed = signal.metadata?.processed;
            return (
              <div key={signal.id} className="p-8 rounded-3xl bg-slate-900 border border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1">{signal.category_slug}</div>
                  <h3 className="text-xl font-bold">{signal.entity_name}</h3>
                  <div className="flex gap-4 mt-2">
                    <div className="text-xs text-slate-500">Signal Confidence: <span className="text-white">{signal.score}%</span></div>
                    <div className="text-xs text-slate-500">Source: <span className="text-slate-300 font-mono uppercase">TinyFish Intelligence</span></div>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Observation Date</div>
                    <div className="text-sm font-medium">{new Date(signal.created_at).toLocaleDateString()}</div>
                  </div>
                  {!isProcessed ? (
                    <button 
                      onClick={() => handlePromote(signal)}
                      className="px-6 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                    >
                      Add to Catalog
                    </button>
                  ) : (
                    <div className="px-6 py-2 rounded-xl bg-slate-800 text-slate-500 font-bold text-xs uppercase tracking-widest">
                      Processed
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-20 rounded-3xl border border-dashed border-white/10 text-center">
            <p className="text-slate-500 italic">No search demand signals found. Launch a Research Job to populate.</p>
          </div>
        )}
      </div>
    </div>
  );
}