import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const { socket, axios, currentUser } = useContext(AuthContext);

  // ✅ Get all users for sidebar
  const getUsers = async () => {
    if (!axios) return;
    
    setIsLoadingUsers(true);
    try {
      const { data } = await axios.get("/api/auth/users");
      if (data.success) {
        // Filter out current user from the list
        const filteredUsers = data.users.filter(
          (user) => user._id !== currentUser?._id
        );
        setUsers(filteredUsers);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // ✅ Get messages between current and selected user
  const getMessages = async (userId) => {
    if (!axios || !userId) return;
    
    setIsLoadingMessages(true);
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setMessages(data.messages);
        // Mark all messages from this user as seen
        await markMessagesAsSeen(userId);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error(error.response?.data?.message || "Failed to fetch messages");
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // ✅ Send a new message
const sendMessage = async (messageData) => {
  if (!axios || !selectedUser) return;

  try {
    const { data } = await axios.post(
      `http://localhost:5000/api/messages/send/${selectedUser._id}`,
      messageData
    );

    if (data.success) {
      setMessages((prev) => [...prev, data.message]);
      return data.message;
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.error("Error sending message:", error);
    toast.error(error.response?.data?.message || "Failed to send message");
  }
};


  // ✅ Mark messages as seen
  const markMessagesAsSeen = async (userId) => {
    if (!axios || !userId) return;
    
    try {
      await axios.put(`/api/messages/mark-seen/${userId}`);
    } catch (error) {
      console.error("Error marking messages as seen:", error);
    }
  };

  // ✅ Listen for incoming messages (socket.io)
  const subscribeToMessages = () => {
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      // If message is from currently selected user, add to messages
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        setMessages((prev) => [...prev, newMessage]);
        // Mark as seen automatically
        markMessagesAsSeen(newMessage.senderId);
      } else {
        // Otherwise, increment unseen message count
        setUnseenMessages((prev) => ({
          ...prev,
          [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1,
        }));
        
        // Show toast notification
        const sender = users.find((u) => u._id === newMessage.senderId);
        if (sender) {
          toast(`New message from ${sender.name}`, {
            icon: "💬",
            duration: 3000,
          });
        }
      }
    });

    // Listen for online users updates
    socket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });
  };

  // ✅ Stop listening when component unmounts or socket changes
  const unsubscribeFromMessages = () => {
    if (socket) {
      socket.off("newMessage");
      socket.off("getOnlineUsers");
    }
  };

  // Subscribe to socket events
  useEffect(() => {
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [socket, selectedUser, users]);

  // Clear messages when user changes
  useEffect(() => {
    if (!selectedUser) {
      setMessages([]);
    }
  }, [selectedUser]);

  const value = {
    messages,
    users,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
    setMessages,
    sendMessage,
    getMessages,
    getUsers,
    onlineUsers,
    isLoadingUsers,
    isLoadingMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};