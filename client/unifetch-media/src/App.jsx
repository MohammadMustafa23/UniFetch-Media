import "./App.css";

import { lazy, Suspense, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import PageLoader from "./common/PageLoader";
import ProtectedRoute from "./security/ProtectedRoute";
import PublicRoute from "./security/PublicRoute";
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

const PrivacyPolicy = lazy(() => import("./security/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./security/TermsOfService"));

/* ==========================================
   APP
========================================== */

function App() {
  const [collapsed, setCollapsed] = useState(false);
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
          classNames: {
            toast: "uf-toast",
            title: "uf-toast-title",
            description: "uf-toast-description",
            closeButton: "uf-toast-close",
          },
        }}
      />

      <Suspense
        fallback={
          <PageLoader
            title="Loading Page"
            message="Preparing your experience..."
          />
        }
      >
        <Routes>
          {/* Public Routes */}

          <Route
            path="/"
            element={
              <HeroPageCTA />
            }
          />

          <Route
            path="/authantication-page"
            element={
              <PublicRoute>
                <AuthPage />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard collapsed={collapsed} setCollapsed={setCollapsed} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/downloads"
            element={
              <ProtectedRoute>
                <Downloads collapsed={collapsed} setCollapsed={setCollapsed} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/queue"
            element={
              <ProtectedRoute>
                <Queue collapsed={collapsed} setCollapsed={setCollapsed} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History collapsed={collapsed} setCollapsed={setCollapsed} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <Favorites collapsed={collapsed} setCollapsed={setCollapsed} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics collapsed={collapsed} setCollapsed={setCollapsed} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/storage"
            element={
              <ProtectedRoute>
                <Storage collapsed={collapsed} setCollapsed={setCollapsed} />
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

          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
