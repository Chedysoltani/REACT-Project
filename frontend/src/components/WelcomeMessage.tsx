'use client';

import { useEffect, useState } from 'react';

export default function WelcomeMessage() {
  const [user, setUser] = useState<{
    name: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    // Récupérer les informations utilisateur depuis le localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser({
          name: parsedUser.name,
          role: parsedUser.role
        });
      } catch (error) {
        console.error('Erreur lors de la lecture des données utilisateur:', error);
      }
    }
  }, []);

  if (!user) {
    return null; // Ne rien afficher tant que les données ne sont pas chargées
  }

  // Mettre en forme le rôle pour l'affichage (première lettre en majuscule)
  const formattedRole = user.role.charAt(0).toUpperCase() + user.role.slice(1);

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-800">
        Welcome {formattedRole}, <span className="text-blue-600">{user.name}</span>
      </h1>
      <p className="text-gray-600 mt-2">
        {getWelcomeMessage(user.role, user.name)}
      </p>
    </div>
  );
}

// Fonction pour générer un message de bienvenue personnalisé en fonction du rôle
function getWelcomeMessage(role: string, name: string): string {
  const messages: Record<string, string> = {
    admin: `Bienvenue dans votre espace d'administration. Gérez facilement votre plateforme médicale.`,
    doctor: `Bienvenue sur votre tableau de bord, Dr. ${name}. Consultez vos rendez-vous et vos patients.`,
    patient: `Bienvenue sur votre espace personnel, ${name}. Prenez rendez-vous et gérez votre santé.`,
    reception: `Bienvenue à l'accueil, ${name}. Gérez les rendez-vous et les dossiers des patients.`
  };

  return messages[role] || `Bienvenue sur votre tableau de bord, ${name}.`;
}
