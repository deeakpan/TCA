'use client';

import { useState } from 'react';
import SnakeGame from '@/components/SnakeGame';

export default function SnakePage() {
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const handleRestart = () => {
    setScore(0);
    setIsPaused(false);
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <h1 className="text-2xl font-bold text-purple-400">Nebular Snake</h1>
        <div className="flex items-center space-x-4">
          <div className="text-purple-400">Score: {score}</div>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
        </div>
      </div>

      {/* Game container */}
      <div className="flex-1 relative">
        <SnakeGame
          isPaused={isPaused}
          onScoreChange={setScore}
          onRestart={handleRestart}
          onPauseChange={setIsPaused}
        />
      </div>
    </div>
  );
} 