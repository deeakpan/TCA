import { NextResponse } from 'next/server';
import { getUserData } from '@/lib/cosmicStore';

// Enhanced star data with real astronomical information
const stars = [
  {
    name: 'Alpha Centauri',
    type: 'G2V',
    distance: 4.37, // light years
    mass: 1.1, // solar masses
    temperature: 5790, // Kelvin
    age: 6.5, // billion years
    elements: ['Hydrogen', 'Helium', 'Oxygen', 'Carbon', 'Iron']
  },
  {
    name: 'Betelgeuse',
    type: 'M1-2Ia-ab',
    distance: 642.5,
    mass: 11.6,
    temperature: 3600,
    age: 8.5,
    elements: ['Hydrogen', 'Helium', 'Carbon', 'Oxygen', 'Nitrogen', 'Iron']
  },
  {
    name: 'Sirius',
    type: 'A1V',
    distance: 8.6,
    mass: 2.02,
    temperature: 9940,
    age: 0.25,
    elements: ['Hydrogen', 'Helium', 'Iron', 'Silicon']
  },
  {
    name: 'Vega',
    type: 'A0V',
    distance: 25.04,
    mass: 2.1,
    temperature: 9602,
    age: 0.455,
    elements: ['Hydrogen', 'Helium', 'Iron', 'Silicon', 'Magnesium']
  },
  {
    name: 'Polaris',
    type: 'F7Ib',
    distance: 433,
    mass: 5.4,
    temperature: 6015,
    age: 0.06,
    elements: ['Hydrogen', 'Helium', 'Carbon', 'Oxygen', 'Nitrogen']
  },
  {
    name: 'Antares',
    type: 'M1Ib',
    distance: 550,
    mass: 12,
    temperature: 3660,
    age: 15,
    elements: ['Hydrogen', 'Helium', 'Carbon', 'Oxygen', 'Nitrogen', 'Iron']
  },
  {
    name: 'Rigel',
    type: 'B8Ia',
    distance: 860,
    mass: 21,
    temperature: 12100,
    age: 0.008,
    elements: ['Hydrogen', 'Helium', 'Oxygen', 'Nitrogen', 'Silicon']
  },
  {
    name: 'Proxima Centauri',
    type: 'M5.5Ve',
    distance: 4.24,
    mass: 0.12,
    temperature: 3042,
    age: 4.85,
    elements: ['Hydrogen', 'Helium', 'Oxygen', 'Carbon']
  }
];

// Enhanced cosmic elements with their properties
const cosmicElements = [
  { name: 'Hydrogen', symbol: 'H', atomicNumber: 1, abundance: 75, type: 'Gas' },
  { name: 'Helium', symbol: 'He', atomicNumber: 2, abundance: 23, type: 'Gas' },
  { name: 'Carbon', symbol: 'C', atomicNumber: 6, abundance: 0.5, type: 'Solid' },
  { name: 'Oxygen', symbol: 'O', atomicNumber: 8, abundance: 1, type: 'Gas' },
  { name: 'Nitrogen', symbol: 'N', atomicNumber: 7, abundance: 0.1, type: 'Gas' },
  { name: 'Neon', symbol: 'Ne', atomicNumber: 10, abundance: 0.13, type: 'Gas' },
  { name: 'Magnesium', symbol: 'Mg', atomicNumber: 12, abundance: 0.07, type: 'Solid' },
  { name: 'Silicon', symbol: 'Si', atomicNumber: 14, abundance: 0.07, type: 'Solid' },
  { name: 'Sulfur', symbol: 'S', atomicNumber: 16, abundance: 0.05, type: 'Solid' },
  { name: 'Iron', symbol: 'Fe', atomicNumber: 26, abundance: 0.11, type: 'Solid' },
  { name: 'Gold', symbol: 'Au', atomicNumber: 79, abundance: 0.0000001, type: 'Solid' },
  { name: 'Platinum', symbol: 'Pt', atomicNumber: 78, abundance: 0.0000005, type: 'Solid' },
  { name: 'Uranium', symbol: 'U', atomicNumber: 92, abundance: 0.0000002, type: 'Solid' },
  { name: 'Plutonium', symbol: 'Pu', atomicNumber: 94, abundance: 0.0000000001, type: 'Solid' }
];

