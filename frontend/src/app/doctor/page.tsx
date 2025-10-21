"use client"
import React from "react"
import { CalendarDays, FileText, Pill } from "lucide-react"

export default function DoctorDashboard() {
  const cards = [
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
    <div className="pt-4">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Tableau de Bord - Médecin
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition"
          >
            <div className="mb-4">{card.icon}</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">{card.title}</h2>
            <p className="text-gray-500 text-sm">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
