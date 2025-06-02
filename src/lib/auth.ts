// Token cache
let tokenCache = {
  token: null as string | null,
  expiresAt: 0
};

export async function getAccessToken(): Promise<string> {
  // Check if we have a valid cached token
  if (tokenCache.token && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token;
  }

  try {
    const response = await fetch(`${process.env.ORBITPORT_AUTH_URL}/api/v1/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        clientId: process.env.ORBITPORT_CLIENT_ID,
        clientSecret: process.env.ORBITPORT_CLIENT_SECRET
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get access token');
    }

    const data = await response.json();
    
    // Cache the token
    tokenCache.token = data.access_token;
    tokenCache.expiresAt = Date.now() + (data.expires_in * 1000);
    
    return data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
} 