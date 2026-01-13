import Link from 'next/link';
import Image from 'next/image';

export default function EventCard({ event }) {
  const eventSlug = event?.slug ? encodeURIComponent(event.slug) : null;
  console.log("EVENT SLUG: "+eventSlug)
  // Format date and time from dateTime field
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

  if (!eventSlug) {
    return null;
  }

  return (
    <Link href={`/details/${eventSlug}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* Event Image */}
        <div className="relative w-full h-48 bg-gray-200">
          <Image
            /*src={event['image-path'] || '/event-image/dummy.png'}*/
            src={'/event-image/dummy.png'}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
            className="object-cover"
          />
        </div>
        
        {/* Event Details */}
        <div className="p-4 space-y-2">
          {/* Location */}
          <p className="text-sm text-gray-600">{event.venue}</p>
          
          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {event.title}
          </h3>
          
          {/* Date */}
          <p className="text-sm text-gray-700">{formatDate(event.dateTime)}</p>
          
          {/* Time */}
          <p className="text-sm text-gray-700">{formatTime(event.dateTime)}</p>
        </div>
      </div>
    </Link>
  );
}
