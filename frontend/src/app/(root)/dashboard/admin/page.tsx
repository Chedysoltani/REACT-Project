'use client';

import { useState } from 'react';
import {
  User,
  Activity,
  Calendar,
  DollarSign,
  Bell,
  MessageSquare,
  ChevronDown,
  Plus,
  type LucideIcon,
} from 'lucide-react';
import Sidebar from '@/app/components/dashboard/Sidebaradmin';

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: LucideIcon;
  color: string;
}

const StatCard = ({ title, value, change, icon: Icon, color }: StatCardProps) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`p-3 rounded-xl bg-${color}-50`}>
        <Icon className={`h-6 w-6 text-${color}-500`} />
      </div>
    </div>
    <p
      className={`mt-3 text-sm font-medium ${
        change >= 0 ? 'text-green-500' : 'text-red-500'
      }`}
    >
      {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% ce mois
    </p>
  </div>
);

export default function DashboardPage() {
  const [search, setSearch] = useState('');

  const stats = [
    { title: 'Nouveaux Patients', value: '890', change: 40, icon: User, color: 'blue' },
    { title: 'Patients OPD', value: '360', change: 30, icon: Activity, color: 'purple' },
    { title: 'Tests de laboratoire', value: '980', change: 60, icon: Calendar, color: 'red' },
    { title: 'Revenus totaux', value: '$98,000', change: 20, icon: DollarSign, color: 'yellow' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      {/* Main section */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl font-semibold text-gray-800">Tableau de bord</h1>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <svg
                  className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 3a7.5 7.5 0 006.15 13.65z"
                  />
                </svg>
              </div>
              <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full">
                <MessageSquare className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full font-semibold">
                  PK
                </div>
                <span className="font-medium text-gray-800 text-sm">Dr. Patrick Kim</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
            </div>
          </div>
        </header>

        {/* Banner */}
        <div className="bg-blue-600 text-white px-8 py-6 flex items-center justify-between rounded-b-2xl shadow">
          <div>
            <h2 className="text-lg font-medium">Bonjour,</h2>
            <h1 className="text-2xl font-bold">Dr. Patrick Kim</h1>
            <p className="text-sm mt-1 opacity-90">Votre planning du jour</p>
          </div>
          <div className="flex space-x-8">
            <div className="text-center">
              <p className="text-3xl font-bold">9</p>
              <p className="text-sm">Patients</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">3</p>
              <p className="text-sm">Chirurgies</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">2</p>
              <p className="text-sm">Sorties</p>
            </div>
          </div>
        </div>

        {/* Stats cards */}
        <main className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, idx) => (
              <StatCard key={idx} {...stat} />
            ))}
          </div>

          {/* Appointments and Patients */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Prochains rendez-vous</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700">Voir tout</button>
              </div>
              <ul className="divide-y divide-gray-100">
                {[
                  { time: '08:00', patient: 'John Doe', type: 'Consultation' },
                  { time: '09:30', patient: 'Jane Smith', type: 'Chirurgie' },
                  { time: '11:00', patient: 'Mark Wilson', type: 'Suivi' },
                ].map((a, i) => (
                  <li key={i} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">{a.patient}</p>
                      <p className="text-sm text-gray-500">{a.type}</p>
                    </div>
                    <p className="text-sm text-gray-600">{a.time}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Patients récents</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700">Voir tout</button>
              </div>
              <div className="space-y-4">
                {[
                  { name: 'Alice Martin', status: 'En attente' },
                  { name: 'Robert Johnson', status: 'Terminé' },
                  { name: 'Sophie Lopez', status: 'Annulé' },
                ].map((p, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                        {p.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <span className="font-medium text-gray-800">{p.name}</span>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        p.status === 'En attente'
                          ? 'bg-yellow-100 text-yellow-700'
                          : p.status === 'Terminé'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
