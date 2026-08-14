import React from 'react';
import { motion } from 'framer-motion';
import { useSpatial } from './SpatialProvider';
import { formatCurrency } from '../../lib/utils';
import { Product } from '../../lib/data/types';
import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { mousePosition, config } = useSpatial();

  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      transition={config.motion}
      className="group relative glass rounded-[2.5rem] overflow-hidden shadow-spatial hover:shadow-spatial-hover transition-all duration-500 bg-background/50 backdrop-blur-xl border border-white/10"
    >
      <div className="aspect-square overflow-hidden bg-muted relative">
        <motion.img 
          src={product.productImage} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
        />
        {product.discountPercent > 0 && (
          <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
            {product.discountPercent}% OFF
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      <div className="p-8 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{product.category}</span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{product.merchant}</span>
          </div>
          <h3 className="font-bold text-xl line-clamp-1 tracking-tight group-hover:text-primary transition-colors">{product.name}</h3>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tighter">{formatCurrency(product.price)}</span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-muted-foreground line-through opacity-50 tracking-tight">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>
          
          <Link 
            to="/product/$slug"
            params={{ slug: product.slug }}
            className="flex items-center justify-center w-12 h-12 bg-secondary text-secondary-foreground rounded-2xl group-hover:bg-primary group-hover:text-primary-foreground shadow-spatial transition-all duration-300"
          >
            <ArrowRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
