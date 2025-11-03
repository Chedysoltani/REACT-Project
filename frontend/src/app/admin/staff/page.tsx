"use client"
import React, { useEffect, useState } from "react"

interface Staff {
  id: number
  name: string
  role: string
  email: string
  phone?: string
}

export default function StaffPage() {
  const [staffList, setStaffList] = useState<Staff[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        if (!token) {
          setError("Token manquant. Veuillez vous reconnecter.")
          setLoading(false)
          return
        }
        const res = await fetch("http://localhost:5000/users/staff", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        })
        if (!res.ok) {
          const text = await res.text()
          throw new Error(text || `Erreur ${res.status}`)
        }
        const data: Array<{ id: number; name: string; email: string; role: 'doctor' | 'receptionist' }> = await res.json()
        const mapped: Staff[] = data.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
        }))
        setStaffList(mapped)
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Erreur inconnue")
      } finally {
        setLoading(false)
      }
    }
    fetchStaff()
  }, [])

  const [editing, setEditing] = useState<Staff | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: "", role: "", email: "", phone: "" })

  const displayRole = (role: string) => {
    if (role === 'doctor') return 'Médecin'
    if (role === 'receptionist') return 'Réceptionniste'
    return role
  }

  const handleOpenModal = (staff?: Staff) => {
    if (staff) {
      setEditing(staff)
      setForm({
        name: staff.name,
        role: staff.role,
        email: staff.email,
        phone: staff.phone || "",
      })
    } else {
      setEditing(null)
      setForm({ name: "", role: "", email: "", phone: "" })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditing(null)
  }

  const handleSave = () => {
    if (editing) {
      setStaffList(staffList.map((s) => (s.id === editing.id ? { ...editing, ...form } : s)))
    } else {
      const newStaff: Staff = { id: staffList.length + 1, ...form }
      setStaffList([...staffList, newStaff])
    }
    handleCloseModal()
  }

  const handleDelete = (id: number) => {
    setStaffList(staffList.filter((s) => s.id !== id))
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Gestion du Personnel</h1>
      <p className="text-gray-600 mb-8">
        Ajoutez, modifiez ou supprimez les membres du staff de la clinique.
      </p>

      {loading && (
        <div className="mb-4 text-gray-600">Chargement...</div>
      )}
      {error && (
        <div className="mb-4 text-red-600">{error}</div>
      )}

      {/* Bouton Ajouter */}
      <div className="mb-6">
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-all shadow-md"
        >
          + Ajouter un membre
        </button>
      </div>

      {/* Tableau du staff */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Liste du Personnel</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-700">
              <th className="p-3">Nom</th>
              <th className="p-3">Rôle</th>
              <th className="p-3">Email</th>
              <th className="p-3">Téléphone</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((staff) => (
              <tr key={staff.id} className="border-t hover:bg-gray-50 transition">
                <td className="p-3">{staff.name}</td>
                <td className="p-3">{displayRole(staff.role)}</td>
                <td className="p-3">{staff.email}</td>
                <td className="p-3">{staff.phone || ''}</td>
                <td className="p-3 flex justify-center gap-3">
                  <button
                    onClick={() => handleOpenModal(staff)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg transition-all"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(staff.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition-all"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {staffList.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-500">
                  {loading ? ' ' : 'Aucun membre du staff pour le moment.'}
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
              {editing ? "Modifier un membre" : "Ajouter un membre"}
            </h2>

            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                placeholder="Nom complet"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                placeholder="Rôle"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
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
                type="text"
                placeholder="Téléphone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
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
