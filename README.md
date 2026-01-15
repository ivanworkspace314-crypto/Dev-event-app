**Dev Event App**
- Next.js 16 App Router project for browsing, creating, and managing developer events.
- Uses MongoDB via Mongoose for persistence and Cloudinary for image uploads.
- Server Actions handle CRUD (create/edit/delete) and bookings with cache revalidation for `/home`, `/admin`, and event detail pages.
- Styled with Tailwind; includes basic admin table, event cards, and booking flows.

**Tech Stack**
- Next.js 16 (App Router, Server Actions), React 19, Tailwind CSS 4
- MongoDB + Mongoose
- Cloudinary for image storage

**Getting Started**
- Install deps: `npm install`
- Create `.env.local` with the vars below.
- Run dev server: `npm run dev` (defaults to http://localhost:3000).

**Environment Variables (.env.local)**
- `MONGODB_URI` – MongoDB connection string
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` – Cloudinary cloud name (public)
- `CLOUDINARY_API_KEY` – Cloudinary API key
- `CLOUDINARY_API_SECRET` – Cloudinary API secret

**Useful Scripts**
- `npm run dev` – Start dev server
- `npm run build` – Build for production
- `npm run start` – Run the production build
- `npm run lint` – Lint the codebase

**Notable Implementation Details**
- Server Actions in `app/actions.js` import `revalidatePath` to refresh cached pages after creates/edits/deletes/bookings.
- Body size limit for Server Actions is set in `next.config.mjs` under `serverActions.bodySizeLimit` (50mb by default).
- Image uploads convert the selected file to base64 and send it to Cloudinary; only PNG/JPG are accepted in the UI.

**Data Models**
- `Event`: title, slug, description, image-path, venue, dateTime, audience, mode, agenda, organizer, tags.
- `Booking`: eventId, email, timestamps.

**Deployment Notes**
- Ensure env vars are configured in your hosting platform.
- Rebuild/redeploy after config changes (e.g., body size limit or env updates).
