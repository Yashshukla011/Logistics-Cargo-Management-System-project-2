import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import socket from "./socket";
import API from "../api/axios";

const TicketChat = () => {
  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));

  // SOCKET
useEffect(() => {
  if (!socket.connected) socket.connect();

  socket.emit("register", user._id);
  socket.emit("join_room", id);

  const handler = (data) => {
    setMessages((prev) => {
      const exists = prev.find((m) => m._id === data._id);
      if (exists) return prev;
      return [...prev, data];
    });
  };

  socket.off("receive_message"); // cleanup old listeners
  socket.on("receive_message", handler);

  return () => {
    socket.off("receive_message", handler);
  };
}, [id]);

  // LOAD OLD MESSAGES
  useEffect(() => {
    const fetchMessages = async () => {
      const res = await API.get(`/support/${id}`);
      console.log("API RESPONSE:", res.data);
setMessages(res.data?.data?.messages || []);
    };
    
    fetchMessages();
  }, [id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // SEND
  const send = () => {
    if (!msg.trim()) return;

    socket.emit("send_message", {
      ticketId: id,
      message: msg,
      role: user?.role,
      senderId: user?._id,
    });

    setMsg("");
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">

      {/* HEADER */}
      <div className="bg-blue-600 text-white px-4 py-3 font-semibold shadow-md">
        💬 Ticket Chat
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3">

        {messages.map((m, i) => {
         const isUser = m.senderId === user?._id;

          return (
            <div
              key={i}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 text-sm rounded-2xl shadow
                ${
                  isUser
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none border"
                }`}
              >
                {m.message}
              </div>
            </div>
          );
        })}

        <div ref={chatEndRef} />
      </div>

      {/* INPUT BOX */}
      <div className="p-3 bg-white border-t flex items-center gap-2">

        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-full outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={send}
          className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition"
        >
          Send
        </button>

      </div>
    </div>
  );
};

export default TicketChat;