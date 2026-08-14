# 🚀 UniFetch Media — Backend

The backend of **UniFetch Media** handles authentication, media information, downloads, background processing, real-time progress, user data, notifications, and cloud storage.

## 🛠️ Tech Stack

| Technology            | Why I Use It                   |
| --------------------- | ------------------------------ |
| **Node.js**           | Run the backend server         |
| **Express**           | Build REST APIs                |
| **MongoDB**           | Store application data         |
| **Mongoose**          | Work with MongoDB using models |
| **Redis / Upstash**   | Cache and temporary data       |
| **JWT**               | User authentication            |
| **Google OAuth**      | Google login                   |
| **bcrypt**            | Password hashing               |
| **Socket.IO**         | Real-time download progress    |
| **yt-dlp**            | Extract and download media     |
| **FFmpeg**            | Process and convert media      |
| **FFprobe**           | Read media information         |
| **Cloudinary**        | Cloud media storage            |
| **Nodemailer / SMTP** | Send OTP and email messages    |

---

# 🧠 What the Backend Does

```text
                    USER
                      │
                      ▼
               React Frontend
                      │
                REST / Socket.IO
                      │
                      ▼
              ┌───────────────┐
              │ Express Server │
              └───────┬───────┘
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
   Authentication   Downloads      Users
        │             │             │
        ▼             ▼             ▼
      JWT          Queue/Worker   MongoDB
                      │
             ┌────────┴────────┐
             ▼                 ▼
           yt-dlp           FFmpeg
             │                 │
             └────────┬────────┘
                      ▼
                 Media File
                      │
                      ▼
                 Cloudinary
```

---

# 📥 Download Flow

The actual media download happens on the **server**, not inside the browser.

```text
Paste URL
    ↓
Get Media Information
    ↓
Select Quality / Format
    ↓
Create Download
    ↓
Download Queue
    ↓
Worker
    ↓
yt-dlp
    ↓
FFmpeg (if required)
    ↓
Upload / Save Media
    ↓
Download Completed
```

This allows downloads to continue on the server even when the user is not actively interacting with the download page.

---

# ⚡ Real-Time Progress

Socket.IO sends download progress from the backend to the correct user.

```text
yt-dlp / Worker
      │
      │ Progress
      ▼
Download Queue
      │
      ▼
 Socket.IO
      │
      ▼
 User Room
      │
      ▼
React Frontend
      │
      ▼
  Progress UI
```

Example:

```text
Starting
   ↓
12%
   ↓
35%
   ↓
67%
   ↓
91%
   ↓
100%
   ↓
Completed
```

---

# 🔐 Authentication Flow

```text
             Register / Login
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
     Email + OTP          Google OAuth
          │                   │
          └─────────┬─────────┘
                    ▼
                  JWT
                    │
                    ▼
            Protected Request
                    │
                    ▼
             Auth Middleware
                    │
                    ▼
                Controller
```

---

# 🗄️ Data Flow

```text
                     Backend
                        │
        ┌───────────────┼────────────────┐
        ▼               ▼                ▼
     MongoDB          Redis          Cloudinary
        │               │                │
        │               │                │
   User Data       Cache / OTP       Media Files
   Downloads       Temporary Data
   History
   Preferences
   Notifications
```

---

# 📁 Server Structure

```text
server/
│
├── src/
│   ├── config/          # Database, Redis & service config
│   ├── controllers/     # API request handling
│   ├── middlewares/     # Auth, validation & rate limiting
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── services/        # Business & external services
│   ├── queue/           # Download queue & worker
│   ├── utils/           # Helper functions
│   └── ...
│
├── bin/                 # yt-dlp / FFmpeg / FFprobe
├── scripts/             # Setup & utility scripts
├── server.js            # Server entry point
└── package.json
```

---

# 🔐 Environment Setup

Create:

```text
server/.env
```

Add the following variables:

```env
# Server
PORT=5000
FRONTEND_CLIENT_ID=http://localhost:5173

# Database
MONGO_URI=

# Authentication
JWT_SECRET=

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Email / SMTP
EMAIL_USER=
SMTP_HOST=
SMTP_PASS=
SMTP_PORT=
SMTP_USER=

# Storage
STORAGE_PROVIDER=cloudinary

# Redis
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# YouTube
YT_COOKIES_PATH=
```

