// src/components/ChatContainer.jsx
import React, { useContext, useEffect, useRef, useState } from "react";
import { formatMessageTime } from "../lib/utils"; // keep your util or replace inline
import toast from "react-hot-toast";
import { FiPaperclip, FiSend, FiCamera } from "react-icons/fi";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";

const ChatContainer = ({ selectedUser, setSelectedUser }) => {
  const { currentUser } = useContext(AuthContext);
  const { messages = [], sendMessage, isLoadingMessages, typingUsers } = useContext(ChatContext);

  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [sending, setSending] = useState(false);
  const endRef = useRef();

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, selectedUser]);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  }, [file]);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      toast.error("Only images allowed");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      toast.error("Max 5MB");
      return;
    }
    setFile(f);
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!text.trim() && !file) return;
    setSending(true);
    try {
      const payload = {};
      if (text.trim()) payload.text = text.trim();
      if (file) {
        // convert to base64 quickly for demo; in prod upload to storage and send URL
        const b = await toBase64(file);
        payload.image = b;
      }
      await sendMessage(payload);
      setText("");
      setFile(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  function toBase64(file) {
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result);
      reader.onerror = rej;
      reader.readAsDataURL(file);
    });
  }

  const isMine = (msg) => msg.senderId === currentUser?._id;

  // message bubble component
  const Message = ({ msg }) => {
    return (
      <div className={`flex items-end gap-3 ${isMine(msg) ? "justify-end" : "justify-start"}`}>
        {!isMine(msg) && (
          <img
            src={selectedUser?.avatar || "https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?w=200"}
            alt="avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
        )}

        <div className="max-w-[75%]">
          {msg.image && (
            <img
              onClick={() => window.open(msg.image, "_blank")}
              src={msg.image}
              alt="shared"
              className={`rounded-xl border border-white/6 object-cover cursor-pointer mb-1 ${
                isMine(msg) ? "mr-0" : "ml-0"
              }`}
              style={{ maxWidth: 320 }}
            />
          )}

          {msg.text && (
            <div
              className={`px-3 py-2 rounded-2xl text-sm leading-snug shadow-sm ${
                isMine(msg) ? "bg-violet-500/25 text-white rounded-br-none" : "bg-white/6 text-gray-100 rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          )}

          <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-2">
            <span>{formatMessageTime(msg.createdAt)}</span>
            {isMine(msg) && (
              <>
                {msg.seen ? (
                  <img src={selectedUser?.avatar} alt="seen" className="w-4 h-4 rounded-full" />
                ) : (
                  <svg width="14" height="12" viewBox="0 0 24 24" fill="none" className="opacity-70">
                    <path d="M2 12l5 5L22 2" stroke="#c7c7c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </>
            )}
          </div>
        </div>

        {isMine(msg) && (
          <img
            src={currentUser?.avatar}
            alt="me"
            className="w-8 h-8 rounded-full object-cover"
          />
        )}
      </div>
    );
  };

  if (!selectedUser) {
    return (
      <main className="flex flex-col items-center justify-center text-gray-300 bg-transparent">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white/90">Select a chat to start messaging</h2>
          <p className="text-sm text-gray-400 mt-2">Your conversations will appear here</p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative bg-transparent flex flex-col">
      {/* header */}
      <header className="flex items-center gap-3 p-3 border-b border-white/6">
        <button className="md:hidden text-white" onClick={() => setSelectedUser(null)}>←</button>
        <img src={selectedUser.avatar} alt={selectedUser.name} className="w-10 h-10 rounded-full object-cover" />
        <div>
          <div className="text-sm font-medium text-white">{selectedUser.name}</div>
          <div className="text-xs text-gray-400">{selectedUser.online ? "Online" : `Last seen ${selectedUser.lastSeen || "recently"}`}</div>
        </div>
      </header>

      {/* messages */}
      <section className="flex-1 p-4 overflow-y-auto space-y-4" style={{ scrollBehavior: "smooth" }}>
        {isLoadingMessages ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse flex items-start gap-3">
              <div className="w-10 h-10 bg-white/6 rounded-full" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-3 w-3/5 bg-white/6 rounded" />
                <div className="h-3 w-1/2 bg-white/6 rounded" />
              </div>
            </div>
          ))
        ) : (
          messages
            .filter((m) => m && m.senderId)
            .map((msg) => <Message key={msg._id || msg.createdAt || Math.random()} msg={msg} />)
        )}

        {/* typing indicator */}
        {typingUsers?.[selectedUser._id] && (
          <div className="flex items-center gap-3">
            <img src={selectedUser.avatar} className="w-8 h-8 rounded-full" alt="typing" />
            <div className="bg-white/6 px-3 py-2 rounded-2xl">
              <div className="flex gap-1 w-10">
                <span className="h-2 w-2 bg-white rounded-full animate-bounce" />
                <span className="h-2 w-2 bg-white rounded-full animate-bounce delay-75" />
                <span className="h-2 w-2 bg-white rounded-full animate-bounce delay-150" />
              </div>
            </div>
          </div>
        )}

        <div ref={endRef} />
      </section>

      {/* composer */}
      <form onSubmit={handleSend} className="p-3 border-t border-white/6 flex items-center gap-3 bg-[#0f1724]/70">
        {preview && (
          <div className="relative">
            <img src={preview} alt="preview" className="w-20 h-20 object-cover rounded-md border border-white/6" />
            <button type="button" onClick={() => { setFile(null); setPreview(null); }} className="absolute -top-2 -right-2 bg-red-600 w-6 h-6 rounded-full text-white text-xs">✕</button>
          </div>
        )}

        <label className="p-2 rounded-full bg-white/5 cursor-pointer" title="Attach">
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
          <FiPaperclip className="text-white" />
        </label>

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
          className="flex-1 py-2 px-4 rounded-full bg-white/5 placeholder-gray-400 outline-none text-white"
        />

        <button type="submit" disabled={sending || (!text.trim() && !file)} className={`p-3 rounded-full ${sending ? "bg-violet-400/60" : "bg-violet-500 hover:bg-violet-600"} text-white`}>
          {sending ? "..." : <FiSend />}
        </button>
      </form>
    </main>
  );
}

export default ChatContainer; 