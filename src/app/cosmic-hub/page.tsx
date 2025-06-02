'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CosmicHub() {
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
        {[...Array(50)].map((_, i) => (
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-5xl mx-auto"
        >
          {/* Back to Home */}
          <div className="mb-8">
            <Link 
              href="/"
              className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors group"
            >
              <motion.span
                initial={{ x: 0 }}
                animate={{ x: [0, -5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="mr-2"
              >
                ←
              </motion.span>
              Back to Home
            </Link>
          </div>

          {/* Hub Title */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <h1 className="font-outfit text-4xl md:text-5xl lg:text-6xl font-light mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 text-transparent bg-clip-text inline-block transform hover:scale-105 transition-transform">
                Cosmic Hub
              </span>
            </h1>
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full" />
          </motion.div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Discover Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="group relative"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
              <Link href="/profile" className="relative block bg-black p-8 rounded-lg h-full">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <span className="text-2xl">✨</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                    Discover Profile
                  </h3>
                  <p className="text-gray-400">
                    Uncover your cosmic ancestry and explore your celestial heritage
                  </p>
                </div>
              </Link>
            </motion.div>

            {/* Cosmic Snake Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="group relative"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
              <Link href="/snake-game" className="relative block bg-black p-8 rounded-lg h-full">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <span className="text-2xl">🐍</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                    Cosmic Snake
                  </h3>
                  <p className="text-gray-400">
                    Collect stars, planets, and comets in this cosmic snake game powered by cosmic radiation
                  </p>
                </div>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
} 