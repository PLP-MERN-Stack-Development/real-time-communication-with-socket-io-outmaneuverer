// src/components/RightSideBar.jsx
import React from "react";

const RightSideBar = ({ selectedUser, setSelectedUser }) => {
  const imagesDummyData = selectedUser?.media || [
    "https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?w=400",
    "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?w=400",
    "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400",
    "https://images.unsplash.com/photo-1544022995-5dd484a472d0?w=400",
    "https://images.unsplash.com/photo-1519241047957-be31d7379a5d?w=400",
  ];

  if (!selectedUser) {
    return (
      <aside className="hidden lg:flex flex-col bg-[#071024] p-6 border-l border-white/5 text-white">
        <div className="text-center opacity-80">
          <p className="font-medium">Select a conversation</p>
          <p className="text-sm text-gray-400 mt-2">User details will appear here</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="hidden lg:flex flex-col bg-[#071024] p-6 border-l border-white/5 text-white overflow-y-auto">
      <div className="flex flex-col items-center gap-3">
        <img src={selectedUser.avatar} alt={selectedUser.name} className="w-28 h-28 rounded-full object-cover border-2 border-violet-500" />
        <div className="text-center">
          <div className="font-semibold text-lg">{selectedUser.name}</div>
          <div className="text-sm text-gray-400">{selectedUser.bio || selectedUser.email}</div>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-semibold">Media & Files</h4>
          <button className="text-xs text-gray-400">View all</button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {imagesDummyData.map((u, i) => (
            <img key={i} src={u} alt={`media-${i}`} className="w-full h-24 object-cover rounded-md cursor-pointer hover:scale-105 transition-transform" />
          ))}
        </div>
      </div>

      <div className="mt-auto pt-6">
        <button className="w-full py-2 rounded-full bg-white/6 hover:bg-white/8 text-white">Voice call</button>
        <button className="w-full mt-2 py-2 rounded-full bg-violet-500 hover:bg-violet-600 text-white">Video call</button>

        <button
          onClick={() => {
            // optional: call logout or open profile
            setSelectedUser(null);
          }}
          className="w-full mt-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white"
        >
          Close chat
        </button>
      </div>
    </aside>
  );
}

export default RightSideBar
