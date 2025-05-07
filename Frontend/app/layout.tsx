import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import type { Metadata } from "next"
import ReduxProvider from "@/components/providers/ReduxProvider"
import AuthProvider from "@/components/providers/AuthProvider"
import Header from "@/components/ui/Header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Next.js Authentication App",
  description: "Authentication with Next.js App Router, Redux Toolkit, and Microsoft OAuth",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <AuthProvider>
            <Header />
            <main className="min-h-screen">{children}</main>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
