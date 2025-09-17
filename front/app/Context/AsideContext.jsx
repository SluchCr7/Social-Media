'use client';
import { createContext, useContext, useEffect, useState } from "react";

export const AsideContext = createContext();

export const AsideContextProvider = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  return (
    <AsideContext.Provider
        value={{
            isMobile,setIsMobile,isMobileMenuOpen,setIsMobileMenuOpen
        }}
    >
        {children}
    </AsideContext.Provider>
  );
};

export const useAside = () => useContext(AsideContext);
