"use client"
import React, { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, X } from "lucide-react"
import { API_ENDPOINTS } from "@/config/api"

type Clinic = {
  id: string
  name: string
  address: string
  phone: string
  email?: string
  createdAt?: string
  updatedAt?: string
}

export default function ClinicsPage() {
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

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

  // Récupérer les cliniques depuis l'API
  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setError("Non authentifié")
          setLoading(false)
          return
        }

        const res = await fetch(API_ENDPOINTS.CLINICS.BASE, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          const text = await res.text()
          throw new Error(text || `Erreur ${res.status}`)
        }

        const data = await res.json()
        setClinics(data.clinics)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue")
      } finally {
        setLoading(false)
      }
    }

    fetchClinics()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("Non authentifié")
        return
      }

      const url = editingClinic 
        ? `${API_ENDPOINTS.CLINICS.BASE}/${editingClinic.id}`
        : API_ENDPOINTS.CLINICS.BASE

      const method = editingClinic ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || `Erreur ${res.status}`)
      }

      // Rafraîchir la liste des cliniques
      const clinicsRes = await fetch(API_ENDPOINTS.CLINICS.BASE, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })
      const data = await clinicsRes.json()
      setClinics(data.clinics)
      
      closeModal()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette clinique ?")) {
      return
    }

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("Non authentifié")
        return
      }

      const res = await fetch(`${API_ENDPOINTS.CLINICS.BASE}/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || `Erreur ${res.status}`)
      }

      // Mettre à jour l'état local
      setClinics(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la suppression")
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Erreur !</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Cliniques</h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          Ajouter une clinique
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
