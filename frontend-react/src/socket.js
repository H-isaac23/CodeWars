import { io } from "socket.io-client";

const socket = io(`${import.meta.env.VITE_URL_PREFIX}:3000`, {
  path: "/socket",
  autoConnect: false,
});

export { socket };
