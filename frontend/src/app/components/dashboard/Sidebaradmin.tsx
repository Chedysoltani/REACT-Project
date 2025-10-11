'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar,
  FileText,
  CreditCard,
  User,
  MessageSquare,
  LogOut,
  Settings,
  Hospital,
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Tableau de bord', icon: Hospital, href: '/', active: pathname === '/' },
    { name: 'Rendez-vous', icon: Calendar, href: '/appointments', active: pathname === '/appointments' },
    { name: 'Dossiers médicaux', icon: FileText, href: '/medical-records', active: pathname === '/medical-records' },
    { name: 'Paiements', icon: CreditCard, href: '/billing', active: pathname === '/billing' },
    { name: 'Messages', icon: MessageSquare, href: '/messages', active: pathname === '/messages' },
    { name: 'Profil', icon: User, href: '/profile', active: pathname === '/profile' },
  ];

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 bg-white shadow-xl border-r border-gray-100">
        <div className="flex items-center justify-center h-16 bg-blue-600 text-white font-bold text-xl tracking-wide">
          Medflex
        </div>

        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 mt-6 px-3 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-150 ${
                  item.active
                    ? 'bg-blue-50 text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 ${
                    item.active
                      ? 'text-blue-500'
                      : 'text-gray-400 group-hover:text-blue-500'
                  }`}
                />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t border-gray-100 p-4">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
              JD
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Dr. John Doe</p>
              <p className="text-xs text-gray-500">Dept. Admin</p>
            </div>
            <button className="ml-auto text-gray-400 hover:text-blue-600">
              <Settings className="h-4 w-4" />
            </button>
          </div>
          <button className="mt-4 flex items-center justify-center w-full py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
}
