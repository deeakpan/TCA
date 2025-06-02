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

// Function to get random positions using cTRNG
async function getRandomPositions(count: number = 8): Promise<{ x: number; y: number }[]> {
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
      
      // Convert hex to positions
      const positions: { x: number; y: number }[] = [];
      for (let i = 0; i < count; i++) {
        const hexChunk = randomHex.slice(i * 8, (i + 1) * 8);
        const x = parseInt(hexChunk.slice(0, 4), 16) % 20; // Grid size is 20
        const y = parseInt(hexChunk.slice(4, 8), 16) % 20;
        positions.push({ x, y });
      }
      
      console.log('Generated positions:', positions);
      return positions;
    })();

    const positions = await pendingRequest;
    return positions;
  } catch (error) {
    console.error('cTRNG Request Failed:', error);
    // Fallback to Math.random if API fails
    const fallbackPositions = Array(count).fill(null).map(() => ({
      x: Math.floor(Math.random() * 20),
      y: Math.floor(Math.random() * 20)
    }));
    console.log('Fallback positions:', fallbackPositions);
    return fallbackPositions;
  } finally {
    // Clear the pending request after it's done
    pendingRequest = null;
  }
}

export async function POST(request: Request) {
  try {
    const positions = await getRandomPositions();
    return NextResponse.json({ positions });
  } catch (error) {
    console.error('Error getting random positions:', error);
    return NextResponse.json(
      { error: 'Failed to get random positions' },
      { status: 500 }
    );
  }
} 