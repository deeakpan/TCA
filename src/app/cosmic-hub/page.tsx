'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Star, Rocket, Gamepad2 } from 'lucide-react';

const CosmicHub = () => {
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateWindowDimensions = () => {
      setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    updateWindowDimensions();
    window.addEventListener('resize', updateWindowDimensions);

    return () => {
      window.removeEventListener('resize', updateWindowDimensions);
    };
  }, []);

  const games = [
    {
      id: 'discover',
      title: 'Discover Profile',
      description: 'Uncover your cosmic ancestry and explore your celestial heritage',
      image: '/cosmic-profile.jpg',
      category: 'Profile',
      available: true,
      gradient: 'from-purple-600 via-blue-600 to-cyan-600',
      link: '/profile',
      icon: <Star className="w-6 h-6" />
    },
    {
      id: 'serpent',
      title: 'Nebula Serpent',
      description: 'Navigate through cosmic dust and collect celestial bodies in this mesmerizing snake adventure',
      image: '/nebula.jpg',
      category: 'Adventure',
      available: true,
      gradient: 'from-green-600 via-emerald-600 to-teal-600',
      link: '/snake-game',
      icon: <Rocket className="w-6 h-6" />
    },
    {
      id: 'tetris',
      title: 'Cosmic Tetris',
      description: 'Stack cosmic blocks in this zero-gravity puzzle adventure',
      image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=400&h=300&fit=crop',
      category: 'Puzzle',
      available: false,
      gradient: 'from-blue-600 via-indigo-600 to-purple-600',
      icon: <Gamepad2 className="w-6 h-6" />
    },
    {
      id: 'invaders',
      title: 'Galactic Shooter',
      description: 'Navigate through the cosmos, battling celestial anomalies and cosmic entities in this intense space shooter',
      image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=400&h=300&fit=crop',
      category: 'Shooter',
      available: false,
      gradient: 'from-red-600 via-orange-600 to-yellow-600',
      icon: <Rocket className="w-6 h-6" />
    },
    {
      id: 'runner',
      title: 'Star Runner',
      description: 'Endless runner through the cosmos, dodge asteroids and collect power-ups',
      image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=400&h=300&fit=crop',
      category: 'Runner',
      available: false,
      gradient: 'from-pink-600 via-rose-600 to-red-600'
    },
    {
      id: 'pong',
      title: 'Galaxy Pong',
      description: 'Classic pong with cosmic twists and gravitational effects',
      image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=400&h=300&fit=crop',
      category: 'Classic',
      available: false,
      gradient: 'from-yellow-600 via-amber-600 to-orange-600'
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }
  };

  const buttonHoverVariants = {
    hover: { 
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    },
    tap: { scale: 0.98 }
  };

  // Simple animated stars background
  const StarField = () => (
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{
            x: Math.random() * windowDimensions.width,
            y: Math.random() * windowDimensions.height,
              scale: Math.random() * 2,
              opacity: Math.random() * 0.5 + 0.5
            }}
            animate={{
            x: [null, Math.random() * windowDimensions.width],
            y: [null, Math.random() * windowDimensions.height],
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
  );

  const GameCard = ({ game, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="group relative"
    >
      <div className="relative overflow-hidden rounded-3xl bg-black/40 backdrop-blur-sm border border-white/10">
        {/* Holographic Border Effect */}
        <div className="absolute -inset-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className={`absolute inset-0 bg-gradient-to-r ${game.gradient} rounded-3xl blur-sm`} />
        </div>
        
        {/* Main Card Content */}
        <div className="relative bg-black/80 backdrop-blur-sm rounded-3xl p-1">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/50 to-black/50">
            
            {/* Image Container */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={game.image}
                alt={game.title}
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
              
              {/* Overlay Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-t ${game.gradient} opacity-30 transition-opacity duration-300`} />
              
              {/* Floating Category Badge */}
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${game.gradient} text-white`}>
                  {game.category}
                </span>
              </div>

              {/* Coming Soon Badge */}
              {!game.available && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                  <div className="bg-purple-600/90 text-white px-6 py-2 rounded-lg font-bold text-lg shadow-xl border border-purple-400/50">
                    COMING SOON
                  </div>
                </div>
              )}

              {/* Scan Line Effect */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${game.gradient}`}>
                  {game.icon}
                </div>
                <h3 className={`text-2xl font-bold bg-gradient-to-r ${game.gradient} bg-clip-text text-transparent`}>
                  {game.title}
                </h3>
      </div>

              <p className="text-gray-300 text-sm leading-relaxed">
                {game.description}
              </p>

              {/* Action Button */}
              <div className="transform transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]">
                {game.available ? (
                  <Link href={game.link}>
                    <button className={`w-full py-3 rounded-xl bg-gradient-to-r ${game.gradient} text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 flex items-center justify-center gap-2`}>
                      {game.id === 'discover' ? 'Enter the Cosmos' : 
                       game.id === 'serpent' ? 'Start Journey' :
                       game.id === 'tetris' ? 'Begin Puzzle' :
                       game.id === 'invaders' ? 'Join Battle' :
                       game.id === 'runner' ? 'Start Run' :
                       game.id === 'pong' ? 'Play Match' : 'Launch Game'}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                ) : (
                  <button className="w-full py-3 rounded-xl bg-gray-700/50 text-gray-400 font-semibold cursor-not-allowed flex items-center justify-center gap-2">
                    Notify Me
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-black text-white overflow-hidden">
      {/* Animated background stars */}
      <StarField />

      {/* Subtle Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-black/20 border-b border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </motion.button>
            </Link>
            <h1 className="text-xl font-light tracking-tight">
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 text-transparent bg-clip-text">
                Cosmic Hub
              </span>
            </h1>
            <div className="w-20" /> {/* Spacer for balance */}
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 pt-24 pb-8 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-5xl mx-auto"
        >
          {/* Welcome Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <p className="text-gray-400 text-lg">Your gateway to cosmic adventures</p>
          </motion.div>

          {/* Daily Challenge Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8 md:mb-12"
          >
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient" />
              <div className="relative bg-black/80 backdrop-blur-sm rounded-2xl p-1">
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900/50 to-black/50">
                  <div className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600">
                          <Star className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                        <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                          Daily Cosmic Challenge
                  </h3>
                      </div>
                      <div className="text-sm text-purple-400 bg-purple-900/30 px-3 py-1.5 rounded-lg">
                        Resets in 12h 34m
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                      <div>
                        <h4 className="text-base md:text-lg font-semibold text-white mb-2">Today's Mission</h4>
                        <p className="text-sm md:text-base text-gray-300 mb-4">
                          Navigate through the cosmic dust in Nebula Serpent and collect 50 celestial bodies without hitting any obstacles.
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-gray-400">
                          <div className="flex items-center gap-2 bg-purple-900/30 px-3 py-1.5 rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-purple-400" />
                            <span>Reward: 100 Cosmic Points</span>
                          </div>
                          <div className="flex items-center gap-2 bg-pink-900/30 px-3 py-1.5 rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-pink-400" />
                            <span>Difficulty: Medium</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="relative mt-4 md:mt-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg" />
                        <div className="relative p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-400">Progress</span>
                            <span className="text-sm text-purple-400">0/50</span>
                          </div>
                          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full w-0 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500" />
                </div>
                          <div className="mt-4">
                            <Link href="/snake-game">
                              <button className="w-full py-2.5 md:py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm md:text-base font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 flex items-center justify-center gap-2">
                                Accept Challenge
                                <ArrowRight className="w-4 h-4" />
                              </button>
              </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </motion.div>

          {/* Games Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {games.map((game, index) => (
              <GameCard key={game.id} game={game} index={index} />
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default CosmicHub;