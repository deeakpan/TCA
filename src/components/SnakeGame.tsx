'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
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

export default function SnakeGame() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isWaitingForFirstMove, setIsWaitingForFirstMove] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

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
  }, [gameState, isWaitingForFirstMove]);

  // Set up keyboard listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Game loop
  useEffect(() => {
    if (!gameState || gameState.gameOver || isWaitingForFirstMove) {
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
      const newState = moveSnake(gameState);
      
      // If food was eaten, get next food position
      if (newState.score > gameState.score) {
        console.log('Food eaten, getting next food...');
        const updatedState = await getNextFood(newState);
        setGameState(updatedState);
      } else {
        setGameState(newState);
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
  }, [gameState, isWaitingForFirstMove]);

  // Restart game
  const handleRestart = async () => {
    setIsLoading(true);
    setIsWaitingForFirstMove(true);
    setIsInitialized(false);
    try {
      console.log('Restarting game...');
      const initialState = await initializeGame();
      setGameState(initialState);
      setError(null);
    } catch (err) {
      console.error('Failed to restart game:', err);
      setError('Failed to restart game. Please try again.');
    }
    setIsLoading(false);
  };

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
          onClick={handleRestart}
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
          <div
            key={`${segment.x}-${segment.y}-${index}`}
            className="bg-purple-500 rounded-sm"
            style={{
              gridColumn: segment.x + 1,
              gridRow: segment.y + 1
            }}
          />
        ))}
        
        {/* Food */}
        <motion.div
          className="bg-pink-500 rounded-full"
          style={{
            gridColumn: gameState.food.x + 1,
            gridRow: gameState.food.y + 1
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        />
      </div>

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
          <p className="text-white mb-4">Score: {gameState.score}</p>
          <button
            onClick={handleRestart}
            className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-500 transition-colors"
          >
            Play Again
          </button>
        </motion.div>
      )}

      {/* Score display */}
      <div className="absolute top-4 right-4 text-white text-lg">
        Score: {gameState.score}
      </div>
    </div>
  );
} 