import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { toast } from 'sonner';
import { getTinyFishStatus, saveTinyFishKey, testTinyFishConnection } from '@/lib/admin/data/settings.functions';

export const Route = createFileRoute('/admin/settings')({
  component: AdminSettingsPage,
});

function AdminSettingsPage() {
  const [apiKey, setApiKey] = useState('');
  const [status, setStatus] = useState<{ connected: boolean; lastUpdated: string | null } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; timestamp?: string; error?: string } | null>(null);

  const getStatusFn = useServerFn(getTinyFishStatus);
  const saveKeyFn = useServerFn(saveTinyFishKey);
  const testConnFn = useServerFn(testTinyFishConnection);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      const result = await getStatusFn();
      setStatus(result);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    setIsSaving(true);
    try {
      await saveKeyFn({ data: { key: apiKey } });
      toast.success('TinyFish API key saved securely');
      setApiKey('');
      loadStatus();
    } catch (e: any) {
      toast.error(e.message || 'Failed to save API key');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const result = await testConnFn();
      setTestResult(result);
      if (result.success) {
        toast.success('TinyFish connection successful');
      } else {
        toast.error('TinyFish connection failed');
      }
    } catch (e: any) {
      setTestResult({ success: false, error: e.message });
      toast.error(e.message || 'Connection test failed');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      <header>
        <h1 className="text-4xl font-bold tracking-tight mb-2">System Settings</h1>
        <p className="text-slate-400">Configure core platform integrations</p>
      </header>

      <section className="p-8 rounded-3xl bg-slate-900 border border-white/5 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">TinyFish Integration</h2>
            <p className="text-sm text-slate-500 mt-1">Primary live-web research and intelligence layer</p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${status?.connected ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-700'}`} />
            <span className={`text-xs font-bold uppercase tracking-widest ${status?.connected ? 'text-emerald-400' : 'text-slate-500'}`}>
              {status?.connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">TinyFish API Key</label>
            <div className="flex gap-4">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                placeholder={status?.connected ? '••••••••••••••••••••••••••••••••' : 'Enter your API key'}
                required
              />
              <button
                type="submit"
                disabled={isSaving || !apiKey.trim()}
                className="px-8 rounded-2xl bg-primary text-primary-foreground font-bold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Key'}
              </button>
            </div>
            <p className="text-[10px] text-slate-600 mt-2 ml-1 leading-relaxed italic">
              * Your API key is encrypted and stored server-side. It is never exposed to the client.
            </p>
          </div>
        </form>

        {status?.connected && (
          <div className="pt-8 border-t border-white/5 space-y-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-400 font-medium">
                Last updated: <span className="text-slate-200 ml-1">{status.lastUpdated ? new Date(status.lastUpdated).toLocaleString() : 'Never'}</span>
              </div>
              <button
                onClick={handleTest}
                disabled={isTesting}
                className="px-6 py-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-widest text-slate-300 disabled:opacity-50"
              >
                {isTesting ? 'Testing...' : 'Test Connection'}
              </button>
            </div>

            {testResult && (
              <div className={`p-6 rounded-2xl border ${testResult.success ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-red-500/5 border-red-500/10'}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${testResult.success ? 'text-emerald-400' : 'text-red-400'}`}>
                    {testResult.success ? 'Success' : 'Connection Failed'}
                  </span>
                  {testResult.timestamp && (
                    <span className="text-[10px] text-slate-500">{new Date(testResult.timestamp).toLocaleTimeString()}</span>
                  )}
                </div>
                <p className={`text-sm ${testResult.success ? 'text-emerald-500/80' : 'text-red-400/80'}`}>
                  {testResult.success 
                    ? 'TinyFish responded correctly. The intelligence pipeline is operational.'
                    : `Error: ${testResult.error || 'Unknown error occurred during connection test.'}`
                  }
                </p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
