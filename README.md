# 🎵 NexaMusic

> Next-generation music streaming platform — cinematic, immersive, zero sign-up.

Built with **Next.js 14 · TypeScript · MongoDB Atlas · Zustand · Tailwind CSS**  
Served from **Google Drive** (15 GB free storage) · Deployed on **Vercel**

---

## Project Structure

```
nexamusic/
├── app/                    # Next.js 14 App Router
│   ├── globals.css         # Tailwind base + all keyframes
│   ├── layout.tsx          # Root layout + metadata
│   ├── page.tsx            # Home page (orchestrates all sections)
│   ├── loading.tsx         # Root loading skeleton
│   ├── error.tsx           # Global error boundary
│   ├── not-found.tsx       # 404 page
│   └── api/
│       ├── tracks/route.ts          # GET list, POST create
│       ├── tracks/[id]/route.ts     # GET, PUT, DELETE
│       ├── tracks/[id]/play/route.ts# POST increment play count
│       ├── tracks/featured/route.ts # GET featured tracks
│       ├── search/route.ts          # GET fuzzy search
│       └── admin/login/route.ts     # POST login → JWT cookie
│
├── components/
│   ├── ui/                 # EqBars · Waveform · GenreBadge · Skeleton · Notification · KeyboardHUD
│   ├── layout/Navbar.tsx
│   ├── hero/Hero.tsx
│   ├── tracks/             # TrackCard · TrackGrid · HorizRow · RecentRow · LikedRow
│   ├── player/             # Player · PlayerProgress · NowPlaying
│   └── admin/              # AdminLogin · AdminPanel · Dashboard · TrackForm · Analytics
│
├── hooks/
│   ├── useAudio.ts         # Core audio engine (fixes silent audio)
│   ├── useKeyboard.ts      # Global keyboard shortcuts
│   └── useLocalStorage.ts  # Type-safe localStorage hook
│
├── store/
│   └── usePlayerStore.ts   # Zustand global player state
│
├── lib/
│   ├── mongodb.ts          # Mongoose singleton connection
│   ├── drive.ts            # Google Drive URL helpers
│   └── jwt.ts              # JWT sign/verify (jose)
│
├── models/
│   ├── Track.ts            # Mongoose Track schema
│   └── Admin.ts            # Mongoose Admin schema
│
├── types/index.ts          # All shared TypeScript interfaces
├── constants/              # colors · genres · sampleTracks
├── scripts/
│   ├── seed-admin.ts       # Create first admin user
│   └── seed-tracks.ts      # Seed sample tracks
│
├── middleware.ts            # JWT guard for /admin routes
├── tailwind.config.ts
├── next.config.js
├── vercel.json
└── tsconfig.json
```

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 20.x |
| npm / pnpm | latest |
| MongoDB Atlas | Free M0 cluster |
| Google Drive | Any Google account |

---

## 1 — Local Development Setup

### 1.1 Clone & Install

```bash
git clone https://github.com/yourname/nexamusic.git
cd nexamusic
npm install
```

### 1.2 Create `.env.local`

```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/nexamusic

# JWT secret — generate with: openssl rand -base64 32
NEXTAUTH_SECRET=your-random-32-char-string-here
NEXTAUTH_URL=http://localhost:3000

# Google Drive API (see Section 3)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REFRESH_TOKEN=
GOOGLE_DRIVE_FOLDER_ID=

# Admin seed credentials
ADMIN_SEED_EMAIL=admin@nexamusic.com
ADMIN_SEED_PASSWORD=YourStrongPassword123!
```

### 1.3 Seed the database

```bash
# Create admin user
npm run seed

# (Optional) Seed sample tracks
npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/seed-tracks.ts
```

### 1.4 Run dev server

```bash
npm run dev
# → http://localhost:3000
```

---

## 2 — MongoDB Atlas Setup

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) → Create free **M0** cluster
2. **Database Access** → Add user with `readWrite` on `nexamusic` database
3. **Network Access** → Add IP `0.0.0.0/0` (allow all) for development  
   *(In production: add Vercel IP ranges only)*
4. Click **Connect → Drivers** → copy the connection string
5. Paste into `MONGODB_URI` replacing `<user>` and `<pass>`

---

## 3 — Google Drive API Setup

### 3.1 Create credentials

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project (e.g. "NexaMusic")
3. **APIs & Services** → Enable **Google Drive API**
4. **Credentials** → Create **OAuth 2.0 Client ID** (type: Web application)
5. Add authorized redirect URI: `https://developers.google.com/oauthplayground`
6. Copy **Client ID** and **Client Secret** to `.env.local`

### 3.2 Get Refresh Token

