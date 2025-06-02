'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import the game component to avoid SSR issues
const SnakeGame = dynamic(() => import('@/components/SnakeGame'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-purple-400 animate-pulse">Loading cosmic game...</div>
    </div>
  )
});

export default function SnakeGamePage() {
  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-black text-white overflow-hidden">
      {/* Animated background stars */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{
              x: Math.random() * windowWidth,
              y: Math.random() * windowHeight,
              scale: Math.random() * 2,
              opacity: Math.random() * 0.5 + 0.5
            }}
            animate={{
              x: [null, Math.random() * windowWidth],
              y: [null, Math.random() * windowHeight],
              opacity: [null, Math.random() * 0.5 + 0.5],
              scale: [null, Math.random() * 2]
            }}
            transition={{
              duration: Math.random() * 15 + 15,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <main className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex justify-between items-center mb-8">
            <Link 
              href="/cosmic-hub"
              className="font-geist-sans inline-block px-4 py-2 border border-purple-500 rounded-lg text-sm hover:bg-purple-500/10 transition-all"
            >
              ← Back to Cosmic Hub
            </Link>
            <h1 className="font-outfit text-3xl font-light bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
              Cosmic Snake
            </h1>
          </div>

          {/* Game container */}
          <div className="w-full aspect-square max-w-md mx-auto bg-black/50 rounded-lg border border-purple-500/50 overflow-hidden">
            <SnakeGame />
          </div>

          {/* Instructions */}
          <div className="mt-8 text-center text-gray-400">
            <p>Use arrow keys to control the snake</p>
            <p className="text-sm mt-2">Powered by SpaceComputer's True Random Number Generator</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
} 