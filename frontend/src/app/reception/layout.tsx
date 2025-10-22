import React from "react"
import SidebarReception from "@/components/dashboard/SidebarReception"
import ProtectedRoute from "@/components/ProtectedRoute"

export default function ReceptionLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['receptionist']}>
      <div className="flex">
        <SidebarReception />
        <div className="ml-64 flex-1 bg-gray-100 min-h-screen p-8">
          {children}
        </div>
      </div>
    </ProtectedRoute>
  )
}
