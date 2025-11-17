// src/pages/Homepage.jsx
import React, { useState } from "react";
import SideBar from "../components/SideBar";
import ChatContainer from "../components/ChatContainer";
import RightSideBar from "../components/RightSideBar";

const Homepage = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  // Keep your currentUser from AuthContext in real app;
  // for local dev we keep a currentUser fallback
  const currentUser = {
    _id: "current-user-id",
    name: "You",
    avatar:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200&h=200",
    email: "you@example.com",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f1724] to-[#0b1220] p-4">
      <div className="mx-auto max-w-[1400px] h-[92vh] border border-white/5 rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-[1fr_1.6fr] lg:grid-cols-[1fr_2fr_1fr]">
        <SideBar
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          currentUser={currentUser}
        />
        <ChatContainer selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
        <RightSideBar selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
      </div>
    </div>
  );
}

export default Homepage
