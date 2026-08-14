import React from 'react';
import { motion } from 'framer-motion';
import { Link } from '@tanstack/react-router';
import { SpatialLayer } from './SpatialLayer';

interface CategoryTileProps {
  category: {
    id: string;
    name: string;
    image: string;
  };
}

export const CategoryTile: React.FC<CategoryTileProps> = ({ category }) => {
  return (
    <Link 
      to="/"
      className="group relative aspect-[4/5] rounded-[3rem] overflow-hidden glass shadow-spatial hover:shadow-spatial-hover transition-all duration-700 block bg-black"
    >
      <SpatialLayer depth="background" parallaxFactor={0.5} className="absolute inset-0 w-full h-full">
        <img 
          src={category.image} 
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
        />
      </SpatialLayer>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      
      <SpatialLayer depth="content" className="absolute bottom-8 left-8 right-8 space-y-2">
        <h3 className="text-white font-black text-2xl tracking-tighter uppercase leading-none">{category.name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] group-hover:text-primary transition-colors">Explore Collection</span>
          <motion.div 
            initial={{ x: -5, opacity: 0 }}
            whileHover={{ x: 0, opacity: 1 }}
            className="w-4 h-px bg-primary" 
          />
        </div>
      </SpatialLayer>
    </Link>
  );
};
