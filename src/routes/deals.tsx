import { createFileRoute } from '@tanstack/react-router';
import { useDeals } from '../hooks/use-data';
import { formatCurrency } from '../lib/utils';
import { ProductCard } from '../components/spatial/ProductCard';
import { SpatialLayer } from '../components/spatial/SpatialLayer';
import { motion } from 'framer-motion';
import { Filter, ChevronDown } from 'lucide-react';

export const Route = createFileRoute('/deals')({
  head: () => ({
    meta: [
      { title: "Top Product Deals & Discounts | SpatialFind" },
      { name: "description", content: "Browse the best hand-picked deals on premium tech and lifestyle products. Save on expert-recommended items." },
      { property: "og:title", content: "Top Product Deals & Discounts | SpatialFind" },
      { property: "og:description", content: "Browse the best hand-picked deals on premium tech and lifestyle products. Save on expert-recommended items." },
      { name: "twitter:title", content: "Top Product Deals & Discounts | SpatialFind" },
      { name: "twitter:description", content: "Browse the best hand-picked deals on premium tech and lifestyle products. Save on expert-recommended items." },
    ],
  }),
  component: DealsPage,
});

function DealsPage() {
  const deals = useDeals();

  return (
    <div className="pb-32 min-h-screen">
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent -z-10" />
        
        <div className="container mx-auto px-4">
          <SpatialLayer depth="content" className="space-y-6 text-center max-w-4xl mx-auto mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-center gap-3 text-primary">
                <div className="h-px w-8 bg-primary/30" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Exclusive Discovery</span>
                <div className="h-px w-8 bg-primary/30" />
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] text-balance">
                TOP <span className="text-primary font-light italic">DEALS.</span>
              </h1>
              <p className="text-xl text-muted-foreground/60 max-w-xl mx-auto font-medium">
                The biggest discounts across all categories, manually curated for maximum value.
              </p>
            </motion.div>
          </SpatialLayer>

          {/* Filters Area */}
          <SpatialLayer depth="foreground">
            <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
              <div className="glass px-8 py-5 rounded-[2.5rem] flex items-center gap-6 shadow-spatial border border-white/5 bg-background/30 backdrop-blur-3xl">
                <div className="flex items-center gap-2 text-primary pr-6 border-r border-white/10">
                  <Filter size={18} />
                  <span className="text-xs font-black uppercase tracking-widest">Filter By</span>
                </div>
                
                <div className="flex items-center gap-8">
                  <button className="flex items-center gap-2 text-sm font-black uppercase tracking-widest hover:text-primary transition-colors">
                    Price <ChevronDown size={14} />
                  </button>
                  <button className="flex items-center gap-2 text-sm font-black uppercase tracking-widest hover:text-primary transition-colors">
                    Discount <ChevronDown size={14} />
                  </button>
                  <button className="flex items-center gap-2 text-sm font-black uppercase tracking-widest hover:text-primary transition-colors">
                    Category <ChevronDown size={14} />
                  </button>
                </div>
              </div>
            </div>
          </SpatialLayer>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {deals.map((deal) => (
              <ProductCard key={deal.id} product={deal} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
