import { io } from "socket.io-client";

let socket = null;

export const initSocket = () => {
  if (!socket || !socket.connected) {
    const token = localStorage.getItem("token"); 
    if (!token) return null;

    socket = io(import.meta.env.VITE_APP_BACKEND_URL, {
      auth: {
        token,
      },
    });
  }
  return socket;
};


export const getSocket = () => socket;
