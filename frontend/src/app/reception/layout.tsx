import React from "react"
import SidebarReception from "../components/dashboard/SidebarReception"

export default function ReceptionLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <SidebarReception />
      <div className="ml-64 flex-1 bg-gray-100 min-h-screen p-8">
        {children}
      </div>
    </div>
  )
}
