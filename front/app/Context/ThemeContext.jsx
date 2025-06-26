'use client'
import { createContext, useState } from "react";
export const ThemeContext = createContext();

const ThemeContextProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(true);
    
    const bgColor = darkMode ? 'bg-[#00000]' : 'bg-[#F9FAFB]';
    const textColor = darkMode ? 'text-[#ffb703]' : 'text-[#3B82F6]';
    const cardBg = darkMode ? 'bg-[#0a0a0a]' : 'bg-[#FFFFFF]';
    const accent = '#ffb703';

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };
    return <ThemeContext.Provider value={{
        toggleDarkMode,
        darkMode,
        setDarkMode,
        bgColor,
        textColor,
        cardBg,
        accent
    }}>
        {children}
    </ThemeContext.Provider>;
};

export default ThemeContextProvider;