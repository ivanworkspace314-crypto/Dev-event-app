import { getAllEvents, createEvent } from '@/app/actions';
import { NextResponse } from 'next/server';

/**
 * GET /api/events
 * Retrieve all events
 */
export async function GET() {
  try {
    const events = await getAllEvents();
    return NextResponse.json(
      {
        success: true,
        data: events,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch events',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/events
 * Create a new event
 * Body: { title, slug, description, 'image-path', venue, dateTime, mode, audience?, agenda?, organizer?, tags? }
 */
export async function POST(request) {
  try {
    const eventData = await request.json();

    const result = await createEvent(eventData);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create event',
      },
      { status: 400 }
    );
  }
}
