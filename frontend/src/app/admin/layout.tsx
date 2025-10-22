import React from "react"
import SidebarAdmin from "../components/dashboard/Sidebaradmin"
import ProtectedRoute from "@/components/ProtectedRoute"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="flex">
        <SidebarAdmin />
        <div className="ml-64 flex-1 bg-gray-100 min-h-screen p-8">
          {children}
        </div>
      </div>
    </ProtectedRoute>
  )
}
