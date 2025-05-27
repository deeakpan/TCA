'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { generateCosmicNarrative, generateCosmicInsights } from '@/services/aiService';

// Dynamically import client components
const CosmicVisualization = dynamic(() => import('@/components/CosmicVisualization'), {
  ssr: false,
  loading: () => <div className="w-full h-[50vh] min-h-[300px] max-h-[600px] bg-black rounded-lg animate-pulse" />
});

function getOrCreateCosmicId(): string {
  if (typeof window === 'undefined') return '';
  
  let cosmicId = localStorage.getItem('cosmic-id');
  if (!cosmicId) {
    cosmicId = 'cosmic-' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('cosmic-id', cosmicId);
  }
  return cosmicId;
}

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [showFullInstructions, setShowFullInstructions] = useState(false);
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
    setMounted(true);
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setCosmicData(null);
    setNarrative(null);
    setInsights(null);

    try {
      console.log('Fetching cosmic data...');
      const response = await fetch('/api/cosmic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-cosmic-id': getOrCreateCosmicId()
        },
        body: JSON.stringify({
          birthDate: formData.birthDate,
          birthTime: formData.birthTime,
          birthLocation: formData.birthLocation
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch cosmic data: ${response.statusText}`);
      }

      const data = await response.json();
      setCosmicData(data);

      // Check if we've hit the limit
      if (data.currentCount >= 3) {
        setError('Daily AI request limit reached. Please try again tomorrow.');
        setLoading(false);
        return;
      }

      // Try to generate AI content
      let aiSuccess = false;
      try {
        console.log('Generating AI narrative...');
        const narrativeResult = await generateCosmicNarrative(data, formData);
        console.log('AI narrative result:', narrativeResult);
        if (narrativeResult) {
          setNarrative(narrativeResult);
          aiSuccess = true;
        }

        console.log('Generating AI insights...');
        const insightsResult = await generateCosmicInsights(data);
        console.log('AI insights result:', insightsResult);
        if (insightsResult) {
          setInsights(insightsResult);
          aiSuccess = true;
        }
      } catch (error) {
        console.error('Error generating AI content:', error);
        // Don't throw here, we'll use fallback content
      }

      // Only increment count if AI generation was successful
      if (aiSuccess) {
        const updateResponse = await fetch('/api/cosmic/count', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-cosmic-id': getOrCreateCosmicId()
          }
        });
        
        if (!updateResponse.ok) {
          console.error('Failed to update request count');
        }
      }

    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
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

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-black text-white flex items-center justify-center">
        <div className="animate-pulse text-2xl text-purple-400">Loading...</div>
      </div>
    );
  }

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
          className="max-w-3xl mx-auto"
        >
          {/* Tutorial Overlay - Made more mobile-friendly */}
          {showTutorial && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative w-full max-w-sm mx-auto bg-black p-6 rounded-lg border border-purple-500/50"
              >
                <button
                  onClick={() => setShowTutorial(false)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
                <h2 className="text-xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                  Welcome to Your Cosmic Profile
                </h2>
                <div className="space-y-3 text-sm text-gray-300">
                  <p>Discover your cosmic ancestry in 3 simple steps:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>Enter your birth details</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>Generate your cosmic profile</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>Get AI insights (3/day limit)</span>
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => setShowTutorial(false)}
                  className="mt-4 w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-sm font-medium hover:from-purple-500 hover:to-pink-500 transition-all"
                >
                  Let's Begin
                </button>
              </motion.div>
            </motion.div>
          )}

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

          {/* Instruction Banner - Made collapsible and more concise */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative group mb-12"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
            <div className="relative bg-black p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <span className="text-purple-400 text-sm">✨</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-purple-400">Quick Guide</h3>
                    <button
                      onClick={() => setShowFullInstructions(!showFullInstructions)}
                      className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      {showFullInstructions ? 'Show Less' : 'Show More'}
                    </button>
                  </div>
                  <p className="text-sm text-gray-300 mt-1">
                    Enter your birth details to generate your cosmic profile. 
                    {!showFullInstructions && (
                      <span className="text-purple-400"> (AI insights limited to 3/day)</span>
                    )}
                  </p>
                  {showFullInstructions && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3"
                    >
                      <p className="text-sm text-gray-300 mb-2">
                        Each profile reveals your celestial heritage through advanced cosmic radiation detection. The AI-generated narrative and insights are limited to 3 requests per day.
                      </p>
                      <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-2">
                        <p className="text-xs text-purple-300">
                          <span className="font-semibold">AI Limit:</span> The AI-generated cosmic narrative and insights are limited to 3 requests per day. You can still generate cosmic profiles and view the basic cosmic data without limits.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
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
                    Cosmic Visualization
                  </h2>
                  <CosmicVisualization data={cosmicData} />
                </div>
              </div>

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

              {/* AI Content Section - Always show this section with either AI or fallback content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                <div className="relative bg-black p-8 rounded-lg">
                  <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                    Your Cosmic Story
                  </h2>
                  
                  {narrative && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-purple-400 mb-3">Cosmic Narrative</h3>
                      <p className="text-lg text-white/90 italic leading-relaxed">
                        {narrative}
                      </p>
                    </div>
                  )}
                  
                  {insights && (
                    <div>
                      <h3 className="text-lg font-semibold text-purple-400 mb-3">Cosmic Insights</h3>
                      <div className="space-y-4">
                        {insights.split('\n').map((insight, i) => (
                          <div key={i} className="flex items-start space-x-3">
                            <span className="text-purple-400 text-xl mt-1">•</span>
                            <p className="text-white/80 leading-relaxed">{insight}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Fallback content if no AI content is available */}
                  {!narrative && !insights && cosmicData && (
                    <>
                      <div className="mb-8">
                        <h3 className="text-lg font-semibold text-purple-400 mb-3">Cosmic Narrative</h3>
                        <p className="text-lg text-white/90 italic leading-relaxed">
                          Born under {cosmicData.birthStar.name}, a {cosmicData.birthStar.type} star {cosmicData.birthStar.distance.toFixed(1)} light years away. Your cosmic journey is written in the {cosmicData.cosmicElements.map(e => e.name).join(', ')} that make up your star.
                        </p>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-purple-400 mb-3">Cosmic Insights</h3>
                        <div className="space-y-4">
                          {[
                            `Your star's temperature of ${cosmicData.birthStar.temperature}K shapes your cosmic energy.`,
                            `The ${cosmicData.cosmicElements.length} elements in your star create a unique cosmic signature.`,
                            `Your star's age of ${cosmicData.birthStar.age.toFixed(1)} billion years connects you to cosmic history.`
                          ].map((insight, i) => (
                            <div key={i} className="flex items-start space-x-3">
                              <span className="text-purple-400 text-xl mt-1">•</span>
                              <p className="text-white/80 leading-relaxed">{insight}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>

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
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
} 