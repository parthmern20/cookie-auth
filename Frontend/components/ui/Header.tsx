"use client"
import Link from "next/link"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { logout } from "@/redux/features/auth/authSlice"
import { useRouter } from "next/navigation"

export default function Header() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)

/**
 * Handles the user logout process by dispatching the logout action
 * and redirecting the user to the appropriate route.
 */

/*************  ✨ Windsurf Command ⭐  *************/
/*******  3598c120-fbb9-426f-9fa1-0cec5c75c2b9  *******/
  const handleLogout = () => {
    dispatch(logout())
    router.push("/login")
  }

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-indigo-600">
                NextAuth App
              </Link>
            </div>
          </div>

          {isAuthenticated && (
            <div className="flex items-center">
              <span className="mr-4">
                Welcome, {user?.name} ({user?.role})
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
