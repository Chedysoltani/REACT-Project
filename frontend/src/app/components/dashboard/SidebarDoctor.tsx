"use client"
import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { CalendarDays, FileText, Pill, LayoutDashboard, LogOut } from "lucide-react"

const SidebarDoctor = () => {
  const pathname = usePathname()

  const menu = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/doctor" },
    { name: "Agenda", icon: <CalendarDays size={20} />, path: "/doctor/agenda" },
    { name: "Dossiers Médicaux", icon: <FileText size={20} />, path: "/doctor/patients" },
    { name: "Ordonnances", icon: <Pill size={20} />, path: "/doctor/ordonnances" },
  ]

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-indigo-600 to-indigo-800 text-white shadow-xl flex flex-col">
      <div className="p-5 text-center text-2xl font-semibold border-b border-indigo-500">
        Médecin
      </div>

      <nav className="flex-1 mt-4 space-y-2">
        {menu.map((item, index) => (
          <Link key={index} href={item.path}>
            <div
              className={`flex items-center gap-3 px-6 py-3 rounded-xl mx-3 cursor-pointer transition ${
                pathname === item.path
                  ? "bg-indigo-500 text-white shadow-lg"
                  : "text-gray-200 hover:bg-indigo-700"
              }`}
            >
              {item.icon}
              <span className="text-sm font-medium">{item.name}</span>
            </div>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-indigo-500">
        <button className="flex items-center gap-3 px-4 py-2 rounded-lg bg-indigo-700 hover:bg-indigo-600 w-full">
          <LogOut size={18} />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  )
}

export default SidebarDoctor
