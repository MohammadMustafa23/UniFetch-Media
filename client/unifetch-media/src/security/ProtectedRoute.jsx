import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../service/auth.service.js";
import Loader from "../common/Loader.jsx";
import socket from "../socket/socket.js";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const { data } = await getCurrentUser();

        if (data.success) {
          setIsAuthenticated(true);

          if (!socket.connected) {
            socket.connect();
          }

          socket.on("connect", () => {
            console.log("✅ Socket Connected:", socket.id);
          });

          socket.on("connect_error", (err) => {
            console.log("❌ Socket Error:", err.message);
          });
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();

    const handleWelcome = (data) => {
      console.log(data.message);
    };

    socket.on("welcome", handleWelcome);

    // 👇 Add this here
    socket.on("download-completed", (data) => {
      console.log("✅ ProtectedRoute received:", data);
    });

    return () => {
      socket.off("welcome", handleWelcome);
      socket.off("download-completed");
    };
  }, []);

  if (loading) {
    return <Loader text="Verifying your account..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/authantication-page" replace />;
  }

  return children;
}
