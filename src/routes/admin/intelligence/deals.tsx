import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { useState, useEffect } from 'react';
import { getIntelligenceSignals, getPriceObservations } from '@/lib/admin/data/intelligence.functions';
import { promoteSignalToProduct } from '@/lib/admin/data/cms.functions';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/intelligence/deals')({
  component: DealsIntelligence,
});

function DealsIntelligence() {
  const getSignalsFn = useServerFn(getIntelligenceSignals);
  const getPriceObsFn = useServerFn(getPriceObservations);
  const promoteFn = useServerFn(promoteSignalToProduct);
  const navigate = useNavigate();

  const [signals, setSignals] = useState<any[]>([]);
  const [observations, setObservations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [signalsData, obsData] = await Promise.all([
          getSignalsFn({ data: { type: 'deal' } }),
          getPriceObsFn()
        ]);
        setSignals(signalsData);
        setObservations(obsData);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

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

  if (isLoading) return <div className="p-12 animate-pulse text-slate-500 uppercase tracking-widest text-[10px] font-bold">Scanning for Deals...</div>;

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      <header>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Deals & Price Drops</h1>
        <p className="text-slate-400">Monitored price changes and verified discount opportunities</p>
      </header>

      <div className="grid grid-cols-1 gap-12">
        <section className="space-y-6">
          <h2 className="text-xl font-bold">Discovered Opportunities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {signals.length > 0 ? (
              signals.map((signal) => {
                const isProcessed = signal.metadata?.processed;
                return (
                  <div key={signal.id} className="p-6 rounded-3xl bg-slate-900 border border-white/5 space-y-4 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-2">Potential Deal</div>
                      <h3 className="font-bold text-lg">{signal.entity_name}</h3>
                      <div className="text-xs text-slate-500">{signal.category_slug}</div>
                    </div>
                    <div className="pt-4 border-t border-white/5">
                      {!isProcessed ? (
                        <button 
                          onClick={() => handlePromote(signal)}
                          className="text-[10px] font-bold text-primary uppercase hover:underline"
                        >
                          Add to Catalog →
                        </button>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Already Added</span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="md:col-span-3 p-12 text-center border border-dashed border-white/10 rounded-3xl text-slate-500 text-sm italic">
                No deal signals detected. Run a Deal Hunt.
              </div>
            )}
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-xl font-bold">Price History Observations</h2>
          <div className="rounded-3xl border border-white/5 bg-slate-900/30 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900 text-slate-400 font-medium border-b border-white/5">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Change</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {observations.length > 0 ? (
                  observations.map((obs) => (
                    <tr key={obs.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-bold text-white">{(obs.products as any)?.name || 'Unknown Product'}</td>
                      <td className="px-6 py-4 font-mono">₹{Number(obs.price).toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className="text-slate-500 text-xs">— Initial Observation</span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">{new Date(obs.observed_at).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500 italic">No price observations recorded yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}