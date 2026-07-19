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
          if (!socket.connected) {
            socket.connect();

            socket.on("welcome", (data) => {
              console.log(data.message);

              socket.emit("join-room", "test-room");
            });
          }

          setIsAuthenticated(true);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  if (loading) {
    return <Loader text="Verifying your account..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/authantication-page" replace />;
  }

  return children;
}
