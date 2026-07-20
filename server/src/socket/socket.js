import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
let io;

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_CLIENT_ID,
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

      console.log("Token:", token);

      if (!token) {
        console.log("❌ No token found");
        socket.disconnect(true);
        return;
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id);

      if (!user) {
        console.log("❌ User not found");
        socket.disconnect(true);
        return;
      }

      socket.join(user._id.toString());

      socket.emit("welcome", {
        message: "Welcome to UniFetch Socket!",
      });

      socket.on("join-room", (room) => {
        socket.join(room);
        console.log(`${socket.id} joined ${room}`);
      });

      socket.on("disconnect", () => {
        console.log("🔴 Socket Disconnected:", socket.id);
      });
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
