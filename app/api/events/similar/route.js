import { getSimilarEvent } from '@/app/actions';
import { NextResponse } from 'next/server';

/**
 * GET /api/events/similar/[slug]
 * Get events with similar tags based on an event slug
 * Query params: slug (event slug)
 * Example: /api/events/similar?slug=react-advanced-patterns-workshop
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          error: 'slug parameter is required',
        },
        { status: 400 }
      );
    }

    const events = await getSimilarEvent(slug);

    return NextResponse.json(
      {
        success: true,
        data: events,
        sourceSlug: slug,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch similar events',
      },
      { status: 500 }
    );
  }
}
