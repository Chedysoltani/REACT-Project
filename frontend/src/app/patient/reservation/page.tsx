"use client"
import React, { useState } from "react"

export default function Reservation() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  // Génération du mois actuel
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  const handleDateClick = (day: number) => {
    const newDate = `${year}-${month + 1}-${day}`
    setSelectedDate(newDate)
    setSelectedTime(null)
  }

  const handleReservation = () => {
    if (!selectedDate || !selectedTime) return alert("Veuillez choisir une date et une heure.")
    alert(`✅ Rendez-vous réservé pour le ${selectedDate} à ${selectedTime}`)
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-semibold text-gray-800 mb-4">Réserver ou modifier un rendez-vous</h2>
      <p className="text-gray-600 mb-6">
        Choisissez une date dans le calendrier ci-dessous, puis sélectionnez une heure pour votre rendez-vous.
      </p>

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
