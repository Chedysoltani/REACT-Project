"use client"
import React, { useState } from "react"
import { Eye, CreditCard, Download } from "lucide-react"

// ✅ Interface TypeScript propre
interface PaiementData {
  id: number
  date: string
  montant: string
  statut: string
  methode: string
  consultation: string
  facture: string
}

export default function Paiement() {
  const [selectedPaiement, setSelectedPaiement] = useState<PaiementData | null>(null)

  const paiements: PaiementData[] = [
    {
      id: 1,
      date: "2025-10-01",
      montant: "120 DT",
      statut: "Payé",
      methode: "Carte bancaire",
      consultation: "Consultation avec Dr. Ahmed Ben Salah",
      facture: "/facture_ahmed.pdf",
    },
    {
      id: 2,
      date: "2025-09-20",
      montant: "90 DT",
      statut: "Payé",
      methode: "Espèces",
      consultation: "Consultation avec Dr. Leila Trabelsi",
      facture: "/facture_leila.pdf",
    },
  ]

  return (
    <div className="bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <CreditCard className="text-blue-600" size={22} />
        Historique des paiements
      </h2>

      {paiements.length === 0 ? (
        <p className="text-gray-600">Aucun paiement à afficher.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left">
              <th className="p-3 border-b">Date</th>
              <th className="p-3 border-b">Montant</th>
              <th className="p-3 border-b">Statut</th>
              <th className="p-3 border-b">Méthode</th>
              <th className="p-3 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paiements.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition">
                <td className="p-3 border-b">{p.date}</td>
                <td className="p-3 border-b font-semibold">{p.montant}</td>
                <td
                  className={`p-3 border-b font-medium ${
                    p.statut === "Payé" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {p.statut}
                </td>
                <td className="p-3 border-b">{p.methode}</td>
                <td className="p-3 border-b text-center flex justify-center gap-2">
                  <button
                    onClick={() => setSelectedPaiement(p)}
                    className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Eye size={16} />
                    Voir
                  </button>

                  {/* Bouton de téléchargement PDF */}
                  <a
                    href={p.facture}
                    download
                    className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 flex items-center gap-2"
                  >
                    <Download size={16} />
                    Facture
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Popup Détails Paiement */}
      {selectedPaiement && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-96 relative">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Détails du paiement
            </h3>
            <p className="text-gray-700">
              <strong>Date :</strong> {selectedPaiement.date}
            </p>
            <p className="text-gray-700">
              <strong>Montant :</strong> {selectedPaiement.montant}
            </p>
            <p className="text-gray-700">
              <strong>Statut :</strong>{" "}
              <span
                className={
                  selectedPaiement.statut === "Payé"
                    ? "text-green-600 font-semibold"
                    : "text-red-600 font-semibold"
                }
              >
                {selectedPaiement.statut}
              </span>
            </p>
            <p className="text-gray-700">
              <strong>Méthode :</strong> {selectedPaiement.methode}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Consultation :</strong> {selectedPaiement.consultation}
            </p>

            <div className="flex justify-between mt-4">
              <a
                href={selectedPaiement.facture}
                download
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                <Download size={16} />
                Télécharger Facture
              </a>
              <button
                onClick={() => setSelectedPaiement(null)}
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
