import React, { createContext, useContext, useMemo, useRef, useState, useEffect } from 'react';
import { useScroll, useSpring, useTransform, MotionValue } from 'framer-motion';
import { SPATIAL_CONFIG, SpatialConfig } from '../../lib/spatial.config';

interface SpatialContextValue {
  scrollProgress: MotionValue<number>;
  mousePosition: { x: MotionValue<number>; y: MotionValue<number> };
  config: SpatialConfig;
}

const SpatialContext = createContext<SpatialContextValue | null>(null);

export const useSpatial = () => {
  const context = useContext(SpatialContext);
  if (!context) throw new Error('useSpatial must be used within a SpatialProvider');
  return context;
};

export const SpatialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { scrollYProgress } = useScroll();
  
  const mouseX = useSpring(0, SPATIAL_CONFIG.motion);
  const mouseY = useSpring(0, SPATIAL_CONFIG.motion);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth) * 2 - 1);
      mouseY.set((e.clientY / window.innerHeight) * 2 - 1);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const value = useMemo(() => ({
    scrollProgress: scrollYProgress,
    mousePosition: { x: mouseX, y: mouseY },
    config: SPATIAL_CONFIG
  }), [scrollYProgress, mouseX, mouseY]);

  return (
    <SpatialContext.Provider value={value}>
      {children}
    </SpatialContext.Provider>
  );
};
