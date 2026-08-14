import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { getGuides, updateGuide, createGuide } from '@/lib/admin/data/cms.functions';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/guides')({
  component: GuidesCmsPage,
});

function GuidesCmsPage() {
  const [guides, setGuides] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const getGuidesFn = useServerFn(getGuides);
  const createGuideFn = useServerFn(createGuide);
  const updateGuideFn = useServerFn(updateGuide);

  useEffect(() => {
    loadGuides();
  }, []);

  const loadGuides = async () => {
    try {
      const data = await getGuidesFn();
      setGuides(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePublish = async (guide: any) => {
    try {
      await updateGuideFn({ data: { id: guide.id, updates: { published: !guide.published } } });
      toast.success(`Guide ${guide.published ? 'unpublished' : 'published'} successfully`);
      loadGuides();
    } catch (e: any) {
      toast.error(e.message || 'Failed to update guide');
    }
  };

  if (isLoading) {
    return <div className="p-12 text-center text-slate-500 uppercase tracking-widest font-bold text-xs animate-pulse">Loading Guides...</div>;
  }

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Guides CMS</h1>
          <p className="text-slate-400">Editorial buying guides and deep-dives</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:scale-105 transition-transform active:scale-95"
        >
          Create New Guide
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides.length > 0 ? guides.map((guide) => (
          <div key={guide.id} className="p-8 rounded-3xl bg-slate-900 border border-white/5 space-y-4 group">
            <div className="aspect-video rounded-2xl bg-slate-800 overflow-hidden border border-white/5">
              {guide.banner_image ? (
                <img src={guide.banner_image} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-600 font-bold uppercase tracking-widest italic">No Image</div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold line-clamp-2">{guide.title}</h3>
              <p className="text-xs text-slate-500 mt-2 line-clamp-3">{guide.excerpt || 'No excerpt provided.'}</p>
            </div>
            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              <button 
                onClick={() => togglePublish(guide)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter transition-all ${
                  guide.published 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-slate-800 text-slate-500 border border-white/5'
                }`}
              >
                {guide.published ? 'Published' : 'Draft'}
              </button>
              <div className="flex gap-4">
                <button className="text-[10px] font-bold text-slate-400 hover:text-white uppercase tracking-widest transition-colors">Edit</button>
                <button className="text-[10px] font-bold text-slate-400 hover:text-white uppercase tracking-widest transition-colors">Preview</button>
              </div>
            </div>
          </div>
        )) : (
          <div className="md:col-span-3 p-20 text-center text-slate-500 italic border border-dashed border-white/10 rounded-3xl">
            No guides found in the database.
          </div>
        )}
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-3xl p-8 space-y-6 shadow-2xl">
            <h2 className="text-2xl font-bold">Create New Guide</h2>
            <form className="space-y-6" onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const data = {
                title: formData.get('title') as string,
                slug: formData.get('slug') as string,
                excerpt: formData.get('excerpt') as string,
                published: false
              };
              try {
                await createGuideFn({ data });
                toast.success('Guide created successfully');
                setIsAdding(false);
                loadGuides();
              } catch (err: any) {
                toast.error(err.message);
              }
            }}>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Title</label>
                <input name="title" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Slug</label>
                <input name="slug" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Excerpt</label>
                <textarea name="excerpt" rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary text-white" />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 bg-primary text-primary-foreground font-bold py-3 rounded-xl">Save Guide</button>
                <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-3 rounded-xl bg-slate-800 font-bold">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}