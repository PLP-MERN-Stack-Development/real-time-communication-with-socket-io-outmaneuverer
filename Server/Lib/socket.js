import { Server } from "socket.io";

export let io;
export const userSocketMap = {};

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" }
  });

  // Socket.io connection handler
  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("New user connected:", userId);
    
    if (userId) {
      userSocketMap[userId] = socket.id;
    }
    
    // Emit online users to all connected clients
    io.emit("onlineUsers", Object.keys(userSocketMap));
    
    socket.on("disconnect", () => {
      console.log("User disconnected:", userId);
      delete userSocketMap[userId];
      io.emit("onlineUsers", Object.keys(userSocketMap));
    });
  });

  return io;
};