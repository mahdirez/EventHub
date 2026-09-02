# EventHub

Plan events, share invite links, and track RSVPs — with Going, Maybe, and Not going counts in real time.

EventHub is a full-stack event management app built with **Next.js 16**, **Neon Auth**, and **Neon Postgres**. Organizers create events, generate a unique invite link, and monitor attendee responses from a dashboard. Guests RSVP through a public link without creating an account.

---

## ✨ Features

- 🗓️ **Event management** — create, edit, and delete events with title, date, location, description, and optional capacity
- 🔗 **Invite links** — generate a unique token-based link per event; copy to clipboard with one click
- ✅ **Public RSVP** — guests respond as Going, Maybe, or Not going without signing in
- 🔁 **RSVP pre-fill** — returning guests see their previous response pre-filled via email lookup and localStorage
- 🎟️ **Capacity limits** — optional max capacity; only Going responses count toward the limit
- 📤 **Attendee export** — download RSVPs as a UTF-8 CSV (owner-only)
- 📊 **Dashboard** — view all your events with RSVP totals at a glance
- 🌍 **i18n** — English and Persian (FA) with RTL layout and Vazirmatn font for Persian
- 🌗 **Theme** — light, dark, and system preference via header toggle
- 🔐 **Auth** — email OTP sign-in/sign-up powered by Neon Auth

---

## 🧱 Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Database | Neon Postgres + Prisma 7 |
| Auth | Neon Auth (`@neondatabase/auth`) |
| UI | shadcn/ui, Tailwind CSS 4, Radix UI, Lucide icons |
| Validation | Zod 4 |
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

---

## 📁 Project Structure

```
app/
  dashboard/          # Organizer dashboard
  events/             # Create, view, edit events
  invite/[token]/     # Public RSVP page
  auth/[path]/        # Neon Auth pages (sign-in, sign-up, …)
  account/[path]/     # Account settings
  api/
    auth/[...path]/   # Neon Auth API handler
    events/.../export # CSV export endpoint

components/           # UI components (forms, dashboard, header, …)
lib/
  actions/            # Server actions (CRUD, RSVP, invites)
  auth/                # Neon Auth client/server setup
  i18n/                # Locale dictionaries and helpers
  validations/         # Zod schemas
prisma/
  schema.prisma        # Database schema
  migrations/           # SQL migrations
proxy.ts               # Route protection for /dashboard and /events
```

---

## 🔄 How It Works

**Organizer flow**
1. Sign up or sign in via email OTP
2. Create an event from the dashboard
3. Open the event detail page and generate an invite link
4. Share the link with guests
5. Track RSVPs and export attendees as CSV

**Guest flow**
1. Open the invite link (`/invite/{token}`)
2. Submit name, email, and attendance status
3. Update the response anytime using the same email

**Route protection**
`proxy.ts` guards `/dashboard` and `/events` routes. Unauthenticated users are redirected to `/auth/sign-in`. Public invite pages and the home page remain open.

---

## 🌍 Internationalization

- Supported locales: **English (`en`)** and **Persian (`fa`)**
- Language preference is stored in the `eventhub-locale` cookie
- Persian uses RTL layout and the **Vazirmatn** font; English uses **Geist**
- Toggle language from the header

To add or edit translations, update the dictionaries in `lib/i18n/locales/`.

---

## 🗄️ Database Schema

```
Event          — owned by a user; has optional capacity
EventInvite    — one invite link per event (unique token)
EventRsvp      — guest responses (unique per event + normalized email)
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
- Form validation error messages are currently in English
- After schema changes, always run `npx prisma migrate deploy` and `npx prisma generate`
