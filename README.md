# EventHub

Plan events, share invite links, track RSVPs, and browse public events — with Going, Maybe, and Not going counts in real time.

EventHub is a full-stack event management app built with **Next.js 16**, **Neon Auth**, and **Neon Postgres**. Organizers create private or public events, generate invite links, and monitor responses from a dashboard. Guests RSVP through a public link without creating an account. Signed-in users can explore public events, save favorites, and see events they RSVP’d to on **My events**.

---

## ✨ Features

### Organizer (signed in)

- 🗓️ **Event management** — create, edit, and delete events with title, date, location, city, description, optional capacity, and cover image URL
- 🔒 **Visibility** — **private** (invite-only discovery) or **public** (listed in explore; requires category and slug)
- 🔗 **Invite links** — unique token-based link per event; copy to clipboard with one click
- 📊 **Dashboard** — paginated list of your events with RSVP totals
- 📤 **Attendee export** — download RSVPs as UTF-8 CSV (owner-only)

### Guests & discovery (mostly no account)

- ✅ **Public RSVP** — respond as Going, Maybe, or Not going via `/invite/{token}` without signing in
- 🔁 **RSVP pre-fill** — returning guests see a previous response via email lookup and localStorage
- 🎟️ **Capacity limits** — optional max; only **Going** counts toward the limit
- 🔍 **Explore** — search and filter public events with pagination (`/explore`)
- 🏷️ **Categories** — browse public events by category (`/categories`, `/categories/{slug}`)
- 📄 **Public event pages** — `/explore/{slug}` for published public events
- ❤️ **Favorites** — signed-in users can save public events
- 📋 **My events** — favorites plus RSVPs matched to the signed-in user’s email (`/my-events`)

### App-wide

- 🌍 **i18n** — English and Persian (FA) with RTL layout and Vazirmatn for Persian
- 🌗 **Theme** — light, dark, and system via header toggle
- 🔐 **Auth** — email OTP sign-in/sign-up (Neon Auth)

---

## 🧱 Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Database | Neon Postgres + Prisma 7 |
| Auth | Neon Auth (`@neondatabase/auth`) |
| UI | shadcn/ui, Tailwind CSS 4, Radix UI, Lucide icons |
| Validation | Zod 4 |
| Tests | Vitest (unit tests in `lib/`) |
| Toasts | Sonner (via Neon Auth UI provider) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- A [Neon](https://neon.tech) account with a Postgres database
- Neon Auth enabled on your Neon project

### 1. Clone and install

```bash
git clone <your-repo-url>
cd EventHub
npm install
```

### 2. Environment variables

Create a `.env.local` file in the project root:

```env
# Neon Postgres connection string
DATABASE_URL="postgresql://..."

# Neon Auth — from your Neon project Auth settings
NEON_AUTH_BASE_URL="https://..."
NEON_AUTH_COOKIE_SECRET="your-random-secret-at-least-32-chars"
```

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | Postgres connection string from Neon |
| `NEON_AUTH_BASE_URL` | Base URL for your Neon Auth instance |
| `NEON_AUTH_COOKIE_SECRET` | Secret used to sign auth cookies (32+ random characters) |

### 3. Run database migrations

```bash
npx prisma migrate deploy
npx prisma generate
```

For local development you can also use:

```bash
npx prisma migrate dev
```

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 📜 Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run Vitest unit tests |

---

## 📁 Project Structure

```
app/
  page.tsx            # Home (discovery landing)
  explore/            # Public event search and detail by slug
  categories/         # Category browse
  my-events/          # Favorites + RSVPs for signed-in user
  dashboard/          # Organizer dashboard
  events/             # Create, view, edit events (organizer)
  invite/[token]/     # Public RSVP page
  auth/[path]/        # Neon Auth pages (sign-in, sign-up, …)
  account/[path]/     # Account settings
  api/
    auth/[...path]/   # Neon Auth API handler
    events/.../export # CSV export endpoint

components/           # UI (forms, dashboard, layout, design-system)
features/discovery/   # Home, grids, my-events sections
lib/
  actions/            # Server actions (events, RSVP, favorites)
  services/           # Domain logic (events, RSVP, discovery, favorites)
  auth/               # Neon Auth client/server setup
  i18n/               # Locale dictionaries and helpers
  validations/        # Zod schemas
prisma/
  schema.prisma       # Database schema
  migrations/         # SQL migrations
proxy.ts              # Route protection for /dashboard and /events
```

---

## 🔄 How It Works

**Organizer flow**
1. Sign up or sign in via email OTP
2. Create an event (private or public) from the dashboard or `/events/new`
3. Open the event detail page and generate an invite link
4. Share the link with guests (public events also appear in explore when configured)
5. Track RSVPs and export attendees as CSV

**Guest flow**
1. Open the invite link (`/invite/{token}`)
2. Submit name, email, and attendance status
3. Update the response anytime using the same email

**Signed-in discovery flow**
1. Browse home, explore, or categories
2. Save favorites on public events
3. View saved events and past RSVPs on **My events** (RSVPs linked by account email)

**Route protection**
`proxy.ts` guards `/dashboard` and `/events`. Unauthenticated users are redirected to `/auth/sign-in`. Public routes include home, explore, categories, invite links, and auth pages. `/my-events` shows a sign-in prompt when logged out.

---

## 🌍 Internationalization

- Supported locales: **English (`en`)** and **Persian (`fa`)**
- Language preference is stored in the `eventhub-locale` cookie
- Persian uses RTL layout and the **Vazirmatn** font; English uses **Geist**
- Toggle language from the header
- App form validation messages use the active locale via `lib/i18n/locales/`

To add or edit translations, update the dictionaries in `lib/i18n/locales/`.

---

## 🗄️ Database Schema

```
Category       — slug + sort order; linked to public events
Event          — owner, details, visibility (private|public), category, slug, cover
EventInvite    — one invite link per event (unique token)
EventRsvp      — guest responses (unique per event + normalized email)
EventFavorite  — user saves on public events (unique per user + event)
```

RSVP statuses: `going`, `maybe`, `not_going`.

---

## ☁️ Deployment

1. Set environment variables on your hosting platform
2. Run migrations against the production database:
   ```bash
   npx prisma migrate deploy
   ```
3. Build and start:
   ```bash
   npm run build
   npm run start
   ```

Ensure your Neon Auth redirect URLs include your production domain.

---

## 📝 Notes

- Neon Auth UI pages (sign-in, account settings) are provided by `@neondatabase/auth` and are not fully translated
- When the database has no public events yet, the home page may show placeholder discovery data in development
- After schema changes, always run `npx prisma migrate deploy` and `npx prisma generate`
