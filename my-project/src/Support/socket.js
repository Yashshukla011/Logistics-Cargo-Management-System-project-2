import { io } from "socket.io-client";



const socket = io("https://logistics-cargo-management-system.onrender.com", {
  transports: ["websocket", "polling"],
  autoConnect: false,
  withCredentials: true,
});

export default socket;