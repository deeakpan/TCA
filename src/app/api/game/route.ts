import { NextResponse } from 'next/server';

// Token cache
let tokenCache = {
  token: null as string | null,
  expiresAt: 0
};

// Request deduplication cache
let pendingRequest: Promise<{ x: number; y: number }[]> | null = null;

// Function to get access token from Auth0 with caching
async function getAccessToken(): Promise<string> {
  const now = Date.now();
  
  // Return cached token if it's still valid (with 5 minute buffer)
  if (tokenCache.token && tokenCache.expiresAt > now + 300000) {
    console.log('Using cached access token');
    return tokenCache.token;
  }

  const authUrl = process.env.ORBITPORT_API_URL;
  const clientId = process.env.ORBITPORT_CLIENT_ID;
  const clientSecret = process.env.ORBITPORT_CLIENT_SECRET;

  if (!authUrl || !clientId || !clientSecret) {
    throw new Error('Missing Orbitport credentials');
  }

  try {
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
      throw new Error(`Failed to get access token: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
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

// Function to check if a position is too close to existing positions
function isTooClose(newPos: { x: number; y: number }, existingPositions: { x: number; y: number }[], minDistance: number = 3): boolean {
  return existingPositions.some(pos => {
    const dx = Math.abs(newPos.x - pos.x);
    const dy = Math.abs(newPos.y - pos.y);
    return dx < minDistance && dy < minDistance;
  });
}

// Function to get random positions using cTRNG
async function getRandomPositions(count: number = 15): Promise<{ x: number; y: number }[]> {
  // If there's a pending request, return its result
  if (pendingRequest) {
    console.log('Reusing pending request...');
    return pendingRequest;
  }

  try {
    console.log('Getting random positions from cTRNG...');
    const accessToken = await getAccessToken();
    
    const trngUrl = `${process.env.ORBITPORT_AUTH_URL}/api/v1/services/trng`;
    console.log('cTRNG Request:', { url: trngUrl });
    
    // Create the request promise
    pendingRequest = (async () => {
      const response = await fetch(trngUrl, {
        headers: {
          'authorization': `Bearer ${accessToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch cTRNG data: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      const randomHex = data.data;
      
      // Convert hex to positions with better distribution
      const positions: { x: number; y: number }[] = [];
      const hexLength = 4; // Each position needs 4 hex chars (2 for x, 2 for y)
      const totalHexNeeded = count * hexLength;
      
      // Ensure we have enough hex data
      if (randomHex.length < totalHexNeeded) {
        throw new Error(`Not enough random data: got ${randomHex.length} chars, need ${totalHexNeeded}`);
      }
      
      // Generate positions with better distribution
      for (let i = 0; i < count; i++) {
        let attempts = 0;
        let newPos: { x: number; y: number };
        
        do {
          const startIdx = i * hexLength;
          const xHex = randomHex.slice(startIdx, startIdx + 2);
          const yHex = randomHex.slice(startIdx + 2, startIdx + 4);
          
          // Avoid edges by keeping positions 2 spaces away from borders
          const x = (parseInt(xHex, 16) % 16) + 2; // 2-17 instead of 0-19
          const y = (parseInt(yHex, 16) % 16) + 2; // 2-17 instead of 0-19
          
          newPos = { x, y };
          attempts++;
          
          // If we've tried too many times, use a fallback position
          if (attempts > 5) {
            newPos = {
              x: Math.floor(Math.random() * 16) + 2,
              y: Math.floor(Math.random() * 16) + 2
            };
            break;
          }
        } while (isTooClose(newPos, positions));
        
        positions.push(newPos);
      }
      
      console.log('Generated positions:', positions);
      return positions;
    })();

    const positions = await pendingRequest;
    return positions;
  } catch (error) {
    console.error('cTRNG Request Failed:', error);
    // Fallback to Math.random if API fails
    const fallbackPositions: { x: number; y: number }[] = [];
    for (let i = 0; i < count; i++) {
      let newPos: { x: number; y: number };
      do {
        newPos = {
          x: Math.floor(Math.random() * 16) + 2,
          y: Math.floor(Math.random() * 16) + 2
        };
      } while (isTooClose(newPos, fallbackPositions));
      fallbackPositions.push(newPos);
    }
    console.log('Fallback positions:', fallbackPositions);
    return fallbackPositions;
  } finally {
    // Clear the pending request after it's done
    pendingRequest = null;
  }
}

export async function POST() {
  try {
    console.log('Game API: Getting random positions...');
    const positions = await getRandomPositions(15);
    console.log('Game API: Positions received:', positions);
    return NextResponse.json({ positions });
  } catch (error) {
    console.error('Game API Error:', error);
    return NextResponse.json(
      { error: 'Failed to get random positions' },
      { status: 500 }
    );
  }
} 