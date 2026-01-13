export default function Home() {
  return (
    <div>
      <h1>Welcome to Dev Event App</h1>
      <p>Event booking and management application</p>
      <nav>
        <ul>
          <li><a href="/home">View Events</a></li>
          <li><a href="/create-event">Create Event</a></li>
          <li><a href="/admin">Admin Dashboard</a></li>
        </ul>
      </nav>
    </div>
  );
}
