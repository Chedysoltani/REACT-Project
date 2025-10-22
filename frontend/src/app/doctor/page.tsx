"use client"
import React from "react"
import { CalendarDays, FileText, Pill } from "lucide-react"
import WelcomeMessage from "@/components/WelcomeMessage"

interface DashboardCard {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function DoctorDashboard() {
  const cards: DashboardCard[] = [
    {
      title: "Gestion de l'agenda",
      description: "Consultez et gérez vos rendez-vous quotidiens.",
      icon: <CalendarDays className="text-indigo-600" size={36} />,
    },
    {
      title: "Dossiers médicaux",
      description: "Accédez et mettez à jour les dossiers de vos patients.",
      icon: <FileText className="text-indigo-600" size={36} />,
    },
    {
      title: "Ordonnances",
      description: "Rédigez et téléchargez les ordonnances des patients.",
      icon: <Pill className="text-indigo-600" size={36} />,
    },
  ]

  return (
    <div className="p-6">
      <WelcomeMessage />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-6">
              <div className="mb-4">{card.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{card.title}</h3>
              <p className="text-gray-600">{card.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
