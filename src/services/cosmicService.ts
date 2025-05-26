interface CosmicData {
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
}

export async function getCosmicData(
  birthDate: string,
  birthTime: string,
  birthLocation: string
): Promise<CosmicData> {
  try {
    const response = await fetch('/api/cosmic', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        birthDate,
        birthTime,
        birthLocation,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch cosmic data');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching cosmic data:', error);
    throw error;
  }
} 