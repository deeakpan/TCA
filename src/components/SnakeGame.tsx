'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaPause, FaPlay } from 'react-icons/fa';
import { 
  GameState, 
  Direction, 
  Position,
  initializeGame,
  moveSnake,
  changeDirection,
  getNextFood,
  GRID_SIZE_CONST,
  TICK_RATE_CONST
} from '@/services/snakeService';

// Declare window property type
declare global {
  interface Window {
    __lastWormholeScore?: number;
  }
}

// SVGs for obstacles and food
const ObstacleSVGs = [
  (color: string) => (<svg width="24" height="24" viewBox="0 0 24 24"><polygon points="12,2 22,12 12,22 2,12" fill={color} /></svg>), // diamond
  (color: string) => (<svg width="24" height="24" viewBox="0 0 24 24"><polygon points="12,2 15,11 24,11 17,17 19,24 12,20 5,24 7,17 0,11 9,11" fill={color} /></svg>), // star
  (color: string) => (<svg width="24" height="24" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill={color} /></svg>), // rounded square
  (color: string) => (<svg width="24" height="24" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="10" ry="4" fill={color} /></svg>), // ellipse
  (color: string) => (<svg width="24" height="24" viewBox="0 0 24 24"><polygon points="12,2 22,22 2,22" fill={color} /></svg>), // triangle
  (color: string) => (<svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill={color} /></svg>), // circle
  (color: string) => (<svg width="24" height="24" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" fill={color} /></svg>), // square
  (color: string) => (<svg width="24" height="24" viewBox="0 0 24 24"><polygon points="12,2 19,21 5,8 19,8 5,21" fill={color} /></svg>), // abstract
  (color: string) => (<svg width="24" height="24" viewBox="0 0 24 24"><polygon points="2,12 12,2 22,12 12,22" fill={color} /></svg>), // kite
  (color: string) => (<svg width="24" height="24" viewBox="0 0 24 24"><polygon points="12,2 22,8 18,22 6,22 2,8" fill={color} /></svg>), // pentagon
];
const FoodSVGs = [
  (color: string) => (<svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill={color} /></svg>), // orb
  (color: string) => (<svg width="24" height="24" viewBox="0 0 24 24"><rect x="8" y="8" width="8" height="8" rx="2" fill={color} /></svg>), // cube
  (color: string) => (<svg width="24" height="24" viewBox="0 0 24 24"><polygon points="12,2 22,12 12,22 2,12" fill={color} /></svg>), // diamond
  (color: string) => (<svg width="24" height="24" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="8" ry="4" fill={color} /></svg>), // ellipse
  (color: string) => (<svg width="24" height="24" viewBox="0 0 24 24"><polygon points="12,2 19,21 5,8 19,8 5,21" fill={color} /></svg>), // abstract
  (color: string) => (<svg width="24" height="24" viewBox="0 0 24 24"><polygon points="2,12 12,2 22,12 12,22" fill={color} /></svg>), // kite
  (color: string) => (<svg width="24" height="24" viewBox="0 0 24 24"><polygon points="12,2 22,8 18,22 6,22 2,8" fill={color} /></svg>), // pentagon
  (color: string) => (<svg width="24" height="24" viewBox="0 0 24 24"><polygon points="12,2 15,11 24,11 17,17 19,24 12,20 5,24 7,17 0,11 9,11" fill={color} /></svg>), // star
  (color: string) => (<svg width="24" height="24" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="8" fill={color} /></svg>), // rounded square
  (color: string) => (<svg width="24" height="24" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" fill={color} /></svg>), // square
];
const Backgrounds = [
  "radial-gradient(circle at 60% 40%, #18181b 0%, #312e81 100%)",
  "linear-gradient(135deg, #18181b 0%, #27272a 100%)",
  "radial-gradient(circle, #18181b 60%, #334155 100%)",
  "linear-gradient(90deg, #18181b 0%, #0f172a 100%)",
  "linear-gradient(135deg, #18181b 0%, #6366f1 100%)",
  "radial-gradient(circle, #18181b 60%, #a21caf 100%)",
  "linear-gradient(135deg, #18181b 0%, #f472b6 100%)",
  "linear-gradient(90deg, #18181b 0%, #0ea5e9 100%)",
  "radial-gradient(circle, #18181b 60%, #eab308 100%)",
  "linear-gradient(135deg, #18181b 0%, #22c55e 100%)",
];
const Borders = [
  "2px solid #312e81",
  "2px solid #334155",
  "2px solid #6366f1",
  "2px solid #a21caf",
  "2px solid #f472b6",
  "2px solid #0ea5e9",
  "2px solid #eab308",
  "2px solid #22c55e",
  "2px solid #27272a",
  "2px solid #18181b",
];
const Effects = [
  "twinkle",
  "glow",
  "none",
  "slow-motion",
  "color-shift",
  "particle-burst",
  "gravity-pull",
  "blur",
  "pulse",
  "shine",
];
const ObstacleColors = ["#22c55e", "#eab308", "#a21caf", "#6366f1", "#f472b6", "#0ea5e9", "#334155", "#f59e42", "#f43f5e", "#18181b"];
const FoodColors = ["#f472b6", "#a21caf", "#6366f1", "#eab308", "#22c55e", "#0ea5e9", "#f59e42", "#f43f5e", "#334155", "#18181b"];

function getRandomTrait<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function SnakeGame({ isPaused, onScoreChange, onRestart, onPauseChange }: SnakeGameProps) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isWaitingForFirstMove, setIsWaitingForFirstMove] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const [showSupernova, setShowSupernova] = useState(false);
  const [wishingStar, setWishingStar] = useState<{ x: number; y: number } | null>(null);
  const [wishingStarTimer, setWishingStarTimer] = useState<NodeJS.Timeout | null>(null);

  // State for current traits
  const [currentTraits, setCurrentTraits] = useState({
    background: "rgba(0,0,0,0.2)",
    border: "2px solid #22223b",
    obstacleSVG: ObstacleSVGs[0],
    obstacleColor: "#22c55e",
    foodSVG: FoodSVGs[0],
    foodColor: "#f472b6",
    effect: "none"
  });
  const [wormholeUsed, setWormholeUsed] = useState(false);

  // Initialize game
  useEffect(() => {
    if (isInitialized) return;

    const startGame = async () => {
      try {
        console.log('Starting game...');
        setIsInitialized(true);
        const initialState = await initializeGame();
        setGameState(initialState);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to initialize game:', err);
        setError('Failed to initialize game. Please try again.');
        setIsLoading(false);
      }
    };
    startGame();

    // Cleanup function
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [isInitialized]);

  // Handle keyboard controls
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!gameState || gameState.gameOver) return;

    // Add space bar for pause
    if (event.key === ' ') {
      event.preventDefault(); // Prevent page scroll
      onPauseChange(!isPaused);
      return;
    }

    const keyToDirection: Record<string, Direction> = {
      'ArrowUp': 'UP',
      'ArrowDown': 'DOWN',
      'ArrowLeft': 'LEFT',
      'ArrowRight': 'RIGHT'
    };

    const newDirection = keyToDirection[event.key];
    if (newDirection) {
      console.log('Key pressed:', event.key, 'New direction:', newDirection);
      if (isWaitingForFirstMove) {
        setIsWaitingForFirstMove(false);
      }
      setGameState(prev => prev ? changeDirection(prev, newDirection) : null);
    }
  }, [gameState, isWaitingForFirstMove, isPaused, onPauseChange]);

  // Set up keyboard listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Handle D-pad controls
  useEffect(() => {
    const dpadButtons = document.querySelectorAll('.dpad-button');
    if (dpadButtons.length > 0) {
      const handleButtonClick = (event) => {
        if (!gameState || gameState.gameOver) return;

        const direction = event.currentTarget.dataset.direction;
        if (direction) {
           if (isWaitingForFirstMove) {
            setIsWaitingForFirstMove(false);
          }
          setGameState(prev => prev ? changeDirection(prev, direction as Direction) : null);
        }
      };

      dpadButtons.forEach(button => {
        button.addEventListener('click', handleButtonClick);
      });

      return () => {
        dpadButtons.forEach(button => {
          button.removeEventListener('click', handleButtonClick);
        });
      };
    }
  }, [gameState, isWaitingForFirstMove]); // Depend on gameState and isWaitingForFirstMove

  // Add new useEffect for wishing star timer
  useEffect(() => {
    if (wishingStar) {
      console.log('Starting 3-second timer for wishing star');
      const timer = setTimeout(() => {
        console.log('3 seconds up - removing wishing star');
        setWishingStar(null);
      }, 3000);  // Changed to 3 seconds

      return () => {
        console.log('Cleaning up wishing star timer');
        clearTimeout(timer);
      };
    }
  }, [wishingStar]);

  // Game loop
  useEffect(() => {
    if (!gameState || gameState.gameOver || isWaitingForFirstMove || isPaused) {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }

    console.log('Setting up game loop...');
    const gameLoop = async () => {
      console.log('Game loop tick...');
      // Move snake
      const newState = moveSnake(gameState, isPaused);
      
      // If food was eaten, get next food position
      if (newState.score > gameState.score) {
        console.log('Food eaten, getting next food...');
        const updatedState = await getNextFood(newState);
        setGameState(updatedState);

        // Supernova animation when score reaches 7
        if (updatedState.score === 7) {
          console.log('Triggering supernova at score 7!');
          setShowSupernova(true);
          // Keep supernova visible for longer
          setTimeout(() => {
            console.log('Hiding supernova');
            setShowSupernova(false);
          }, 5000); // Keep visible for 5 seconds
        }

        // Spawn wishing star when score >= 20
        if (updatedState.score >= 20 && !wishingStar) {
          // Only spawn at intervals of 20 (20, 40, 60, etc.)
          if (updatedState.score % 20 === 0) {
            console.log('Spawning wishing star at score:', updatedState.score);
            const newWishingStar = {
              x: Math.floor(Math.random() * GRID_SIZE_CONST),
              y: Math.floor(Math.random() * GRID_SIZE_CONST)
            };
            setWishingStar(newWishingStar);
          }
        }
      } else {
        setGameState(newState);
      }

      // Check for wishing star collision
      if (wishingStar && newState.snake[0].x === wishingStar.x && newState.snake[0].y === wishingStar.y) {
        console.log('Wishing star collision!');
        const newLength = Math.floor(newState.snake.length / 2);
        const updatedSnake = newState.snake.slice(0, newLength);
        setGameState(prev => prev ? { ...prev, snake: updatedSnake } : null);
        setWishingStar(null);
      }
    };

    // Clear any existing interval
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }

    // Set up new interval
    gameLoopRef.current = setInterval(gameLoop, TICK_RATE_CONST);

    // Cleanup function
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    };
  }, [gameState, isWaitingForFirstMove, isPaused]);

  // Update score in parent component
  useEffect(() => {
    if (gameState) {
      onScoreChange(gameState.score);
    }
  }, [gameState?.score, onScoreChange]);

  // Detect wormhole teleport and randomize traits
  useEffect(() => {
    if (!gameState) return;
    if (wormholeUsed) {
      setCurrentTraits({
        background: getRandomTrait(Backgrounds),
        border: getRandomTrait(Borders),
        obstacleSVG: getRandomTrait(ObstacleSVGs),
        obstacleColor: getRandomTrait(ObstacleColors),
        foodSVG: getRandomTrait(FoodSVGs),
        foodColor: getRandomTrait(FoodColors),
        effect: getRandomTrait(Effects),
      });
      setWormholeUsed(false);
    }
  }, [wormholeUsed]);

  // Watch for wormhole use (score +3 is our wormhole bonus)
  useEffect(() => {
    if (!gameState) return;
    if (typeof window !== 'undefined') {
      if (
        window.__lastWormholeScore !== undefined &&
        gameState.score === window.__lastWormholeScore + 3
      ) {
        setWormholeUsed(true);
      }
      window.__lastWormholeScore = gameState.score;
    }
  }, [gameState?.score]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-purple-400 animate-pulse">Loading cosmic randomness...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
        <div className="text-red-400">{error}</div>
        <button
          onClick={onRestart}
          className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-500 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!gameState) return null;

  // Calculate cell size based on container size
  const cellSize = `calc(100% / ${GRID_SIZE_CONST})`;

  return (
    <div className="relative w-full h-full">
      {/* Game board */}
      <div
        className="w-full h-full grid transition-all duration-700"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE_CONST}, ${cellSize})`,
          gridTemplateRows: `repeat(${GRID_SIZE_CONST}, ${cellSize})`,
          background: currentTraits.background,
          border: currentTraits.border
        }}
      >
        {/* Snake */}
        {gameState.snake.map((segment, index) => (
          <motion.div
            key={`${segment.x}-${segment.y}-${index}`}
            className={`${index === 0 ? 'bg-purple-400' : 'bg-purple-500'} rounded-sm relative overflow-hidden`}
            style={{
              gridColumn: segment.x + 1,
              gridRow: segment.y + 1
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.1 }}
          >
            {index === 0 && (
              <>
                <div className="absolute inset-0 bg-purple-300 opacity-30 animate-pulse-glow" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-purple-400/30 to-purple-400/0 animate-shimmer" />
              </>
            )}
          </motion.div>
        ))}
        
        {/* Food */}
        <motion.div
          className="relative"
          style={{
            gridColumn: gameState.food.x + 1,
            gridRow: gameState.food.y + 1
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {currentTraits.foodSVG(currentTraits.foodColor)}
        </motion.div>

        {/* Obstacles */}
        {gameState.obstacles.map((obstacle, i) => {
          const age = Date.now() - obstacle.createdAt;
          const progress = age / obstacle.lifetime;
          const scale = 1 + Math.sin(progress * Math.PI) * 0.2; // Pulse effect
          // Alternate color and SVG for each obstacle
          const svgFn = currentTraits.obstacleSVG;
          const color = currentTraits.obstacleColor;
          return (
            <motion.div
              key={`obstacle-${obstacle.position.x}-${obstacle.position.y}-${obstacle.createdAt}`}
              className="relative"
              style={{
                gridColumn: obstacle.position.x + 1,
                gridRow: obstacle.position.y + 1
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: scale,
                opacity: 1 - progress,
                rotate: 360
              }}
              transition={{ 
                duration: 0.5,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              {svgFn(color)}
            </motion.div>
          );
        })}

        {/* Wormhole */}
        {gameState.wormhole && (
          <motion.div
            className="relative"
            style={{
              gridColumn: gameState.wormhole.x + 1,
              gridRow: gameState.wormhole.y + 1
            }}
            initial={{ scale: 0, rotate: 0, opacity: 0 }}
            animate={{ scale: [1, 1.2, 1], rotate: 360, opacity: 1 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24">
              <g>
                <ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="#a21caf" strokeWidth="2" />
                <ellipse cx="12" cy="12" rx="7" ry="2.5" fill="none" stroke="#c026d3" strokeWidth="2" />
                <ellipse cx="12" cy="12" rx="4" ry="1.2" fill="none" stroke="#f472b6" strokeWidth="2" />
              </g>
            </svg>
          </motion.div>
        )}

        {/* Wishing Star */}
        {wishingStar && (
          <motion.div
            className="relative"
            style={{
              gridColumn: wishingStar.x + 1,
              gridRow: wishingStar.y + 1
            }}
            initial={{ scale: 0, rotate: 0 }}
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: 360
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <div className="absolute inset-0 bg-blue-500 rounded-full animate-pulse-glow" />
            <div className="absolute inset-0 bg-blue-400 rounded-full blur-sm animate-pulse-glow" />
            <div className="absolute inset-0 bg-blue-300 rounded-full blur-md animate-pulse-glow" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0 transform -rotate-45" />
            <div className="absolute inset-0 bg-white rounded-full opacity-30 animate-ping" />
          </motion.div>
        )}
      </div>

      {/* Pause overlay */}
      {isPaused && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-40"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-center space-y-6"
          >
            <h2 className="text-3xl font-bold text-purple-400">Game Paused</h2>
            <p className="text-gray-400">Take a cosmic break</p>
            <button
              onClick={onRestart}
              className="px-6 py-3 bg-red-600/80 rounded-lg hover:bg-red-500/80 transition-colors text-lg font-medium"
            >
              Restart Journey
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Waiting for first move overlay */}
      {isWaitingForFirstMove && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center"
        >
          <p className="text-purple-400 text-lg mb-2">Press any arrow key to start</p>
          <p className="text-gray-400 text-sm">Use arrow keys to control the snake</p>
        </motion.div>
      )}

      {/* Game over overlay */}
      {gameState.gameOver && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center"
        >
          <h2 className="text-2xl font-bold text-purple-400 mb-4">Game Over</h2>
          <button
            onClick={onRestart}
            className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-500 transition-colors"
          >
            Play Again
          </button>
        </motion.div>
      )}

      {/* Supernova effect */}
      {showSupernova && (
        <div className="absolute inset-0 pointer-events-none z-50">
          {/* Initial flash */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-white"
          />

          {/* Core explosion */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ 
              scale: [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5],
              opacity: [0, 1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0]
            }}
            transition={{ 
              duration: 1.5,
              times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1],
              ease: "easeOut"
            }}
            className="absolute inset-0"
          >
            {/* Intense core */}
            <div className="absolute inset-0 bg-white opacity-90 animate-pulse-glow" />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-80" />
            
            {/* Energy waves */}
            <div className="absolute inset-0 bg-gradient-radial from-white/90 via-purple-500/50 to-transparent animate-pulse-glow" />
            <div className="absolute inset-0 bg-gradient-radial from-white/80 via-pink-500/40 to-transparent animate-pulse-glow" style={{ animationDelay: '0.1s' }} />
            <div className="absolute inset-0 bg-gradient-radial from-white/70 via-blue-500/30 to-transparent animate-pulse-glow" style={{ animationDelay: '0.2s' }} />
          </motion.div>

          {/* Energy particles */}
          <div className="absolute inset-0">
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                initial={{ 
                  x: '50%', 
                  y: '50%',
                  scale: 0,
                  opacity: 1
                }}
                animate={{ 
                  x: `${Math.random() * 100}%`,
                  y: `${Math.random() * 100}%`,
                  scale: [0, 1, 0],
                  opacity: [1, 0.8, 0]
                }}
                transition={{ 
                  duration: 0.5,
                  delay: i * 0.02,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>

          {/* Shockwave rings */}
          <div className="absolute inset-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 border-2 border-white/30 rounded-full"
                initial={{ scale: 0, opacity: 0.8 }}
                animate={{ 
                  scale: [0, 1.5, 2],
                  opacity: [0.8, 0.4, 0]
                }}
                transition={{ 
                  duration: 0.8,
                  delay: i * 0.15,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>

          {/* Energy beams */}
          <div className="absolute inset-0">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0"
                initial={{ rotate: i * 45, scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 1, 1.5],
                  opacity: [0, 0.8, 0]
                }}
                transition={{ 
                  duration: 1,
                  delay: 0.2,
                  ease: "easeOut"
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
              </motion.div>
            ))}
          </div>

          {/* Final flash */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ 
              duration: 0.3,
              delay: 1.2
            }}
            className="absolute inset-0 bg-white"
          />
        </div>
      )}
    </div>
  );
} 