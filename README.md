# NexaMusic

A small music streaming app I built to learn the Next.js App Router properly, with a real database and a real audio player instead of yet another todo app. No sign up required to listen, tracks are served straight from Google Drive so there's no storage bill, and there's a lightweight admin panel to manage the catalog.

Built with Next.js 14, TypeScript, MongoDB Atlas, Zustand, and Tailwind CSS. Deployed on Vercel.

## Features

- Browse, search, and play tracks with a persistent bottom player
- Keyboard shortcuts for play/pause, seek, mute, and next/previous
- Liked tracks and recently played, stored locally
- Admin panel to add, edit, feature, and soft delete tracks
- Play count analytics and a genre breakdown chart
- Audio files hosted on Google Drive instead of paid object storage

## Project structure

```
nexamusic/
├── app/                    Next.js App Router pages and API routes
│   ├── api/tracks/         CRUD for tracks, play counts, featured, search
│   └── api/admin/login/    Admin login, issues a JWT cookie
├── components/
│   ├── ui/                 EqBars, Waveform, GenreBadge, Skeleton, etc.
│   ├── layout/              Navbar
│   ├── hero/
│   ├── tracks/              TrackCard, TrackGrid, HorizRow, RecentRow, LikedRow
│   ├── player/               Player, PlayerProgress, NowPlaying
│   └── admin/                 AdminLogin, AdminPanel, Dashboard, TrackForm, Analytics
├── hooks/
│   ├── useAudio.ts          Core audio engine
│   ├── useKeyboard.ts       Global keyboard shortcuts
│   └── useLocalStorage.ts    Type safe localStorage wrapper
├── store/usePlayerStore.ts  Zustand global player state
├── lib/
│   ├── mongodb.ts           Mongoose connection
│   ├── drive.ts              Google Drive URL helpers
│   └── jwt.ts                 JWT sign and verify (jose)
├── models/                   Track and Admin Mongoose schemas
├── types/index.ts            Shared TypeScript interfaces
├── scripts/                  seed admin, seed sample tracks
└── middleware.ts             Guards /admin routes with the JWT cookie
```

## Prerequisites

- Node.js 20 or newer
- npm or pnpm
- A free MongoDB Atlas M0 cluster
- A Google account with some free Drive storage

## Getting started

Clone the repo and install dependencies:

```bash
git clone https://github.com/adityaparmar25/nexamusic.git
cd nexamusic
npm install
```

Create a `.env.local` file in the root:

```env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/nexamusic

NEXTAUTH_SECRET=generate this with openssl rand base64 32
NEXTAUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REFRESH_TOKEN=
GOOGLE_DRIVE_FOLDER_ID=

ADMIN_SEED_EMAIL=you@example.com
ADMIN_SEED_PASSWORD=choose something strong, this seeds your real admin account
```

Seed the database, then run the dev server:

```bash
npm run seed
npm run dev
```

The app runs at `http://localhost:3000`.

## MongoDB Atlas setup

1. Create a free M0 cluster at cloud.mongodb.com
2. Under Database Access, add a user with readWrite on the `nexamusic` database
3. Under Network Access, allow `0.0.0.0/0` for local development (lock this down to Vercel's IP ranges once you deploy)
4. Copy the connection string from Connect > Drivers and drop it into `MONGODB_URI`

## Google Drive API setup

This project streams audio directly from Google Drive rather than paying for object storage, which is overkill for a personal project like this.

1. Create a project in the Google Cloud console and enable the Drive API
2. Create an OAuth 2.0 client (type: Web application), with `https://developers.google.com/oauthplayground` as an authorized redirect URI
3. Open the OAuth Playground, use your own client ID and secret under settings, and authorize the `drive.readonly` scope
4. Exchange the authorization code for tokens and copy the refresh token into `.env.local`
5. Create a folder in your Drive named `NexaMusic`, share it as "anyone with the link can view", and copy the folder ID from the URL into `GOOGLE_DRIVE_FOLDER_ID`

To add a track: upload the file to that folder, set sharing to anyone with the link, grab the file ID from the share URL, and paste it into the admin panel when adding a track.

## A note on the audio bug

Early on, audio would load but never actually play, with no error in the console. The cause was `crossOrigin="anonymous"` set on the `<audio>` element in `useAudio.ts`. Google Drive and other external audio hosts don't send CORS headers, so the browser was silently dropping playback. Removing that attribute fixed it. Only set `crossOrigin` if you control the server and it explicitly sends CORS headers.

## Keyboard shortcuts

| Key | Action |
|-----|--------|
| Space | Play / pause |
| Left / Right arrow | Seek 10 seconds |
| M | Mute / unmute |
| N | Next track |
| P | Previous track |
| Esc | Close now playing |
| / | Toggle shortcut list |

## Admin panel

Log in from the Admin button in the navbar using the email and password you set in `ADMIN_SEED_EMAIL` and `ADMIN_SEED_PASSWORD`. From there you can add, edit, and soft delete tracks, toggle which ones are featured, and check play count and genre stats.

Passwords are hashed with bcrypt, and the session is a JWT stored in an httpOnly cookie, not localStorage. Admin routes are protected by middleware, and the login endpoint is rate limited.

## Deploying to Vercel

Push the repo to GitHub, then import it into Vercel. Framework detection should pick up Next.js automatically. Add every variable from `.env.local` in the Vercel project settings, update `NEXTAUTH_URL` to your production domain once you have one, and run the seed script again pointing at your Atlas cluster so the production database has an admin user.

## Tech stack

Next.js 14, TypeScript, Tailwind CSS, Zustand, MongoDB Atlas with Mongoose, JWT auth via jose, Google Drive API for storage, deployed on Vercel.

## License

MIT