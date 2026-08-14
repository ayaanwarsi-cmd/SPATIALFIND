import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Float, MeshDistortMaterial, Environment } from '@react-three/drei';
import { useRef, Suspense } from 'react';
import * as THREE from 'three';

function AnimatedShape() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color="#000000"
          speed={3}
          distort={0.4}
          radius={1}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </Float>
  );
}

function Rig() {
  const { camera, mouse } = useThree();
  const vec = new THREE.Vector3();

  return useFrame(() => {
    camera.position.lerp(vec.set(mouse.x * 2, mouse.y * 2, 5), 0.05);
    camera.lookAt(0, 0, 0);
  });
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 -z-10 opacity-30 dark:opacity-20 pointer-events-none">
      <Canvas dpr={[1, 2]}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75} />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          <AnimatedShape />
          <Rig />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}

export function ProductScene({ assetPath }: { assetPath: string }) {
  // Simple orbital viewer for Phase 1
  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 4], fov: 50 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <pointLight position={[-10, -10, -10]} />
          
          <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
            {/* We would load the GLB here, for now using a placeholder mesh */}
            <mesh>
              <boxGeometry args={[1.5, 1.5, 1.5]} />
              <meshStandardMaterial color="#f0f0f0" metalness={0.5} roughness={0.2} />
            </mesh>
          </Float>
          
          <OrbitControls enableZoom={false} enablePan={false} dampingFactor={0.05} autoRotate />
          <Environment preset="warehouse" />
        </Suspense>
      </Canvas>
    </div>
  );
}
