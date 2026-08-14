# 🚀 UniFetch Media — Frontend

The frontend of **UniFetch Media**, a web application for downloading and managing media from supported platforms.

It provides a modern dashboard where users can **paste a URL, preview media, choose quality, start downloads, track progress, and manage downloaded media**.

---

## ✨ What I Built

* 🔗 URL-based media download
* 👀 Media preview before download
* 🎞️ Video & audio format selection
* 📊 Real-time download progress
* 📥 Download queue
* 📜 Download history
* ⭐ Favorites
* 🔔 Notifications
* ⚙️ Download preferences
* 📦 Storage information
* 📈 Download analytics
* ▶️ Play downloaded media
* 💾 Save media to device
* 📤 Share media
* 🔄 Retry failed downloads
* 📋 Auto URL detection
* ⚡ Auto-download option
* 🔐 Protected user pages
* 🔑 Email & Google authentication
* 📱 Responsive interface

---

# 🛠️ Tech Stack

| Technology           | Why I Used It                          |
| -------------------- | -------------------------------------- |
| **React 19**         | Build reusable and interactive UI      |
| **Vite**             | Fast development and production builds |
| **React Router 7**   | Handle application navigation          |
| **Axios**            | Connect frontend with backend APIs     |
| **Socket.IO Client** | Receive live download progress         |
| **GSAP**             | Smooth UI animations                   |
| **Recharts**         | Display download analytics             |
| **Lucide React**     | Clean and consistent icons             |
| **Google OAuth**     | Google login                           |
| **Sonner**           | Simple user notifications              |
| **Lodash Debounce**  | Reduce unnecessary repeated actions    |

These are the libraries currently used by the frontend package.

---

# 🧩 Frontend Architecture

```text
                    ┌─────────────────┐
                    │      User       │
                    └────────┬────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │    React Frontend   │
                  │                     │
                  │ Pages + Components  │
                  └──────────┬──────────┘
                             │
                 ┌───────────┴───────────┐
                 ▼                       ▼
          ┌──────────────┐       ┌──────────────┐
          │ REST APIs    │       │   Socket.IO  │
          │   Axios      │       │ Live Updates │
          └──────┬───────┘       └──────┬───────┘
                 │                      │
                 └──────────┬───────────┘
                            ▼
                   ┌────────────────┐
                   │ Backend Server │
                   └────────────────┘
```

---

# 📥 Download Experience

The main frontend flow is:

```text
Paste URL
    │
    ▼
Detect URL / Platform
    │
    ▼
Get Media Information
    │
    ▼
Show Preview
    │
    ▼
Choose Quality / Format
    │
    ▼
Start Download
    │
    ▼
Download Queue
    │
    ▼
Live Progress
    │
    ▼
Completed
    │
    ├── ▶ Play
    ├── 💾 Save
    ├── 📤 Share
    └── 🗑️ Delete
```

The frontend does **not** perform the actual media processing itself. It communicates with the backend and displays the download state and results.

---

# ⚡ Real-Time Progress

Socket.IO is used to update the UI while a download is running.

```text
                  Backend Worker
                       │
                       │ Progress
                       ▼
                  ┌───────────┐
                  │ Socket.IO │
                  └─────┬─────┘
                        │
                        ▼
                 React Frontend
                        │
              ┌─────────┼─────────┐
              ▼         ▼         ▼
             25%       60%       100%
          Downloading Downloading Completed
```

This means the user can see download progress without refreshing the page.

The frontend has a dedicated `socket` module for this connection.

---

# 🔐 Authentication

```text
             User
              │
       ┌──────┴──────┐
       ▼             ▼
   Email Login    Google Login
       │             │
       └──────┬──────┘
              ▼
        Authentication
              │
              ▼
       Protected Routes
              │
              ▼
          Dashboard
```

The frontend includes authentication pages and route protection using `ProtectedRoute` and `PublicRoute`.

---

# 📊 Dashboard

The dashboard brings the main media-management features together:

```text
                    Dashboard
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
     Downloads        Queue          History
        │               │               │
        └───────────────┼───────────────┘
                        │
              ┌─────────┴─────────┐
              ▼                   ▼
          Favorites           Analytics
```

