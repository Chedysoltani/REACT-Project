"use client"
import React, { useState } from "react"
import { Plus, Pencil, Trash2, X } from "lucide-react"

type Clinic = {
  id: number
  name: string
  address: string
  phone: string
}

export default function ClinicsPage() {
  const [clinics, setClinics] = useState<Clinic[]>([
    { id: 1, name: "Clinique El Amen", address: "Ariana", phone: "71 123 456" },
    { id: 2, name: "Clinique Hannibal", address: "Tunis", phone: "71 789 012" },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingClinic, setEditingClinic] = useState<Clinic | null>(null)
  const [formData, setFormData] = useState<Omit<Clinic, "id">>({
    name: "",
    address: "",
    phone: "",
  })

  const openModal = (clinic?: Clinic) => {
    if (clinic) {
      setEditingClinic(clinic)
      setFormData({
        name: clinic.name,
        address: clinic.address,
        phone: clinic.phone,
      })
    } else {
      setEditingClinic(null)
      setFormData({ name: "", address: "", phone: "" })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => setIsModalOpen(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingClinic) {
      setClinics((prev) =>
        prev.map((c) =>
          c.id === editingClinic.id ? { ...c, ...formData } : c
        )
      )
    } else {
      setClinics((prev) => [
        ...prev,
        { id: Date.now(), ...formData },
      ])
    }
    closeModal()
  }

  const handleDelete = (id: number) => {
    if (confirm("Voulez-vous vraiment supprimer cette clinique ?")) {
      setClinics((prev) => prev.filter((c) => c.id !== id))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">Gestion des Cliniques</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl shadow hover:bg-indigo-700 transition"
        >
          <Plus size={18} /> Ajouter
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="pb-3">Nom</th>
              <th className="pb-3">Adresse</th>
              <th className="pb-3">Téléphone</th>
              <th className="pb-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clinics.map((clinic) => (
              <tr key={clinic.id} className="border-b hover:bg-gray-50 transition">
                <td className="py-3">{clinic.name}</td>
                <td>{clinic.address}</td>
                <td>{clinic.phone}</td>
                <td className="text-center space-x-3">
                  <button
                    onClick={() => openModal(clinic)}
                    className="text-indigo-600 hover:text-indigo-800 transition"
                    title="Modifier"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(clinic.id)}
                    className="text-red-500 hover:text-red-700 transition"
                    title="Supprimer"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {clinics.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500 italic">
                  Aucune clinique enregistrée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-fadeIn">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={22} />
            </button>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {editingClinic ? "Modifier la Clinique" : "Ajouter une Clinique"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-600 mb-1">Nom de la Clinique</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Adresse</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Téléphone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
                >
                  {editingClinic ? "Modifier" : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
