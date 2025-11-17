import Jwt from "jsonwebtoken";
import User from "../Models/User.js";

// Middleware to protect routes
export const protectRoute = async (req, res, next) => {
  try {
    // 1️⃣ Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1]; // Extract token

    // 2️⃣ Verify token
    const decoded = Jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    // 3️⃣ Find user in database
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // 4️⃣ Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error("protectRoute error:", error.message);
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
