import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  // ✅ Set token header
  const setAxiosToken = (token) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  // Check if user is authenticated
  const checkAuth = async () => {
    if (!token) return; // no token to check
    try {
      const { data } = await axios.get("/api/auth/check");
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Authentication failed");
      logout(); // remove invalid token
    }
  };

  // Login function
  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials);
      if (data.success) {
        setAuthUser(data.user);
        setToken(data.token);
        setAxiosToken(data.token);
        localStorage.setItem("token", data.token);
        connectSocket(data.user);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const { data } = await axios.get("/api/auth/logout");
      if (data.success) {
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]);
        setAxiosToken(null);
        localStorage.removeItem("token");
        toast.success("Logged out successfully");
        if (socket) {
          socket.disconnect();
          setSocket(null);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  // Update user profile
  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("/api/auth/update", body);
      if (data.success) {
        setAuthUser(data.user);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  // Connect to socket
  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;

    const newSocket = io(backendUrl, {
      query: { userId: userData._id },
    });

    newSocket.connect();
    setSocket(newSocket);

    newSocket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });
  };

  // Effect to set token header and check auth on mount
  useEffect(() => {
    if (token) {
      setAxiosToken(token);
      checkAuth();
    }
  }, [token]);

  // Cleanup socket on unmount
  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  const value = {
    axios,
    authUser,
    onlineUsers,
    socket,
    token,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