// Token cache
let tokenCache = {
  token: null as string | null,
  expiresAt: 0
};

// Request deduplication cache
let pendingRequest: Promise<string> | null = null;

// Function to get access token from Auth0 with caching
async function getAccessToken(): Promise<string> {
  const now = Date.now();
  
  // Return cached token if it's still valid (with 5 minute buffer)
  if (tokenCache.token && tokenCache.expiresAt > now + 300000) {
    console.log('Using cached access token');
    return tokenCache.token;
  }

  // If there's a pending request, return its result
  if (pendingRequest) {
    console.log('Reusing pending token request...');
    return pendingRequest;
  }

  const authUrl = process.env.ORBITPORT_API_URL;
  const clientId = process.env.ORBITPORT_CLIENT_ID;
  const clientSecret = process.env.ORBITPORT_CLIENT_SECRET;

  if (!authUrl || !clientId || !clientSecret) {
    throw new Error('Missing Orbitport credentials');
  }

  try {
    // Create the request promise
    pendingRequest = (async () => {
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
    })();

    const token = await pendingRequest;
    return token;
  } catch (error) {
    console.error('Auth0 Request Failed:', error);
    throw error;
  } finally {
    pendingRequest = null;
  }
}

// Function to get multiple random numbers in a single cTRNG call
async function getCTRNGNumbers(count: number, ranges: { min: number; max: number }[]): Promise<number[]> {
  try {
    console.log('Getting cTRNG numbers...');
    const accessToken = await getAccessToken();
    
    const trngUrl = `${process.env.ORBITPORT_AUTH_URL}/api/v1/services/trng`;
    console.log('cTRNG Request:', { url: trngUrl });
    
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
    
    // Split the hex string into chunks for each number
    const chunkSize = Math.floor(randomHex.length / count);
    const results: number[] = [];
    
    for (let i = 0; i < count; i++) {
      const hexChunk = randomHex.slice(i * chunkSize, (i + 1) * chunkSize);
      const randomNumber = parseInt(hexChunk, 16);
      const { min, max } = ranges[i];
      const result = min + (randomNumber % (max - min));
      results.push(result);
    }
    
    console.log('Random Numbers Generated:', results.map((result, i) => ({
      min: ranges[i].min,
      max: ranges[i].max,
      result
    })));
    
    return results;
  } catch (error) {
    console.error('cTRNG Request Failed:', error);
    // Fallback to Math.random
    return ranges.map(({ min, max }) => min + Math.random() * (max - min));
  }
}

// Function to determine birth star based on date and cTRNG
async function determineBirthStar(birthDate: string): Promise<{
  name: string;
  type: string;
  distance: number;
  mass: number;
  temperature: number;
  age: number;
  elements: string[];
}> {
  console.log('Determining birth star for date:', birthDate);
  
  // Get all random numbers in a single request
  const [distance, temp, age, nameIndex, starNumber, typeIndex, subtype, massIndex] = await getCTRNGNumbers(8, [
    { min: 1, max: 1000 },      // Distance
    { min: 2000, max: 15000 },  // Temperature
    { min: 1, max: 15000 },     // Age
    { min: 0, max: 10 },        // Name index
    { min: 1, max: 100 },       // Star number
    { min: 0, max: 7 },         // Star type index
    { min: 0, max: 9 },         // Star subtype
    { min: 0, max: 20 }         // Mass index
  ]);

  // Generate star name
  const starNames = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa'];
  const name = `${starNames[Math.floor(nameIndex)]} ${Math.floor(starNumber)}`;

  // Generate star type
  const starTypes = ['O', 'B', 'A', 'F', 'G', 'K', 'M'];
  const type = `${starTypes[Math.floor(typeIndex)]}${Math.floor(subtype)}V`;

  // Convert age from million years to billion years
  const ageInBillionYears = age / 1000;

  return {
    name,
    type,
    distance: distance,
    mass: 0.5 + (massIndex / 10), // 0.5-2.5 solar masses
    temperature: temp,
    age: ageInBillionYears,
    elements: ['Hydrogen', 'Helium', 'Oxygen', 'Carbon', 'Iron'] // Base elements all stars have
  };
}

