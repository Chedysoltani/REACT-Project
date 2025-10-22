"use client"
import React from "react"
import { useRouter } from "next/navigation"
import { 
  Building2, 
  Users2, 
  ClipboardList, 
  LogOut,
  UserCog,
  Stethoscope,
  Calendar,
  FileText
} from "lucide-react"
import AdminStats from "@/components/dashboard/AdminStats"

interface NavItem {
  title: string
  icon: React.ReactNode
  href: string
}

export default function AdminDashboard() {
  const router = useRouter()

  const navItems: NavItem[] = [
    {
      title: "Cliniques",
      icon: <Building2 size={20} className="text-blue-600" />,
      href: "/admin/clinics"
    },
    {
      title: "Services",
      icon: <ClipboardList size={20} className="text-emerald-600" />,
      href: "/admin/services"
    },
    {
      title: "Personnel",
      icon: <UserCog size={20} className="text-purple-600" />,
      href: "/admin/staff"
    },
    {
      title: "Rendez-vous",
      icon: <Calendar size={20} className="text-amber-600" />,
      href: "/admin/appointments"
    },
    {
      title: "Rapports",
      icon: <FileText size={20} className="text-rose-600" />,
      href: "/admin/reports"
    }
  ]

  const handleLogout = () => {
    // Supprimer le token et rediriger vers la page de connexion
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Barre de navigation supérieure */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Admin</h1>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <LogOut size={18} />
          Déconnexion
        </button>
      </div>

      {/* Statistiques rapides */}
      {/* <div className="mb-8">
        <AdminStats />
      </div> */}

      {/* Navigation principale */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {navItems.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
          >
            <div className="p-2 bg-gray-50 rounded-lg">
              {item.icon}
            </div>
            <span className="font-medium text-gray-800">{item.title}</span>
          </a>
        ))}
      </div>

      {/* Section d'activité récente */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Activité récente</h2>
          <button className="text-sm text-blue-600 hover:text-blue-800">Voir tout</button>
        </div>
        
        <div className="space-y-4">
          {[1, 2].map((item) => (
            <div key={item} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Stethoscope size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Nouveau rendez-vous</p>
                  <p className="text-xs text-gray-500">Il y a 2h</p>
                </div>
              </div>
              <button className="text-sm text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="19" cy="12" r="1" />
                  <circle cx="5" cy="12" r="1" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}