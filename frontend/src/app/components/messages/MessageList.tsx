// components/messages/MessageList.tsx
'use client';

import { useState } from 'react';
import { Mail, Search, ChevronRight } from 'lucide-react';

const messages = [
  {
    id: 1,
    from: 'Dr. Sarah Johnson',
    subject: 'Résultats de vos analyses',
    preview: 'Bonjour, je vous envoie les résultats de vos analyses sanguines...',
    time: '10:30',
    read: false,
    avatar: 'SJ'
  },
  // ... autres messages
];

export default function MessageList() {
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Messages</h2>
          <div className="relative flex-1 max-w-md ml-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Rechercher des messages..."
            />
          </div>
          <button className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Nouveau message
          </button>
        </div>
      </div>
      
      <div className="divide-y divide-gray-200">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-4 hover:bg-gray-50 cursor-pointer ${
              selectedMessage === message.id ? 'bg-blue-50' : ''
            }`}
            onClick={() => setSelectedMessage(message.id)}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-medium">{message.avatar}</span>
              </div>
              <div className="ml-4 flex-1 min-w-0">
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {message.from}
                  </p>
                  <p className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                    {message.time}
                  </p>
                </div>
                <p className="text-sm text-gray-900 font-medium truncate">
                  {message.subject}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {message.preview}
                </p>
              </div>
              {!message.read && (
                <div className="ml-2 flex-shrink-0 flex">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                </div>
              )}
              <ChevronRight className="ml-2 h-5 w-5 text-gray-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}