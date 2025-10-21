"use client"
import React, { useState } from "react"
interface patient {
  id: number
  nom: string
  age: number
  diagnostic: string
}
export default function PatientsPage() {
  const [patients, setPatients] = useState([
    { id: 1, nom: "Ali Ben Salah", age: 34, diagnostic: "Diabète type 2" },
    { id: 2, nom: "Sara Khelifi", age: 29, diagnostic: "Hypertension" },
  ])
  const [showModal, setShowModal] = useState(false)
  const [editingPatient, setEditingPatient] = useState<patient | null>(null)
  const [formData, setFormData] = useState({ nom: "", age: "", diagnostic: "" })

  const handleOpenModal = (patient?: patient) => {
    if (patient) {
      setEditingPatient(patient)
      setFormData({
        nom: patient.nom,
        age: patient.age.toString(),
        diagnostic: patient.diagnostic,
      })
    } else {
      setEditingPatient(null)
      setFormData({ nom: "", age: "", diagnostic: "" })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => setShowModal(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = () => {
    if (editingPatient) {
      setPatients(patients.map(p =>
        p.id === editingPatient.id ? { ...p, ...formData, age: Number(formData.age) } : p
      ))
    } else {
      const newPatient = {
        id: patients.length + 1,
        ...formData,
        age: Number(formData.age),
      }
      setPatients([...patients, newPatient])
    }
    setShowModal(false)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">Dossiers Médicaux</h1>
      <p className="text-gray-600 mb-6">
        Accédez aux dossiers de vos patients et mettez-les à jour en temps réel.
      </p>

      <button
        onClick={() => handleOpenModal()}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-4 hover:bg-blue-700"
      >
        + Ajouter un patient
      </button>

      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="py-2 px-4 text-left">Nom</th>
            <th className="py-2 px-4 text-left">Âge</th>
            <th className="py-2 px-4 text-left">Diagnostic</th>
            <th className="py-2 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id} className="border-b">
              <td className="py-2 px-4">{patient.nom}</td>
              <td className="py-2 px-4">{patient.age}</td>
              <td className="py-2 px-4">{patient.diagnostic}</td>
              <td className="py-2 px-4 text-center">
                <button
                  onClick={() => handleOpenModal(patient)}
                  className="text-blue-600 hover:underline"
                >
                  Modifier
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* --- MODALE --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 w-96 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {editingPatient ? "Modifier le dossier" : "Ajouter un dossier"}
            </h2>

            <div className="space-y-3">
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                placeholder="Nom du patient"
                className="w-full border p-2 rounded-lg"
              />
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Âge"
                className="w-full border p-2 rounded-lg"
              />
              <input
                type="text"
                name="diagnostic"
                value={formData.diagnostic}
                onChange={handleChange}
                placeholder="Diagnostic"
                className="w-full border p-2 rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
