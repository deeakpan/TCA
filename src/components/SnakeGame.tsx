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

interface SnakeGameProps {
  isPaused: boolean;
  onScoreChange: (score: number) => void;
  onRestart: () => void;
  onPauseChange: (paused: boolean) => void;
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
      <div className="w-full h-full grid bg-black/20" style={{ 
        gridTemplateColumns: `repeat(${GRID_SIZE_CONST}, ${cellSize})`,
        gridTemplateRows: `repeat(${GRID_SIZE_CONST}, ${cellSize})`
      }}>
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
          <div className="absolute inset-0 bg-pink-500 rounded-full animate-pulse-glow" />
          <div className="absolute inset-0 bg-pink-400 rounded-full blur-sm animate-pulse-glow" />
          <div className="absolute inset-0 bg-pink-300 rounded-full blur-md animate-pulse-glow" />
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-pink-500/50 to-pink-500/0 transform -rotate-45" />
        </motion.div>

        {/* Obstacles */}
        {gameState.obstacles.map((obstacle) => {
          const age = Date.now() - obstacle.createdAt;
          const progress = age / obstacle.lifetime;
          const scale = 1 + Math.sin(progress * Math.PI) * 0.2; // Pulse effect

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
              {obstacle.type === 'green' && (
                <>
                  <div className="absolute inset-0 bg-green-500 rounded-full animate-pulse-glow" />
                  <div className="absolute inset-0 bg-green-400 rounded-full blur-sm animate-pulse-glow" />
                  <div className="absolute inset-0 bg-green-300 rounded-full blur-md animate-pulse-glow" />
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/50 to-green-500/0 transform -rotate-45" />
                  <div className="absolute inset-0 bg-white rounded-full opacity-20 animate-ping" />
                </>
              )}
              
              {obstacle.type === 'orange' && (
                <>
                  <div className="absolute inset-0 bg-orange-500 rounded-full animate-pulse-glow" />
                  <div className="absolute inset-0 bg-orange-400 rounded-full blur-sm animate-pulse-glow" />
                  <div className="absolute inset-0 bg-orange-300 rounded-full blur-md animate-pulse-glow" />
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/50 to-orange-500/0 transform -rotate-45" />
                  <div className="absolute inset-0 bg-white rounded-full opacity-20 animate-ping" />
                </>
              )}
            </motion.div>
          );
        })}

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