'use client'
import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export const ThemeContextProvider = ({ children }) => {
  const [theme, setTheme] = useState('light')

  // ✅ عند أول تحميل للتطبيق نقرأ من localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme')
    if (storedTheme) {
      setTheme(storedTheme)
    } else {
      // يمكن اكتشاف الثيم الافتراضي من النظام
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')
    }
  }, [])

  // ✅ كلما تغير الثيم، نطبّقه فورًا على الصفحة
  useEffect(() => {
    const root = document.documentElement

    root.classList.toggle('dark', theme === 'dark')
    root.classList.toggle('light', theme === 'light')
    root.style.colorScheme = theme
    root.setAttribute('data-theme', theme)

    localStorage.setItem('theme', theme)
  }, [theme])

  // ✅ دالة التبديل
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
