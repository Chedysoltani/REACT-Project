'use client';

'use client';

import { useState } from 'react';
import { format, addMonths, subMonths, isSameDay, isSameMonth, isBefore, addDays } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Appointment = {
  id: string;
  date: Date;
  title: string;
  doctor: string;
  specialty?: string;
  patient: string;
  status: 'scheduled' | 'completed' | 'cancelled';
};

const doctors = [
  { id: '1', name: 'Dr. Sarah Johnson', specialty: 'Cardiologist' },
  { id: '2', name: 'Dr. Michael Chen', specialty: 'Dentist' },
  { id: '3', name: 'Dr. Emily Wilson', specialty: 'General Practitioner' },
  { id: '4', name: 'Dr. Robert Brown', specialty: 'Neurologist' },
];

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [formData, setFormData] = useState({
    time: '09:00',
    doctorId: '',
  });
  
  // Default patient name (would come from auth in a real app)
  const patientName = 'John Doe';

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const onDateClick = (day: Date) => {
    // Only allow future dates
    if (isBefore(day, new Date()) && !isSameDay(day, new Date())) {
      return;
    }
    
    // Check if there's an appointment on this date
    const existingAppointment = appointments.find(appt => isSameDay(appt.date, day));
    
    if (existingAppointment) {
      setSelectedAppointment(existingAppointment);
      setShowForm(false);
    } else {
      setSelectedDate(day);
      setSelectedAppointment(null);
      setShowForm(true);
      setFormData({
        time: '09:00',
        doctorId: '',
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !formData.doctorId) return;

    const selectedDoctor = doctors.find(doc => doc.id === formData.doctorId);
    if (!selectedDoctor) return;

    const newAppointment: Appointment = {
      id: Date.now().toString(),
      date: new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        parseInt(formData.time.split(':')[0]),
        parseInt(formData.time.split(':')[1])
      ),
      title: `Appointment with ${selectedDoctor.name}`,
      doctor: selectedDoctor.name,
      specialty: selectedDoctor.specialty,
      patient: patientName,
      status: 'scheduled',
    };

    setAppointments([...appointments, newAppointment]);
    setShowForm(false);
    setSelectedAppointment(newAppointment);
  };

  const renderHeader = () => (
    <div className="flex items-center justify-between mb-4">
      <button
        onClick={prevMonth}
        className="p-2 rounded-full hover:bg-gray-100"
        aria-label="Previous month"
      >
        <ChevronLeft size={20} />
      </button>
      <h2 className="text-xl font-semibold">
        {format(currentMonth, 'MMMM yyyy')}
      </h2>
      <button
        onClick={nextMonth}
        className="p-2 rounded-full hover:bg-gray-100"
        aria-label="Next month"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );

  const renderDays = () => {
    const days = [];
    const dateFormat = 'EEE';
    const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="text-center font-medium text-gray-500 py-2" key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="grid grid-cols-7 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    const endDate = new Date(monthEnd);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = new Date(day);
        const hasAppointment = appointments.some(appt => isSameDay(appt.date, day));
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isToday = isSameDay(day, new Date());
        const isPast = isBefore(day, new Date()) && !isToday;
        const isSelected = selectedDate && isSameDay(day, selectedDate);

        days.push(
          <div
            className={`
              min-h-16 p-1 border border-gray-100 relative
              ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''}
              ${isToday ? 'bg-blue-50' : ''}
              ${isSelected ? 'ring-2 ring-blue-500 z-10' : ''}
              ${isPast ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer'}
            `}
            key={day.toString()}
            onClick={() => !isPast && onDateClick(cloneDay)}
          >
            <span className={`block text-sm p-1 rounded-full w-6 h-6 flex items-center justify-center ${isToday ? 'bg-blue-500 text-white' : ''}`}>
              {formattedDate}
            </span>
            {hasAppointment && (
              <div className="w-2 h-2 bg-blue-500 rounded-full absolute top-1 right-1"></div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="mb-4">{rows}</div>;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {renderHeader()}
      {renderDays()}
      {renderCells()}

      {/* Appointment Form Modal */}
      {(showForm || selectedAppointment) && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            {selectedAppointment ? (
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Appointment Details - {format(selectedAppointment.date, 'MMMM d, yyyy')}
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Patient</p>
                    <p className="font-medium">{selectedAppointment.patient}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Doctor</p>
                    <p className="font-medium">{selectedAppointment.doctor}</p>
                    <p className="text-sm text-gray-500">{selectedAppointment.specialty}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-medium">{format(selectedAppointment.date, 'h:mm a')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {selectedAppointment.status}
                    </span>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setSelectedAppointment(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 className="text-lg font-semibold mb-4">
                  Schedule Appointment for {format(selectedDate, 'MMMM d, yyyy')}
                </h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Patient Name
                  </label>
                  <input
                    type="text"
                    value={patientName}
                    disabled
                    className="w-full p-2 border bg-gray-50 rounded-lg"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Doctor
                  </label>
                  <select
                    required
                    value={formData.doctorId}
                    onChange={(e) => setFormData({...formData, doctorId: e.target.value})}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a doctor</option>
                    {doctors.map(doctor => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialty}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Time
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    min="09:00"
                    max="17:00"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    disabled={!formData.doctorId}
                  >
                    Confirm Appointment
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Upcoming Appointments */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Upcoming Appointments</h3>
        {appointments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No upcoming appointments</p>
        ) : (
          <div className="space-y-3">
            {appointments
              .sort((a, b) => a.date.getTime() - b.date.getTime())
              .map((appt) => (
                <div key={appt.id} className="p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{appt.title}</p>
                      <p className="text-sm text-gray-600">{appt.doctor}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {format(appt.date, 'MMM d, yyyy')}
                      </p>
                      <p className="text-sm text-gray-600">
                        {format(appt.date, 'h:mm a')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
