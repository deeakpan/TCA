// Shared store for cosmic request counts
export interface RequestCount {
  count: number;
  lastReset: string; // ISO date string
}

// Use a Map to store request counts
export const requestCounts = new Map<string, RequestCount>();

// Helper function to get or initialize user data
export function getUserData(uniqueId: string): RequestCount {
  const today = new Date().toISOString().split('T')[0];
  const userData = requestCounts.get(uniqueId) || { count: 0, lastReset: today };
  
  // Reset count if it's a new day
  if (userData.lastReset !== today) {
    userData.count = 0;
    userData.lastReset = today;
  }
  
  return userData;
}

// Helper function to increment count
export function incrementCount(uniqueId: string): { count: number; remainingRequests: number } {
  const userData = getUserData(uniqueId);
  userData.count++;
  requestCounts.set(uniqueId, userData);
  return {
    count: userData.count,
    remainingRequests: Math.max(0, 3 - userData.count)
  };
} 