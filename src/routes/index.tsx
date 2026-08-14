/**
 * '''Do not make any visual modifications. The phrases I write are commands to understand what I want, not to be written down. Understand their content well, then execute what is required.'''
 * 
 * # CRITICAL — FULL PROJECT CODEBASE SYNC TO GITHUB
 * 
 * I need you to transfer/synchronize the COMPLETE CURRENT Lovable project codebase to my GitHub repository:
 * 
 * GitHub repository:
 * ayaanwarsi-cmd/SPATIALFIND
 * 
 * ... (rest of the command content) ...
 */
import { createFileRoute, Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { useTrendingProducts, useCategories, useDeals } from '../hooks/use-data';
import { formatCurrency } from '../lib/utils';
import { Search, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import { HeroScene } from '../components/three/Scenes';
import { ProductCard } from '../components/spatial/ProductCard';
import { SpatialLayer } from '../components/spatial/SpatialLayer';
import { SceneContainer } from '../components/spatial/SceneContainer';
import { CategoryTile } from '../components/spatial/CategoryTile';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: "SpatialFind | Discover Something Worth Buying" },
      { name: "description", content: "Explore manually curated premium products with 3D spatial depth. SpatialFind is an editorial magazine-style discovery platform for tech, gaming, and audio." },
      { property: "og:title", content: "SpatialFind | Discover Something Worth Buying" },
      { property: "og:description", content: "Explore manually curated premium products with 3D spatial depth. SpatialFind is an editorial magazine-style discovery platform for tech, gaming, and audio." },
      { name: "twitter:title", content: "SpatialFind | Discover Something Worth Buying" },
      { name: "twitter:description", content: "Explore manually curated premium products with 3D spatial depth. SpatialFind is an editorial magazine-style discovery platform for tech, gaming, and audio." },
    ],
  }),
  component: Index,
});

function Index() {
  const trending = useTrendingProducts();
  const categories = useCategories();
  const deals = useDeals();

  return (
    <div className="space-y-32 pb-32">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <SceneContainer className="absolute inset-0 -z-10">
          <HeroScene />
        </SceneContainer>

        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.02),transparent)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02),transparent)]" />
        
        <div className="container mx-auto px-4 text-center space-y-16 max-w-5xl relative z-10">
          <SpatialLayer depth="content" className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] text-balance">
                FIND SOMETHING <br />
                <span className="text-primary/80 font-light italic">WORTH BUYING.</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground/80 max-w-2xl mx-auto text-balance leading-relaxed font-medium">
                SpatialFind is a next-generation discovery platform. 
                Manually curated, visually premium, and spatial-first.
              </p>
            </motion.div>
          </SpatialLayer>

          <SpatialLayer depth="foreground">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-3xl mx-auto group"
            >
              <div className="absolute inset-0 bg-primary/10 rounded-[2.5rem] blur-3xl group-focus-within:bg-primary/20 transition-all duration-700" />
              <div className="relative glass rounded-[2.5rem] p-3 flex items-center shadow-spatial group-focus-within:ring-2 ring-primary/30 transition-all duration-500 bg-background/40 backdrop-blur-2xl border border-white/10">
                <Search className="ml-8 text-muted-foreground/60 shrink-0" size={24} />
                <input 
                  type="text" 
                  placeholder="What are you looking for?" 
                  className="w-full bg-transparent border-none focus:ring-0 px-8 py-6 text-xl font-bold placeholder:text-muted-foreground/30 tracking-tight"
                />
                <button className="bg-primary text-primary-foreground px-10 py-6 rounded-[2rem] font-black tracking-tighter hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg">
                  SEARCH
                </button>
              </div>
              <div className="absolute top-full left-0 right-0 mt-8 flex justify-center gap-8 text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em]">
                <span className="hover:text-primary transition-colors cursor-pointer">MacBook Pro</span>
                <span className="hover:text-primary transition-colors cursor-pointer">RTX 4090</span>
                <span className="hover:text-primary transition-colors cursor-pointer">Sony XM5</span>
              </div>
            </motion.div>
          </SpatialLayer>
        </div>
      </section>

      {/* Trending Section */}
      <section className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <TrendingUp size={16} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Trending Discovery</span>
            </div>
            <h2 className="text-4xl font-bold tracking-tighter">Recently Discovered</h2>
          </div>
          <Link to="/" className="text-sm font-bold flex items-center gap-2 group">
            View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>


        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {trending.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-20">
          <div className="flex items-center justify-center gap-2 text-primary">
            <Sparkles size={16} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Curated Collections</span>
          </div>
          <h2 className="text-5xl font-bold tracking-tighter">Shop by Category</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat) => (
            <CategoryTile key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* Stats / Value Prop */}
      <section className="py-32 bg-primary text-primary-foreground overflow-hidden relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-24 text-center md:text-left">
            <div className="space-y-4">
              <span className="text-7xl font-bold tracking-tighter opacity-20 block">01</span>
              <h3 className="text-2xl font-bold tracking-tight">Expert Curation</h3>
              <p className="text-primary-foreground/60 leading-relaxed">
                We manually research every product to ensure only the best make the list.
              </p>
            </div>
            <div className="space-y-4">
              <span className="text-7xl font-bold tracking-tighter opacity-20 block">02</span>
              <h3 className="text-2xl font-bold tracking-tight">3D Exploration</h3>
              <p className="text-primary-foreground/60 leading-relaxed">
                Experience products in spatial depth before committing to a purchase.
              </p>
            </div>
            <div className="space-y-4">
              <span className="text-7xl font-bold tracking-tighter opacity-20 block">03</span>
              <h3 className="text-2xl font-bold tracking-tight">Real Value</h3>
              <p className="text-primary-foreground/60 leading-relaxed">
                Transparent affiliate links that help us grow without charging you a cent.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
