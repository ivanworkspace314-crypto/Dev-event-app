export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-5xl font-bold mb-4 text-blue-400">Welcome to Dev Event App</h1>
        <p className="text-xl text-slate-300 mb-10">Event booking and management application</p>
        <nav className="space-y-4">
          <ul className="space-y-3">
            <li>
              <a 
                href="/home" 
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                View Events
              </a>
            </li>
            <li>
              <a 
                href="/create-event" 
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Create Event
              </a>
            </li>
            <li>
              <a 
                href="/admin" 
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Admin Dashboard
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
