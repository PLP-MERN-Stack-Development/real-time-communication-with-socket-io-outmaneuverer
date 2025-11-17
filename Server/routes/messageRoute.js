import express from "express";
import { getMessages, getUsersForSidebar, markMessageAsSeen, sendMessage } from "../Controllers/messageController.js";
import { protectRoute } from "../MiddleWare/auth.js";

const messageRouter = express.Router();

// Sidebar users
messageRouter.get("/users", protectRoute, getUsersForSidebar);

// Messages with a selected user
messageRouter.get("/:id", protectRoute, getMessages);

// Mark message as seen
messageRouter.put("/mark/:id", protectRoute, markMessageAsSeen);

// Send message
messageRouter.post("/send/:id", protectRoute, sendMessage);

export default messageRouter;
