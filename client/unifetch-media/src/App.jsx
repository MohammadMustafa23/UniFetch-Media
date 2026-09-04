import "./App.css";

import { lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { getCachedUser, setCachedUser } from "./utils/userCache.js";
import PageLoader from "./common/PageLoader";
import ProtectedRoute from "./security/ProtectedRoute";
import PublicRoute from "./security/PublicRoute";
import { getCurrentUser } from "./service/auth.service";
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
  const [userName, setUserName] = useState(() => {
    const cachedUser = getCachedUser();
    return cachedUser?.userName || cachedUser?.name || cachedUser?.email || "";
  });
  useEffect(() => {
    const loadUser = async () => {
      const cachedUser = getCachedUser();

      // Already available → don't call API
      if (cachedUser) {
        return;
      }

      try {
        const { data } = await getCurrentUser();

        if (data.success) {
          const user = data.user || data.data;

          setCachedUser(user);

          setUserName(user?.userName || user?.name || user?.email || "User");
        }
      } catch (error) {
        console.error("Failed to load user:", error);
      }
    };

    loadUser();
  }, []);
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

          <Route path="/" element={<HeroPageCTA />} />

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
                <Dashboard
                  collapsed={collapsed}
                  setCollapsed={setCollapsed}
                  userName={userName}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/downloads"
            element={
              <ProtectedRoute>
                <Downloads
                  collapsed={collapsed}
                  setCollapsed={setCollapsed}
                  userName={userName}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/queue"
            element={
              <ProtectedRoute>
                <Queue
                  collapsed={collapsed}
                  setCollapsed={setCollapsed}
                  userName={userName}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History
                  collapsed={collapsed}
                  setCollapsed={setCollapsed}
                  userName={userName}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <Favorites
                  collapsed={collapsed}
                  setCollapsed={setCollapsed}
                  userName={userName}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics
                  collapsed={collapsed}
                  setCollapsed={setCollapsed}
                  userName={userName}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/storage"
            element={
              <ProtectedRoute>
                <Storage
                  collapsed={collapsed}
                  setCollapsed={setCollapsed}
                  userName={userName}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings
                  collapsed={collapsed}
                  setCollapsed={setCollapsed}
                  userName={userName}
                />
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
