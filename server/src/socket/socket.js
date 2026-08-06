import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
let io;

export function initSocket(server) {
  const allowedOrigins = process.env.FRONTEND_CLIENT_ID.split(",").map(
    (origin) => origin.trim(),
  );

  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  io.on("connection", async (socket) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie || "";

      const cookies = Object.fromEntries(
        cookieHeader
          .split("; ")
          .filter(Boolean)
          .map((cookie) => cookie.split("=")),
      );

      const token = cookies.token;
      if (!token) {
        socket.disconnect(true);
        return;
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        socket.disconnect(true);
        return;
      }

      socket.join(user._id.toString());

      socket.on("join-room", (room) => {
        socket.join(room);
      });

      socket.on("disconnect", () => {});
    } catch (error) {
      console.error("Socket Auth Error:", error.message);
      socket.disconnect(true);
    }
  });
  return io;
}

export function getIO() {
  return io;
}
