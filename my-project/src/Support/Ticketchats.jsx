import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import socket from "./socket";

const TicketChat = () => {
  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    socket.emit("join_room", id);

    const handler = (data) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on("receive_message", handler);

    return () => socket.off("receive_message", handler);
  }, [id]);

  // auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
const send = () => {
  if (!msg.trim()) return;

  socket.emit("send_message", {
    ticketId: id,
    message: msg,
    role: "user",
  });

  setMsg("");
};
  return (
    <div className="h-screen flex flex-col bg-gray-100">

      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-3 font-semibold text-lg">
        Ticket Chat #{id}
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">

        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl text-sm shadow
              ${
                m.role === "user"
                  ? "bg-green-500 text-white rounded-br-none"
                  : "bg-white text-black rounded-bl-none"
              }`}
            >
              {m.message}
            </div>
          </div>
        ))}

        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t p-3 flex gap-2">
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={send}
          className="bg-blue-600 text-white px-6 rounded-full hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default TicketChat;