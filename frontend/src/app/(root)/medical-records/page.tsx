'use client';

import { useState } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import MedicalRecordsCard from '@/app/components/medical-records/MedicalRecordsCard';

export default function MedicalRecordsPage() {
  // Sample data - in a real app, this would come from an API
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const medicalRecords = [
    { 
      id: 1, 
      date: '2023-10-01',
      doctor: 'Dr. Sarah Johnson',
      specialty: 'Cardiologue',
      notes: 'Le patient présente une tension artérielle légèrement élevée. Une surveillance régulière est recommandée.',
      medications: [
        { name: 'Amlodipine', dosage: '5mg', frequency: '1x/jour', duration: '30 jours' },
        { name: 'Atorvastatine', dosage: '20mg', frequency: '1x/soir', duration: '30 jours' }
      ]
    },
    { 
      id: 2, 
      date: '2023-09-15',
      doctor: 'Dr. Michael Chen',
      specialty: 'Dentiste',
      notes: 'Contrôle dentaire annuel. Nettoyage effectué. Aucune carie détectée.',
      medications: [
        { name: 'Amoxicilline', dosage: '1g', frequency: '2x/jour', duration: '7 jours' },
        { name: 'Ibuprofène', dosage: '400mg', frequency: '3x/jour si douleur', duration: '5 jours' }
      ]
    },
    { 
      id: 3, 
      date: '2023-08-20',
      doctor: 'Dr. Laura Martinez',
      specialty: 'Ophtalmologue',
      notes: 'Examen de la vue annuel. Légère modification de la prescription des lunettes.',
      medications: [
        { name: 'Larmes artificielles', dosage: '1 goutte', frequency: '3x/jour', duration: '30 jours' }
      ]
    },
  ];

  const filteredRecords = medicalRecords.filter(record => {
    const matchesSearch = record.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        record.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeFilter === 'all') return matchesSearch;
    return matchesSearch && record.specialty.toLowerCase() === activeFilter.toLowerCase();
  });

  const specialties = [...new Set(medicalRecords.map(record => record.specialty))];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dossiers médicaux</h1>
          <p className="text-gray-600 mt-1">Consultez et gérez vos dossiers médicaux</p>
        </div>
        <button className="mt-4 md:mt-0 inline-flex items-center px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={18} className="mr-2" />
          Nouveau dossier
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Rechercher un médecin ou une spécialité..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="appearance-none block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
            >
              <option value="all">Toutes les spécialités</option>
              {specialties.map((specialty, index) => (
                <option key={index} value={specialty}>{specialty}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {filteredRecords.length > 0 ? (
          <div className="space-y-4">
            {filteredRecords.map((record) => (
              <MedicalRecordsCard 
                key={record.id} 
                record={record} 
                onDownload={(id) => {
                  console.log('Downloading record:', id);
                  // In a real app, this would trigger a download
                  alert(`Téléchargement du dossier #${id}...`);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Aucun dossier trouvé</h3>
            <p className="mt-1 text-gray-500">Aucun dossier ne correspond à votre recherche.</p>
          </div>
        )}
      </div>
    </div>
  );
}
