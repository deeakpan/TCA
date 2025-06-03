'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Ribbon } from 'react-ribbons';

export default function CosmicHub() {
  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-black text-white overflow-hidden">
      {/* Background Nebula Image */}
      <div className="fixed inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/nebula.jpg')`,
            filter: 'blur(8px) brightness(0.6)',
            transform: 'scale(1.05)',
          }}
        />
        <div className="absolute inset-0 bg-black/50" /> {/* Overlay for readability */}
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
            <p className="text-gray-400 mt-4 text-lg">Your gateway to cosmic adventures</p>
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full" />
          </motion.div>

          {/* Games Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Discover Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="group relative overflow-hidden rounded-lg"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
              <Link href="/profile" className="relative block bg-black p-8 rounded-lg h-full transform transition-transform duration-300 group-hover:scale-105">
                <div className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 mb-4 rounded-full bg-purple-500/20 flex items-center justify-center overflow-hidden transform group-hover:scale-110 transition-transform duration-300">
                    <img 
                      src="https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=200&h=200&fit=crop" 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
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

            {/* Nebula Serpent Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="group relative overflow-hidden rounded-lg"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
              <Link href="/snake-game" className="relative block bg-black p-8 rounded-lg h-full transform transition-transform duration-300 group-hover:scale-105">
                <div className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 mb-4 rounded-full bg-purple-500/20 flex items-center justify-center overflow-hidden transform group-hover:scale-110 transition-transform duration-300">
                    <img 
                      src="/Screenshot 2025-06-03 120016.png" 
                      alt="Nebula Serpent" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                    Nebula Serpent
                  </h3>
                  <p className="text-gray-400">
                    Navigate through cosmic dust and collect celestial bodies in this mesmerizing snake adventure
                  </p>
                </div>
              </Link>
            </motion.div>

            {/* Coming Soon Games */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="group relative overflow-hidden rounded-lg"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
              <div className="relative block bg-black p-8 rounded-lg h-full">
                <Ribbon
                  side="right"
                  type="corner"
                  size="large"
                  backgroundColor="#7E22CE"
                  color="#fff"
                  withStripes={false}
                  fontFamily="inherit"
                >
                  Coming Soon
                </Ribbon>
                <div className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 mb-4 rounded-full bg-purple-500/20 flex items-center justify-center overflow-hidden transform group-hover:scale-110 transition-transform duration-300">
                    <img 
                      src="https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=200&h=200&fit=crop" 
                      alt="Cosmic Tetris" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                    Cosmic Tetris
                  </h3>
                  <p className="text-gray-400">
                    Stack cosmic blocks in this zero-gravity puzzle adventure
                  </p>
                  <div className="mt-4">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                      Puzzle
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="group relative overflow-hidden rounded-lg"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
              <div className="relative block bg-black p-8 rounded-lg h-full">
                <Ribbon
                  side="right"
                  type="corner"
                  size="large"
                  backgroundColor="#7E22CE"
                  color="#fff"
                  withStripes={false}
                  fontFamily="inherit"
                >
                  Coming Soon
                </Ribbon>
                <div className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 mb-4 rounded-full bg-purple-500/20 flex items-center justify-center overflow-hidden transform group-hover:scale-110 transition-transform duration-300">
                    <img 
                      src="https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=200&h=200&fit=crop" 
                      alt="Space Invaders" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                    Space Invaders
                  </h3>
                  <p className="text-gray-400">
                    Defend Earth from alien invaders in this classic arcade remake
                  </p>
                  <div className="mt-4">
                    <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm">
                      Action
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="group relative overflow-hidden rounded-lg"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
              <div className="relative block bg-black p-8 rounded-lg h-full">
                <Ribbon
                  side="right"
                  type="corner"
                  size="large"
                  backgroundColor="#7E22CE"
                  color="#fff"
                  withStripes={false}
                  fontFamily="inherit"
                >
                  Coming Soon
                </Ribbon>
                <div className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 mb-4 rounded-full bg-purple-500/20 flex items-center justify-center overflow-hidden transform group-hover:scale-110 transition-transform duration-300">
                    <img 
                      src="https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=200&h=200&fit=crop" 
                      alt="Star Runner" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                    Star Runner
                  </h3>
                  <p className="text-gray-400">
                    Endless runner through the cosmos, dodge asteroids and collect power-ups
                  </p>
                  <div className="mt-4">
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                      Runner
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="group relative overflow-hidden rounded-lg"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
              <div className="relative block bg-black p-8 rounded-lg h-full">
                <Ribbon
                  side="right"
                  type="corner"
                  size="large"
                  backgroundColor="#7E22CE"
                  color="#fff"
                  withStripes={false}
                  fontFamily="inherit"
                >
                  Coming Soon
                </Ribbon>
                <div className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 mb-4 rounded-full bg-purple-500/20 flex items-center justify-center overflow-hidden transform group-hover:scale-110 transition-transform duration-300">
                    <img 
                      src="https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=200&h=200&fit=crop" 
                      alt="Galaxy Pong" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                    Galaxy Pong
                  </h3>
                  <p className="text-gray-400">
                    Classic pong with cosmic twists and gravitational effects
                  </p>
                  <div className="mt-4">
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm">
                      Classic
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="group relative overflow-hidden rounded-lg"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
              <div className="relative block bg-black p-8 rounded-lg h-full">
                <Ribbon
                  side="right"
                  type="corner"
                  size="large"
                  backgroundColor="#7E22CE"
                  color="#fff"
                  withStripes={false}
                  fontFamily="inherit"
                >
                  Coming Soon
                </Ribbon>
                <div className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 mb-4 rounded-full bg-purple-500/20 flex items-center justify-center overflow-hidden transform group-hover:scale-110 transition-transform duration-300">
                    <img 
                      src="https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=200&h=200&fit=crop" 
                      alt="Cosmic Memory" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                    Cosmic Memory
                  </h3>
                  <p className="text-gray-400">
                    Match celestial objects in this cosmic-themed memory game
                  </p>
                  <div className="mt-4">
                    <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm">
                      Memory
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
              className="group relative overflow-hidden rounded-lg"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
              <div className="relative block bg-black p-8 rounded-lg h-full">
                <Ribbon
                  side="right"
                  type="corner"
                  size="large"
                  backgroundColor="#7E22CE"
                  color="#fff"
                  withStripes={false}
                  fontFamily="inherit"
                >
                  Coming Soon
                </Ribbon>
                <div className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 mb-4 rounded-full bg-purple-500/20 flex items-center justify-center overflow-hidden transform group-hover:scale-110 transition-transform duration-300">
                    <img 
                      src="https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=200&h=200&fit=crop" 
                      alt="Quantum Breakout" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                    Quantum Breakout
                  </h3>
                  <p className="text-gray-400">
                    Break through quantum barriers in this physics-based puzzle game
                  </p>
                  <div className="mt-4">
                    <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm">
                      Physics
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
} 