import { createFileRoute, Link } from '@tanstack/react-router';
import { useGuides } from '../hooks/use-data';
import { motion } from 'framer-motion';
import { SpatialLayer } from '../components/spatial/SpatialLayer';
import { BookOpen, ArrowRight } from 'lucide-react';

export const Route = createFileRoute('/guides')({
  head: () => ({
    meta: [
      { title: "Expert Buying Guides & Curated Collections | SpatialFind" },
      { name: "description", content: "Editorial deep-dives into the latest products. Read our buying guides to find the perfect gear for your needs." },
      { property: "og:title", content: "Expert Buying Guides & Curated Collections | SpatialFind" },
      { property: "og:description", content: "Editorial deep-dives into the latest products. Read our buying guides to find the perfect gear for your needs." },
      { name: "twitter:title", content: "Expert Buying Guides & Curated Collections | SpatialFind" },
      { name: "twitter:description", content: "Editorial deep-dives into the latest products. Read our buying guides to find the perfect gear for your needs." },
    ],
  }),
  component: GuidesPage,
});

function GuidesPage() {
  const guides = useGuides();

  return (
    <div className="pb-32 min-h-screen">
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent -z-10" />
        
        <div className="container mx-auto px-4">
          <SpatialLayer depth="content" className="space-y-6 text-center max-w-4xl mx-auto mb-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-center gap-3 text-primary">
                <div className="h-px w-8 bg-primary/30" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Editorial Curation</span>
                <div className="h-px w-8 bg-primary/30" />
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] text-balance">
                BUYING <span className="text-primary font-light italic">GUIDES.</span>
              </h1>
              <p className="text-xl text-muted-foreground/60 max-w-xl mx-auto font-medium">
                Expert deep-dives and curated recommendations to help you find exactly what you need.
              </p>
            </motion.div>
          </SpatialLayer>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {guides.map((guide) => (
              <SpatialLayer key={guide.id} depth="foreground">
                <Link 
                  to="/guides/$slug"
                  params={{ slug: guide.slug }}
                  className="group block relative aspect-[16/10] rounded-[4rem] overflow-hidden glass shadow-spatial hover:shadow-spatial-hover transition-all duration-700 bg-background/30 backdrop-blur-3xl border border-white/5"
                >
                  <img 
                    src={guide.featuredImage} 
                    alt={guide.title}
                    className="absolute inset-0 w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  
                  <div className="absolute bottom-12 left-12 right-12 space-y-6">
                    <div className="flex items-center gap-3 text-primary">
                      <BookOpen size={16} />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">{guide.category}</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white leading-[0.9] text-balance group-hover:text-primary transition-colors">
                      {guide.title}
                    </h2>
                    <p className="text-white/60 text-lg font-medium line-clamp-2 max-w-lg">
                      {guide.excerpt}
                    </p>
                    <div className="flex items-center gap-2 pt-4">
                      <span className="text-white font-black text-xs uppercase tracking-[0.2em]">Read Guide</span>
                      <ArrowRight size={16} className="text-primary group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </Link>
              </SpatialLayer>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
