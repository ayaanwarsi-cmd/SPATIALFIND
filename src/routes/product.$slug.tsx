import { createFileRoute } from '@tanstack/react-router';
import { useProductBySlug } from '../hooks/use-data';
import { formatCurrency } from '../lib/utils';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, ArrowUpRight, ChevronRight, Info } from 'lucide-react';
import { ProductScene } from '../components/three/Scenes';
import { SpatialLayer } from '../components/spatial/SpatialLayer';
import { SceneContainer } from '../components/spatial/SceneContainer';

export const Route = createFileRoute('/product/$slug')({
  head: (ctx) => {
    const product = (ctx as any).loaderData;
    if (!product) return { title: "Product Not Found | SpatialFind" };
    
    return {
      meta: [
        { title: `${product.name} by ${product.brand} | SpatialFind Discovery` },
        { name: "description", content: `Expert review and 3D spatial exploration of the ${product.name}. See detailed specs and find the best prices.` },
        { property: "og:title", content: `${product.name} by ${product.brand} | SpatialFind Discovery` },
        { property: "og:description", content: `Expert review and 3D spatial exploration of the ${product.name}. See detailed specs and find the best prices.` },
        { property: "og:image", content: product.productImage },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: `${product.name} by ${product.brand} | SpatialFind Discovery` },
        { name: "twitter:description", content: `Expert review and 3D spatial exploration of the ${product.name}. See detailed specs and find the best prices.` },
        { name: "twitter:image", content: product.productImage },
      ],
    };
  },
  loader: ({ params }) => {
    // This is a temporary way to get product data for head() in Phase 1
    // Ideally this would come from a proper API
    const products = [
      { slug: 'macbook-pro-m3', name: 'MacBook Pro M3', brand: 'Apple', description: 'The ultimate professional laptop.', productImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1000' },
      { slug: 'sony-wh-1000xm5', name: 'Sony WH-1000XM5', brand: 'Sony', description: 'Industry-leading noise cancellation.', productImage: 'https://images.unsplash.com/photo-1618366712277-721626c6aa3b?auto=format&fit=crop&q=80&w=1000' }
    ];
    return products.find(p => p.slug === params.slug);
  },
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const product = useProductBySlug(slug);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-4xl font-bold tracking-tighter">Product not found</h1>
      </div>
    );
  }

  return (
    <div className="pb-32">
      {/* Product Hero */}
      <section className="container mx-auto px-4 py-12 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left: Product Visual */}
          <div className="lg:col-span-7 space-y-8">
            <SpatialLayer depth="foreground">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="aspect-[4/3] rounded-[4rem] glass overflow-hidden relative group shadow-spatial flex items-center justify-center bg-background/30 backdrop-blur-3xl border border-white/5"
              >
                <SceneContainer className="w-full h-full">
                  {product.threeDAsset ? (
                    <ProductScene assetPath={product.threeDAsset} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-12 relative">
                      <motion.div
                        animate={{ 
                          y: [0, -10, 0],
                        }}
                        transition={{ 
                          duration: 4, 
                          repeat: Infinity, 
                          ease: "easeInOut" 
                        }}
                        className="w-full h-full relative"
                      >
                        <img 
                          src={product.productImage} 
                          alt={product.name}
                          className="w-full h-full object-contain relative z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
                        />
                        <div className="absolute inset-0 blur-3xl opacity-20 bg-primary/30 rounded-full scale-75" />
                      </motion.div>
                    </div>
                  )}
                </SceneContainer>
                <div className="absolute top-10 left-10">
                  <span className="glass px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/10">
                    {product.brand}
                  </span>
                </div>
              </motion.div>
            </SpatialLayer>

          </div>

          {/* Right: Product Info */}
          <div className="lg:col-span-5 space-y-12">
            <SpatialLayer depth="content" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-yellow-500 bg-yellow-500/10 px-3 py-1.5 rounded-full border border-yellow-500/20 shadow-sm">
                    <Star size={14} fill="currentColor" />
                    <span className="text-xs font-black">{product.rating}</span>
                  </div>
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{product.category}</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] text-balance">
                  {product.name}
                </h1>
                <p className="text-xl text-muted-foreground/80 leading-relaxed font-medium text-balance">
                  {product.description}
                </p>
              </motion.div>
            </SpatialLayer>

            <SpatialLayer depth="foreground">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="p-10 rounded-[3.5rem] bg-muted/30 border border-white/5 shadow-spatial-hover backdrop-blur-3xl space-y-8"
              >
                <div className="flex items-baseline gap-4">
                  <span className="text-5xl font-black tracking-tighter">{formatCurrency(product.price)}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-xl text-muted-foreground/40 line-through decoration-destructive/30 font-medium">
                      {formatCurrency(product.originalPrice)}
                    </span>
                  )}
                  {product.discountPercent > 0 && (
                    <span className="bg-primary text-primary-foreground text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg ml-auto">
                      {product.discountPercent}% OFF
                    </span>
                  )}
                </div>

                <div className="space-y-6">
                  <a 
                    href={product.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full py-6 bg-primary text-primary-foreground rounded-[2rem] font-black tracking-tighter text-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-xl group"
                  >
                    CHECK LATEST PRICE
                    <ArrowUpRight size={22} className="ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </a>
                  
                  <div className="flex items-start gap-3 px-4 text-[10px] text-muted-foreground/60 leading-relaxed font-bold uppercase tracking-widest">
                    <Info size={14} className="shrink-0 mt-0.5 text-primary" />
                    <p>
                      We may earn a commission from this link. 
                      Verified pricing from <span className="text-foreground">{product.merchant}</span>.
                    </p>
                  </div>
                </div>
              </motion.div>
            </SpatialLayer>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex items-center gap-3 text-primary/70"
            >
              <ShieldCheck size={20} />
              <span className="text-xs font-black tracking-[0.1em] uppercase">Expertly recommended for you</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Details Sections */}
      <section className="container mx-auto px-4 py-32 space-y-48">
        <SpatialLayer depth="background" className="grid grid-cols-1 md:grid-cols-2 gap-32">
          <div className="space-y-10">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">Why This <span className="text-primary italic font-light">Product?</span></h2>
            <div className="space-y-6 text-xl text-muted-foreground/70 leading-relaxed font-medium">
              <p>
                Our team selected the {product.name} because it represents the perfect intersection of {product.tags.join(', ')}. 
                In a market filled with generic alternatives, this {product.brand} offering stands out for its deliberate engineering and aesthetic clarity.
              </p>
            </div>
          </div>
          
          <div className="space-y-10">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">Key <span className="text-primary italic font-light">Features</span></h2>
            <ul className="grid grid-cols-1 gap-6">
              {product.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-6 group">
                  <div className="h-2 w-2 rounded-full bg-primary/30 group-hover:bg-primary transition-colors duration-500" />
                  <span className="text-lg font-bold text-muted-foreground group-hover:text-foreground transition-colors duration-500 uppercase tracking-tight">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </SpatialLayer>

        <SpatialLayer depth="content" className="space-y-12">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">Technical <span className="text-primary italic font-light">Specs</span></h2>
          <div className="glass rounded-[3.5rem] overflow-hidden border border-white/5 shadow-spatial bg-background/20 backdrop-blur-3xl">
            <table className="w-full text-left border-collapse">
              <tbody>
                {Object.entries(product.specifications).map(([key, value], i) => (
                  <tr key={key} className={`group ${i % 2 === 0 ? 'bg-muted/10' : ''} hover:bg-primary/5 transition-colors duration-500`}>
                    <td className="p-10 font-black text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60 border-r border-white/5 w-1/3 group-hover:text-primary transition-colors">{key}</td>
                    <td className="p-10 text-xl text-foreground font-bold tracking-tight">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SpatialLayer>
      </section>
    </div>
  );
}
