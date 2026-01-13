'use server';

import connectDB from '@/lib/db';
import Event from '@/models/Event';
import Booking from '@/models/Booking';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload image file to Cloudinary and return secure URL
 */
export async function uploadEventImage(file) {
  if (!file) {
    throw new Error('No file provided');
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const base64File = `data:${file.type};base64,${buffer.toString('base64')}`;

  const result = await cloudinary.uploader.upload(base64File, {
    folder: 'dev-events',
  });

  return {
    success: true,
    secure_url: result.secure_url,
    public_id: result.public_id,
  };
}

/**
 * Retrieve all event entries from database
 */
export async function getAllEvents() {
  try {
    await connectDB();
    const events = await Event.find({}).sort({ dateTime: 1 });
    return JSON.parse(JSON.stringify(events));
  } catch (error) {
    console.error('Error fetching all events:', error);
    throw new Error('Failed to fetch events');
  }
}

/**
 * Retrieve single event entry from database by its eventSlug
 */
export async function getEvent(eventSlug) {
  try {
    await connectDB();
    const event = await Event.findOne({ slug: eventSlug });

    if (!event) {
      throw new Error('Event not found');
    }

    return JSON.parse(JSON.stringify(event));
  } catch (error) {
    console.error('Error fetching event:', error);
    throw new Error('Failed to fetch event');
  }
}

/**
 * Create new entry for Booking in database
 * And then add the audience in the event by one in the Event Table
 */
export async function bookEvent(eventSlug, email) {
  try {
    await connectDB();

    // Find the event
    const event = await Event.findOne({ slug: eventSlug });
    if (!event) {
      throw new Error('Event not found');
    }

    // Create booking entry
    const booking = new Booking({
      eventId: event._id,
      email: email,
    });

    await booking.save();

    // Increment audience by 1
    event.audience = (event.audience || 0) + 1;
    await event.save();

    return {
      success: true,
      message: 'Event booked successfully',
      booking: JSON.parse(JSON.stringify(booking)),
    };
  } catch (error) {
    console.error('Error booking event:', error);
    throw new Error('Failed to book event');
  }
}

/**
 * Retrieve list of similar events from database that have at least one shared tag
 * Takes eventSlug, gets its tags, and finds similar events excluding itself
 */
export async function getSimilarEvent(eventSlug) {
  try {
    await connectDB();

    // Find the event by slug
    const event = await Event.findOne({ slug: eventSlug });

    if (!event) {
      throw new Error('Event not found');
    }

    // If event has no tags, return empty array
    if (!event.tags || event.tags.length === 0) {
      return [];
    }

    // Find events with at least one matching tag, excluding the current event
    const events = await Event.find({
      tags: { $in: event.tags },
      _id: { $ne: event._id }, // Exclude the current event
    }).sort({ dateTime: 1 });

    return JSON.parse(JSON.stringify(events));
  } catch (error) {
    console.error('Error fetching similar events:', error);
    throw new Error('Failed to fetch similar events');
  }
}

/**
 * Create new entry for event table
 */
export async function createEvent(eventData) {
  try {
    await connectDB();

    // Validate required fields
    const requiredFields = ['title', 'slug', 'description', 'image-path', 'venue', 'dateTime', 'mode'];
    for (const field of requiredFields) {
      if (!eventData[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Check if slug already exists
    const existingEvent = await Event.findOne({ slug: eventData.slug });
    if (existingEvent) {
      throw new Error('Event with this slug already exists');
    }

    const event = new Event({
      title: eventData.title,
      slug: eventData.slug,
      description: eventData.description,
      'image-path': eventData['image-path'],
      venue: eventData.venue,
      dateTime: new Date(eventData.dateTime),
      audience: eventData.audience || 0,
      mode: eventData.mode,
      agenda: eventData.agenda || '',
      organizer: eventData.organizer || '',
      tags: eventData.tags || [],
    });

    await event.save();

    return {
      success: true,
      message: 'Event created successfully',
      event: JSON.parse(JSON.stringify(event)),
    };
  } catch (error) {
    console.error('Error creating event:', error);
    throw new Error(`Failed to create event: ${error.message}`);
  }
}

/**
 * Update the event for event table
 */
export async function editEvent(eventSlug, eventData) {
  try {
    await connectDB();

    const event = await Event.findOne({ slug: eventSlug });

    if (!event) {
      throw new Error('Event not found');
    }

    // Update fields
    if (eventData.title !== undefined) event.title = eventData.title;
    if (eventData.description !== undefined) event.description = eventData.description;
    if (eventData['image-path'] !== undefined) event['image-path'] = eventData['image-path'];
    if (eventData.venue !== undefined) event.venue = eventData.venue;
    if (eventData.dateTime !== undefined) event.dateTime = new Date(eventData.dateTime);
    if (eventData.audience !== undefined) event.audience = eventData.audience;
    if (eventData.mode !== undefined) event.mode = eventData.mode;
    if (eventData.agenda !== undefined) event.agenda = eventData.agenda;
    if (eventData.organizer !== undefined) event.organizer = eventData.organizer;
    if (eventData.tags !== undefined) event.tags = eventData.tags;

    await event.save();

    return {
      success: true,
      message: 'Event updated successfully',
      event: JSON.parse(JSON.stringify(event)),
    };
  } catch (error) {
    console.error('Error updating event:', error);
    throw new Error('Failed to update event');
  }
}

/**
 * Delete specific event
 */
export async function deleteEvent(eventSlug) {
  try {
    await connectDB();

    const event = await Event.findOne({ slug: eventSlug });

    if (!event) {
      throw new Error('Event not found');
    }

    // Delete all bookings associated with this event
    await Booking.deleteMany({ eventId: event._id });

    // Delete the event
    await Event.deleteOne({ _id: event._id });

    return {
      success: true,
      message: 'Event deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting event:', error);
    throw new Error('Failed to delete event');
  }
}
