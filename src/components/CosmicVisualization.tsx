'use client';

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
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (starRef.current && glowRef.current) {
      // Rotation speed based on age and elements (heavier elements = slower rotation)
      const elementWeight = data.cosmicElements.reduce((sum, el) => sum + el.atomicNumber, 0) / data.cosmicElements.length;
      const rotationSpeed = 0.005 * (1 / Math.max(1, data.birthStar.age)) * (1 / (elementWeight / 20));
      starRef.current.rotation.y += rotationSpeed;
      glowRef.current.rotation.y += rotationSpeed * 0.6;
    }
  });

  // Calculate unique star properties based on all available data
  const temp = data.birthStar.temperature;
  const age = data.birthStar.age;
  const distance = data.birthStar.distance;
  
  // Use elements to influence the star's appearance
  const elementTypes = new Set(data.cosmicElements.map(el => el.type));
  const hasGasElements = elementTypes.has('Gas');
  const hasSolidElements = elementTypes.has('Solid');
  
  // Calculate average atomic number of elements
  const avgAtomicNumber = data.cosmicElements.reduce((sum, el) => sum + el.atomicNumber, 0) / data.cosmicElements.length;
  
  // Base color from temperature (2000K - 15000K)
  const tempHue = 1 - ((temp - 2000) / 13000); // 1 (red) to 0 (blue)
  
  // Modify color based on elements and age
  let finalHue = tempHue;
  let saturation = 1.0;
  let lightness = 0.5;
  
  // Age affects color (older stars tend to be redder)
  finalHue = Math.min(1, finalHue + (age / 15) * 0.2);
  
  // Elements affect the color
  if (hasGasElements) {
    // Gas elements add blue tint
    finalHue = Math.max(0, finalHue - 0.1);
    saturation *= 1.2;
  }
  if (hasSolidElements) {
    // Solid elements add warmth
    finalHue = Math.min(1, finalHue + 0.05);
    lightness *= 1.1;
  }
  
  // Average atomic number affects brightness
  lightness *= 0.8 + (avgAtomicNumber / 100);
  
  // Distance affects the intensity
  const distanceFactor = 1 / Math.max(1, distance / 100);
  saturation *= 0.8 + distanceFactor * 0.4;
  lightness *= 0.8 + distanceFactor * 0.4;

  const starColor = new THREE.Color().setHSL(finalHue, saturation, lightness);

  // Star size based on distance and elements
  const baseSize = 1;
  const distanceSize = 1 / Math.max(1, distance / 100);
  const elementSize = 1 + (avgAtomicNumber / 200); // Heavier elements = slightly larger star
  const starSize = baseSize * (0.8 + distanceSize * 0.4) * elementSize;
  const glowSize = starSize * (1.5 + (temp / 15000)); // Hotter stars have larger glows

  // Calculate unique glow color
  const glowColor = new THREE.Color().setHSL(
    finalHue,
    saturation * 0.8,
    lightness * 1.2
  );

  return (
    <group>
      {/* Outer glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[glowSize, 32, 32]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={0.2 + (temp / 15000) * 0.1} // Hotter stars have more visible glow
          side={THREE.BackSide}
        />
      </mesh>
      {/* Main star */}
      <mesh ref={starRef}>
        <sphereGeometry args={[starSize, 32, 32]} />
        <meshBasicMaterial
          color={starColor}
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
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

  // Number of particles based on number of elements
  const particleCount = data.cosmicElements.length * 200;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  
  // Create particles for each element
  let particleIndex = 0;
  data.cosmicElements.forEach((element, elementIndex) => {
    const elementParticleCount = 200;
    const radius = 2 + (element.atomicNumber / 50); // Larger radius for heavier elements
    
    for (let i = 0; i < elementParticleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[particleIndex * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[particleIndex * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[particleIndex * 3 + 2] = radius * Math.cos(phi);
      
      // Color based on element type
      const hue = element.type === 'Gas' ? 0.6 : 0.3; // Blue for gas, orange for solid
      const color = new THREE.Color().setHSL(hue, 1, 0.5);
      colors[particleIndex * 3] = color.r;
      colors[particleIndex * 3 + 1] = color.g;
      colors[particleIndex * 3 + 2] = color.b;
      
      particleIndex++;
    }
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  return (
    <points ref={particlesRef}>
      <primitive object={geometry} />
      <pointsMaterial
        size={0.05}
        vertexColors
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
      // Pulsing speed based on radiation level
      const pulseSpeed = 0.001 * (1 + data.radiationLevel / 50);
      const scale = 1 + Math.sin(Date.now() * pulseSpeed) * (0.1 + data.radiationLevel / 200);
      sphereRef.current.scale.set(scale, scale, scale);
    }
  });

  // Color based on radiation level
  const radiationColor = new THREE.Color().setHSL(
    0.3 + (data.radiationLevel / 200), // Hue shifts from green to yellow with higher radiation
    1,
    0.5
  );

  return (
    <mesh ref={sphereRef}>
      <sphereGeometry args={[1.5, 32, 32]} />
      <meshBasicMaterial
        color={radiationColor}
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
    <div className="relative w-full h-[50vh] min-h-[300px] max-h-[600px] bg-black rounded-lg overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        onCreated={() => setIsInitialized(true)}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <RadiationSphere data={data} />
        <Star data={data} />
        <ElementParticles data={data} />
        <OrbitControls 
          enableDamping 
          dampingFactor={0.05}
          enableZoom={true}
          enablePan={false}
          minDistance={3}
          maxDistance={10}
        />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      </Canvas>
      {isInitialized && data && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/30 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 z-30">
          <p className="text-sm font-medium text-white whitespace-nowrap">
            Radiation: {data.radiationLevel.toFixed(1)}
          </p>
        </div>
      )}
    </div>
  );
};

export default CosmicVisualization; 