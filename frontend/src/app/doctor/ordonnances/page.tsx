"use client"

import React, { useState } from "react"
import { Dialog } from "@headlessui/react"
import { ChevronDown, ChevronUp, FileDown } from "lucide-react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { Button } from "../../components/ui/button"

interface Ordonnance {
  id: number
  patient: string
  date: string
  medicaments: { nom: string; dose: string; frequence: string }[]
}

export default function OrdonnancesPage() {
  const [ordonnances, setOrdonnances] = useState<Ordonnance[]>([
    {
      id: 1,
      patient: "Mme Ben Youssef",
      date: "2025-10-11",
      medicaments: [
        { nom: "Doliprane", dose: "500mg", frequence: "2x par jour" },
        { nom: "Augmentin", dose: "1g", frequence: "matin et soir" },
      ],
    },
    {
      id: 2,
      patient: "Mr Trabelsi",
      date: "2025-10-10",
      medicaments: [{ nom: "Ibuprofène", dose: "400mg", frequence: "1x par jour" }],
    },
  ])

  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    patient: "",
    medicaments: "",
  })

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const generatePDF = (ordonnance: Ordonnance) => {
    const doc = new jsPDF()
    doc.text("Ordonnance Médicale", 80, 15)
    doc.text(`Docteur: Dr. Saif Eddine Yedes`, 20, 25)
    doc.text(`Patient: ${ordonnance.patient}`, 20, 35)
    doc.text(`Date: ${ordonnance.date}`, 20, 45)

    autoTable(doc, {
      startY: 55,
      head: [["Médicament", "Dose", "Fréquence"]],
      body: ordonnance.medicaments.map((m) => [m.nom, m.dose, m.frequence]),
    })

    doc.save(`Ordonnance_${ordonnance.patient}.pdf`)
  }

  const handleAddOrdonnance = () => {
    if (!formData.patient || !formData.medicaments) return
    const newOrd: Ordonnance = {
      id: ordonnances.length + 1,
      patient: formData.patient,
      date: new Date().toISOString().split("T")[0],
      medicaments: formData.medicaments.split(",").map((med) => ({
        nom: med.trim(),
        dose: "500mg",
        frequence: "2x par jour",
      })),
    }
    setOrdonnances([...ordonnances, newOrd])
    setFormData({ patient: "", medicaments: "" })
    setIsOpen(false)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Ordonnances</h1>
        <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={() => setIsOpen(true)}>
          + Nouvelle ordonnance
        </Button>
      </div>

      <div className="bg-white shadow-md rounded-2xl p-4 border border-gray-200">
        {ordonnances.map((ord) => (
          <div
            key={ord.id}
            className="border-b border-gray-200 py-3 flex flex-col gap-2 transition hover:bg-gray-50"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-800">{ord.patient}</p>
                <p className="text-gray-500 text-sm">{ord.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => generatePDF(ord)}
                >
                  <FileDown className="w-4 h-4" /> Télécharger
                </Button>
                <button onClick={() => toggleExpand(ord.id)} className="text-gray-600">
                  {expandedId === ord.id ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {expandedId === ord.id && (
              <div className="bg-gray-50 rounded-xl p-3 mt-2">
                <table className="w-full text-left text-sm text-gray-700">
                  <thead>
                    <tr className="border-b">
                      <th className="pb-1">Médicament</th>
                      <th className="pb-1">Dose</th>
                      <th className="pb-1">Fréquence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ord.medicaments.map((m, i) => (
                      <tr key={i} className="border-b">
                        <td className="py-1">{m.nom}</td>
                        <td className="py-1">{m.dose}</td>
                        <td className="py-1">{m.frequence}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Popup d’ajout d’ordonnance */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <Dialog.Title className="text-xl font-semibold mb-4 text-gray-800">
              Nouvelle Ordonnance
            </Dialog.Title>
            <div className="flex flex-col gap-3">
              <label className="text-gray-600">Nom du patient</label>
              <input
                type="text"
                value={formData.patient}
                onChange={(e) => setFormData({ ...formData, patient: e.target.value })}
                placeholder="Ex: Mme Dupont"
                className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <label className="text-gray-600 mt-2">Médicaments (séparés par des virgules)</label>
              <input
                type="text"
                value={formData.medicaments}
                onChange={(e) => setFormData({ ...formData, medicaments: e.target.value })}
                placeholder="Ex: Doliprane, Ibuprofène"
                className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="flex justify-end mt-6 gap-3">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Annuler
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleAddOrdonnance}>
                Ajouter
              </Button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  )
}
