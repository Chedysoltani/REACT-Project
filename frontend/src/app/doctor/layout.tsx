import React from "react"
import SidebarDoctor from "@/components/dashboard/SidebarDoctor"
import ProtectedRoute from "@/components/ProtectedRoute"

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['doctor']}>
      <div className="flex">
        <SidebarDoctor />
        <div className="ml-64 flex-1 bg-gray-100 min-h-screen p-8">
          {children}
        </div>
      </div>
    </ProtectedRoute>
  )
}
