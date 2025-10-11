import React from "react"
import SidebarDoctor from "@/app/components/dashboard/SidebarDoctor"

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <SidebarDoctor />
      <div className="ml-64 flex-1 bg-gray-100 min-h-screen p-8">
        {children}
      </div>
    </div>
  )
}
