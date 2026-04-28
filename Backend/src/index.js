import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { Server } from "socket.io";

import connectDB from "../src/Database/db.js";
import { app } from "./app.js";

import User from "../src/Models/User.model.js";
import Support from "../src/Models/Support.model.js";

let io;
const onlineUsers = new Map();

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
          origin: "https://logistics-cargo-management-system-p.vercel.app",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 Connected:", socket.id);

    // REGISTER USER
    socket.on("register", (userId) => {
      if (!userId) return;

      const id = String(userId);
      onlineUsers.set(id, socket.id);
      socket.join(id);

      console.log("📌 REGISTERED:", id);
    });

    // JOIN ROOM
    socket.on("join_room", (roomId) => {
      socket.join(roomId);
      console.log("📥 Joined room:", roomId);
    });

    // SEND MESSAGE
    socket.on("send_message", async (data) => {
      try {
        console.log("📨 Message:", data);

        const { ticketId, message, role, senderId } = data;

        const ticket = await Support.findByIdAndUpdate(
          ticketId,
          {
            $push: {
              messages: {
                senderId,
                role,
                message,
              },
            },
          },
          { new: true }
        );

        if (!ticket) return;

        // 🔥 REALTIME CHAT
        io.to(ticketId).emit("receive_message", data);

        // 🔥 ADMIN → USER NOTIFICATION (FIXED)
        if (role === "admin") {
          const userSocket = onlineUsers.get(ticket.userId?.toString());

          if (userSocket) {
            io.to(userSocket).emit("notification", {
              title: "Support Reply",
              message: "Admin replied to your ticket",
              type: "chat",
              ticketId: ticket._id.toString(),   // 🔥 FIXED
            });
          }
        }

        // 🔥 USER → ADMIN NOTIFICATION (FIXED)
        else {
          const admins = await User.find({ role: "admin" });

          admins.forEach((admin) => {
            const adminSocket = onlineUsers.get(admin._id.toString());

            if (adminSocket) {
              io.to(adminSocket).emit("notification", {
                title: "New Message",
                message: "New message from user",
                type: "chat",
                ticketId: ticket._id.toString(),   // 🔥 FIXED
              });
            }
          });
        }

      } catch (err) {
        console.log("SEND MESSAGE ERROR:", err.message);
      }
    });

    // DISCONNECT
    socket.on("disconnect", () => {
      console.log("🔴 Disconnected:", socket.id);

      for (let [userId, sockId] of onlineUsers.entries()) {
        if (sockId === socket.id) {
          onlineUsers.delete(userId);
          console.log("❌ Removed:", userId);
          break;
        }
      }
    });
  });
};

// 🔥 SEND NOTIFICATION FUNCTION
const sendNotification = (userId, data) => {
  if (!io) return;

  const id = String(userId);
  const socketId = onlineUsers.get(id);

  if (!socketId) {
    console.log("⚠️ User offline:", id);
    return;
  }

  io.to(socketId).emit("notification", {
    ...data,
    read: false,
    time: Date.now(),
  });
};

// START SERVER
connectDB().then(() => {
  const server = http.createServer(app);

  initSocket(server);

  server.listen(process.env.PORT || 5000, () => {
    console.log("🚀 Server running");
  });
});

export { io, sendNotification };