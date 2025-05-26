'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-black text-white overflow-hidden">
      {/* Animated background stars */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 2,
              opacity: Math.random()
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              opacity: [null, Math.random()],
              scale: [null, Math.random() * 2]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
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
          {/* Hero Section */}
          <div className="text-center mb-24">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-3xl rounded-full" />
              <div className="relative">
                <h1 className="font-outfit text-4xl md:text-5xl lg:text-6xl font-light mb-4 tracking-tight">
                  <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 text-transparent bg-clip-text inline-block transform hover:scale-105 transition-transform">
                    True Cosmic Ancestry
                  </span>
                </h1>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full" />
              </div>
            </motion.div>
            
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="font-geist-sans text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto mt-12 leading-relaxed"
            >
              Discover your celestial heritage through the cosmic elements that shaped your existence
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-4"
            >
              <Link 
                href="/profile"
                className="font-geist-sans inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-medium text-base hover:from-purple-500 hover:to-pink-500 transition-all transform hover:scale-105"
              >
                Discover Your Profile
              </Link>
              <Link 
                href="https://blog.spacecomputer.io/cypherpunk-cosmic-randomness-ctrng-beta-now-live/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-geist-sans inline-block px-6 py-3 border border-purple-500 rounded-lg text-base hover:bg-purple-500/10 transition-all"
              >
                Learn More
              </Link>
            </motion.div>
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-24">
            {[
              {
                title: "Birth Star",
                description: "Uncover your celestial guardian star and its cosmic significance in your life's journey",
                delay: 0.6
              },
              {
                title: "Cosmic Elements",
                description: "Explore the unique combination of elements that form your cosmic DNA",
                delay: 0.8
              },
              {
                title: "Radiation Profile",
                description: "Understand your cosmic radiation signature and its influence on your existence",
                delay: 1
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: feature.delay }}
                className="group relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                <div className="relative bg-black p-6 rounded-lg h-full">
                  <h3 className="font-outfit text-xl font-light mb-3 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                    {feature.title}
                  </h3>
                  <p className="font-geist-sans text-gray-300 text-base">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* How It Works Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="relative group mb-8"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
            <div className="relative bg-black p-8 rounded-lg">
              <h2 className="font-outfit text-2xl font-light mb-6 text-center bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                How It Works
              </h2>
              <div className="space-y-4 text-base">
                <p className="font-geist-sans text-gray-300">
                  The Cosmic Ancestry uses advanced cosmic radiation detection and celestial mapping to create your unique cosmic profile. By analyzing your birth information through the lens of quantum randomness, we connect you to the cosmic forces that shaped your existence.
                </p>
                <p className="font-geist-sans text-gray-300">
                  Our system utilizes the SpaceComputer Orbitport's True Random Number Generator (cTRNG), which derives its randomness from cosmic radiation. This ensures that your cosmic profile is truly unique and connected to the universe's natural randomness.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Legal Disclaimer Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="text-center text-sm text-gray-400 space-y-2"
          >
            <p className="font-geist-sans">
              © 2025 TCA. All rights reserved.
            </p>
            <p className="font-geist-sans">
              This is a demonstration project. The cosmic profile generation is for entertainment purposes only.
            </p>
            <p className="font-geist-sans">
              Powered by SpaceComputer Orbitport's cTRNG technology.
            </p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <Link 
                href="/terms"
                className="font-geist-sans text-gray-400 hover:text-gray-300 transition-colors"
              >
                Terms of Service
              </Link>
              <span className="text-gray-600">•</span>
              <Link 
                href="/privacy"
                className="font-geist-sans text-gray-400 hover:text-gray-300 transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
} 