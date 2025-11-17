import { generateToken } from "../Lib/utils.js";
import User from "../Models/User.js";
import bcrypt from "bcrypt";
import cloudinary from "../Lib/Cloudinary.js";

// ==================== SIGNUP ====================
export const Signup = async (req, res) => {
  const { fullName, email, password, bio } = req.body;

  try {
    if (!fullName || !email || !password || !bio) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ fullName, email, password: hashedPassword, bio });
    await newUser.save();

    const token = generateToken(newUser._id);

    res.status(201).json({
      success: true,
      userData: newUser,
      message: "User created successfully",
      token,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ==================== LOGIN ====================
export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id);

    res.status(200).json({ success: true, userData: user, token, message: "Logged in successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ==================== CHECK AUTH ====================
export const checkAuth = (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};

// ==================== UPDATE PROFILE ====================
export const updateProfile = async (req, res) => {
  try {
    const { fullName, bio, profilePic } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user._id;
    let updatedUser;

    // If profilePic is provided, upload to Cloudinary
    if (profilePic) {
      try {
        const upload = await cloudinary.uploader.upload(profilePic, {
          folder: "profilePics",
        });
        updatedUser = await User.findByIdAndUpdate(
          userId,
          { fullName, bio, profilePic: upload.secure_url },
          { new: true }
        );
      } catch (cloudErr) {
        console.error("Cloudinary upload failed:", cloudErr);
        return res.status(500).json({ message: "Image upload failed" });
      }
    } else {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { fullName, bio },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ==================== LOGOUT ====================
export const Logout = async (req, res) => {
  try {
    // If you’re using cookies for JWT, clear them:
    res.clearCookie("token");

    // Or if you’re using tokens in localStorage (as in your React app), 
    // you can simply send success without doing anything server-side:
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ success: false, message: "Logout failed" });
  }
};

//import User from "../Models/User.js"; // ensure you have the User model imported

// ==================== GET ALL USERS ====================
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // exclude passwords
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};

