import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface DNASphereProps {
  size?: number;
  rotationSpeedY?: number;
  rotationSpeedX?: number;
}

const DNASphere: React.FC<DNASphereProps> = ({ size = 2, rotationSpeedY = 0.003, rotationSpeedX = 0.001 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sphereRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Generate procedural heatmap texture
    const texSize = 256;
    const canvas = document.createElement('canvas');
    canvas.width = texSize;
    canvas.height = texSize;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      for (let y = 0; y < texSize; y++) {
        for (let x = 0; x < texSize; x++) {
          // Generate pseudo-random DNA data pattern
          const value = Math.abs(Math.sin(x * 0.1 + y * 0.13) + Math.cos(x * 0.07 - y * 0.11));
          // Map value to color (heatmap style)
          const r = Math.floor(255 * value);
          const g = Math.floor(255 * (1 - value));
          const b = Math.floor(128 + 127 * Math.sin(value * Math.PI));
          ctx.fillStyle = `rgb(${r},${g},${b})`;
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }
    const texture = new THREE.CanvasTexture(canvas);

    // Create sphere geometry and material
    const geometry = new THREE.SphereGeometry(size, 64, 64);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const sphere = new THREE.Mesh(geometry, material);
    sphereRef.current = sphere;
    scene.add(sphere);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      sphere.rotation.y += rotationSpeedY;
      sphere.rotation.x += rotationSpeedX;
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      scene.clear();
    };
  }, [size, rotationSpeedY, rotationSpeedX]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
  );
};

export default DNASphere; 