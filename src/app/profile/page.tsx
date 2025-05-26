'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CosmicVisualization from '@/components/CosmicVisualization';
import { getCosmicData } from '@/services/cosmicService';
import { generateCosmicNarrative, generateCosmicInsights } from '@/services/aiService';
import Link from 'next/link';

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    birthTime: '',
    birthLocation: '',
    gender: ''
  });

  const [cosmicData, setCosmicData] = useState<{
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
  } | null>(null);

  const [narrative, setNarrative] = useState<string | null>(null);
  const [insights, setInsights] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNarrative(null);
    setInsights(null);

    try {
      const data = await getCosmicData(
        formData.birthDate,
        formData.birthTime,
        formData.birthLocation
      );
      setCosmicData(data);

      // Generate AI narrative and insights
      const [narrativeResult, insightsResult] = await Promise.all([
        generateCosmicNarrative(data, formData),
        generateCosmicInsights(data)
      ]);

      setNarrative(narrativeResult);
      setInsights(insightsResult);
    } catch (err) {
      setError('Failed to fetch cosmic data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'birthDate') {
      const parts = value.split('-');
      if (parts[0] && parts[0].length > 4) {
        parts[0] = parts[0].slice(0, 4);
      }
      setFormData(prev => ({
        ...prev,
        [name]: parts.join('-')
      }));
    } else if (name === 'birthTime') {
      // Ensure time is in HH:MM format
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (value === '' || timeRegex.test(value)) {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

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
              opacity: Math.random()
            }}
            animate={{
              y: [null, Math.random() * windowHeight],
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
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

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative mb-12"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-3xl rounded-full" />
            <h1 className="text-5xl font-bold text-center bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 text-transparent bg-clip-text relative">
              Your Cosmic Profile
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative group mb-12"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
            <form onSubmit={handleSubmit} className="relative bg-black p-8 rounded-lg space-y-6">
              <div>
                <label className="block mb-2 text-lg">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded bg-gray-900 border border-purple-500/50 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block mb-2 text-lg">Birth Date</label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded bg-gray-900 border border-purple-500/50 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  required
                  max={`${new Date().getFullYear()}-12-31`}
                />
              </div>

              <div>
                <label className="block mb-2 text-lg">Birth Time (optional)</label>
                <input
                  type="time"
                  name="birthTime"
                  value={formData.birthTime}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded bg-gray-900 border border-purple-500/50 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  placeholder="HH:MM"
                  pattern="[0-9]{2}:[0-9]{2}"
                />
              </div>

              <div>
                <label className="block mb-2 text-lg">Birth Location</label>
                <input
                  type="text"
                  name="birthLocation"
                  value={formData.birthLocation}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded bg-gray-900 border border-purple-500/50 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  required
                  placeholder="City, Country"
                />
              </div>

              <div>
                <label className="block mb-2 text-lg">Gender (optional)</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded bg-gray-900 border border-purple-500/50 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-bold text-lg hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Calculating...' : 'Discover Your Cosmic Ancestry'}
              </motion.button>
            </form>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-center mb-8"
            >
              {error}
            </motion.div>
          )}

          {cosmicData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                <div className="relative bg-black p-8 rounded-lg">
                  <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                    Your Birth Star
                  </h2>
                  <div className="space-y-2">
                    <p><span className="text-purple-400">Name:</span> {cosmicData.birthStar.name}</p>
                    <p><span className="text-purple-400">Type:</span> {cosmicData.birthStar.type}</p>
                    <p><span className="text-purple-400">Distance:</span> {cosmicData.birthStar.distance} light years</p>
                    <p><span className="text-purple-400">Temperature:</span> {cosmicData.birthStar.temperature}K</p>
                    <p><span className="text-purple-400">Age:</span> {cosmicData.birthStar.age} billion years</p>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                <div className="relative bg-black p-8 rounded-lg">
                  <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                    Cosmic Elements
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {cosmicData.cosmicElements.map((element) => (
                      <div key={element.symbol} className="p-4 rounded bg-gray-900">
                        <p className="text-xl font-bold text-purple-400">{element.symbol}</p>
                        <p className="text-sm text-gray-400">{element.name}</p>
                        <p className="text-sm">Abundance: {element.abundance}%</p>
                        <p className="text-sm">Type: {element.type}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                <div className="relative bg-black p-8 rounded-lg">
                  <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                    Radiation Profile
                  </h2>
                  <p className="text-lg">Level: {cosmicData.radiationLevel}</p>
                  <p className="text-sm text-gray-400">Source: {cosmicData.source}</p>
                  <p className="text-sm text-gray-400">Timestamp: {cosmicData.timestamp}</p>
                </div>
              </div>

              {narrative && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                  <div className="relative bg-black p-8 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                      Your Cosmic Story
                    </h2>
                    <p className="text-lg leading-relaxed">{narrative}</p>
                  </div>
                </motion.div>
              )}

              {insights && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                  <div className="relative bg-black p-8 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                      Cosmic Insights
                    </h2>
                    <p className="text-lg leading-relaxed">{insights}</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
} 