import type React from "react"
import Sidebar from "@/components/ui/Sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen pt-16">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">{children}</div>
    </div>
  )
}
