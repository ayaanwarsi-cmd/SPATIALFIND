import { createFileRoute } from '@tanstack/react-router'
import { useProducts } from '../hooks/use-data'
import { ProductCard } from '../components/spatial/ProductCard'
import { SpatialLayer } from '../components/spatial/SpatialLayer'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { z } from 'zod'

const searchSchema = z.object({
  q: z.string().optional(),
})

export const Route = createFileRoute('/search')({
  validateSearch: (search: Record<string, unknown>) => searchSchema.parse(search),
  head: (ctx) => {
    const q = (ctx as any).loaderData?.q || '';
    const title = q ? `Search results for "${q}" | SpatialFind` : "Search Products | SpatialFind";
    return {
      meta: [
        { title },
        { name: "description", content: "Search for premium tech, gaming, and audio products on SpatialFind." },
      ],
    };
  },
  loader: (ctx) => {
    return { q: (ctx as any).search?.q };
  },
  component: SearchPage,
});

function SearchPage() {
  const products = useProducts()
  const { q } = Route.useSearch() as { q?: string }

  const filteredProducts = q
    ? products.filter((p) =>
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.brand.toLowerCase().includes(q.toLowerCase()) ||
        p.category.toLowerCase().includes(q.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(q.toLowerCase()))
      )
    : products

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
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Discovery Engine</span>
                <div className="h-px w-8 bg-primary/30" />
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] text-balance">
                SEARCH <span className="text-primary font-light italic">RESULTS.</span>
              </h1>
              {q && (
                <p className="text-xl text-muted-foreground/60 max-w-xl mx-auto font-medium">
                  Showing results for "{q}"
                </p>
              )}
            </motion.div>
          </SpatialLayer>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-32 text-center space-y-8">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full" />
                <Search size={80} className="relative text-muted-foreground/20" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tighter uppercase">No matches found</h2>
                <p className="text-muted-foreground font-medium">Try adjusting your search terms or exploring categories.</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
