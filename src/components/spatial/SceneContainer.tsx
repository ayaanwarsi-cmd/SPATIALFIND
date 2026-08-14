import React, { Suspense } from 'react';
import { useSpatial } from './SpatialProvider';

interface SceneContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const SceneContainer: React.FC<SceneContainerProps> = ({ children, className = "" }) => {
  return (
    <div className={`relative overflow-hidden w-full h-full ${className}`}>
      <Suspense fallback={null}>
        {children}
      </Suspense>
    </div>
  );
};
