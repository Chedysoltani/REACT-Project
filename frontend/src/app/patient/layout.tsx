"use client";
import React, { useState } from "react";
import SidebarPatient from "@/app/components/dashboard/SidebarPatient";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <ProtectedRoute allowedRoles={['patient']}>
      <div className="flex min-h-screen bg-gray-100">
        <SidebarPatient isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className="flex-1 flex flex-col">
          <header className="bg-white shadow-md p-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-700">Espace Patient</h1>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              {isSidebarOpen ? "Masquer" : "Afficher"}
            </button>
          </header>
          <main className="p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
