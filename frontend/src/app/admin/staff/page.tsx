"use client"
import React, { useEffect, useState } from "react"
import { API_ENDPOINTS } from "@/config/api"
import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline'

interface Clinic {
  id: string
  name: string
  address: string
}

interface Staff {
  id: number | string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone?: string;
  clinicId?: number | string;
  name?: string;
  specialty?: string;
  fullName?: string;
  clinicName?: string;
}

export default function StaffPage() {
  const [doctors, setDoctors] = useState<Staff[]>([]);
  const [receptionists, setReceptionists] = useState<Staff[]>([]);
  const [patients, setPatients] = useState<Staff[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [clinicLoading, setClinicLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clinicError, setClinicError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Staff | null>(null);
  const [activeTab, setActiveTab] = useState<'doctors' | 'receptionists' | 'patients'>('doctors');
  
  // Un seul état pour le formulaire
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    role: "",
    email: "",
    phone: "",
    clinicId: "",
    password: "",
    specialty: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      if (!token) {
        setError("Token manquant. Veuillez vous reconnecter.")
        setLoading(false)
        setClinicLoading(false)
        return
      }

      // Récupérer les cliniques
      try {
        const clinicsRes = await fetch(API_ENDPOINTS.CLINICS.BASE, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        })
        
        if (!clinicsRes.ok) {
          const text = await clinicsRes.text()
          throw new Error(text || `Erreur ${clinicsRes.status} lors de la récupération des cliniques`)
        }
        
        const clinicsData = await clinicsRes.json()
        const clinicsArray = Array.isArray(clinicsData) ? clinicsData : (clinicsData.clinics || [])
        setClinics(clinicsArray)
      } catch (e: any) {
        setClinicError(e instanceof Error ? e.message : "Erreur lors du chargement des cliniques")
      } finally {
        setClinicLoading(false)
      }

      // Récupérer les utilisateurs
      try {
        const res = await fetch(API_ENDPOINTS.USERS.BASE, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        })
        
        if (!res.ok) {
          const text = await res.text()
          throw new Error(text || `Erreur ${res.status}`)
        }
        
        const data = await res.json()
        
        const mapped: Staff[] = data.map((u: any) => ({
          id: u.id,
          firstName: u.firstName || '',
          lastName: u.lastName || '',
          name: u.firstName ? `${u.firstName} ${u.lastName || ''}`.trim() : u.email,
          email: u.email,
          role: u.role,
          phone: u.phone || '',
          clinicId: u.clinicId || '',
          specialty: u.specialty || '',
          clinicName: u.clinic ? u.clinic.name : ''
        }))
        
        setDoctors(mapped.filter((user: Staff) => user.role === 'doctor'));
        setReceptionists(mapped.filter((user: Staff) => user.role === 'receptionist'));
        setPatients(mapped.filter((user: Staff) => user.role === 'patient'));
      } catch (e: any) {
        setError(e instanceof Error ? e.message : "Erreur inconnue")
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  const displayRole = (role: string) => {
    if (role === 'doctor') return 'Médecin'
    if (role === 'receptionist') return 'Réceptionniste'
    if (role === 'patient') return 'Patient'
    return role
  }

  const handleOpenModal = (staff: Staff | null = null) => {
    setEditing(staff);
    if (staff) {
      setForm({
        firstName: staff.firstName || '',
        lastName: staff.lastName || '',
        role: staff.role || 'doctor',
        email: staff.email || '',
        phone: staff.phone || '',
        clinicId: staff.clinicId?.toString() || '',
        specialty: staff.specialty || '',
        password: ''
      });
    } else {
      setForm({
        firstName: '',
        lastName: '',
        role: 'doctor',
        email: '',
        phone: '',
        clinicId: '',
        specialty: '',
        password: ''
      });
    }
    setError('');
    setSuccessMessage('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowDetailsModal(false);
    setEditing(null);
    setForm({
      firstName: '',
      lastName: '',
      role: '',
      email: '',
      phone: '',
      clinicId: '',
      specialty: '',
      password: ''
    });
    setError('');
    setSuccessMessage('');
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Session expirée. Veuillez vous reconnecter.");
        setIsSubmitting(false);
        return;
      }

      // Validation
      if (!form.firstName || !form.lastName || !form.email || !form.role) {
        setError("Veuillez remplir tous les champs obligatoires");
        setIsSubmitting(false);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        setError("Veuillez entrer une adresse email valide");
        setIsSubmitting(false);
        return;
      }

      const userData: any = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        role: form.role,
        phone: form.phone ? form.phone.trim() : null,
      };

      if (form.role === 'doctor') {
        if (!form.clinicId) {
          setError("Veuillez sélectionner une clinique pour le médecin");
          setIsSubmitting(false);
          return;
        }
        userData.clinicId = form.clinicId;
        userData.specialty = form.specialty?.trim() || null;
      } else {
        userData.clinicId = null;
        userData.specialty = null;
      }

      if (!editing && !form.password) {
        setError("Veuillez saisir un mot de passe");
        setIsSubmitting(false);
        return;
      }
      // Toujours inclure le mot de passe pour les nouveaux utilisateurs
      if (!editing || form.password) {
        userData.password = form.password;
      }

      const url = editing 
        ? `${API_ENDPOINTS.USERS.BASE}/${editing.id}`
        : API_ENDPOINTS.USERS.BASE;

      const method = editing ? 'PATCH' : 'POST';

      // Préparer les données à envoyer
      const requestBody = { ...userData };
      
      // Ajouter des logs pour le débogage
      console.log('Données envoyées au serveur:', requestBody);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Erreur lors de la sauvegarde');
      }

      const newStaff: Staff = {
        ...responseData,
        name: responseData.firstName ? 
          `${responseData.firstName} ${responseData.lastName || ''}`.trim() : 
          responseData.email,
        clinicName: responseData.clinic ? 
          responseData.clinic.name : 
          (responseData.clinicId ? 
            clinics.find(c => c.id === responseData.clinicId)?.name : 
            '')
      };

      if (editing) {
        const oldRole = editing.role;
        const newRole = responseData.role || oldRole;

        // Supprimer de l'ancienne liste si le rôle a changé
        if (oldRole !== newRole) {
          if (oldRole === 'doctor') {
            setDoctors(prev => prev.filter(item => item.id !== editing.id));
          } else if (oldRole === 'receptionist') {
            setReceptionists(prev => prev.filter(item => item.id !== editing.id));
          } else if (oldRole === 'patient') {
            setPatients(prev => prev.filter(item => item.id !== editing.id));
          }
        }

        // Mettre à jour ou ajouter dans la nouvelle liste
        if (newRole === 'doctor') {
          setDoctors(prev => {
            if (oldRole === newRole) {
              return prev.map(item => item.id === editing.id ? newStaff : item);
            } else {
              return [...prev, newStaff];
            }
          });
        } else if (newRole === 'receptionist') {
          setReceptionists(prev => {
            if (oldRole === newRole) {
              return prev.map(item => item.id === editing.id ? newStaff : item);
            } else {
              return [...prev, newStaff];
            }
          });
        } else if (newRole === 'patient') {
          setPatients(prev => {
            if (oldRole === newRole) {
              return prev.map(item => item.id === editing.id ? newStaff : item);
            } else {
              return [...prev, newStaff];
            }
          });
        }
        
        setSuccessMessage('Membre mis à jour avec succès');
      } else {
        if (responseData.role === 'doctor') {
          setDoctors(prev => [...prev, newStaff]);
        } else if (responseData.role === 'receptionist') {
          setReceptionists(prev => [...prev, newStaff]);
        } else if (responseData.role === 'patient') {
          setPatients(prev => [...prev, newStaff]);
        }
        
        setSuccessMessage('Membre ajouté avec succès');
      }

      handleCloseModal();

    } catch (error) {
      console.error('Erreur:', error);
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleViewDetails = (staff: Staff) => {
    const clinic = staff.clinicId 
      ? clinics.find(c => c.id.toString() === staff.clinicId?.toString())
      : null;

    const staffWithDetails: Staff = {
      ...staff,
      firstName: staff.firstName || staff.name?.split(' ')[0] || '',
      lastName: staff.lastName || staff.name?.split(' ').slice(1).join(' ') || '',
      email: staff.email || '',
      phone: staff.phone || 'Non renseigné',
      role: staff.role || 'Non spécifié',
      clinicName: clinic?.name || staff.clinicName || 'Non attribuée',
      specialty: staff.specialty || (staff.role === 'doctor' ? 'Non spécifiée' : 'Non applicable'),
      fullName: (staff.firstName || staff.name) 
        ? `${staff.firstName || staff.name?.split(' ')[0] || ''} ${staff.lastName || staff.name?.split(' ').slice(1).join(' ') || ''}`.trim()
        : 'Nom inconnu'
    };
    
    setSelectedStaff(staffWithDetails);
    setShowDetailsModal(true);
  };

  const handleDelete = async (id: string | number, role: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      }

      // Utiliser l'endpoint spécifique pour la suppression
      const response = await fetch(API_ENDPOINTS.USERS.DELETE(id), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erreur lors de la suppression');
      }

      if (role === 'doctor') {
        setDoctors(prev => prev.filter(member => member.id !== id));
      } else if (role === 'receptionist') {
        setReceptionists(prev => prev.filter(member => member.id !== id));
      } else if (role === 'patient') {
        setPatients(prev => prev.filter(member => member.id !== id));
      }
      
      setSuccessMessage('Membre supprimé avec succès');
      setTimeout(() => setSuccessMessage(''), 3000);

    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStaffTable = (staffList: Staff[], type: 'doctor' | 'receptionist' | 'patient') => {
    if (loading) {
      return <div className="text-center py-4">Chargement en cours...</div>;
    }

    const title = type === 'doctor' ? 'Médecins' : 
                 type === 'receptionist' ? 'Réceptionnistes' : 'Patients';
    const emptyMessage = type === 'doctor' ? 'Aucun médecin trouvé' : 
                       type === 'receptionist' ? 'Aucun réceptionniste trouvé' : 
                       'Aucun patient trouvé';

    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>
        {staffList.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-4 text-center text-gray-500">
            {emptyMessage}
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  {type === 'doctor' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Spécialité
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Téléphone
                  </th>
                  {(type === 'doctor' || type === 'receptionist') && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {type === 'doctor' ? 'Clinique' : 'Affectation'}
                    </th>
                  )}
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {staffList.map((staff) => (
                  <tr key={staff.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {staff.firstName && staff.lastName 
                          ? `${staff.firstName} ${staff.lastName}` 
                          : staff.name || 'Non spécifié'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {staff.email || '-'}
                    </td>
                    {type === 'doctor' && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {staff.specialty || 'Non spécifiée'}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {staff.phone || '-'}
                    </td>
                    {(type === 'doctor' || type === 'receptionist') && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {staff.clinicId !== undefined && staff.clinicId !== null
                          ? (clinics.find(c => c.id.toString() === staff.clinicId?.toString())?.name || 'Inconnue')
                          : type === 'doctor' ? 'Non affecté' : 'Non spécifiée'}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleViewDetails(staff)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Voir les détails"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleOpenModal(staff)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Modifier"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(staff.id, staff.role)}
                          className="text-red-600 hover:text-red-900"
                          title="Supprimer"
                          disabled={isSubmitting}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestion du Personnel</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Ajouter un membre
        </button>
      </div>

      {/* Messages d'erreur et de succès */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}
      {clinicError && (
        <div className="mb-4 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
          {clinicError}
        </div>
      )}

      {/* Onglets */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('doctors')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'doctors'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Médecins ({doctors.length})
            </button>
            <button
              onClick={() => setActiveTab('receptionists')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'receptionists'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Réceptionnistes ({receptionists.length})
            </button>
            <button
              onClick={() => setActiveTab('patients')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'patients'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Patients ({patients.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'doctors' && renderStaffTable(doctors, 'doctor')}
      {activeTab === 'receptionists' && renderStaffTable(receptionists, 'receptionist')}
      {activeTab === 'patients' && renderStaffTable(patients, 'patient')}

      {/* Modal d'ajout/édition */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {editing ? "Modifier un membre" : "Ajouter un membre"}
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                  <input
                    type="text"
                    placeholder="Prénom"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                  <input
                    type="text"
                    placeholder="Nom"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rôle *</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value, specialty: e.target.value === 'doctor' ? form.specialty : '' })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                  required
                >
                  <option value="">Sélectionner un rôle</option>
                  <option value="doctor">Médecin</option>
                  <option value="receptionist">Réceptionniste</option>
                  <option value="patient">Patient</option>
                </select>
              </div>
              
              {form.role === 'doctor' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Spécialité *</label>
                    <input
                      type="text"
                      placeholder="Ex: Cardiologie, Dentiste, etc."
                      value={form.specialty || ''}
                      onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                      required={form.role === 'doctor'}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Clinique *</label>
                    <select
                      value={form.clinicId}
                      onChange={(e) => setForm({ ...form, clinicId: e.target.value })}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                      disabled={clinicLoading || clinics.length === 0}
                      required={form.role === 'doctor'}
                    >
                      {clinicLoading ? (
                        <option>Chargement des cliniques...</option>
                      ) : clinics.length === 0 ? (
                        <option value="">Aucune clinique disponible</option>
                      ) : (
                        <>
                          <option value="">Sélectionner une clinique</option>
                          {clinics.map((clinic) => (
                            <option key={clinic.id} value={clinic.id}>
                              {clinic.name}
                            </option>
                          ))}
                        </>
                      )}
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  placeholder="Email du membre"
                  value={form.email || ''}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input
                  type="tel"
                  placeholder="Numéro de téléphone"
                  value={form.phone || ''}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {!editing && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe *</label>
                  <input
                    type="password"
                    placeholder="Définir un mot de passe"
                    value={form.password || ''}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Le mot de passe doit contenir au moins 6 caractères
                  </p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                  {error}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isSubmitting}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Traitement...' : (editing ? 'Mettre à jour' : 'Ajouter')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de détails */}
      {showDetailsModal && selectedStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Détails du membre
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900">
                  {selectedStaff.fullName}
                </h3>
                <p className="text-gray-600 mt-1">{selectedStaff.email}</p>
                <div className="mt-2">
                  <span 
                    className={`
                      inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                      ${selectedStaff.role === 'doctor' ? 'bg-blue-100 text-blue-800' : ''}
                      ${selectedStaff.role === 'receptionist' ? 'bg-green-100 text-green-800' : ''}
                      ${selectedStaff.role === 'patient' ? 'bg-purple-100 text-purple-800' : ''}
                      ${!['doctor', 'receptionist', 'patient'].includes(selectedStaff.role) ? 'bg-gray-100 text-gray-800' : ''}
                    `}
                  >
                    {displayRole(selectedStaff.role)}
                  </span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Informations détaillées</h4>
                <dl className="grid grid-cols-1 gap-y-4">
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                      {selectedStaff.email}
                    </dd>
                  </div>
                  
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500">Téléphone</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                      {selectedStaff.phone}
                    </dd>
                  </div>
                  
                  {selectedStaff.role === 'doctor' && (
                    <>
                      <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500">Spécialité</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                          {selectedStaff.specialty}
                        </dd>
                      </div>
                      
                      <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500">Clinique</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                          {selectedStaff.clinicName}
                        </dd>
                      </div>
                    </>
                  )}
                  
                  {selectedStaff.role === 'receptionist' && selectedStaff.clinicId && (
                    <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500">Clinique</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                        {selectedStaff.clinicName}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  handleOpenModal(selectedStaff);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Modifier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}