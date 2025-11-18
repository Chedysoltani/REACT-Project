"use client"
import React, { useEffect, useState } from "react"
import { API_ENDPOINTS } from "@/config/api"

interface Doctor {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  specialty: string
  clinicId: string
  address: string
  password?: string
}

interface Clinic {
  id: string
  name: string
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [editing, setEditing] = useState<Doctor | null>(null)
  const [showModal, setShowModal] = useState(false)
  // Définition du type pour le formulaire
  interface DoctorFormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    specialty: string;
    clinicId: string;
    address: string;
  }

  const [form, setForm] = useState<DoctorFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    specialty: "",
    clinicId: "",
    address: ""
  })

  // 🔹 Récupération des médecins et des cliniques
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
        if (!token) {
          setError("Token manquant. Veuillez vous reconnecter.")
          setLoading(false)
          return
        }

        // Récupérer les médecins
        const [doctorsRes, clinicsRes] = await Promise.all([
          fetch(API_ENDPOINTS.USERS.DOCTORS, {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          }),
          fetch(API_ENDPOINTS.CLINICS.BASE, {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          })
        ])

        if (!doctorsRes.ok || !clinicsRes.ok) {
          throw new Error('Erreur lors du chargement des données')
        }

        const doctorsData = await doctorsRes.json()
        const clinicsResponse = await clinicsRes.json()
        const clinicsData = Array.isArray(clinicsResponse) ? clinicsResponse : (clinicsResponse.clinics || [])

        setDoctors(doctorsData)
        setClinics(clinicsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // 🔹 Réinitialiser le formulaire
  const resetForm = () => {
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      specialty: "",
      clinicId: "",
      address: ""
    })
  }

  // 🔹 Ouvrir le modal pour éditer un médecin
  const handleEditDoctor = (doctor: Doctor) => {
    setEditing(doctor)
    setForm({
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      email: "", // Ne pas pré-remplir l'email
      phone: doctor.phone || "",
      specialty: doctor.specialty || "",
      clinicId: doctor.clinicId ? String(doctor.clinicId) : "",
      address: doctor.address || "",
      password: "" // Ne pas pré-remplir le mot de passe
    })
    setShowModal(true)
  }

  // 🔹 Ouvrir le modal pour ajouter un nouveau médecin
  const handleOpenModal = () => {
    // Réinitialiser le formulaire avec des champs vides
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      specialty: "",
      clinicId: "",
      address: ""
    })
    setEditing(null)
    setShowModal(true)
  }

  // 🔹 Fermer le modal
  const handleCloseModal = () => {
    setShowModal(false)
    setEditing(null)
    resetForm()
  }

  // 🔹 Sauvegarder un médecin (création ou mise à jour)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("Non authentifié")
        return
      }

      // Validation des champs obligatoires
      if (!form.firstName || !form.lastName || !form.phone || !form.specialty || !form.address || !form.clinicId) {
        setError("Tous les champs sont obligatoires")
        return
      }

      // Validation de l'email pour la création ou la mise à jour
      if (!form.email) {
        setError("L'email du médecin est requis")
        return
      }

      // Validation du mot de passe (obligatoire pour la création, optionnel pour la mise à jour)
      if (!editing && !form.password) {
        setError("Le mot de passe est requis pour créer un nouveau médecin")
        return
      }

      if (form.password && form.password.length < 6) {
        setError("Le mot de passe doit contenir au moins 6 caractères")
        return
      }

      // Préparer les données pour l'API
      const doctorData = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        specialty: form.specialty,
        address: form.address,
        clinicId: form.clinicId, // Keep as string, don't convert to number
        // Inclure le mot de passe uniquement s'il est fourni
        ...(form.password && { password: form.password })
      }

      const url = editing 
        ? `${API_ENDPOINTS.USERS.DOCTORS}/${editing.id}`
        : API_ENDPOINTS.USERS.DOCTORS

      const method = editing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(doctorData)
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Erreur API:', errorText)
        throw new Error(errorText || 'Erreur lors de la sauvegarde')
      }

      // Recharger la liste des médecins
      window.location.reload()
    } catch (err) {
      console.error('Erreur:', err)
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
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

      const res = await fetch(`${API_ENDPOINTS.USERS.DOCTORS}/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || `Erreur ${res.status}`)
      }

      // Mettre à jour la liste des médecins localement
      setDoctors(prevDoctors => prevDoctors.filter(d => d.id !== id))
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
          type="button"
          onClick={handleOpenModal}
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
              <th className="p-3">Prénom</th>
              <th className="p-3">Spécialité</th>
              <th className="p-3">Email</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((d) => (
              <tr key={d.id} className="border-t hover:bg-gray-50 transition">
                <td className="p-3">{d.lastName}</td>
                <td className="p-3">{d.firstName}</td>
                <td className="p-3">{d.specialty}</td>
                <td className="p-3">{d.email}</td>
                <td className="p-3 flex justify-center gap-3">
                  <button
                    onClick={() => handleEditDoctor(d)}
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
                <td colSpan={5} className="text-center p-4 text-gray-500">
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

            <form onSubmit={handleSave}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
                      Prénom *
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="firstName"
                      type="text"
                      placeholder="Prénom du médecin"
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
                      Nom *
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="lastName"
                      type="text"
                      placeholder="Nom du médecin"
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                      Email du médecin *
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="email"
                      type="email"
                      placeholder="exemple@medecin.tn"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                      autoComplete="new-email"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                      Téléphone *
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="phone"
                      type="tel"
                      placeholder="Numéro de téléphone"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="specialty">
                      Spécialité *
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="specialty"
                      type="text"
                      placeholder="Spécialité médicale"
                      value={form.specialty}
                      onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                      Adresse *
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="address"
                      type="text"
                      placeholder="Adresse du médecin"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="clinicId">
                      Clinique *
                    </label>
                    <select
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="clinicId"
                      value={form.clinicId}
                      onChange={(e) => setForm({ ...form, clinicId: e.target.value })}
                      required
                    >
                      <option value="">Sélectionner une clinique</option>
                      {clinics.map(clinic => (
                        <option key={clinic.id} value={clinic.id}>
                          {clinic.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                    {editing ? 'Nouveau mot de passe (laisser vide pour ne pas changer)' : 'Mot de passe *'}
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="password"
                    type="password"
                    placeholder={editing ? "Laisser vide pour ne pas changer" : "Minimum 6 caractères"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required={!editing}
                    minLength={!editing ? 6 : undefined}
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  {editing ? "Mettre à jour" : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
