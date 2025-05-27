import { NextResponse } from 'next/server';
import { incrementCount } from '@/lib/cosmicStore';

export async function POST(request: Request) {
  try {
    // Get the unique ID from headers
    const uniqueId = request.headers.get('x-cosmic-id');
    if (!uniqueId) {
      return NextResponse.json(
        { error: 'Missing cosmic ID' },
        { status: 400 }
      );
    }

    // Increment count using shared store
    const { count, remainingRequests } = incrementCount(uniqueId);

    return NextResponse.json({
      success: true,
      currentCount: count,
      remainingRequests
    });
  } catch (error) {
    console.error('Error incrementing request count:', error);
    return NextResponse.json(
      { error: 'Failed to update request count' },
      { status: 500 }
    );
  }
} 