import Sidebar from '@/app/components/dashboard/Sidebaradmin';
import Calendar from '@/app/components/appointments/Calendar';
import { FileText, Calendar as CalendarIcon } from 'lucide-react';

export default function AppointmentsPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeItem="appointments" />
      <div className="flex-1 ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <CalendarIcon className="mr-2" size={24} />
              Rendez-vous
            </h1>
            <p className="text-gray-600">Planifiez et gérez vos rendez-vous médicaux</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search appointments..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Calendar />
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FileText className="mr-2" size={20} />
              Appointment Notes
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  Select a date on the calendar to schedule a new appointment or view details of an existing one.
                </p>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h3 className="font-medium text-yellow-800 mb-2">Upcoming Appointment</h3>
                <p className="text-sm text-yellow-700">
                  Your next appointment is in 3 days. Please arrive 15 minutes early.
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">Office Hours</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>Monday - Friday: 9:00 AM - 5:00 PM</li>
                  <li>Saturday: 9:00 AM - 1:00 PM</li>
                  <li>Sunday: Closed</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
