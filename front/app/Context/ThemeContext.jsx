// 'use client'
// import { createContext, useContext, useEffect, useState } from 'react'

// const ThemeContext = createContext()

// export const ThemeContextProvider = ({ children }) => {
//   const [theme, setTheme] = useState('light')

//   // عند أول تحميل للتطبيق، نقرأ من localStorage
//   useEffect(() => {
//     const storedTheme = localStorage.getItem('theme')
//     if (storedTheme) {
//       setTheme(storedTheme)
//       document.documentElement.classList.toggle('dark', storedTheme === 'dark')
//     } else {
//       // الوضع الافتراضي
//       document.documentElement.classList.remove('dark')
//     }
//   }, [])

//   // عند تغيير الثيم، نحدّث localStorage ونطبّقه على الصفحة
//   const toggleTheme = () => {
//     const newTheme = theme === 'light' ? 'dark' : 'light'
//     setTheme(newTheme)
//     localStorage.setItem('theme', newTheme)
//     document.documentElement.classList.toggle('dark', newTheme === 'dark')
//   }

//   return (
//     <ThemeContext.Provider value={{ theme, toggleTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   )
// }

// export const useTheme = () => useContext(ThemeContext)

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
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
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
