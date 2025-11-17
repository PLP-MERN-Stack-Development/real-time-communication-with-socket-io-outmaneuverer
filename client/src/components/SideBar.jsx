// src/components/SideBar.jsx
import React, { useEffect, useState, useContext } from "react";
import { FiSearch, FiMoreVertical } from "react-icons/fi";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";

const SideBar = ({ selectedUser, setSelectedUser, currentUser }) => {
  const { logout } = useContext(AuthContext);
  const { getUsers, users = [], unseenMessages = {}, isLoadingUsers } = useContext(ChatContext);

  const [q, setQ] = useState("");

  useEffect(() => {
    getUsers?.();
  }, []);

  const filtered = q
    ? users.filter((u) => (u.name || "").toLowerCase().includes(q.toLowerCase()))
    : users;

  const handleSelect = (user) => {
    setSelectedUser(user);
  };

  return (
    <aside className={`bg-[#0b1220] p-4 text-white border-r border-white/5`}>
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <img src={currentUser?.avatar} alt="me" className="w-12 h-12 rounded-full object-cover border-2 border-violet-500" />
          <div className="text-sm">
            <p className="font-medium">{currentUser?.name}</p>
            <p className="text-xs text-gray-400">{currentUser?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 rounded-md bg-white/5 hover:bg-white/7" title="Menu">
            <FiMoreVertical />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="relative">
          <span className="absolute left-3 top-3 text-gray-400">
            <FiSearch />
          </span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search or start new chat"
            className="w-full pl-10 pr-3 py-2 rounded-full bg-white/5 placeholder-gray-400 outline-none text-sm"
          />
        </div>
      </div>

      <div className="text-xs text-gray-400 mb-2">CHATS</div>

      <div className="overflow-y-auto h-[60vh] pr-2">
        {isLoadingUsers ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse flex items-center gap-3 p-3 rounded-lg bg-white/3 mb-2">
              <div className="w-12 h-12 rounded-full bg-white/6" />
              <div className="flex-1">
                <div className="h-3 bg-white/6 rounded w-3/5 mb-2" />
                <div className="h-2 bg-white/6 rounded w-1/2" />
              </div>
            </div>
          ))
        ) : filtered.length ? (
          filtered.map((user) => {
            const unread = unseenMessages?.[user._id] || 0;
            const active = selectedUser?._id === user._id;
            return (
              <div
                key={user._id}
                onClick={() => handleSelect(user)}
                className={`flex items-center gap-3 p-3 rounded-lg mb-2 cursor-pointer transition-all ${
                  active ? "bg-violet-500/20 scale-[1.003]" : "hover:bg-white/5"
                }`}
              >
                <div className="relative">
                  <img
                    src={user.avatar || "https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?w=200&q=80"}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover border border-white/6"
                  />
                  {user.online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full ring-2 ring-black" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center gap-2">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.lastSeen ? user.lastSeen : ""}</p>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <p className="text-xs text-gray-400 truncate">{user.bio || user.email || "No bio"}</p>
                    {unread > 0 && <span className="ml-2 bg-violet-500 text-[11px] px-2 py-0.5 rounded-full text-white">{unread}</span>}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-400 mt-8">No users yet.</div>
        )}
      </div>

      <div className="mt-4 border-t border-white/5 pt-4 flex gap-2">
        <button
          onClick={() => {
            logout?.();
            toast.success("Logged out");
          }}
          className="flex-1 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm"
        >
          Logout
        </button>
        <button
          onClick={() => toast("New chat coming soon")}
          className="py-2 px-3 rounded-full bg-white/6 hover:bg-white/8 text-white text-sm"
        >
          New
        </button>
      </div>
    </aside>
  );
}

export default SideBar;
