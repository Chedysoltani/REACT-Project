"use client"
import React, { useEffect, useState } from "react"

interface Doctor {
  id: number
  name: string
  specialty: string
  email: string
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [editing, setEditing] = useState<Doctor | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: "", specialty: "", email: "", password: "" })

  // 🔹 Récupération des médecins
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
        if (!token) {
          setError("Token manquant. Veuillez vous reconnecter.")
          setLoading(false)
          return
        }

        const res = await fetch("http://localhost:5000/doctors", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          const text = await res.text()
          throw new Error(text || `Erreur ${res.status}`)
        }

        const data: Doctor[] = await res.json()
        setDoctors(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue")
      } finally {
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [])

  // 🔹 Ouvrir / Fermer modale
  const handleOpenModal = (doctor?: Doctor) => {
    if (doctor) {
      setEditing(doctor)
      setForm({
        name: doctor.name,
        specialty: doctor.specialty,
        email: doctor.email,
        password: "", // on ne montre pas le mot de passe existant
      })
    } else {
      setEditing(null)
      setForm({ name: "", specialty: "", email: "", password: "" })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditing(null)
  }

  // 🔹 Ajouter ou modifier un médecin
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        alert("Token manquant.")
        return
      }

      const method = editing ? "PATCH" : "POST"
      const url = editing
        ? `http://localhost:5000/doctors/${editing.id}`
        : "http://localhost:5000/doctors"

      const bodyData: any = {
        name: form.name,
        specialty: form.specialty,
        email: form.email,
      }

      // 🔹 Inclure le mot de passe uniquement pour la création ou si modifié
      if (!editing || form.password) {
        bodyData.password = form.password
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(bodyData),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || `Erreur ${res.status}`)
      }

      const data: Doctor = await res.json()

      if (editing) {
        setDoctors(doctors.map((d) => (d.id === editing.id ? data : d)))
      } else {
        setDoctors([...doctors, data])
      }

      handleCloseModal()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    }
  }

  // 🔹 Supprimer un médecin
  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        alert("Token manquant.")
        return
      }

      const res = await fetch(`http://localhost:5000/doctors/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || `Erreur ${res.status}`)
      }

      setDoctors(doctors.filter((d) => d.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Gestion des Médecins</h1>
      <p className="text-gray-600 mb-8">
        Gérez les médecins et leurs informations : ajout, modification ou suppression.
      </p>

      {loading && <div className="text-gray-600 mb-4">Chargement...</div>}
      {error && <div className="text-red-600 mb-4">{error}</div>}

      <div className="mb-6">
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-all shadow-md"
        >
          + Ajouter un médecin
        </button>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Liste des Médecins</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-700">
              <th className="p-3">Nom</th>
              <th className="p-3">Spécialité</th>
              <th className="p-3">Email</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((d) => (
              <tr key={d.id} className="border-t hover:bg-gray-50 transition">
                <td className="p-3">{d.name}</td>
                <td className="p-3">{d.specialty}</td>
                <td className="p-3">{d.email}</td>
                <td className="p-3 flex justify-center gap-3">
                  <button
                    onClick={() => handleOpenModal(d)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(d.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {doctors.length === 0 && !loading && (
              <tr>
                <td colSpan={4} className="text-center p-4 text-gray-500">
                  Aucun médecin pour le moment.
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
              {editing ? "Modifier un médecin" : "Ajouter un médecin"}
            </h2>

            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                placeholder="Nom du médecin"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                placeholder="Spécialité (ex: Cardiologie)"
                value={form.specialty}
                onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="password"
                placeholder="Mot de passe"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
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
