import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import socket from "./socket";

const AdminChat = () => {
  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const chatRef = useRef(null);

  // Join room + receive messages
  useEffect(() => {
    if (!id) return;

    socket.emit("join_room", id);

    const handler = (data) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on("receive_message", handler);

    return () => {
      socket.off("receive_message", handler);
    };
  }, [id]);

  // Auto scroll
  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // Send message
  const send = () => {
    if (!msg.trim()) return;

    socket.emit("send_message", {
      ticketId: id,
      message: msg,
      role: "admin",
    });

    setMsg("");
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">

      {/* Header */}
      <div className="bg-black text-white px-4 py-3 text-lg font-semibold">
        Admin Support Chat
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${
              m.role === "admin" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl text-sm shadow ${
                m.role === "admin"
                  ? "bg-black text-white rounded-br-none"
                  : "bg-white text-black rounded-bl-none"
              }`}
            >
              {m.message}
            </div>
          </div>
        ))}

        <div ref={chatRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t p-3 flex gap-2">
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-black"
        />

        <button
          onClick={send}
          className="bg-black text-white px-6 rounded-full hover:bg-gray-800"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AdminChat;