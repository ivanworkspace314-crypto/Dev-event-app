import { getEvent, getSimilarEvent } from '@/app/actions';
import BookEventCard from '@/components/BookEventCard';
import EventCard from '@/components/EventCard';
import { notFound } from 'next/navigation';

export default async function EventDetailsPage({ params }) {
  const { eventSlug } = await params;
  
  if (!eventSlug || eventSlug === 'undefined') {
    return notFound();
  }

  // Get event details
  let event;
  try {
    event = await getEvent(eventSlug);
  } catch (error) {
    return notFound();
  }
  
  // Get similar events (max 3)
  const allSimilarEvents = await getSimilarEvent(eventSlug);
  const similarEvents = allSimilarEvents.slice(0, 3);

  // Format date and time
  const formatDate = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-6">{event.title}</h1>

        {/* Description */}
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">{event.description}</p>

        {/* Image */}
        <div className="mb-8">
          <img 
            src={event['image-path']} 
            alt={event.title}
            className="w-full rounded-lg shadow-md"
          />
        </div>

        {/* Book Event Card */}
        <div className="mb-8">
          <BookEventCard eventSlug={eventSlug} />
        </div>

        {/* Event Details */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Details</h2>
          <div className="bg-white rounded-lg shadow-md p-6 space-y-3">
            <div>
              <span className="font-semibold text-gray-900">Date: </span>
              <span className="text-gray-700">{formatDate(event.dateTime)}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-900">Time: </span>
              <span className="text-gray-700">{formatTime(event.dateTime)}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-900">Venue: </span>
              <span className="text-gray-700">{event.venue}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-900">Mode: </span>
              <span className="text-gray-700">{event.mode}</span>
            </div>
          </div>
        </div>

        {/* Agenda */}
        {event.agenda && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Agenda</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-700 whitespace-pre-line">{event.agenda}</p>
            </div>
          </div>
        )}

        {/* About the Organizer */}
        {event.organizer && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Organizer</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-700">{event.organizer}</p>
            </div>
          </div>
        )}

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Similar Events */}
        {similarEvents.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Similar Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarEvents.map((similarEvent) => (
                <EventCard key={similarEvent._id} event={similarEvent} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
