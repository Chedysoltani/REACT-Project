'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface UserDetails {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone?: string;
  specialty?: string;
  bio?: string;
  photo?: string;
  clinic?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function UserDetailsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/');
      toast.error('Accès non autorisé');
    } else if (status === 'authenticated') {
      fetchUserDetails();
    }
  }, [status, session, router]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/users/admin/users/${params.id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.user?.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des détails de l\'utilisateur');
      }

      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des détails de l\'utilisateur');
      router.push('/admin/dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link 
            href="/admin/dashboard" 
            className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Détails de l'utilisateur</h1>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              {user.photo ? (
                <img 
                  src={user.photo} 
                  alt={`${user.firstName} ${user.lastName}`} 
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-2xl font-semibold">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </div>
              )}
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-600">{user.email}</p>
                <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                  user.role === 'doctor' ? 'bg-blue-100 text-blue-800' :
                  user.role === 'receptionist' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Informations personnelles</h3>
                <dl className="mt-2 space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Téléphone</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user.phone || 'Non renseigné'}</dd>
                  </div>
                  {user.specialty && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Spécialité</dt>
                      <dd className="mt-1 text-sm text-gray-900">{user.specialty}</dd>
                    </div>
                  )}
                  {user.clinic && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Clinique</dt>
                      <dd className="mt-1 text-sm text-gray-900">{user.clinic.name}</dd>
                    </div>
                  )}
                </dl>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Compte</h3>
                <dl className="mt-2 space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Date de création</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Dernière mise à jour</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(user.updatedAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </dd>
                  </div>
                </dl>
              </div>

              {user.bio && (
                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-gray-500">Biographie</h3>
                  <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">{user.bio}</p>
                </div>
              )}
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Retour
            </Link>
            <Link
              href={`/admin/users/${user.id}/edit`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Modifier
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
