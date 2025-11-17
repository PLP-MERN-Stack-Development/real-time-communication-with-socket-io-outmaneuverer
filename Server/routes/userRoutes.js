import express from "express";
import { checkAuth, getAllUsers, Login, Logout, Signup, updateProfile } from "../Controllers/UserController.js";
import { protectRoute } from "../MiddleWare/auth.js";


const userRouter = express.Router();

userRouter.post("/register", Signup);
userRouter.post("/login", Login);
userRouter.get("/check", protectRoute, checkAuth);
userRouter.put("/update", protectRoute, updateProfile);
userRouter.get("/Logout", Logout);
userRouter.get("/users", getAllUsers);


export default userRouter;