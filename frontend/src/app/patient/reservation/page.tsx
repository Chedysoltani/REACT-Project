"use client"
import React, { useState, useEffect } from "react"
import { API_ENDPOINTS } from "@/config/api"

interface Medecin {
  id: number
  name: string   // correspond au champ "name" de ton service (nom du médecin)
  price: number
  duration: string
  specialty:string
}

export default function Reservation() {
  const [medecins, setMedecins] = useState<Medecin[]>([])
  const [selectedMedecin, setSelectedMedecin] = useState<number | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // 🔹 Récupération des "services" (qui sont les médecins)
useEffect(() => {
  const fetchMedecins = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
      if (!token) {
        setError("Token manquant. Veuillez vous reconnecter.")
        setLoading(false)
        return
      }

      const res = await fetch(API_ENDPOINTS.USERS.DOCTORS, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      })

      if (!res.ok) throw new Error(`Erreur ${res.status}`)

      const data: Medecin[] = await res.json()
      setMedecins(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
      setLoading(false)
    }
  }

  fetchMedecins()
}, [])


  // 🔹 Génération du calendrier
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  const handleDateClick = (day: number) => {
    const newDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    setSelectedDate(newDate)
    setSelectedTime(null)
  }

  // 🔹 Réservation (simulation)
  const handleReservation = async () => {
    if (!selectedMedecin) return alert("Veuillez choisir un médecin.")
    if (!selectedDate || !selectedTime) return alert("Veuillez choisir une date et une heure.")

    const res = await fetch(`${API_ENDPOINTS.APPOINTMENTS.BASE}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
     body: JSON.stringify({
  medecinId: selectedMedecin, // correspond au DTO
  date: selectedDate,
  heure: selectedTime,
  // si le patientId est récupéré du token backend, inutile ici
}),

    })

    if (res.ok) {
      alert(`✅ Rendez-vous confirmé avec succès !`)
      setSelectedMedecin(null)
      setSelectedDate(null)
      setSelectedTime(null)
    } else {
      const err = await res.text()
      alert("Erreur : " + err)
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-semibold text-gray-800 mb-4">Réserver un rendez-vous</h2>

      {/* 🔸 Sélection du médecin */}
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md mx-auto mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Choisissez un médecin</h3>
        {loading && <p>Chargement...</p>}
        {error && <p className="text-red-600">{error}</p>}

       <select
  value={selectedMedecin ?? ""}
  onChange={(e) => setSelectedMedecin(Number(e.target.value))}
>
  <option value="">-- Sélectionner un médecin --</option>
  {medecins.map((med) => (
    <option key={med.id} value={med.id}>
      {med.name} ({med.specialty})
    </option>
  ))}
</select>

      </div>

      {/* 📅 CALENDRIER */}
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-3xl mx-auto">
        <h3 className="text-xl font-semibold mb-4 text-gray-700 text-center">
          {today.toLocaleString("fr-FR", { month: "long", year: "numeric" })}
        </h3>

        <div className="grid grid-cols-7 gap-2 text-center">
          <div className="font-semibold text-gray-500">Lun</div>
          <div className="font-semibold text-gray-500">Mar</div>
          <div className="font-semibold text-gray-500">Mer</div>
          <div className="font-semibold text-gray-500">Jeu</div>
          <div className="font-semibold text-gray-500">Ven</div>
          <div className="font-semibold text-gray-500">Sam</div>
          <div className="font-semibold text-gray-500">Dim</div>

          {days.map((day) => {
            const date = new Date(year, month, day)
            const isPast = date < today
            const isSelected = selectedDate === `${year}-${month + 1}-${day}`
            return (
              <button
                key={day}
                onClick={() => !isPast && handleDateClick(day)}
                disabled={isPast}
                className={`p-3 rounded-lg transition-all ${
                  isPast
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : isSelected
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-50 hover:bg-blue-100 text-gray-800"
                }`}
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>

      {/* 🕐 CHOIX DE L’HEURE */}
      {selectedDate && (
        <div className="mt-8 bg-white p-6 rounded-2xl shadow-md w-full max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
            Choisissez une heure pour le {selectedDate}
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              "09:00",
              "09:30",
              "10:00",
              "10:30",
              "11:00",
              "11:30",
              "14:00",
              "14:30",
              "15:00",
              "15:30",
              "16:00",
              "16:30",
            ].map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`p-2 rounded-lg border transition-all ${
                  selectedTime === time
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-50 hover:bg-blue-100 text-gray-800 border-gray-200"
                }`}
              >
                {time}
              </button>
            ))}
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={handleReservation}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md transition-all"
            >
              Confirmer la réservation
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
