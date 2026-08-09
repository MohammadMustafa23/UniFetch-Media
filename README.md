# UniFetch Media

> Download and manage media from YouTube, Instagram, and other platforms — all from one simple web app.

## About

UniFetch Media is a full-stack web app (MERN stack) that lets you download videos and audio using just a URL. Paste a link, preview the media, pick a quality, and the app downloads it in the background while you keep using the app. You get live progress updates, download history, notifications, and the option to save the file to your device or share it directly.

## Features

- **Multi-platform downloads** — Currently supports YouTube and Instagram, built so more platforms can be added later.
- **Media preview** — See thumbnail, title, uploader, duration, and available formats before downloading.
- **Custom download options** — Pick video/audio quality, format, and whether to download the thumbnail.
- **Background download queue** — Downloads run on the server, so you don't have to keep the tab open and waiting.
- **Live progress** — Real-time percentage, speed, and ETA over Socket.IO.
- **Download history** — Every download is saved with title, platform, size, and status. Mark favorites, clear history anytime.
- **Notifications** — Get notified when a download finishes, plus other account notifications.
- **Save & share** — Save completed files to your device, or share them directly (Web Share API on mobile).
- **Auto-detect & auto-download** — Optionally detect a copied link and start the download without manual steps.
- **Accounts** — Email/password signup with OTP verification, plus Google sign-in.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, React Router, Axios, Socket.IO Client |
| Backend | Node.js, Express.js, Socket.IO, JWT, bcrypt |
| Database | MongoDB (Mongoose) |
| Cache / Temp Data | Redis |
| Media Engine | yt-dlp, FFmpeg, FFprobe, Deno (for YouTube extraction) |
| Hosting | Vercel (frontend), Render (backend), Upstash (Redis) |

## How It Works

1. You paste a media URL (or it's auto-detected from your clipboard).
2. The backend detects the platform and asks yt-dlp for the media info.
3. You see a preview (thumbnail, title, formats) and pick a quality.
4. The download is added to a background queue instead of blocking the request.
5. A background worker runs yt-dlp (and FFmpeg if needed) to fetch and process the file.
6. Progress updates are pushed to your browser in real time over Socket.IO.
7. Once done, you can play, save to device, share, or delete the file.

## Architecture

Instead of one giant diagram, here's what each part does:

- **Client (React)** — The UI. Talks to the backend over REST for normal requests, and over Socket.IO for live updates.
- **API Server (Node/Express)** — Handles auth, download requests, history, preferences, and notifications.
- **MongoDB** — Stores permanent data: users, downloads, history, preferences, notifications.
- **Redis** — Stores short-lived data: cached user info, OTPs, and cache invalidation for downloads.
- **Download Queue + Worker** — Picks up a queued download and runs it in the background with yt-dlp/FFmpeg, so the API never freezes while a file downloads.
- **Socket.IO** — Sends progress from the worker back to the exact user who started the download (each user gets a private room, so no one sees another user's progress).

```
Client (React)
   |
   |  REST API                Socket.IO (live updates)
   v                                ^
API Server (Node/Express) ----------|
   |
   |------> MongoDB   (users, downloads, history, notifications)
   |------> Redis     (cache, OTP, temp data)
   |
   v
Download Queue --> Worker --> yt-dlp + FFmpeg --> Media File
```

## Project Structure

```
UniFetch-Media/
├── client/            # React frontend
│   └── src/
│       ├── Components/
│       ├── Pages/
│       ├── Services/
│       └── socket/
│
├── server/            # Node backend
│   ├── bin/           # ffmpeg, ffprobe, yt-dlp binaries
│   └── src/
│       ├── config/
│       ├── models/
│       ├── routes/
│       ├── controllers/
│       ├── services/
│       └── queue/
│
└── README.md
```

## Environment Variables

Create a `.env` file inside `server/`:

```
PORT=
MONGODB_URI=
REDIS_URL=
JWT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
FRONTEND_URL=
```

Never commit `.env` or `youtube_cookies.txt` to GitHub.

## Getting Started

### Backend

```bash
git clone https://github.com/MohammadMustafa23/UniFetch-Media.git
cd UniFetch-Media/server
npm install
npm run install-deno
chmod +x bin/ffmpeg bin/ffprobe bin/yt-dlp
npm start
```

### Frontend

```bash
cd ../client
npm install
npm run dev
```

## Known Limitations

- **YouTube** — YouTube regularly changes its anti-bot system, so extraction can occasionally break or need updated cookies. Not every video is guaranteed to work.
- **Large file downloads** — "Save to Device" goes through the browser, so it depends on your network, browser, and free storage space.

## Legal Note

UniFetch Media is meant for personal and educational use. Only download content you have the right to use, and always follow the source platform's terms of service.

## Author

**Mohammad Mustafa**
Repo: https://github.com/MohammadMustafa23/UniFetch-Media
