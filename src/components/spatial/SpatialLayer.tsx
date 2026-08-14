import React from 'react';
import { motion, useTransform, useSpring } from 'framer-motion';
import { useSpatial } from './SpatialProvider';

interface SpatialLayerProps {
  children: React.ReactNode;
  depth: 'farBackground' | 'background' | 'midground' | 'content' | 'foreground' | 'interactive';
  parallaxFactor?: number;
  className?: string;
}

export const SpatialLayer: React.FC<SpatialLayerProps> = ({ 
  children, 
  depth, 
  parallaxFactor = 1,
  className = "" 
}) => {
  const { mousePosition, config } = useSpatial();
  
  // Use a string literal for depth if the type inference failed
  const zIndex = config.depths[depth as keyof typeof config.depths];
  const pFactor = config.parallax[depth as keyof typeof config.parallax] || 0.1;

  const x = useTransform(mousePosition.x, (val) => val * 50 * pFactor * parallaxFactor);
  const y = useTransform(mousePosition.y, (val) => val * 50 * pFactor * parallaxFactor);

  return (
    <motion.div
      style={{
        x,
        y,
        zIndex,
        position: 'relative',
        transformStyle: 'preserve-3d',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
