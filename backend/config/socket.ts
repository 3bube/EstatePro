// socket.ts
import { Server } from "http";
import { Server as SocketServer } from "socket.io";
import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.models";

interface MessageData {
  conversationId: string;
  senderId: string;
  content: string;
  participants: string[];
}

interface User {
  userId: string;
  socketId: string;
}

let onlineUsers: User[] = [];

export const setupSocketIO = (httpServer: Server) => {
  const io = new SocketServer(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  // Authentication middleware for socket connections
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication required"));
    }

    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      const user = await UserModel.findById(decoded.userId);
      if (!user) {
        return next(new Error("User not found"));
      }

      socket.data.user = user;
      next();
    } catch (error) {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket: Socket) => {
    console.log("New client connected");

    // Add user to online users when they connect
    socket.on("addUser", (userId: string) => {
      const existingUser = onlineUsers.find((user) => user.userId === userId);
      if (!existingUser) {
        onlineUsers.push({
          userId,
          socketId: socket.id,
        });
      }
      io.emit("getOnlineUsers", onlineUsers);
    });

    // Handle new messages
    socket.on("sendMessage", (data: MessageData) => {
      const { participants, senderId } = data;

      // Filter out the sender's ID from participants
      const participantIds: string[] = participants.filter(
        (id: string) => id !== senderId
      );

      // Find online participants and send them the message
      const onlineParticipants = onlineUsers.filter((user) =>
        participantIds.includes(user.userId)
      );

      onlineParticipants.forEach((participant) => {
        io.to(participant.socketId).emit("getMessage", data);
      });
    });

    // Handle typing status
    socket.on(
      "typing",
      (data: { conversationId: string; senderId: string }) => {
        const { conversationId, senderId } = data;
        socket.broadcast.emit("userTyping", { conversationId, senderId });
      }
    );

    // Handle stop typing status
    socket.on(
      "stopTyping",
      (data: { conversationId: string; senderId: string }) => {
        const { conversationId, senderId } = data;
        socket.broadcast.emit("userStopTyping", { conversationId, senderId });
      }
    );

    // Remove user from online users when they disconnect
    socket.on("disconnect", () => {
      onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
      io.emit("getOnlineUsers", onlineUsers);
      console.log("Client disconnected");
    });
  });

  return io;
};
