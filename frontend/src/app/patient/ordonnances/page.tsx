"use client"
import React, { useState } from "react"
import { ChevronDown, ChevronUp, Download } from "lucide-react"

export default function Ordonnances() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const ordonnances = [
    {
      id: 1,
      medecin: "Dr. Ahmed Ben Salah",
      date: "2025-10-10",
      fichier: "/ordonnance_ahmed.pdf",
      medicaments: [
        { nom: "Paracétamol 500mg", posologie: "1 comprimé matin et soir" },
        { nom: "Ibuprofène 400mg", posologie: "1 comprimé après le repas" },
      ],
    },
    {
      id: 2,
      medecin: "Dr. Leila Trabelsi",
      date: "2025-10-05",
      fichier: "/ordonnance_leila.pdf",
      medicaments: [
        { nom: "Amoxicilline 1g", posologie: "1 comprimé toutes les 8 heures" },
        { nom: "Vitamine C 500mg", posologie: "1 comprimé par jour" },
      ],
    },
  ]

  const toggleDetails = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Téléchargement des ordonnances
      </h2>

      {ordonnances.length === 0 ? (
        <p className="text-gray-600">Aucune ordonnance disponible.</p>
      ) : (
        <div className="space-y-4">
          {ordonnances.map((ordo, index) => (
            <div
              key={ordo.id}
              className="border border-gray-200 rounded-lg hover:shadow-md transition-all"
            >
              <div
                className="flex justify-between items-center p-4 cursor-pointer"
                onClick={() => toggleDetails(index)}
              >
                <div>
                  <h3 className="font-semibold text-gray-800">{ordo.medecin}</h3>
                  <p className="text-sm text-gray-500">{ordo.date}</p>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={ordo.fichier}
                    download
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    <Download size={16} />
                    PDF
                  </a>
                  {openIndex === index ? (
                    <ChevronUp className="text-gray-600" size={22} />
                  ) : (
                    <ChevronDown className="text-gray-600" size={22} />
                  )}
                </div>
              </div>

              {openIndex === index && (
                <div className="bg-gray-50 border-t border-gray-200 p-4 animate-fadeIn">
                  <h4 className="font-medium text-gray-700 mb-2">
                    Médicaments prescrits :
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-600">
                    {ordo.medicaments.map((med, i) => (
                      <li key={i}>
                        <span className="font-semibold">{med.nom}</span> —{" "}
                        {med.posologie}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
