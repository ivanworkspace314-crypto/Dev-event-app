import { getEvent, editEvent, deleteEvent, bookEvent } from '@/app/actions';
import { NextResponse } from 'next/server';

/**
 * GET /api/events/[slug]
 * Retrieve a single event by slug
 */
export async function GET(request, { params }) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          error: 'Slug parameter is required',
        },
        { status: 400 }
      );
    }

    const event = await getEvent(slug);

    return NextResponse.json(
      {
        success: true,
        data: event,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch event',
      },
      { status: 404 }
    );
  }
}

/**
 * PUT /api/events/[slug]
 * Update an event by slug
 * Body: { title?, slug?, description?, 'image-path'?, venue?, dateTime?, audience?, mode?, agenda?, organizer?, tags? }
 */
export async function PUT(request, { params }) {
  try {
    const { slug } = await params;
    const eventData = await request.json();

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          error: 'Slug parameter is required',
        },
        { status: 400 }
      );
    }

    const result = await editEvent(slug, eventData);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update event',
      },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/events/[slug]
 * Delete an event by slug
 */
export async function DELETE(request, { params }) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          error: 'Slug parameter is required',
        },
        { status: 400 }
      );
    }

    const result = await deleteEvent(slug);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to delete event',
      },
      { status: 404 }
    );
  }
}
