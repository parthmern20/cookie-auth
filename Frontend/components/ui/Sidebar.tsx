"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAppSelector } from "@/redux/hooks"
import { USER_ROLES } from "@/lib/constants"

export default function Sidebar() {
  const pathname = usePathname()
  const { user } = useAppSelector((state) => state.auth)
console.log("user", user)
  if (!user) return null

  const isAdmin = user.role === USER_ROLES.ADMIN
  const isRecruiter = user.role === USER_ROLES.RECRUITER

  return (
    <div className="h-full bg-gray-800 w-64 fixed left-0 top-16 overflow-y-auto">
      <nav className="mt-5">
        <div className="px-2 space-y-1">
          {isAdmin && (
            <>
              <Link
                href="/admin"
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  pathname === "/admin" ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/admin/users"
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  pathname === "/admin/users"
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                User Management
              </Link>
            </>
          )}

          {isRecruiter && (
            <>
              <Link
                href="/recruiter"
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  pathname === "/recruiter"
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/recruiter/candidates"
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  pathname === "/recruiter/candidates"
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                Candidate Management
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  )
}
