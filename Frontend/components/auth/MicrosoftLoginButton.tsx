"use client"
import { MICROSOFT_AUTH } from "@/lib/constants"
import { useMsal, MsalProvider } from "@azure/msal-react"
import { PublicClientApplication, EventType } from "@azure/msal-browser"

// Initialize MSAL instance
const msalConfig = {
  auth: {
    clientId: MICROSOFT_AUTH.CLIENT_ID,
    authority: MICROSOFT_AUTH.AUTHORITY,
    redirectUri: MICROSOFT_AUTH.REDIRECT_URI,
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
}

// Create the MSAL instance outside the component
let msalInstance: PublicClientApplication

// Initialize MSAL instance safely
if (typeof window !== "undefined") {
  try {
    msalInstance = new PublicClientApplication(msalConfig)

    // Register Redirect callbacks
    msalInstance.addEventCallback((event) => {
      if (event.eventType === EventType.LOGIN_SUCCESS) {
        console.log("Login success")
      }
    })
  } catch (error) {
    console.error("Failed to initialize MSAL:", error)
    // Create a dummy instance to prevent errors
    msalInstance = {} as PublicClientApplication
  }
} else {
  // Create a dummy instance for SSR
  msalInstance = {} as PublicClientApplication
}

// Microsoft Login Button Component
function MicrosoftButton() {
  const { instance } = useMsal()

  const handleLogin = () => {
    try {
      instance.loginRedirect({
        scopes: MICROSOFT_AUTH.SCOPES,
      })
    } catch (error) {
      console.error("Microsoft login error:", error)
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogin}
      className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 23 23" className="mr-2">
        <path fill="#f3f3f3" d="M0 0h23v23H0z" />
        <path fill="#f35325" d="M1 1h10v10H1z" />
        <path fill="#81bc06" d="M12 1h10v10H12z" />
        <path fill="#05a6f0" d="M1 12h10v10H1z" />
        <path fill="#ffba08" d="M12 12h10v10H12z" />
      </svg>
      Sign in with Microsoft
    </button>
  )
}

// Provider wrapper with error handling
export default function MicrosoftLoginButton() {
  // Only render the Microsoft button if we're in the browser
  if (typeof window === "undefined") {
    return <div>Loading Microsoft login...</div>
  }

  try {
    return (
      <MsalProvider instance={msalInstance}>
        <MicrosoftButton />
      </MsalProvider>
    )
  } catch (error) {
    console.error("Error rendering Microsoft login button:", error)
    return (
      <button
        type="button"
        disabled
        className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-400 bg-gray-100"
      >
        Microsoft login unavailable
      </button>
    )
  }
}
