import { createFileRoute } from '@tanstack/react-router';
import { useGuides } from '../hooks/use-data';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { SpatialLayer } from '../components/spatial/SpatialLayer';
import { BookOpen, Calendar, User } from 'lucide-react';

export const Route = createFileRoute('/guides/$slug')({
  head: (ctx) => {
    const guide = (ctx as any).loaderData;
    if (!guide) return { title: "Guide Not Found | SpatialFind" };
    
    return {
      meta: [
        { title: `${guide.title} | SpatialFind Buying Guide` },
        { name: "description", content: guide.excerpt },
        { property: "og:title", content: `${guide.title} | SpatialFind Buying Guide` },
        { property: "og:description", content: guide.excerpt },
        { property: "og:image", content: guide.featuredImage },
        { property: "og:type", content: "article" },
      ],
    };
  },
  loader: ({ params }) => {
    // Temp mock data for loader to feed head()
    const guides = [
      { slug: 'ultimate-gaming-setup-2026', title: 'The Ultimate Gaming Setup 2026', excerpt: 'Building the peak performance spatial gaming environment.', featuredImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=2000' },
      { slug: 'minimalist-workspace-audio', title: 'Minimalist Workspace Audio', excerpt: 'Curating the perfect soundscape for deep work and focus.', featuredImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=2000' }
    ];
    return guides.find(g => g.slug === params.slug);
  },
  component: GuideDetailPage,
});

function GuideDetailPage() {
  const { slug } = Route.useParams();
  const guides = useGuides();
  const guide = useMemo(() => guides.find(g => g.slug === slug), [guides, slug]);

  if (!guide) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-4xl font-bold tracking-tighter uppercase">Guide not found</h1>
      </div>
    );
  }

  return (
    <article className="pb-32 min-h-screen">
      {/* Guide Hero */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img 
            src={guide.featuredImage} 
            alt={guide.title}
            className="w-full h-full object-cover scale-110 blur-sm brightness-[0.3]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center space-y-10 max-w-5xl">
          <SpatialLayer depth="content" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-center gap-4 text-primary">
                <BookOpen size={20} />
                <span className="text-xs font-black uppercase tracking-[0.4em]">{guide.category}</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] text-balance">
                {guide.title}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground/80 max-w-3xl mx-auto text-balance leading-relaxed font-medium italic">
                {guide.excerpt}
              </p>
            </motion.div>
          </SpatialLayer>

          <SpatialLayer depth="foreground">
            <div className="flex items-center justify-center gap-12 pt-8">
              <div className="flex items-center gap-3 text-muted-foreground/60">
                <Calendar size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">August 13, 2026</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground/60">
                <User size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Expert Curation Team</span>
              </div>
            </div>
          </SpatialLayer>
        </div>
      </section>

      {/* Guide Content */}
      <section className="container mx-auto px-4 max-w-4xl py-32">
        <SpatialLayer depth="content" className="prose prose-invert prose-2xl max-w-none">
          <div className="space-y-12 text-muted-foreground/80 font-medium leading-[1.6]">
            {guide.content}
            <p>
              When evaluating hardware in 2026, the metrics have shifted from raw performance to spatial efficiency and sustained thermal headroom. 
              Our testing process for {guide.category} involves real-world stress testing combined with aesthetic integration analysis.
            </p>
            <div className="p-12 glass rounded-[3rem] border border-white/5 bg-primary/5 space-y-6">
              <h3 className="text-white text-3xl font-black tracking-tighter uppercase">Our Selection Process</h3>
              <p className="text-lg">
                Every product listed in this guide has been manually vetted for durability, performance-per-watt, and long-term value. 
                We do not use automated scrapers; our curation is human-first.
              </p>
            </div>
          </div>
        </SpatialLayer>
      </section>
    </article>
  );
}
