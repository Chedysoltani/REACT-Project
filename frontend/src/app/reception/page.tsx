"use client"
import React from "react"
import { CalendarDays, UserPlus, CreditCard } from "lucide-react"

export default function ReceptionDashboard() {
  const cards = [
    {
      title: "Rendez-vous",
      description: "Consultez et gérez les rendez-vous des patients.",
      icon: <CalendarDays className="text-indigo-600" size={36} />,
    },
    {
      title: "Enregistrement des patients",
      description: "Ajoutez de nouveaux patients et mettez à jour leurs informations.",
      icon: <UserPlus className="text-indigo-600" size={36} />,
    },
    {
      title: "Facturation",
      description: "Gérez les paiements et générez les factures des patients.",
      icon: <CreditCard className="text-indigo-600" size={36} />,
    },
  ]

  return (
    <div className="pt-4">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Tableau de Bord - Réceptionniste
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
