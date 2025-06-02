// Types for the game
export type Position = {
  x: number;
  y: number;
};

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type GameState = {
  snake: Position[];
  food: Position;
  direction: Direction;
  score: number;
  gameOver: boolean;
  foodPositions: Position[];
  currentFoodIndex: number;
};

// Constants
const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 2) }];
const INITIAL_DIRECTION: Direction = 'RIGHT';
const TICK_RATE = 200;

// Request deduplication cache
let pendingRequest: Promise<Position[]> | null = null;

// Token cache for cTRNG API
let tokenCache = {
  token: null as string | null,
  expiresAt: 0
};

// Get access token from Auth0
async function getAccessToken(): Promise<string> {
  console.log('Getting access token...');
  const now = Date.now();
  
  // Return cached token if it's still valid (with 5 minute buffer)
  if (tokenCache.token && tokenCache.expiresAt > now + 300000) {
    console.log('Using cached token');
    return tokenCache.token;
  }

  const authUrl = process.env.ORBITPORT_API_URL;
  const clientId = process.env.ORBITPORT_CLIENT_ID;
  const clientSecret = process.env.ORBITPORT_CLIENT_SECRET;

  if (!authUrl || !clientId || !clientSecret) {
    console.error('Missing Orbitport credentials:', { authUrl, clientId: !!clientId, clientSecret: !!clientSecret });
    throw new Error('Missing Orbitport credentials');
  }

  try {
    console.log('Fetching new token from:', authUrl);
    const response = await fetch(`${authUrl}/oauth/token`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        audience: 'https://op.spacecomputer.io/api',
        grant_type: 'client_credentials',
      }),
    });

    if (!response.ok) {
      console.error('Token request failed:', response.status, response.statusText);
      throw new Error(`Failed to get access token: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Token received successfully');
    
    // Cache the token
    tokenCache = {
      token: data.access_token,
      expiresAt: now + (data.expires_in * 1000)
    };

    return data.access_token;
  } catch (error) {
    console.error('Auth0 Request Failed:', error);
    throw error;
  }
}

// Get random positions from cTRNG
async function getRandomPositions(): Promise<Position[]> {
  // If there's a pending request, return its result
  if (pendingRequest) {
    console.log('Reusing pending request...');
    return pendingRequest;
  }

  console.log('Getting random positions from cTRNG...');
  try {
    // Create the request promise
    pendingRequest = (async () => {
      const response = await fetch('/api/game', {
        method: 'POST'
      });
      
      if (!response.ok) {
        console.error('Game API request failed:', response.status, response.statusText);
        throw new Error(`Failed to fetch game data: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Game API data received:', data);
      return data.positions;
    })();

    const positions = await pendingRequest;
    return positions;
  } catch (error) {
    console.error('Game API Request Failed:', error);
    console.log('Falling back to Math.random');
    // Fallback to Math.random if API fails
    const fallbackPositions = Array(8).fill(null).map(() => ({
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    }));
    console.log('Fallback positions:', fallbackPositions);
    return fallbackPositions;
  } finally {
    // Clear the pending request after it's done
    pendingRequest = null;
  }
}

// Initialize game state
export async function initializeGame(): Promise<GameState> {
  console.log('Initializing game...');
  const foodPositions = await getRandomPositions();
  const initialState: GameState = {
    snake: INITIAL_SNAKE,
    food: foodPositions[0],
    direction: INITIAL_DIRECTION,
    score: 0,
    gameOver: false,
    foodPositions,
    currentFoodIndex: 0
  };
  console.log('Initial game state:', initialState);
  return initialState;
}

// Get next food position
export async function getNextFood(currentState: GameState): Promise<GameState> {
  console.log('Getting next food position...');
  let newFoodPositions = currentState.foodPositions;
  let newFoodIndex = currentState.currentFoodIndex + 1;
  
  // If we're running out of food positions, fetch new ones
  if (newFoodIndex >= 7) {
    console.log('Fetching new food positions...');
    try {
      const newPositions = await getRandomPositions();
      newFoodPositions = newPositions;
      newFoodIndex = 0;
    } catch (error) {
      console.error('Failed to fetch new food positions:', error);
      // Keep using existing positions if fetch fails
    }
  }
  
  const newState = {
    ...currentState,
    food: newFoodPositions[newFoodIndex],
    foodPositions: newFoodPositions,
    currentFoodIndex: newFoodIndex
  };
  console.log('New food state:', newState);
  return newState;
}

// Move snake
export function moveSnake(state: GameState): GameState {
  console.log('Moving snake...', { currentDirection: state.direction });
  const head = { ...state.snake[0] };
  
  // Calculate new head position
  switch (state.direction) {
    case 'UP':
      head.y = (head.y - 1 + GRID_SIZE) % GRID_SIZE;
      break;
    case 'DOWN':
      head.y = (head.y + 1) % GRID_SIZE;
      break;
    case 'LEFT':
      head.x = (head.x - 1 + GRID_SIZE) % GRID_SIZE;
      break;
    case 'RIGHT':
      head.x = (head.x + 1) % GRID_SIZE;
      break;
  }
  
  console.log('New head position:', head);
  
  // Check for collision with self
  const hasCollision = state.snake.some(segment => 
    segment.x === head.x && segment.y === head.y
  );
  
  if (hasCollision) {
    console.log('Collision detected!');
    return { ...state, gameOver: true };
  }
  
  // Check if food is eaten
  const hasEatenFood = head.x === state.food.x && head.y === state.food.y;
  console.log('Food eaten:', hasEatenFood);
  
  // Create new snake array
  const newSnake = [head, ...state.snake];
  if (!hasEatenFood) {
    newSnake.pop();
  }
  
  const newState = {
    ...state,
    snake: newSnake,
    score: hasEatenFood ? state.score + 1 : state.score
  };
  console.log('New game state:', newState);
  return newState;
}

// Change direction
export function changeDirection(state: GameState, newDirection: Direction): GameState {
  console.log('Changing direction:', { from: state.direction, to: newDirection });
  // Prevent 180-degree turns
  const invalidMoves: Record<Direction, Direction> = {
    'UP': 'DOWN',
    'DOWN': 'UP',
    'LEFT': 'RIGHT',
    'RIGHT': 'LEFT'
  };
  
  if (invalidMoves[state.direction] === newDirection) {
    console.log('Invalid move: 180-degree turn');
    return state;
  }
  
  return { ...state, direction: newDirection };
}

// Export constants
export const GRID_SIZE_CONST = GRID_SIZE;
export const TICK_RATE_CONST = TICK_RATE; 