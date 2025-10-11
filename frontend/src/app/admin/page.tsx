"use client"
import React from "react"
import { Building2, Settings, Users2 } from "lucide-react"

export default function AdminDashboard() {
  const cards = [
    {
      title: "Création de clinique",
      description: "Ajoutez de nouvelles cliniques et configurez leurs informations.",
      icon: <Building2 className="text-indigo-600" size={36} />,
    },
    {
      title: "Configuration des services",
      description: "Définissez les spécialités, prix et durées des consultations.",
      icon: <Settings className="text-indigo-600" size={36} />,
    },
    {
      title: "Gestion du staff",
      description: "Ajoutez, modifiez ou supprimez les comptes du personnel médical.",
      icon: <Users2 className="text-indigo-600" size={36} />,
    },
  ]

  return (
    <div className="pt-4">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Tableau de Bord - Admin
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
