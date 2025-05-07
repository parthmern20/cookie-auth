"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/redux/hooks"
import { USER_ROLES } from "@/lib/constants"
import { setCredentials } from "@/redux/features/auth/authSlice"

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useAppDispatch()

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated) {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
          const response = await fetch(`${apiUrl}/auth/me`, {
            credentials: "include",
          })

          if (!response.ok) {
            throw new Error("Not authenticated")
          }

          const data = await response.json()
          dispatch(
            setCredentials({
              user: data.user,
              token: data.token,
            }),
          )
        } catch (error) {
          console.log("Not authenticated or error fetching user data")
        }
      }
    }

    checkAuth()
  }, [isAuthenticated, dispatch])

  // Handle redirects based on authentication state
  useEffect(() => {
    const handleRouting = () => {
      // Handle authentication redirects
      if (!isAuthenticated && !pathname.startsWith("/login") && !pathname.startsWith("/auth")) {
        router.push("/login")
        return
      }

      if (isAuthenticated) {
        if (pathname === "/login" || pathname === "/") {
          // Redirect based on user role
          if (user?.role === USER_ROLES.ADMIN) {
            router.push("/admin")
          } else if (user?.role === USER_ROLES.RECRUITER) {
            router.push("/recruiter")
          }
        }

        // Protect admin routes
        if (pathname.startsWith("/admin") && user?.role !== USER_ROLES.ADMIN) {
          if (user?.role === USER_ROLES.RECRUITER) {
            router.push("/recruiter")
          } else {
            router.push("/login")
          }
        }

        // Protect recruiter routes
        if (pathname.startsWith("/recruiter") && user?.role !== USER_ROLES.RECRUITER) {
          if (user?.role === USER_ROLES.ADMIN) {
            router.push("/admin")
          } else {
            router.push("/login")
          }
        }
      }
    }

    handleRouting()
  }, [isAuthenticated, user, router, pathname])

  return <>{children}</>
}
