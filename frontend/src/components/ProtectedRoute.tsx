'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (!token || !userData) {
        toast.error('Veuillez vous connecter pour accéder à cette page');
        router.push('/login');
        return;
      }

      try {
        const user = JSON.parse(userData);
        
        // Vérifier si l'utilisateur a le rôle requis
        if (allowedRoles && !allowedRoles.includes(user.role)) {
          toast.error('Accès non autorisé');
          // Rediriger vers la page par défaut du rôle de l'utilisateur
          router.push(`/${user.role}`);
          return;
        }
        
        setIsAuthorized(true);
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        toast.error('Erreur d\'authentification');
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, allowedRoles]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
