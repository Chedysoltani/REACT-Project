"use client"

import React, { useState } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction"
import { Dialog } from "@headlessui/react"
import { Button } from "../../components/ui/button"

export default function AgendaPage() {
  const [events, setEvents] = useState([
    {
      title: "Consultation - Mme Ben Youssef",
      start: "2025-10-14T10:00:00",
      end: "2025-10-14T11:00:00",
    },
    {
      title: "Contrôle - Mr Trabelsi",
      start: "2025-10-15T14:00:00",
      end: "2025-10-15T14:30:00",
    },
  ])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({ title: "", time: "" })

  const handleDateClick = (info: DateClickArg) => {
    setSelectedDate(info.dateStr)
    setIsOpen(true)
  }

  const handleAddEvent = () => {
    if (!selectedDate || !formData.title || !formData.time) return
    const newEvent = {
      title: formData.title,
      start: `${selectedDate}T${formData.time}`,
      end: `${selectedDate}T${formData.time}`,
    }
    setEvents([...events, newEvent])
    setFormData({ title: "", time: "" })
    setIsOpen(false)
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-4">Gestion de l’Agenda</h1>
      <p className="text-gray-600 mb-6">
        Consultez, ajoutez ou modifiez vos rendez-vous patients directement depuis le calendrier.
      </p>

      <div className="bg-white shadow-md rounded-2xl p-4 border border-gray-200">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          dateClick={handleDateClick}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          height="80vh"
        />
      </div>

      {/* Popup pour ajout d’un rendez-vous */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <Dialog.Title className="text-xl font-semibold mb-4 text-gray-800">
              Ajouter un rendez-vous
            </Dialog.Title>
            <div className="flex flex-col gap-3">
              <label className="text-gray-600">Nom du patient</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Consultation - Mme Dupont"
                className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <label className="text-gray-600 mt-2">Heure</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="flex justify-end mt-6 gap-3">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Annuler
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleAddEvent}>
                Ajouter
              </Button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  )
}