1. Open [OAuth Playground](https://developers.google.com/oauthplayground)
2. Click ⚙️ (settings) → check **Use your own OAuth credentials** → paste Client ID & Secret
3. Scope: `https://www.googleapis.com/auth/drive.readonly`
4. Click **Authorize APIs** → sign in → **Exchange authorization code for tokens**
5. Copy **Refresh Token** to `.env.local`

### 3.3 Create the Drive folder

1. Create a folder named `NexaMusic` in your Google Drive
2. Right-click → **Get link** → copy the folder ID (the part after `/folders/`)
3. Paste into `GOOGLE_DRIVE_FOLDER_ID`

### 3.4 Upload a track

1. Upload an MP3/WAV to the `NexaMusic` folder
2. Right-click → **Share** → **Anyone with the link can view**
3. Copy the link → extract the file ID (the long string in the URL)
4. In Admin Panel → paste the file ID

---

## 4 — Audio Source Fix (Important)

The previous build was silent because of `crossOrigin="anonymous"` on the `<audio>` element.

**Root cause:** External MP3 hosts (SoundHelix, Google Drive download links) do NOT send CORS headers. The browser silently blocked audio loading.

**Fix applied in `hooks/useAudio.ts`:**
```typescript
// ❌ OLD (broken — CORS block → silent audio)
const audio = new Audio();
audio.crossOrigin = "anonymous";   // ← this was killing playback

// ✅ NEW (correct)
const audio = new Audio();
// No crossOrigin set. Works for all external streams.
// Only set crossOrigin if YOUR server explicitly sends CORS headers.
```

**For Google Drive audio streaming:**
```
// Stream URL format (no crossOrigin needed)
https://drive.google.com/uc?export=download&id=FILE_ID
```

---

## 5 — Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play / Pause |
| `←` / `→` | Seek ±10 seconds |
| `M` | Mute / Unmute |
| `N` | Next track |
| `P` | Previous track |
| `Esc` | Close Now Playing |
| `/` | Toggle shortcut HUD |

---

## 6 — Admin Panel

1. Click **Admin** button in the navbar
2. Login: `admin@nexamusic.com` / `admin123` *(demo)*  
   *(In production, use the credentials from your `.env.local` seed)*
3. Features:
   - Add / Edit / Soft-delete tracks
   - Toggle featured status (★)
   - Restore deactivated tracks
   - Play count analytics chart
   - Genre breakdown stats

---

## 7 — Deploying to Vercel

### 7.1 Push to GitHub

```bash
git init
git add .
git commit -m "feat: initial NexaMusic"
git remote add origin https://github.com/yourname/nexamusic.git
git push -u origin main
```

### 7.2 Import to Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Framework: **Next.js** (auto-detected)
4. Add all environment variables from `.env.local`
5. Click **Deploy**

### 7.3 After deploy

```bash
# Update NEXTAUTH_URL to your production domain
NEXTAUTH_URL=https://nexamusic.vercel.app

# Re-run seed pointing to Atlas
npm run seed
```

---

## 8 — Performance Targets

| Metric | Target | Status |
|--------|--------|--------|
| LCP | < 2.5s | ✅ Images lazy-loaded, fonts preloaded |
| FID | < 100ms | ✅ No heavy JS on main thread |
| CLS | < 0.1 | ✅ Fixed dimensions on all images |
| Lighthouse Score | ≥ 90 | ✅ SSR, semantic HTML, ARIA labels |
| Audio start | < 1.5s | ✅ `preload="metadata"`, no CORS block |

---

## 9 — Security Checklist

- [x] Passwords hashed with `bcryptjs` (12 salt rounds)
- [x] JWT stored in `httpOnly` cookie (not localStorage)
- [x] Admin routes protected by `middleware.ts`
- [x] Rate limiting on login endpoint (5 req/min per IP)
- [x] Input validation on all API routes
- [x] Soft delete (tracks never permanently erased)
- [x] Environment variables never committed to git
- [x] CSP and security headers in `vercel.json`
- [x] `NEXTAUTH_SECRET` randomly generated (not hardcoded)

---

## 10 — Adding More Tracks (Production Flow)

1. Upload MP3 to Google Drive `NexaMusic` folder
2. Set sharing to **Anyone with the link**
3. Copy the **file ID** from the share URL
4. Open Admin Panel → **Add Track**
5. Paste file ID → fill metadata → **Publish**
6. Track is live instantly — no restart needed

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v3 |
| State | Zustand 4 |
| Database | MongoDB Atlas (free M0) |
| ODM | Mongoose 8 |
| Auth | JWT via `jose` |
| Storage | Google Drive API v3 |
| Deployment | Vercel (Hobby free) |
| Icons | Lucide React |
| Fonts | Inter (Google Fonts) |

---

## License

MIT © NexaMusic