"use client"
import React, { useState } from "react"
import SidebarPatient from "@/app/components/dashboard/SidebarPatient"
import { CalendarDays, FileText, CreditCard, Edit, Download } from "lucide-react"

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState("rendezvous")

  const appointments = [
    { id: 1, date: "2025-10-14", time: "10:30", doctor: "Dr. Karim Haddad", status: "Confirmé" },
    { id: 2, date: "2025-10-20", time: "14:00", doctor: "Dr. Amira Ben Salah", status: "En attente" },
  ]

  const history = [
    { id: 1, date: "2025-09-25", doctor: "Dr. Karim Haddad", notes: "Contrôle général" },
    { id: 2, date: "2025-09-02", doctor: "Dr. Amira Ben Salah", notes: "Résultats analyses" },
  ]

  const payments = [
    { id: 1, date: "2025-09-25", amount: "120 DT", method: "Carte bancaire", status: "Payé" },
    { id: 2, date: "2025-09-02", amount: "80 DT", method: "Espèces", status: "Payé" },
  ]

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <SidebarPatient />
      <div className="flex-1 p-8">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Espace Patient</h1>
        </header>

        <div className="flex space-x-3 mb-6">
          {[
            { id: "rendezvous", label: "Prochains Rendez-vous", icon: <CalendarDays className="w-5 h-5" /> },
            { id: "historique", label: "Historique", icon: <FileText className="w-5 h-5" /> },
            { id: "reservation", label: "Réserver / Modifier", icon: <Edit className="w-5 h-5" /> },
            { id: "paiement", label: "Paiement", icon: <CreditCard className="w-5 h-5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          {/* Rendez-vous */}
          {activeTab === "rendezvous" && (
            <div className="grid md:grid-cols-2 gap-4">
              {appointments.map((a) => (
                <div
                  key={a.id}
                  className="border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition"
                >
                  <div className="flex justify-between">
                    <p className="font-medium text-gray-800">{a.doctor}</p>
                    <span
                      className={`text-sm px-2 py-1 rounded ${
                        a.status === "Confirmé"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {a.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">📅 {a.date} — 🕒 {a.time}</p>
                  <button className="mt-3 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700">
                    Modifier
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Historique */}
          {activeTab === "historique" && (
            <div className="space-y-3">
              {history.map((h) => (
                <div
                  key={h.id}
                  className="border rounded-xl p-4 bg-white shadow-sm flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-gray-800">{h.doctor}</p>
                    <p className="text-gray-600 text-sm">{h.date} — {h.notes}</p>
                  </div>
                  <button className="flex items-center bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700">
                    <Download className="w-4 h-4 mr-2" /> Télécharger PDF
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Réservation */}
          {activeTab === "reservation" && (
            <form className="bg-white p-6 rounded-xl shadow-md space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">Réserver ou modifier un rendez-vous</h2>
              <div>
                <label className="block text-gray-700 mb-1">Médecin</label>
                <select className="w-full border rounded-lg p-2">
                  <option>Dr. Karim Haddad</option>
                  <option>Dr. Amira Ben Salah</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Date</label>
                <input type="date" className="w-full border rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Heure</label>
                <input type="time" className="w-full border rounded-lg p-2" />
              </div>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Réserver
              </button>
            </form>
          )}

          {/* Paiement */}
          {activeTab === "paiement" && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-xl shadow-md">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Montant</th>
                    <th className="px-4 py-2 text-left">Méthode</th>
                    <th className="px-4 py-2 text-left">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2">{p.date}</td>
                      <td className="px-4 py-2">{p.amount}</td>
                      <td className="px-4 py-2">{p.method}</td>
                      <td className="px-4 py-2">
                        <span className="bg-green-100 text-green-700 text-sm px-2 py-1 rounded">
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
