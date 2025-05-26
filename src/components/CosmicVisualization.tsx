import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

interface CosmicData {
  birthStar: {
    name: string;
    type: string;
    distance: number;
    temperature: number;
    age: number;
  };
  cosmicElements: Array<{
    name: string;
    symbol: string;
    atomicNumber: number;
    abundance: number;
    type: string;
  }>;
  radiationLevel: number;
  timestamp: string;
  source: string;
}

interface CosmicVisualizationProps {
  data: CosmicData;
}

function Star({ data }: { data: CosmicData }) {
  const starRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (starRef.current) {
      starRef.current.rotation.y += 0.005;
    }
  });

  return (
    <mesh ref={starRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial
        color={new THREE.Color().setHSL(data.birthStar.temperature / 12000, 1, 0.5)}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

function ElementParticles({ data }: { data: CosmicData }) {
  const particlesRef = useRef<THREE.Points>(null);
  
  useFrame(() => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.002;
      particlesRef.current.rotation.x += 0.001;
    }
  });

  const particleCount = 1000;
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    const radius = 2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  return (
    <points ref={particlesRef}>
      <primitive object={geometry} />
      <pointsMaterial
        size={0.05}
        color={new THREE.Color().setHSL(0.6, 1, 0.5)}
        transparent
        opacity={0.6}
      />
    </points>
  );
}

function RadiationSphere({ data }: { data: CosmicData }) {
  const sphereRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (sphereRef.current) {
      const scale = 1 + Math.sin(Date.now() * 0.001) * 0.1;
      sphereRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh ref={sphereRef}>
      <sphereGeometry args={[1.5, 32, 32]} />
      <meshBasicMaterial
        color={0x00ff00}
        transparent
        opacity={data.radiationLevel / 200}
        wireframe
      />
    </mesh>
  );
}

const CosmicVisualization: React.FC<CosmicVisualizationProps> = ({ data }) => {
  const [isInitialized, setIsInitialized] = useState(false);

  return (
    <div className="relative w-full h-[600px] bg-black rounded-lg overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        onCreated={() => setIsInitialized(true)}
      >
        <ambientLight intensity={0.5} />
        <Star data={data} />
        <ElementParticles data={data} />
        <RadiationSphere data={data} />
        <OrbitControls enableDamping dampingFactor={0.05} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      </Canvas>
      
      {isInitialized && data && (
        <>
          {/* Information Overlay */}
          <div className="absolute top-0 left-0 p-4 text-white bg-black/50 rounded-br-lg">
            <h3 className="text-xl font-bold mb-2">{data.birthStar.name}</h3>
            <p className="text-sm">Type: {data.birthStar.type}</p>
            <p className="text-sm">Distance: {data.birthStar.distance} light years</p>
            <p className="text-sm">Temperature: {data.birthStar.temperature}K</p>
            <p className="text-sm">Age: {data.birthStar.age} billion years</p>
          </div>
          
          <div className="absolute bottom-0 right-0 p-4 text-white bg-black/50 rounded-tl-lg">
            <h3 className="text-xl font-bold mb-2">Cosmic Elements</h3>
            <div className="grid grid-cols-2 gap-2">
              {data.cosmicElements.map((element) => (
                <div key={element.name} className="text-sm">
                  <span className="font-bold">{element.symbol}</span> - {element.name}
                  <br />
                  <span className="text-xs">Abundance: {element.abundance}%</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                        text-white bg-black/50 px-4 py-2 rounded-lg">
            <p className="text-lg font-bold">Radiation Level: {data.radiationLevel.toFixed(2)}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default CosmicVisualization; 