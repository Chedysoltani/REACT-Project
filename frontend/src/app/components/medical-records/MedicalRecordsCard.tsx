'use client';

import { useState } from 'react';
import { Download, User, Calendar, Pill, Clock, ChevronDown, ChevronUp, FileText as FileTextIcon } from 'lucide-react';

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

interface MedicalRecord {
  id: number;
  date: string;
  doctor: string;
  specialty: string;
  medications: Medication[];
  notes?: string;
}

interface MedicalRecordsCardProps {
  record: MedicalRecord;
  onDownload: (recordId: number) => void;
}

export default function MedicalRecordsCard({ record, onDownload }: MedicalRecordsCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDownload(record.id);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <div 
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200"
    >
      <div 
        className="p-5 cursor-pointer hover:bg-gray-50 flex justify-between items-start"
        onClick={toggleExpand}
      >
        <div className="flex-1">
          <div className="flex items-start">
            <div className="bg-blue-100 p-2 rounded-lg mr-4 flex-shrink-0">
              <User className="text-blue-600 w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                {record.doctor}
              </h3>
              <p className="text-sm text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-1">
                {record.specialty}
              </p>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <Calendar className="mr-1.5 w-4 h-4 text-gray-400" />
                <span>{formatDate(record.date)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <button 
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            onClick={handleDownloadClick}
            title="Télécharger le PDF"
          >
            <Download className="w-5 h-5" />
          </button>
          <button 
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand();
            }}
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="px-5 pb-5 pt-0 border-t border-gray-100">
          {record.notes && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <FileTextIcon className="mr-2 text-blue-600 w-5 h-5" />
                Notes du médecin
              </h4>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm leading-relaxed">
                {record.notes}
              </p>
            </div>
          )}
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <Pill className="mr-2 text-green-600 w-5 h-5" />
              Ordonnance
            </h4>
            
            {record.medications.length > 0 ? (
              <div className="space-y-3">
                {record.medications.map((med, idx) => (
                  <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <Pill className="text-blue-500 w-5 h-5 mr-2" />
                          <span className="font-medium text-gray-900">{med.name}</span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                          <div className="flex items-start">
                            <div className="bg-blue-50 p-1.5 rounded-md mr-3">
                              <Pill className="text-blue-500 w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Dosage</p>
                              <p className="text-sm font-medium text-gray-900">{med.dosage}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="bg-purple-50 p-1.5 rounded-md mr-3">
                              <Clock className="text-purple-500 w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Fréquence</p>
                              <p className="text-sm font-medium text-gray-900">{med.frequency}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="bg-amber-50 p-1.5 rounded-md mr-3">
                              <Calendar className="text-amber-500 w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Durée</p>
                              <p className="text-sm font-medium text-gray-900">{med.duration}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <span className="px-2.5 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full whitespace-nowrap">
                        En cours
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-100">
                <Pill className="mx-auto w-8 h-8 text-gray-300 mb-2" />
                <p className="text-gray-500 text-sm">Aucun médicament prescrit</p>
              </div>
            )}
          </div>
          
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center border-t border-gray-100 pt-5">
            <div className="text-sm text-gray-500 mb-3 sm:mb-0">
              Dernière mise à jour: {formatDate(record.date)}
            </div>
            <button 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={handleDownloadClick}
            >
              <Download className="mr-2 w-4 h-4" />
Télécharger l&apos;ordonnance
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
