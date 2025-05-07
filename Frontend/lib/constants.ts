// Define API base URL with a fallback
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Microsoft authentication configuration
export const MICROSOFT_AUTH = {
  CLIENT_ID: process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID || "",
  AUTHORITY: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_MICROSOFT_TENANT_ID || "common"}`,
  REDIRECT_URI: process.env.NEXT_PUBLIC_MICROSOFT_REDIRECT_URI || "http://localhost:5000/api/auth/microsoft/callback",
  SCOPES: ["user.read", "profile", "email", "openid"],
}

// Local storage key for auth data
export const AUTH_STORAGE_KEY = "auth_data"

// User role constants
export const USER_ROLES = {
  ADMIN: "admin",
  RECRUITER: "recruiter",
}
