import type React from "react"
import { protectRoute } from "@/lib/auth"
import { USER_ROLES } from "@/lib/constants"

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Server-side protection
  protectRoute(USER_ROLES.RECRUITER)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Recruiter Dashboard</h1>
      {children}
    </div>
  )
}
