import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import connectDB from "./Lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoute.js";
import { initializeSocket } from "./Lib/socket.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io AFTER creating server
initializeSocket(server);

// Middleware
app.use(express.json({ limit: "4mb" }));
app.use(cors());

// Routes
app.get("/api/status", (req, res) => {
  res.send("API is running...");
});

app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Start the server only after DB connection
const startServer = async () => {
  await connectDB();
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
};

startServer();

export default server;