import { getAllEvents } from '@/app/actions';
import Link from 'next/link';
import DeleteEventButton from '@/components/DeleteEventButton';
import TableHeaderCell from '@/components/TableHeaderCell';
import TableCell from '@/components/TableCell';

export default async function AdminDashboard() {


  // Load all events (will show first 10)
  const allEvents = await getAllEvents();
  const events = allEvents.slice(0, 10);

  // Format date and time
  const formatDate = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
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
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-slate-100">Event Management</h1>
          <Link
            href="/create-event"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Add New Event
          </Link>
        </div>

        {/* Events Table */}
        <div className="bg-slate-800 rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700">
              <thead className="bg-slate-700">
                <tr>
                  <TableHeaderCell>Event</TableHeaderCell>
                  <TableHeaderCell>Location</TableHeaderCell>
                  <TableHeaderCell>Date</TableHeaderCell>
                  <TableHeaderCell>Time</TableHeaderCell>
                  <TableHeaderCell>Booked Spot</TableHeaderCell>
                  <TableHeaderCell>Action</TableHeaderCell>
                </tr>
              </thead>
              <tbody className="bg-slate-800 divide-y divide-slate-700">
                {events.map((event) => (
                  <tr key={event._id} className="hover:bg-slate-700">
                    <TableCell>
                      <Link href={`/details/${event.slug}`} className="text-sm font-medium text-slate-100 hover:text-blue-400">
                        {event.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {event.venue}
                    </TableCell>
                    <TableCell>
                      {formatDate(event.dateTime)}
                    </TableCell>
                    <TableCell>
                      {formatTime(event.dateTime)}
                    </TableCell>
                    <TableCell>
                      {event.audience || 0}
                    </TableCell>
                    <TableCell className="text-sm font-medium space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">EDIT</button>
                      <DeleteEventButton eventSlug={event.slug} eventTitle={event.title} />
                    </TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {events.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400">No events found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
