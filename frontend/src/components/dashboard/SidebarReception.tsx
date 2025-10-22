'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, User, Clock, Users, Stethoscope } from 'lucide-react';

export default function SidebarReception() {
  const pathname = usePathname();
  
  const navItems = [
    { name: 'Tableau de bord', href: '/reception', icon: Home },
    { name: 'Rendez-vous', href: '/reception/appointments', icon: Calendar },
    { name: 'Patients', href: '/reception/patients', icon: User },
    { name: 'Médecins', href: '/reception/doctors', icon: Stethoscope },
    { name: 'Salles', href: '/reception/rooms', icon: Clock },
    { name: 'Liste d\'attente', href: '/reception/waiting-list', icon: Users },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Espace Réception</h1>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
