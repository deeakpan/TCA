import OpenAI from 'openai';

interface CosmicElement {
  name: string;
  symbol: string;
  atomicNumber: number;
  abundance: number;
  type: string;
}

interface BirthStar {
  name: string;
  type: string;
  distance: number;
  temperature: number;
  age: number;
}

interface CosmicData {
  birthStar: BirthStar;
  cosmicElements: CosmicElement[];
  radiationLevel: number;
  timestamp: string;
  source: string;
}

interface UserData {
  name: string;
  birthDate: string;
  birthTime?: string;
  birthLocation: string;
  gender?: string;
}

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY,
  dangerouslyAllowBrowser: true,
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL,
    "X-Title": "True Cosmic Ancestry",
  },
});

export async function generateCosmicNarrative(cosmicData: CosmicData, userData: UserData) {
  try {
    const completion = await openai.chat.completions.create({
      model: "mistralai/mistral-small-3.1-24b-instruct:free",
      messages: [
        {
          role: "system",
          content: `You are a cosmic storyteller. Create a brief, mystical narrative about a person's cosmic ancestry.
          Keep it under 3 sentences. Focus on the most interesting aspect of their cosmic profile.
          Be poetic but concise.`
        },
        {
          role: "user",
          content: `Create a brief cosmic narrative for ${userData.name}:
          Birth Star: ${cosmicData.birthStar.name} (${cosmicData.birthStar.type})
          Distance: ${cosmicData.birthStar.distance} light years
          Temperature: ${cosmicData.birthStar.temperature}K
          Age: ${cosmicData.birthStar.age} billion years
          
          Cosmic Elements: ${cosmicData.cosmicElements.map((e: CosmicElement) => 
            `${e.name} (${e.symbol}): ${e.abundance}% abundance, ${e.type} element`
          ).join(', ')}
          
          Radiation Level: ${cosmicData.radiationLevel}`
        }
      ],
      temperature: 0.8,
      max_tokens: 150,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating cosmic narrative:', error);
    return null;
  }
}

export async function generateCosmicInsights(cosmicData: CosmicData) {
  try {
    const completion = await openai.chat.completions.create({
      model: "mistralai/mistral-small-3.1-24b-instruct:free",
      messages: [
        {
          role: "system",
          content: `You are a cosmic oracle. Provide 2 brief, mystical insights about a person's cosmic profile.
          Each insight should be 1-2 sentences. Focus on the most significant aspects of their cosmic makeup.
          Be poetic but concise.`
        },
        {
          role: "user",
          content: `Generate 2 brief cosmic insights for someone whose cosmic lineage traces back to ${cosmicData.birthStar.name}, a ${cosmicData.birthStar.type} star that has burned for ${cosmicData.birthStar.age} billion years.
          
          Their cosmic signature includes:
          - Star Distance: ${cosmicData.birthStar.distance} light years
          - Star Temperature: ${cosmicData.birthStar.temperature}K
          - Cosmic Elements: ${cosmicData.cosmicElements.map((e: CosmicElement) => 
            `${e.name} (${e.symbol}): ${e.abundance}% abundance, ${e.type} element`
          ).join(', ')}
          - Radiation Level: ${cosmicData.radiationLevel}`
        }
      ],
      temperature: 0.8,
      max_tokens: 150,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating cosmic insights:', error);
    return null;
  }
} 