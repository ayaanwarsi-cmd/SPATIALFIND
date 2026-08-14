import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { getProducts, updateProduct, createProduct } from '../../../lib/admin/data/cms.functions';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/products/')({
  component: ProductsCmsPage,
});

function ProductsCmsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const getProductsFn = useServerFn(getProducts);
  const createProductFn = useServerFn(createProduct);
  const updateProductFn = useServerFn(updateProduct);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getProductsFn();
      setProducts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePublish = async (product: any) => {
    try {
      await updateProductFn({ data: { id: product.id, updates: { published: !product.published } } });
      toast.success(`Product ${product.published ? 'unpublished' : 'published'} successfully`);
      loadProducts();
    } catch (e: any) {
      toast.error(e.message || 'Failed to update product');
    }
  };

  if (isLoading) {
    return <div className="p-12 text-center text-slate-500 uppercase tracking-widest font-bold text-xs animate-pulse">Loading Products...</div>;
  }

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Products CMS</h1>
          <p className="text-slate-400">Manage your product catalog and affiliate links</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:scale-105 transition-transform active:scale-95"
        >
          Add New Product
        </button>
      </header>

      <div className="rounded-3xl border border-white/5 bg-slate-900/30 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900 text-slate-400 font-medium border-b border-white/5">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Merchant</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.length > 0 ? products.map((product) => (
              <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-800 border border-white/5 shrink-0 flex items-center justify-center">
                      {product.product_image ? (
                        <img src={product.product_image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">NO IMG</div>
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-white">{product.name}</div>
                      <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">{product.category_slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <button 
                    onClick={() => togglePublish(product)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter transition-all ${
                      product.published 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-slate-800 text-slate-500 border border-white/5'
                    }`}
                  >
                    {product.published ? 'Published' : 'Draft'}
                  </button>
                </td>
                <td className="px-6 py-6 font-medium text-slate-300">
                  {product.merchant || 'None'}
                </td>
                <td className="px-6 py-6 font-mono text-slate-400">
                  ₹{Number(product.price).toLocaleString()}
                </td>
                <td className="px-6 py-6 text-right">
                  <button 
                    onClick={() => {
                      const name = prompt('Enter new product name', product.name);
                      if (name) updateProductFn({ data: { id: product.id, updates: { name } } }).then(() => loadProducts());
                    }}
                    className="text-xs font-bold text-slate-400 hover:text-white transition-colors mr-4"
                  >
                    Edit
                  </button>
                  <Link 
                    to="/product/$slug" 
                    params={{ slug: product.slug }}
                    className="text-xs font-bold text-slate-400 hover:text-white transition-colors"
                  >
                    Preview
                  </Link>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">No products found in the database.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-3xl p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h2 className="text-2xl font-bold">Add New Product</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const data = {
                name: formData.get('name') as string,
                slug: formData.get('slug') as string,
                price: Number(formData.get('price')),
                category_slug: formData.get('category') as string,
                merchant: formData.get('merchant') as string,
                affiliate_url: formData.get('affiliate_url') as string,
                published: false
              };
              try {
                await createProductFn({ data });
                toast.success('Product created successfully');
                setIsAdding(false);
                loadProducts();
              } catch (err: any) {
                toast.error(err.message);
              }
            }}>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Product Name</label>
                <input name="name" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Slug</label>
                <input name="slug" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Price (₹)</label>
                <input name="price" type="number" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                <select name="category" required className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary">
                  <option value="computers">Computers</option>
                  <option value="pc-components">PC Components</option>
                  <option value="gaming">Gaming</option>
                  <option value="audio">Audio</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Merchant</label>
                <select name="merchant" required className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary">
                  <option value="Amazon">Amazon</option>
                  <option value="Flipkart">Flipkart</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Affiliate URL</label>
                <input name="affiliate_url" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary" />
              </div>
              <div className="md:col-span-2 flex gap-4 pt-4">
                <button type="submit" className="flex-1 bg-primary text-primary-foreground font-bold py-3 rounded-xl">Save Product</button>
                <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-3 rounded-xl bg-slate-800 font-bold">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