---

# 🧱 Component Structure

The frontend uses feature-based components instead of putting everything into one large component.

```text
src/
│
├── Animation/       # UI animations
│
├── Components/
│   ├── Analytics/       # Download analytics
│   ├── AuthFrontedPage/ # Authentication UI
│   ├── Dashboard/      # Dashboard components
│   ├── Downloads/      # Download UI
│   ├── Favorites/      # Favorite media
│   ├── HeroSectionCTA/ # Landing page sections
│   ├── History/        # Download history
│   ├── Queue/          # Download queue
│   ├── Setting/        # User preferences
│   └── Storage/        # Storage information
│
├── Pages/
│   ├── AuthPage.jsx
│   ├── Dashboard.jsx
│   └── HeroPageCTA.jsx
│
├── service/            # API communication
├── socket/             # Socket.IO connection
├── security/           # Route protection
├── common/             # Shared UI logic
├── utils/              # Helper functions
├── assets/             # Images and assets
│
├── App.jsx
├── App.css
└── main.jsx
```

This structure keeps features separated and makes the frontend easier to maintain.

---

# 🌐 API Service Layer

API calls are separated into dedicated service files:

```text
service/
├── axios.js
├── auth.service.js
├── download.service.js
├── history.service.js
├── notification.service.js
├── preferences.service.js
├── storage.service.js
├── analytics.service.js
└── videoFunction.service.js
```

This keeps API logic separate from UI components.

---

# 🔄 Frontend ↔ Backend

```text
┌─────────────────────┐
│    React Frontend   │
│                     │
│ Dashboard           │
│ Downloads           │
│ Queue               │
│ History             │
│ Settings            │
└──────────┬──────────┘
           │
     Axios + Socket.IO
           │
           ▼
┌─────────────────────┐
│    Backend API      │
│                     │
│ Authentication      │
│ Downloads           │
│ Queue / Worker      │
│ Media Processing    │
│ Database             │
└─────────────────────┘
```

The frontend focuses on the **user interface, navigation, API communication, and real-time UI updates**.

---

# 🎨 UI & Experience

The frontend focuses on:

* Clean dashboard design
* Responsive layouts
* Reusable components
* Loading states
* Download progress states
* Error handling
* Toast notifications
* Smooth animations
* Simple media management

GSAP is used for animations, while Lucide React provides the application's icon system.

---

# ⚙️ Environment Variables

Create a `.env` file in:

```text
client/unifetch-media/
```

Example:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

For production, `VITE_API_URL` should point to the deployed backend API.

> Never put private backend secrets inside frontend environment variables.

---

# 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/MohammadMustafa23/UniFetch-Media.git
```

### 2. Open the frontend

```bash
cd UniFetch-Media/client/unifetch-media
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start development server

```bash
npm run dev
```

---

# 📦 Available Commands

```bash
npm run dev
```

Start development server.

```bash
npm run build
```

Create production build.

```bash
npm run preview
```

Preview production build.

```bash
npm run lint
```

Run Oxlint.

These commands are defined in the current frontend `package.json`.

---

# 🎯 Why This Frontend Architecture?

The frontend is designed around one main idea:

> **Keep the UI simple while the backend handles the heavy work.**

```text
React
  │
  ├── Show media
  ├── Manage user actions
  ├── Show queue
  ├── Show progress
  └── Manage downloads
          │
          ▼
      Backend
          │
          ├── Download
          ├── Process
          ├── Store
          └── Track
```

This makes the application easier to extend with new download features and platforms.

---

# 🚧 Project Status

**UniFetch Media is currently under development.**

The frontend continues to receive improvements in:

* UI/UX
* Download experience
* Performance
* Queue management
* Mobile experience
* Storage management
* Platform support

---

## 👨‍💻 Author

**Mohammad Mustafa**

B.Tech Computer Science & Engineering

[GitHub](https://github.com/MohammadMustafa23)

---

<p align="center">
  Built with ❤️ using React + Vite
</p>
