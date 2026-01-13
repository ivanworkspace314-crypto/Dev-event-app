import { getAllEvents } from '@/app/actions';
import EventCard from '@/components/EventCard';

export default async function HomePage() {
  // Retrieve all events data
  const events = await getAllEvents();

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <div className="text-center py-16 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-4">
          The Hub for Every Dev Event You Can't Miss
        </h1>
        <h2 className="text-xl md:text-2xl text-slate-300">
          Hackathons, Meetups, and Conferences, All in One Place
        </h2>
      </div>

      {/* Featured Events Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <p className="text-2xl font-semibold text-slate-100 mb-8">Featured Events</p>
        
        {/* Event Grid - 1 column on mobile, 3 columns on larger screens */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>

        {events.length === 0 && (
          <p className="text-center text-slate-400 mt-8">No events available at the moment.</p>
        )}
      </div>
    </div>
  );
}
