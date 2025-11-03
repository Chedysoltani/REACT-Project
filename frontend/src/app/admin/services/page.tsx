"use client"
import React, { useEffect, useState } from "react"

interface Service {
  id: number
  name: string
  price: number
  duration: string
}

export default function ServicePage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [editing, setEditing] = useState<Service | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: "", price: "", duration: "" })

  // 🔹 Récupération des services au chargement
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
        if (!token) {
          setError("Token manquant. Veuillez vous reconnecter.")
          setLoading(false)
          return
        }

        const res = await fetch("http://localhost:5000/services", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          const text = await res.text()
          throw new Error(text || `Erreur ${res.status}`)
        }

        const data: Service[] = await res.json()
        setServices(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue")
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  // 🔹 Ouvrir / Fermer modale
  const handleOpenModal = (service?: Service) => {
    if (service) {
      setEditing(service)
      setForm({
        name: service.name,
        price: service.price.toString(),
        duration: service.duration,
      })
    } else {
      setEditing(null)
      setForm({ name: "", price: "", duration: "" })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditing(null)
  }

  // 🔹 Ajouter ou modifier un service
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        alert("Token manquant.")
        return
      }

      const method = editing ? "PUT" : "POST"
      const url = editing
        ? `http://localhost:5000/services/${editing.id}`
        : "http://localhost:5000/services"

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          price: parseFloat(form.price),
          duration: form.duration,
        }),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || `Erreur ${res.status}`)
      }

      const data: Service = await res.json()

      if (editing) {
        setServices(services.map((s) => (s.id === editing.id ? data : s)))
      } else {
        setServices([...services, data])
      }

      handleCloseModal()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    }
  }

  // 🔹 Supprimer un service
  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        alert("Token manquant.")
        return
      }

      const res = await fetch(`http://localhost:5000/services/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || `Erreur ${res.status}`)
      }

      setServices(services.filter((s) => s.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Gestion des Services</h1>
      <p className="text-gray-600 mb-8">
        Gérez les services proposés par la clinique : ajout, modification ou suppression.
      </p>

      {loading && <div className="text-gray-600 mb-4">Chargement...</div>}
      {error && <div className="text-red-600 mb-4">{error}</div>}

      <div className="mb-6">
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-all shadow-md"
        >
          + Ajouter un service
        </button>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Liste des Services</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-700">
              <th className="p-3">Nom</th>
              <th className="p-3">Prix</th>
              <th className="p-3">Durée</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.id} className="border-t hover:bg-gray-50 transition">
                <td className="p-3">{s.name}</td>
                <td className="p-3">{s.price} TND</td>
                <td className="p-3">{s.duration}</td>
                <td className="p-3 flex justify-center gap-3">
                  <button
                    onClick={() => handleOpenModal(s)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {services.length === 0 && !loading && (
              <tr>
                <td colSpan={4} className="text-center p-4 text-gray-500">
                  Aucun service pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg relative">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {editing ? "Modifier un service" : "Ajouter un service"}
            </h2>

            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                placeholder="Nom du service"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="number"
                placeholder="Prix"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                placeholder="Durée (ex: 30min)"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                {editing ? "Mettre à jour" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
