import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { runResearchJob, getRecentJobs } from '../../../lib/admin/data/intelligence.functions';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/research/')({
  component: ResearchPage,
});

function ResearchPage() {
  const launchJobFn = useServerFn(runResearchJob);
  const getJobsFn = useServerFn(getRecentJobs);
  const [isScanning, setIsScanning] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const data = await getJobsFn();
      setJobs(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLaunchJob = async (type: string, category: string = 'all') => {
    setIsScanning(true);
    try {
      await launchJobFn({ data: { type, category } });
      toast.success(`${type} job launched successfully`);
      loadJobs();
    } catch (e: any) {
      toast.error(e.message || 'Failed to launch research job');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      <header>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Research Jobs</h1>
        <p className="text-slate-400">Launch live-web discovery via TinyFish</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="p-8 rounded-3xl bg-slate-900 border border-white/5 space-y-8">
          <h2 className="text-xl font-bold">Launch New Job</h2>
          
          <div className="grid grid-cols-1 gap-4">
            <button 
              onClick={() => handleLaunchJob('Quick Scan')}
              disabled={isScanning}
              className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-left disabled:opacity-50"
            >
              <div>
                <div className="font-bold">Quick Scan</div>
                <div className="text-xs text-slate-500 mt-1">Search current product & category signals</div>
              </div>
              <div className="text-xs font-bold text-primary">{isScanning ? 'RUNNING...' : 'LAUNCH →'}</div>
            </button>

            {[
              { title: 'Deal Hunt', desc: 'Find strong discount opportunities' },
              { title: 'Trend Hunt', desc: 'Find rapidly rising topics' },
              { title: 'Affiliate Opportunity Hunt', desc: 'Find commercial signals' },
            ].map((job, i) => (
              <button 
                key={i}
                onClick={() => handleLaunchJob(job.title)}
                disabled={isScanning}
                className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-left disabled:opacity-50"
              >
                <div>
                  <div className="font-bold">{job.title}</div>
                  <div className="text-xs text-slate-500 mt-1">{job.desc}</div>
                </div>
                <div className="text-xs font-bold text-slate-600 tracking-widest italic">PRESET</div>
              </button>
            ))}
          </div>
        </section>

        <section className="p-8 rounded-3xl bg-slate-900 border border-white/5 space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Recent Job Status</h2>
            <button onClick={loadJobs} className="text-xs text-slate-500 hover:text-white transition-colors uppercase tracking-widest font-bold">Refresh</button>
          </div>
          
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <div key={job.id} className={`p-6 rounded-2xl border ${
                  job.status === 'completed' ? 'bg-emerald-500/5 border-emerald-500/10' : 
                  job.status === 'failed' ? 'bg-red-500/5 border-red-500/10' : 
                  'bg-white/5 border-white/10 animate-pulse'
                }`}>
                  <div className="flex justify-between items-center mb-4">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${
                      job.status === 'completed' ? 'text-emerald-400' : 
                      job.status === 'failed' ? 'text-red-400' : 
                      'text-sky-400'
                    }`}>
                      {job.type} — {job.status}
                    </span>
                    <span className="text-[10px] text-slate-500">{new Date(job.created_at).toLocaleTimeString()}</span>
                  </div>
                  <div className="text-sm space-y-2">
                    {job.status === 'completed' && (
                      <div className="flex gap-4">
                        <div className="text-xs font-medium text-slate-400">Results: <span className="text-white">{job.results_count}</span></div>
                        <div className="text-xs font-medium text-slate-400">Sources: <span className="text-white">{job.sources_count}</span></div>
                      </div>
                    )}
                    {job.status === 'failed' && (
                      <div className="text-xs text-red-400 italic">Error: {job.errors?.[0] || 'Unknown error'}</div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-slate-500 text-sm italic">
                No recent jobs found.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
