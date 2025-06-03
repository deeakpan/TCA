'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { FaPause, FaPlay } from 'react-icons/fa';

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
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);

  const handleRestart = () => {
    window.location.reload();
  };

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-black text-white overflow-hidden relative">
      {/* Background Nebula Serpent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-pink-900/20 to-blue-900/20" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 2 }}
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, 
              rgba(147, 51, 234, 0.3) 0%,
              rgba(236, 72, 153, 0.2) 25%,
              rgba(59, 130, 246, 0.1) 50%,
              transparent 70%)`
          }}
        />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 }}
          transition={{ duration: 3 }}
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50,0 C60,30 80,40 100,50 C80,60 60,70 50,100 C40,70 20,60 0,50 C20,40 40,30 50,0' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
            backgroundPosition: 'center',
            transform: 'rotate(45deg)'
          }}
        />
        {/* Stylized Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.1, y: 0 }}
          transition={{ duration: 2, delay: 1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="relative w-full">
            <h1 className="text-9xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 transform -rotate-12 absolute left-0 top-1/4">
              NEBULA
            </h1>
            <h1 className="text-9xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 transform rotate-12 absolute right-0 bottom-1/4">
              SERPENT
            </h1>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 blur-xl" />
          </div>
        </motion.div>
      </div>

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

      {/* Score and Pause Controls */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-4">
        <div className="text-white text-sm font-medium bg-black/30 px-3 py-1.5 rounded-lg">
          Score: {score}
        </div>
        <button
          onClick={() => setIsPaused(prev => !prev)}
          className="p-2 hover:text-purple-400 transition-colors"
        >
          {isPaused ? <FaPlay className="text-white" /> : <FaPause className="text-white" />}
        </button>
      </div>

      <main className="container mx-auto px-4 pt-8 pb-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Game container */}
          <div className="w-full aspect-square max-w-md mx-auto bg-black/50 rounded-lg border border-purple-500/50 overflow-hidden">
            <SnakeGame
              isPaused={isPaused}
              onScoreChange={setScore}
              onRestart={handleRestart}
              onPauseChange={setIsPaused}
            />
          </div>

          {/* Instructions */}
          <div className="mt-8 text-center text-gray-400">
            <p>Use arrow keys to control the serpent</p>
            <p className="text-sm mt-2">Powered by SpaceComputer's True Random Number Generator</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
} 