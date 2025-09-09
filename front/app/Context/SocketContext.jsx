'use client'
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user?._id) {
      // ✅ Connect socket with userId
      const newSocket = io(process.env.NEXT_PUBLIC_BACK_URL, {
        query: { userId: user._id },
        transports: ["websocket"],
      });

      setSocket(newSocket);

      // Debug
      newSocket.on("connect", () => {
        console.log("🟢 Socket connected:", newSocket.id);
      });

      newSocket.on("disconnect", () => {
        console.log("🔴 Socket disconnected");
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user?._id]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
