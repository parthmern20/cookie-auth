import { redirect } from "next/navigation"
import { USER_ROLES } from "./constants"
import { cookies } from "next/headers"

export const protectRoute = async (role?: string) => {
  try {
    const cookieStore = await cookies()
    const authCookie = cookieStore.get("auth_token")

    if (!authCookie?.value) {
      redirect("/login")
    }

    if (role) {
      const userRole = cookieStore.get("user_role")?.value

      if (!userRole || userRole !== role) {
        if (userRole === USER_ROLES.ADMIN) {
          redirect("/admin")
        } else if (userRole === USER_ROLES.RECRUITER) {
          redirect("/recruiter")
        } else {
          redirect("/login")
        }
      }
    }
  } catch (error) {
    console.error("Error in protectRoute:", error)
    redirect("/login")
  }
}
