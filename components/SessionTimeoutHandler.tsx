"use client"

import { useEffect, useCallback, useRef } from "react"
import { useSession, signOut } from "next-auth/react"

// Inactivity timeout in milliseconds (15 minutes)
const TIMEOUT_IN_MS = 15 * 60 * 1000

export default function SessionTimeoutHandler() {
  const { data: session, status } = useSession()
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const handleLogout = useCallback(async () => {
    if (status === "authenticated") {
      console.log("[SESSION] Auto logging out due to inactivity")
      await signOut({ 
        callbackUrl: "/login?reason=timeout",
        redirect: true 
      })
    }
  }, [status])

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    
    if (status === "authenticated") {
      timerRef.current = setTimeout(handleLogout, TIMEOUT_IN_MS)
    }
  }, [handleLogout, status])

  useEffect(() => {
    // Only set up listeners if user is authenticated
    if (status !== "authenticated") {
      if (timerRef.current) clearTimeout(timerRef.current)
      return
    }

    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ]

    const handleActivity = () => {
      resetTimer()
    }

    // Initialize timer
    resetTimer()

    // Add event listeners for user activity
    events.forEach((event) => {
      window.addEventListener(event, handleActivity)
    })

    // Cleanup
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity)
      })
    }
  }, [status, resetTimer])

  return null
}
