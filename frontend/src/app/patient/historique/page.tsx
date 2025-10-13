"use client"
import React, { useState } from "react"
import { Eye } from "lucide-react"

interface ConsultationData {
  id: number
  medecin: string
  date: string
  motif: string
  diagnostic: string
  traitement: string
}

export default function Historique() {
  const [selectedConsultation, setSelectedConsultation] = useState<ConsultationData | null>(null)

  const consultations: ConsultationData[] = [
    {
      id: 1,
      medecin: "Dr. Ahmed Ben Salah",
      date: "2025-09-15",
      motif: "Douleur abdominale",
      diagnostic: "Gastro-entérite légère",
      traitement: "Paracétamol + régime alimentaire léger",
    },
    {
      id: 2,
      medecin: "Dr. Leila Trabelsi",
      date: "2025-08-10",
      motif: "Fièvre et toux",
      diagnostic: "Infection virale bénigne",
      traitement: "Repos + Vitamine C",
    },
  ]

  return (
    <div className="bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Historique des consultations
      </h2>

      {consultations.length === 0 ? (
        <p className="text-gray-600">Aucun historique trouvé.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left">
              <th className="p-3 border-b">Médecin</th>
              <th className="p-3 border-b">Date</th>
              <th className="p-3 border-b">Motif</th>
              <th className="p-3 border-b text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {consultations.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50 transition">
                <td className="p-3 border-b">{c.medecin}</td>
                <td className="p-3 border-b">{c.date}</td>
                <td className="p-3 border-b">{c.motif}</td>
                <td className="p-3 border-b text-center">
                  <button
                    onClick={() => setSelectedConsultation(c)}
                    className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2 mx-auto"
                  >
                    <Eye size={16} />
                    Voir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Popup Détails */}
      {selectedConsultation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-96 relative">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Détails de la consultation
            </h3>
            <p className="text-gray-700">
              <strong>Médecin :</strong> {selectedConsultation.medecin}
            </p>
            <p className="text-gray-700">
              <strong>Date :</strong> {selectedConsultation.date}
            </p>
            <p className="text-gray-700">
              <strong>Motif :</strong> {selectedConsultation.motif}
            </p>
            <p className="text-gray-700">
              <strong>Diagnostic :</strong> {selectedConsultation.diagnostic}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Traitement :</strong> {selectedConsultation.traitement}
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setSelectedConsultation(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
