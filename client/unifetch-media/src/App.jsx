import "./App.css";

import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import Loader from "./common/Loader";
import ProtectedRoute from "./security/ProtectedRoute";

/* ==========================================
   LAZY IMPORTS
========================================== */

const HeroPageCTA = lazy(() => import("./Pages/HeroPageCTA"));
const AuthPage = lazy(() => import("./Pages/AuthPage"));

const Dashboard = lazy(() => import("./Pages/Dashboard"));

const Downloads = lazy(() => import("./Components/Downloads/Downloads"));

const Queue = lazy(() => import("./Components/Queue/Queue"));

const History = lazy(() => import("./Components/History/History"));

const Favorites = lazy(() => import("./Components/Favorites/Favorites"));

const Analytics = lazy(() => import("./Components/Analytics/Analytics"));

const Storage = lazy(() => import("./Components/Storage/Storage"));

const Settings = lazy(() => import("./Components/Setting/ProfileSettings"));

/* ==========================================
   APP
========================================== */

function App() {
  return (
    <>
      <Toaster
        theme="dark"
        position="top-right"
        richColors
        closeButton
        expand
        visibleToasts={3}
        toastOptions={{
          duration: 3000,
        }}
      />

      <Suspense fallback={<Loader text="Loading page..." />}>
        <Routes>
          {/* Public Routes */}

          <Route path="/" element={<HeroPageCTA />} />

          <Route path="/authantication-page" element={<AuthPage />} />

          {/* Protected Routes */}

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/downloads"
            element={
              <ProtectedRoute>
                <Downloads />
              </ProtectedRoute>
            }
          />

          <Route
            path="/queue"
            element={
              <ProtectedRoute>
                <Queue />
              </ProtectedRoute>
            }
          />

          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />

          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />

          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />

          <Route
            path="/storage"
            element={
              <ProtectedRoute>
                <Storage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
