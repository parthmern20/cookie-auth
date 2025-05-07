"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAppDispatch } from "@/redux/hooks"
import { setCredentials } from "@/redux/features/auth/authSlice"

export default function MicrosoftCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const processAuth = async () => {
      try {
        const data = searchParams.get("data")

        if (data) {
          // Process data from URL parameters
          const authData = JSON.parse(decodeURIComponent(data))
          dispatch(setCredentials(authData))

          // Redirect based on user role
          if (authData.user.role === "admin") {
            router.push("/admin")
          } else if (authData.user.role === "recruiter") {
            router.push("/recruiter")
          } else {
            router.push("/")
          }
        } else {
          // If no data is provided, try to fetch user data from the API
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

          const response = await fetch(`${apiUrl}/auth/me`, {
            credentials: "include", // Important to include cookies
          })

          if (!response.ok) {
            throw new Error("Failed to get user data")
          }

          const userData = await response.json()

          dispatch(
            setCredentials({
              user: userData.user,
              token: userData.token,
            }),
          )

          // Redirect based on user role
          if (userData.user.role === "admin") {
            router.push("/admin")
          } else if (userData.user.role === "recruiter") {
            router.push("/recruiter")
          } else {
            router.push("/")
          }
        }
      } catch (error) {
        console.error("Error in Microsoft callback:", error)
        setError("Authentication failed. Please try again.")
        // Don't redirect immediately on error to show the error message
        setTimeout(() => {
          router.push("/login?error=microsoft_auth_failed")
        }, 3000)
      }
    }

    processAuth()
  }, [searchParams, dispatch, router])

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-4">Processing Microsoft Login</h1>
      {error ? <p className="text-red-500">{error}</p> : <p>Please wait while we complete your sign-in...</p>}
    </div>
  )
}
