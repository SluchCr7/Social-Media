'use client'
import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import { usePost } from "@/app/Context/PostContext"
import { useAuth } from "@/app/Context/AuthContext"
import { useUser } from "../Context/UserContext"

export const useGetData = (userId) => {
  const { getUserById } = useUser()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  // جلب بيانات اليوزر
  useEffect(() => {
    if (!userId) return
    setLoading(true)
    getUserById(userId)
      .then(res => setUserData(res))
      .catch(err => console.log(err))
      .finally(() => setLoading(false))
  }, [userId])


  return {
    loading,
    userData,
  }
}
