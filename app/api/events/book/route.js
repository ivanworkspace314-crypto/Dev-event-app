import { bookEvent } from '@/app/actions';
import { NextResponse } from 'next/server';

/**
 * POST /api/events/book
 * Book an event
 * Body: { eventSlug, email }
 */
export async function POST(request) {
  try {
    const { eventSlug, email } = await request.json();

    if (!eventSlug || !email) {
      return NextResponse.json(
        {
          success: false,
          error: 'eventSlug and email are required',
        },
        { status: 400 }
      );
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email format',
        },
        { status: 400 }
      );
    }

    const result = await bookEvent(eventSlug, email);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to book event',
      },
      { status: 400 }
    );
  }
}
