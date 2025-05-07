import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { AUTH_STORAGE_KEY } from "@/lib/constants"
import { cookies } from "next/headers"

export interface User {
  id: string
  email: string
  name: string
  role: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// Safe localStorage access
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === "undefined") return null
    try {
      return localStorage.getItem(key)
    } catch (e) {
      console.error("Error accessing localStorage:", e)
      return null
    }
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(key, value)
    } catch (e) {
      console.error("Error setting localStorage:", e)
    }
  },
  removeItem: (key: string): void => {
    if (typeof window === "undefined") return
    try {
      localStorage.removeItem(key)
    } catch (e) {
      console.error("Error removing from localStorage:", e)
    }
  },
}

const loadAuthFromStorage = (): Partial<AuthState> => {
  const storedAuth = safeLocalStorage.getItem(AUTH_STORAGE_KEY)
  if (storedAuth) {
    try {
      return JSON.parse(storedAuth)
    } catch (e) {
      console.error("Error parsing stored auth:", e)
    }
  }
  return { isAuthenticated: false }
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  ...loadAuthFromStorage(),
}

// AsyncThunk for login
export const login = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
      const response = await fetch(`${apiUrl}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || "Login failed")
      }

      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue("Network error occurred")
    }
  },
)

// Microsoft OAuth login thunk
export const microsoftLogin = createAsyncThunk("auth/microsoftLogin", async (token: string, { rejectWithValue }) => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
    const response = await fetch(`${apiUrl}/auth/microsoft`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
      credentials: "include",
    })

    if (!response.ok) {
      const errorData = await response.json()
      return rejectWithValue(errorData.message || "Microsoft login failed")
    }

    const data = await response.json()
    return data
  } catch (error) {
    return rejectWithValue("Network error occurred")
  }
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload
      state.user = user
      state.token = token
      state.isAuthenticated = true
      state.error = null

      safeLocalStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
          user,
          token,
          isAuthenticated: true,
        }),
      )
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false

      safeLocalStorage.removeItem(AUTH_STORAGE_KEY)

      // Call logout API to clear cookies
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
      fetch(`${apiUrl}/auth/logout`, {
        method: "POST",
        credentials: "include",
      }).catch((err) => console.error("Logout error:", err))
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log("Login fulfilled:", action.payload)
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload.data.user
        state.token = action.payload.data.token

        safeLocalStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify({
            user: action.payload.data.user,
            token: action.payload.data.token,
            isAuthenticated: true,
          }),
        )
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Microsoft Login
      .addCase(microsoftLogin.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(microsoftLogin.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload.data.user
        state.token = action.payload.data.token

        safeLocalStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify({
            user: action.payload.user,
            token: action.payload.token,
            isAuthenticated: true,
          }),
        )
      })
      .addCase(microsoftLogin.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { setCredentials, logout, clearError } = authSlice.actions

export default authSlice.reducer
