"use client"
import React, { useState } from "react"
import { CalendarDays, FileText, CreditCard, Home, LogOut, Menu, X } from "lucide-react"
import Link from "next/link"

export default function SidebarPatient() {
  const [open, setOpen] = useState(true)

  const menuItems = [
    { id: 1, name: "Tableau de bord", icon: <Home className="w-5 h-5" />, path: "/dashboard/patient" },
    { id: 2, name: "Rendez-vous", icon: <CalendarDays className="w-5 h-5" />, path: "/dashboard/patient#rendezvous" },
    { id: 3, name: "Historique", icon: <FileText className="w-5 h-5" />, path: "/dashboard/patient#historique" },
    { id: 4, name: "Paiement", icon: <CreditCard className="w-5 h-5" />, path: "/dashboard/patient#paiement" },
  ]

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`${
          open ? "w-64" : "w-20"
        } bg-blue-700 text-white min-h-screen transition-all duration-300 flex flex-col`}
      >
        <div className="flex items-center justify-between p-4 border-b border-blue-500">
          <h1 className={`${open ? "block" : "hidden"} text-xl font-bold`}>Patient</h1>
          <button onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 mt-4">
          {menuItems.map((item) => (
            <Link
              href={item.path}
              key={item.id}
              className="flex items-center space-x-3 py-2 px-4 hover:bg-blue-600 rounded-lg mx-2 my-1 transition"
            >
              {item.icon}
              {open && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="border-t border-blue-500 p-4">
          <button className="flex items-center space-x-3 hover:bg-blue-600 rounded-lg px-4 py-2 w-full">
            <LogOut className="w-5 h-5" />
            {open && <span>Déconnexion</span>}
          </button>
        </div>
      </div>
    </div>
  )
}
