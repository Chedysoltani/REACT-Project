"use client"
import React, { useState } from "react"

export default function RendezVous() {
  const [rendezVous, setRendezVous] = useState([
    {
      id: 1,
      date: "2025-10-15",
      heure: "10:00",
      medecin: "Dr. Ahmed Ben Salah",
      statut: "Confirmé",
    },
    {
      id: 2,
      date: "2025-10-18",
      heure: "14:30",
      medecin: "Dr. Leila Trabelsi",
      statut: "En attente",
    },
  ])

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Vos prochains rendez-vous</h2>

      {rendezVous.length === 0 ? (
        <p className="text-gray-600">Aucun rendez-vous programmé.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-700">
              <th className="p-3 border-b">Date</th>
              <th className="p-3 border-b">Heure</th>
              <th className="p-3 border-b">Médecin</th>
              <th className="p-3 border-b">Statut</th>
              <th className="p-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rendezVous.map((rdv) => (
              <tr key={rdv.id} className="hover:bg-gray-50 transition">
                <td className="p-3 border-b">{rdv.date}</td>
                <td className="p-3 border-b">{rdv.heure}</td>
                <td className="p-3 border-b">{rdv.medecin}</td>
                <td
                  className={`p-3 border-b font-medium ${
                    rdv.statut === "Confirmé"
                      ? "text-green-600"
                      : rdv.statut === "En attente"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {rdv.statut}
                </td>
                <td className="p-3 border-b">
                  <button className="text-blue-600 hover:underline mr-2">Modifier</button>
                  <button className="text-red-600 hover:underline">Annuler</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