---

# 🔑 How to Get Environment Variables

### MongoDB

```text
MongoDB Atlas
     ↓
Create Database
     ↓
Connect
     ↓
Drivers
     ↓
Copy Connection String
     ↓
MONGO_URI
```

Example:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/unifetch
```

### Google OAuth

```text
Google Cloud Console
        ↓
APIs & Services
        ↓
Credentials
        ↓
OAuth Client ID
        ↓
Web Application
        ↓
Client ID + Client Secret
```

Add:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

### Cloudinary

```text
Cloudinary
    ↓
Dashboard
    ↓
Account Details
    ↓
Cloud Name
API Key
API Secret
```

Add:

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Gmail / SMTP

For Gmail:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
EMAIL_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

Use a **Google App Password** instead of your normal Gmail password.

```text
Google Account
     ↓
Security
     ↓
2-Step Verification
     ↓
App Passwords
     ↓
Create Password
     ↓
SMTP_PASS
```

### Upstash Redis

```text
Upstash
   ↓
Create Redis Database
   ↓
Open Database
   ↓
Connect
   ↓
REST API
   ↓
REST URL + REST Token
```

Add:

```env
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

### YouTube Cookies

`YT_COOKIES_PATH` points to the cookies file used by the downloader.

Example:

```env
YT_COOKIES_PATH=./cookies.txt
```

Keep the file private.

```gitignore
.env
cookies.txt
*.cookies.txt
```

---

# 🚀 Getting Started

### 1. Clone

```bash
git clone https://github.com/MohammadMustafa23/UniFetch-Media.git
```

### 2. Open Server

```bash
cd UniFetch-Media/server
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure `.env`

Create:

```text
server/.env
```

and add all required values.

### 5. Start Server

```bash
npm run dev
```

or:

```bash
npm start
```

---

# 🧩 Backend Responsibilities

| Feature        | Server Handles                    |
| -------------- | --------------------------------- |
| Authentication | Register, Login, OTP, JWT, Google |
| Downloads      | Create and manage downloads       |
| Queue          | Process downloads in background   |
| Media          | yt-dlp, FFmpeg, FFprobe           |
| Progress       | Socket.IO events                  |
| History        | Store download history            |
| Notifications  | Download status notifications     |
| Preferences    | User download settings            |
| Storage        | Cloudinary / configured storage   |
| Database       | MongoDB                           |
| Cache          | Redis                             |
| Email          | OTP and system emails             |
| Security       | JWT, validation, rate limiting    |

---

# 🔄 Complete Backend Architecture

```text
                         ┌───────────────┐
                         │    Frontend   │
                         └───────┬───────┘
                                 │
                       REST + Socket.IO
                                 │
                                 ▼
                       ┌─────────────────┐
                       │ Express / Node  │
                       └────────┬────────┘
                                │
             ┌──────────────────┼──────────────────┐
             ▼                  ▼                  ▼
       Authentication       Downloads           Users
             │                  │                  │
             ▼                  ▼                  ▼
            JWT             Queue/Worker        MongoDB
                                │
                    ┌───────────┴───────────┐
                    ▼                       ▼
                  yt-dlp                  FFmpeg
                    │                       │
                    └───────────┬───────────┘
                                ▼
                           Media Storage
                                │
                         ┌──────┴──────┐
                         ▼             ▼
                     Cloudinary      Local
                         │
                         ▼
                       User

              Redis ──► Cache / OTP / Temporary Data

              Socket.IO ──► Live Progress
```

---

# ⚠️ Security

Never commit:

```text
.env
cookies.txt
API keys
JWT secrets
Cloudinary secrets
SMTP passwords
Redis tokens
Google client secrets
```

Use environment variables locally and configure them separately on your deployment platform.

---

# 🚧 Project Status

**UniFetch Media is currently under development.**

The backend continues to improve in:

* Download reliability
* Queue management
* Real-time progress
* Storage
* Performance
* Platform support
* Security

---

## 👨‍💻 Author

**Mohammad Mustafa**

B.Tech Computer Science & Engineering

[GitHub](https://github.com/MohammadMustafa23)
