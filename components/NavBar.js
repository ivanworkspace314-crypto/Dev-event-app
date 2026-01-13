import Link from 'next/link';

export default function NavBar() {
  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* App Icon/Logo */}
          <Link href="/home" className="text-2xl font-bold hover:text-gray-300 transition-colors">
            DevEvent
          </Link>
          
          {/* Navigation Items */}
          <div className="flex space-x-8">
            <Link 
              href="/home" 
              className="hover:text-gray-300 transition-colors font-medium"
            >
              Home
            </Link>
            <Link 
              href="/admin" 
              className="hover:text-gray-300 transition-colors font-medium"
            >
              Events
            </Link>
            <Link 
              href="/create-event" 
              className="hover:text-gray-300 transition-colors font-medium"
            >
              Create Event
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