// Function to determine cosmic elements
async function determineCosmicElements(birthStar: typeof stars[0]): Promise<typeof cosmicElements[0][]> {
  console.log('Determining cosmic elements...');
  
  // Get number of elements and their indices in a single request
  const [numElements, ...elementIndices] = await getCTRNGNumbers(4, [
    { min: 3, max: 7 },         // Number of elements
    { min: 0, max: cosmicElements.length },  // First element
    { min: 0, max: cosmicElements.length },  // Second element
    { min: 0, max: cosmicElements.length }   // Third element
  ]);

  // Create a weighted pool of elements based on the birth star's elements
  const elementPool = cosmicElements.filter(element => 
    birthStar.elements.includes(element.name)
  );
  
  // Add some random elements from the full pool (20% chance)
  const fullPool = [...elementPool];
  cosmicElements.forEach(element => {
    if (!elementPool.includes(element) && Math.random() < 0.2) {
      fullPool.push(element);
    }
  });

  // Use the random indices to select elements from the pool
  const selectedElements = elementIndices
    .map(index => fullPool[Math.floor(index % fullPool.length)])
    .filter((element, index, self) => 
      // Remove duplicates
      index === self.findIndex(e => e.name === element.name)
    );

  // If we have fewer elements than requested, add more
  while (selectedElements.length < numElements) {
    const randomIndex = Math.floor(Math.random() * fullPool.length);
    const element = fullPool[randomIndex];
    if (!selectedElements.some(e => e.name === element.name)) {
      selectedElements.push(element);
    }
  }

  console.log('Selected cosmic elements:', selectedElements.map(e => e.name));
  return selectedElements;
}

// Function to calculate radiation level based on star and elements
function calculateRadiationLevel(birthStar: typeof stars[0], elements: typeof cosmicElements[0][]): number {
  // Base radiation from star's temperature (40-60% of total)
  const baseRadiation = (birthStar.temperature / 10000) * 50;
  
  // Additional radiation from elements (30-40% of total)
  const elementRadiation = elements.reduce((sum, element) => {
    return sum + (element.atomicNumber * 0.1);
  }, 0);
  
  // Random cosmic fluctuation (10-20% of total)
  const cosmicFluctuation = Math.random() * 20;
  
  // Final radiation level (0-100)
  const totalRadiation = baseRadiation + elementRadiation + cosmicFluctuation;
  return Math.min(100, Math.max(0, totalRadiation));
}

export async function POST(request: Request) {
  console.log('Received cosmic data request');
  try {
    const body = await request.json();
    console.log('Request body:', body);
    const { birthDate, birthTime, birthLocation } = body;

    // Get the unique ID from headers
    const uniqueId = request.headers.get('x-cosmic-id');
    if (!uniqueId) {
      return NextResponse.json(
        { error: 'Missing cosmic ID' },
        { status: 400 }
      );
    }

    // Get current count using shared store
    const userData = getUserData(uniqueId);

    // Get cosmic data using cTRNG
    console.log('Fetching cosmic data...');
    const birthStar = await determineBirthStar(birthDate);
    const cosmicElements = await determineCosmicElements(birthStar);
    const radiationLevel = calculateRadiationLevel(birthStar, cosmicElements);

    // Format response with current count
    const response = {
      birthStar: {
        name: String(birthStar.name),
        type: String(birthStar.type),
        distance: Number(birthStar.distance),
        temperature: Number(birthStar.temperature),
        age: Number(birthStar.age)
      },
      cosmicElements: cosmicElements.map(element => ({
        name: String(element.name),
        symbol: String(element.symbol),
        atomicNumber: Number(element.atomicNumber),
        abundance: Number(element.abundance),
        type: String(element.type)
      })),
      radiationLevel: Number(radiationLevel),
      timestamp: new Date().toISOString(),
      source: 'cTRNG',
      currentCount: userData.count,
      remainingRequests: Math.max(0, 3 - userData.count)
    };
    
    console.log('Sending response:', JSON.stringify(response, null, 2));
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error processing cosmic data request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 