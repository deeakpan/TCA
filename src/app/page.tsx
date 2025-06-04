'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { Gamepad2, Zap, Code, ArrowRight, Star, Brain, Sparkles, Wallet, Dna, Atom, Telescope, Shield, Lock, Database, Cpu, Network, ChevronRight, Menu } from 'lucide-react';

export default function Home() {
  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cosmicData, setCosmicData] = useState({
    activeStars: 0,
    radiationLevel: 'Low',
    lastUpdate: new Date().toISOString()
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
      setIsMobile(window.innerWidth < 768);

      const handleResize = () => {
        setWindowWidth(window.innerWidth);
        setWindowHeight(window.innerHeight);
        setIsMobile(window.innerWidth < 768);
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCosmicData(prev => ({
        ...prev,
        activeStars: Math.floor(Math.random() * 1000) + 500,
        radiationLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
        lastUpdate: new Date().toISOString()
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Star,
      title: "Cosmic Profile",
      description: "Discover your cosmic ancestry and birth star through advanced astrological analysis.",
      link: "/profile"
    },
    {
      icon: Gamepad2,
      title: "Nebula Serpent",
      description: "Navigate through cosmic elements in this immersive snake adventure.",
      link: "/snake-game"
    },
    {
      icon: Brain,
      title: "AI Insights",
      description: "Get personalized cosmic insights powered by advanced AI analysis.",
      link: "/cosmic-tools"
    }
  ];

  const cosmicElements = [
    { symbol: "H", name: "Hydrogen", abundance: "75%", color: "from-blue-400 to-blue-600" },
    { symbol: "He", name: "Helium", abundance: "23%", color: "from-purple-400 to-purple-600" },
    { symbol: "C", name: "Carbon", abundance: "0.5%", color: "from-green-400 to-green-600" },
    { symbol: "N", name: "Nitrogen", abundance: "0.1%", color: "from-red-400 to-red-600" },
    { symbol: "O", name: "Oxygen", abundance: "1%", color: "from-yellow-400 to-yellow-600" }
  ];

  const starTypes = [
    { type: "G2V", name: "Yellow Dwarf", description: "Similar to our Sun", color: "from-yellow-400 to-orange-600" },
    { type: "A1V", name: "White Star", description: "Hot and bright", color: "from-blue-400 to-indigo-600" },
    { type: "M1-2Ia-ab", name: "Red Supergiant", description: "Massive and cool", color: "from-red-400 to-red-600" }
  ];

  // Simple animated stars background
  const StarField = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none bg-black">
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
  );

  // Mobile Navigation
  const MobileNav = () => (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black">
      <div className="px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
          Cosmic Nexus
        </Link>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2"
        >
          <Menu size={24} />
        </button>
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-black border-t border-gray-800"
          >
            <div className="px-4 py-2 space-y-4">
              <Link href="/tutorials" className="block py-2 hover:text-purple-400">Tutorials</Link>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full">
                <Wallet size={20} />
                <span>Connect Wallet</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );

  // Mobile Hero Section
  const MobileHero = () => (
    <section className="pt-24 px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6">
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
            Cosmic
          </span>
          <motion.span
            className="bg-gradient-to-r from-pink-400 to-purple-400 text-transparent bg-clip-text ml-2"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key="nexus"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {Array.from("Nexus").map((char, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.2,
                      delay: index * 0.15,
                      repeat: Infinity,
                      repeatDelay: 2,
                      repeatType: "loop"
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.span>
            </AnimatePresence>
          </motion.span>
        </h1>
        <p className="text-gray-300 text-sm mb-8">
          Where the universe dictates the rules. Experience true cosmic randomness.
        </p>
        <Link 
          href="/cosmic-hub"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-sm font-bold w-full max-w-xs mx-auto"
        >
          <Sparkles size={20} />
          Enter the Nexus
        </Link>
      </motion.div>
    </section>
  );

  // Mobile How It Works Section
  const MobileHowItWorks = () => (
    <section className="px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col items-center gap-8"
      >
        <div className="w-full space-y-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text text-center">
            How Cosmic Nexus Works
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Star className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">Cosmic Data Collection</h3>
                <p className="text-sm text-gray-300">We gather real-time cosmic radiation data from space, ensuring true randomness in every interaction.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Brain className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">AI Analysis</h3>
                <p className="text-sm text-gray-300">Advanced algorithms process cosmic data to generate unique insights and experiences.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Gamepad2 className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">Interactive Experience</h3>
                <p className="text-sm text-gray-300">Engage with cosmic elements through games and visualizations powered by real space data.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full relative">
          <div className="aspect-square rounded-2xl bg-gradient-to-br from-purple-900/40 to-black border border-purple-500/30 p-6">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-2xl"></div>
            <div className="relative z-10 h-full flex flex-col justify-center">
              <div className="text-5xl font-bold text-center mb-4">98%</div>
              <div className="text-lg text-center text-purple-400 mb-6">True Cosmic Randomness</div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Data Accuracy</span>
                  <span className="text-purple-400">99.9%</span>
                </div>
                <div className="h-2 bg-purple-900/50 rounded-full overflow-hidden">
                  <div className="h-full w-[99.9%] bg-gradient-to-r from-purple-500 to-pink-500"></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Processing Speed</span>
                  <span className="text-purple-400">0.1s</span>
                </div>
                <div className="h-2 bg-purple-900/50 rounded-full overflow-hidden">
                  <div className="h-full w-[95%] bg-gradient-to-r from-purple-500 to-pink-500"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );

  // DNA Section for both mobile and desktop
  const DNASection = () => (
    <section className="px-4 py-12 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto"
      >
        <h2 className="text-2xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
          Your Cosmic DNA
        </h2>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">DNA Match Score</h3>
                <div className="text-3xl font-bold text-purple-400">98%</div>
              </div>
              <div className="h-2 bg-purple-900/50 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                  initial={{ width: 0 }}
                  whileInView={{ width: "98%" }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                <span className="text-gray-300">Unique cosmic radiation pattern</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                <span className="text-gray-300">Personalized cosmic insights</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                <span className="text-gray-300">Real-time cosmic data integration</span>
              </div>
            </div>
          </div>
          <div className="relative aspect-square">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-2xl"></div>
            <div className="relative h-full flex items-center justify-center">
              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="w-48 h-48 md:w-64 md:h-64"
              >
                <div className="absolute inset-0 border-2 border-purple-500/30 rounded-full"></div>
                <div className="absolute inset-4 border-2 border-pink-500/30 rounded-full"></div>
                <div className="absolute inset-8 border-2 border-purple-500/30 rounded-full"></div>
                <div className="absolute inset-12 border-2 border-pink-500/30 rounded-full"></div>
                <div className="absolute inset-16 border-2 border-purple-500/30 rounded-full"></div>
                <div className="absolute inset-20 border-2 border-pink-500/30 rounded-full"></div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );

  // Mobile Layout
  const MobileLayout = () => (
    <>
      <MobileNav />
      <main className="relative z-10">
        <MobileHero />
        <MobileHowItWorks />
        <DNASection />
        <MobileFeatures />
        <MobileCosmicElements />
        <MobileStarTypes />
        <MobileCTA />
        <MobileFooter />
      </main>
    </>
  );

  // Mobile Features Section
  const MobileFeatures = () => (
    <section className="px-4 py-12">
      <h2 className="text-2xl font-bold mb-6 text-center">Features</h2>
      <div className="space-y-4">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-black/50 border border-purple-500/20 rounded-lg p-4"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600">
                <feature.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-300">{feature.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );

  // Mobile Cosmic Elements
  const MobileCosmicElements = () => (
    <section className="px-4 py-12">
      <h2 className="text-2xl font-bold mb-6 text-center">Cosmic Elements</h2>
      <div className="grid grid-cols-2 gap-3">
        {cosmicElements.map((element, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-black/50 border border-purple-500/20 rounded-lg p-3"
          >
            <div className="text-2xl font-bold mb-1">{element.symbol}</div>
            <div className="text-sm mb-1">{element.name}</div>
            <div className="text-xs text-purple-400">{element.abundance}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );

  // Mobile Star Types
  const MobileStarTypes = () => (
    <section className="px-4 py-12">
      <h2 className="text-2xl font-bold mb-6 text-center">Star Types</h2>
      <div className="space-y-3">
        {starTypes.map((star, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-black/50 border border-purple-500/20 rounded-lg p-4"
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="text-lg font-mono mb-1">{star.type}</div>
                <div className="text-sm">{star.name}</div>
              </div>
              <div className="text-xs text-purple-400">{star.description}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );

  // Mobile CTA
  const MobileCTA = () => (
    <section className="px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="bg-black/50 border border-purple-500/20 rounded-lg p-6 text-center"
      >
        <h2 className="text-2xl font-bold mb-4">Begin Your Cosmic Journey</h2>
        <p className="text-sm text-gray-300 mb-6">
          Join us in exploring the mysteries of the universe and discovering your cosmic identity.
        </p>
        <Link 
          href="/profile"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-sm font-bold w-full"
        >
          <Brain size={20} />
          Start Your Journey
        </Link>
      </motion.div>
    </section>
  );

  // Mobile Footer
  const MobileFooter = () => (
    <footer className="px-4 py-8 border-t border-gray-800 bg-black/50 backdrop-blur-sm">
      <div className="space-y-6">
        <div className="space-y-4">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
            Cosmic Nexus
          </Link>
          <p className="text-gray-400 text-sm">
            Experience true cosmic randomness and discover your cosmic DNA profile.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-bold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><Link href="/cosmic-hub" className="text-gray-400 hover:text-purple-400 transition-colors">Cosmic Hub</Link></li>
              <li><Link href="/profile" className="text-gray-400 hover:text-purple-400 transition-colors">Cosmic Profile</Link></li>
              <li><Link href="/snake-game" className="text-gray-400 hover:text-purple-400 transition-colors">Nebula Serpent</Link></li>
              <li><Link href="/cosmic-tools" className="text-gray-400 hover:text-purple-400 transition-colors">Cosmic Tools</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="https://www.spacecomputer.io/" className="text-gray-400 hover:text-purple-400 transition-colors">SpaceComputer</Link></li>
              <li><Link href="https://docs.spacecomputer.io/" className="text-gray-400 hover:text-purple-400 transition-colors">API Documentation</Link></li>
              <li><Link href="/tutorials" className="text-gray-400 hover:text-purple-400 transition-colors">Tutorials</Link></li>
              <li><Link href="/developers" className="text-gray-400 hover:text-purple-400 transition-colors">For Developers</Link></li>
            </ul>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-4">Legal</h3>
          <ul className="space-y-2">
            <li><Link href="/legal/license" className="text-gray-400 hover:text-purple-400 transition-colors">License</Link></li>
            <li><Link href="/legal/terms" className="text-gray-400 hover:text-purple-400 transition-colors">Terms of Use</Link></li>
            <li><Link href="/legal/privacy" className="text-gray-400 hover:text-purple-400 transition-colors">Privacy Policy</Link></li>
            <li><Link href="/legal/disclaimer" className="text-gray-400 hover:text-purple-400 transition-colors">Disclaimer</Link></li>
          </ul>
        </div>
        <div className="pt-6 border-t border-gray-800 flex flex-col items-center gap-4">
          <p className="text-gray-500 text-sm">© 2025 Cosmic Nexus. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="https://t.me/d2eakapn" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-purple-400 transition-colors text-sm">Telegram</a>
            <a href="mailto:deeakpan123@gmail.com" className="text-gray-500 hover:text-purple-400 transition-colors text-sm">Support</a>
            <Link href="/faq" className="text-gray-500 hover:text-purple-400 transition-colors text-sm">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );

  // Desktop Footer
  const DesktopFooter = () => (
    <footer className="w-full border-t border-gray-800 bg-black/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
              Cosmic Nexus
            </Link>
            <p className="text-gray-400 text-sm">
              Experience true cosmic randomness and discover your cosmic DNA profile.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><Link href="/cosmic-hub" className="text-gray-400 hover:text-purple-400 transition-colors">Cosmic Hub</Link></li>
              <li><Link href="/profile" className="text-gray-400 hover:text-purple-400 transition-colors">Cosmic Profile</Link></li>
              <li><Link href="/snake-game" className="text-gray-400 hover:text-purple-400 transition-colors">Nebula Serpent</Link></li>
              <li><Link href="/cosmic-tools" className="text-gray-400 hover:text-purple-400 transition-colors">Cosmic Tools</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="https://www.spacecomputer.io/" className="text-gray-400 hover:text-purple-400 transition-colors">SpaceComputer</Link></li>
              <li><Link href="https://docs.spacecomputer.io/" className="text-gray-400 hover:text-purple-400 transition-colors">API Documentation</Link></li>
              <li><Link href="/tutorials" className="text-gray-400 hover:text-purple-400 transition-colors">Tutorials</Link></li>
              <li><Link href="/developers" className="text-gray-400 hover:text-purple-400 transition-colors">For Developers</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/legal/license" className="text-gray-400 hover:text-purple-400 transition-colors">License</Link></li>
              <li><Link href="/legal/terms" className="text-gray-400 hover:text-purple-400 transition-colors">Terms of Use</Link></li>
              <li><Link href="/legal/privacy" className="text-gray-400 hover:text-purple-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/legal/disclaimer" className="text-gray-400 hover:text-purple-400 transition-colors">Disclaimer</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">© 2025 Cosmic Nexus. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="https://t.me/d2eakapn" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-purple-400 transition-colors text-sm">Telegram</a>
            <a href="mailto:deeakpan123@gmail.com" className="text-gray-500 hover:text-purple-400 transition-colors text-sm">Support</a>
            <Link href="/faq" className="text-gray-500 hover:text-purple-400 transition-colors text-sm">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );

  // Create legal pages
  const LegalPages = () => {
    const licenseContent = `
MIT License

Copyright (c) 2024 Cosmic Nexus

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
    `;

    const termsContent = `
Terms of Use

1. Acceptance of Terms
By accessing and using Cosmic Nexus, you agree to be bound by these Terms of Use.

2. Description of Service
Cosmic Nexus provides cosmic DNA profiling and random number generation services powered by space-based technology.

3. User Responsibilities
Users must provide accurate information and use the service in accordance with applicable laws.

4. Intellectual Property
All content and technology associated with Cosmic Nexus is protected by copyright and other intellectual property laws.

5. Limitation of Liability
Cosmic Nexus is provided "as is" without any warranties of any kind.

6. Changes to Terms
We reserve the right to modify these terms at any time.
    `;

    const privacyContent = `
Privacy Policy

1. Information Collection
We collect information necessary to provide our cosmic DNA profiling services.

2. Use of Information
Your information is used to generate and maintain your cosmic DNA profile.

3. Data Security
We implement appropriate security measures to protect your information.

4. Third-Party Services
We use SpaceComputer's cTRNG technology for random number generation.

5. Your Rights
You have the right to access, correct, or delete your personal information.

6. Contact
For privacy concerns, please contact our support team.
    `;

    const disclaimerContent = `
Disclaimer

1. Service Accuracy
While we strive for accuracy, cosmic DNA profiling results are for entertainment purposes.

2. No Medical Advice
Our services do not provide medical, legal, or financial advice.

3. Third-Party Services
We are not responsible for the accuracy of third-party services we integrate with.

4. Service Availability
We do not guarantee uninterrupted access to our services.

5. Limitation of Liability
We are not liable for any damages arising from the use of our services.
    `;

    return (
      <div className="hidden">
        <div id="license">{licenseContent}</div>
        <div id="terms">{termsContent}</div>
        <div id="privacy">{privacyContent}</div>
        <div id="disclaimer">{disclaimerContent}</div>
      </div>
    );
  };

  // Desktop Layout
  const DesktopLayout = () => (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-50 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
            Cosmic Nexus
          </Link>
          <div className="flex items-center space-x-6">
            <Link href="/tutorials" className="hover:text-purple-400 transition-colors">Tutorials</Link>
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:from-purple-500 hover:to-pink-500 transition-all">
              <Wallet size={20} />
              <span>Connect Wallet</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 relative z-10 mt-20">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <section className="text-center mb-24 pt-40 relative">
            {/* Animated Star Background for Title */}
            <div className="absolute inset-0 z-0">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={`title-star-${i}`}
                  className="absolute w-1.5 h-1.5 bg-white rounded-full"
                  initial={{ 
                    x: Math.random() * 400 - 200,
                    y: Math.random() * 200 - 100,
                    scale: Math.random() * 2,
                    opacity: 0,
                    rotate: Math.random() * 360
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0.8, 0.3],
                    rotate: [0, 360],
                    x: [null, Math.random() * 400 - 200],
                    y: [null, Math.random() * 200 - 100]
                  }}
                  transition={{
                    duration: Math.random() * 3 + 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="relative z-10"
            >
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8 relative inline-flex items-center">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                  Cosmic
                </span>
                <motion.span
                  className="bg-gradient-to-r from-pink-400 to-purple-400 text-transparent bg-clip-text ml-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key="nexus"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="inline-block"
                    >
                      {Array.from("Nexus").map((char, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{
                            duration: 0.2,
                            delay: index * 0.15,
                            repeat: Infinity,
                            repeatDelay: 2,
                            repeatType: "loop"
                          }}
                          className="inline-block"
                        >
                          {char}
                        </motion.span>
                      ))}
                    </motion.span>
                  </AnimatePresence>
                  <motion.span
                    className="inline-block w-0.5 h-8 bg-gradient-to-b from-purple-400 to-pink-400 ml-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ 
                      duration: 0.8,
                      repeat: Infinity,
                      repeatDelay: 0.5
                    }}
                  />
                </motion.span>
              </h1>
            </motion.div>
            
            <motion.p 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-16 leading-relaxed relative z-10"
            >
              Where the universe dictates the rules. Experience true cosmic randomness and discover your place in the cosmos.
            </motion.p>

            {/* Real-time Cosmic Data */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-16"
            >
              <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 border border-purple-500/20">
                <div className="text-purple-400 mb-2">Active Stars</div>
                <div className="text-3xl font-bold">{cosmicData.activeStars.toLocaleString()}</div>
              </div>
              <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 border border-purple-500/20">
                <div className="text-purple-400 mb-2">Radiation Level</div>
                <div className="text-3xl font-bold">{cosmicData.radiationLevel}</div>
              </div>
              <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 border border-purple-500/20">
                <div className="text-purple-400 mb-2">Last Update</div>
                <div className="text-sm">{new Date(cosmicData.lastUpdate).toLocaleTimeString()}</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-8"
            >
              <Link 
                href="/cosmic-hub"
                className="inline-flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold text-lg hover:from-purple-500 hover:to-pink-500 transition-all transform hover:scale-105 shadow-lg"
              >
                <Sparkles size={28} />
                Enter the Nexus
              </Link>
            </motion.div>
          </section>

          {/* How It Works - Slide Style */}
          <section className="mb-48">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row items-center gap-12"
            >
              <div className="flex-1 space-y-6">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                  How Cosmic Nexus Works
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-purple-500/20">
                      <Star className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Cosmic Data Collection</h3>
                      <p className="text-gray-300">We gather real-time cosmic radiation data from space, ensuring true randomness in every interaction.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-purple-500/20">
                      <Brain className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">AI Analysis</h3>
                      <p className="text-gray-300">Advanced algorithms process cosmic data to generate unique insights and experiences.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-purple-500/20">
                      <Gamepad2 className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Interactive Experience</h3>
                      <p className="text-gray-300">Engage with cosmic elements through games and visualizations powered by real space data.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 relative">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-purple-900/40 to-black border border-purple-500/30 p-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-2xl"></div>
                  <div className="relative z-10 h-full flex flex-col justify-center">
                    <div className="text-6xl font-bold text-center mb-4">98%</div>
                    <div className="text-xl text-center text-purple-400">True Cosmic Randomness</div>
                    <div className="mt-8 space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Data Accuracy</span>
                        <span className="text-purple-400">99.9%</span>
                      </div>
                      <div className="h-2 bg-purple-900/50 rounded-full overflow-hidden">
                        <div className="h-full w-[99.9%] bg-gradient-to-r from-purple-500 to-pink-500"></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Processing Speed</span>
                        <span className="text-purple-400">0.1s</span>
                      </div>
                      <div className="h-2 bg-purple-900/50 rounded-full overflow-hidden">
                        <div className="h-full w-[95%] bg-gradient-to-r from-purple-500 to-pink-500"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>

          {/* DNA Section */}
          <DNASection />

          {/* Features Section */}
          <section className="mb-48">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                  <div className="relative bg-black p-8 rounded-lg h-full">
                    <div className="p-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 w-fit mb-4">
                      <feature.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                      {feature.title}
                    </h3>
                    <p className="text-white/80 mb-4">{feature.description}</p>
                    <Link
                      href={feature.link}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
                    >
                      Explore
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Cosmic Elements - Slide Style */}
          <section className="mb-48">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row items-center gap-12"
            >
              <div className="flex-1">
                <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                  Cosmic Elements
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {cosmicElements.map((element, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative group"
                    >
                      <div className={`absolute -inset-0.5 bg-gradient-to-r ${element.color} rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200`} />
                      <div className="relative bg-black p-6 rounded-lg">
                        <div className="text-3xl font-bold mb-2">{element.symbol}</div>
                        <div className="text-lg mb-1">{element.name}</div>
                        <div className="text-sm text-purple-400">Abundance: {element.abundance}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="flex-1 space-y-6">
                <h3 className="text-2xl font-bold">Understanding Cosmic Elements</h3>
                <p className="text-gray-300">
                  These elements form the building blocks of the universe. Each element in your cosmic profile influences your unique characteristics and cosmic journey.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                    <span>Hydrogen (H) - The most abundant element</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                    <span>Helium (He) - Second most abundant</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                    <span>Carbon (C) - Essential for life</span>
                  </div>
                </div>
                <Link
                  href="/elements"
                  className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Learn more about cosmic elements
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </section>

          {/* Star Types - Slide Style */}
          <section className="mb-48">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row-reverse items-center gap-12"
            >
              <div className="flex-1">
                <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                  Star Types
                </h2>
                <div className="space-y-4">
                  {starTypes.map((star, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative group"
                    >
                      <div className={`absolute -inset-0.5 bg-gradient-to-r ${star.color} rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200`} />
                      <div className="relative bg-black p-6 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-mono mb-1">{star.type}</div>
                            <div className="text-lg">{star.name}</div>
                          </div>
                          <div className="text-purple-400">{star.description}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="flex-1 space-y-6">
                <h3 className="text-2xl font-bold">Your Cosmic Connection</h3>
                <p className="text-gray-300">
                  Each star type represents different cosmic energies and characteristics. Discover how your birth star influences your cosmic profile.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                    <span>G2V - Balanced and nurturing energy</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                    <span>A1V - Intense and transformative power</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                    <span>M1-2Ia-ab - Deep and mysterious influence</span>
                  </div>
                </div>
                <Link
                  href="/stars"
                  className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Explore star types in detail
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </section>

          {/* Call to Action */}
          <section className="mb-48">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8 }}
              className="p-10 rounded-xl bg-gradient-to-br from-purple-900/40 to-black border border-purple-500/30 text-center relative overflow-hidden group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text drop-shadow-md">
                  Begin Your Cosmic Journey
                </h2>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
                  Join us in exploring the mysteries of the universe and discovering your cosmic identity. Experience games powered by true cosmic randomness and unlock insights about your place in the cosmos.
                </p>
                <Link 
                  href="/profile"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-lg font-bold hover:from-purple-500 hover:to-pink-500 transition-all transform hover:scale-105 shadow-lg"
                >
                  <Brain size={24} />
                  Start Your Journey
                </Link>
              </div>
            </motion.div>
          </section>
        </div>
      </main>

      <LegalPages />
      <DesktopFooter />
    </>
  );

  return (
    <div className="min-h-screen bg-black text-white flex flex-col overflow-hidden relative">
      <StarField />
      {isMobile ? <MobileLayout /> : <DesktopLayout />}
    </div>
  );
} 