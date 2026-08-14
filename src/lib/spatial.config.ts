export interface SpatialConfig {
  depths: {
    farBackground: number;
    background: number;
    midground: number;
    content: number;
    foreground: number;
    interactive: number;
  };
  parallax: {
    farBackground: number;
    background: number;
    midground: number;
    content: number;
    foreground: number;
  };
  motion: {
    stiffness: number;
    damping: number;
    mass: number;
  };
  camera: {
    fov: number;
    near: number;
    far: number;
  };
}

export const SPATIAL_CONFIG: SpatialConfig = {
  depths: {
    farBackground: -20,
    background: -10,
    midground: -5,
    content: 0,
    foreground: 5,
    interactive: 10,
  },
  parallax: {
    farBackground: 0.02,
    background: 0.05,
    midground: 0.1,
    content: 0.2,
    foreground: 0.4,
  },
  motion: {
    stiffness: 100,
    damping: 30,
    mass: 1,
  },
  camera: {
    fov: 45,
    near: 0.1,
    far: 1000,
  },
};
