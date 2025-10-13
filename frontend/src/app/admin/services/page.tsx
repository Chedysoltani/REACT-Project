"use client"
import React, { useState } from "react"
import { Plus, Pencil, Trash2, X } from "lucide-react"

type Service = {
  id: number
  name: string
  price: number
  duration: string
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([
    { id: 1, name: "Consultation Générale", price: 60, duration: "30 min" },
    { id: 2, name: "Radiologie", price: 120, duration: "45 min" },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [formData, setFormData] = useState<Omit<Service, "id">>({
    name: "",
    price: 0,
    duration: "",
  })

  const openModal = (service?: Service) => {
    if (service) {
      setEditingService(service)
      setFormData({
        name: service.name,
        price: service.price,
        duration: service.duration,
      })
    } else {
      setEditingService(null)
      setFormData({ name: "", price: 0, duration: "" })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => setIsModalOpen(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingService) {
      setServices((prev) =>
        prev.map((s) =>
          s.id === editingService.id ? { ...s, ...formData } : s
        )
      )
    } else {
      setServices((prev) => [
        ...prev,
        { id: Date.now(), ...formData },
      ])
    }
    closeModal()
  }

  const handleDelete = (id: number) => {
    if (confirm("Voulez-vous vraiment supprimer ce service ?")) {
      setServices((prev) => prev.filter((s) => s.id !== id))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">Configuration des Services</h1>
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
              <th className="pb-3">Nom du service</th>
              <th className="pb-3">Tarif (DT)</th>
              <th className="pb-3">Durée</th>
              <th className="pb-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id} className="border-b hover:bg-gray-50 transition">
                <td className="py-3">{service.name}</td>
                <td>{service.price}</td>
                <td>{service.duration}</td>
                <td className="text-center space-x-3">
                  <button
                    onClick={() => openModal(service)}
                    className="text-indigo-600 hover:text-indigo-800 transition"
                    title="Modifier"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="text-red-500 hover:text-red-700 transition"
                    title="Supprimer"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500 italic">
                  Aucun service configuré.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL AJOUT / MODIF */}
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
              {editingService ? "Modifier le Service" : "Ajouter un Service"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-600 mb-1">Nom du service</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Tarif (DT)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: Number(e.target.value) })
                  }
                  className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Durée</label>
                <input
                  type="text"
                  placeholder="Ex: 30 min"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
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
                  {editingService ? "Modifier" : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
