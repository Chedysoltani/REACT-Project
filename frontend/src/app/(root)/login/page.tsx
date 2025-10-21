"use client"
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important pour les cookies
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        try {
          const jsonError = JSON.parse(errorData);
          throw new Error(jsonError.message || 'Email ou mot de passe incorrect');
        } catch (e) {
          console.error('Erreur de réponse du serveur:', errorData);
          throw new Error('Erreur de connexion au serveur');
        }
      }

      const data = await response.json();

      // Enregistrer le token dans le localStorage
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
      }
      
      toast.success('Connexion réussie ! Redirection...');
      
      // Rediriger vers le tableau de bord après 1,5 secondes
      setTimeout(() => {
        router.push('/Home');
      }, 1500);
      
    } catch (error: any) {
      console.error('Erreur lors de la connexion:', error);
      toast.error(error.message || 'Une erreur est survenue lors de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex bg-cover bg-center" style={{
      backgroundImage: `url('https://img.freepik.com/photos-gratuite/hopital-blur-est-la_1203-7972.jpg?t=st=1760183601~exp=1760187201~hmac=be10422c10d75df487e849bbd426680f23c1a31c880be1665f89050d5ad68c63&w=1060')`,
    }}>
      {/* Login form section */}
      <div className="w-full flex justify-end items-center pr-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-white p-10 rounded-2xl shadow-lg w-96"
        >
          <h1 className="text-center text-2xl font-bold mb-6 text-gray-800">MedFlow</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col">
              <label className="block text-gray-700 mb-1">
                Your email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Entrez votre email"
                className="w-full border border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col mt-4">
              <label className="block text-gray-700 mb-1">
                Your password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Entrez votre mot de passe"
                className="w-full border border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-right text-sm mt-1 text-blue-600 cursor-pointer">
                Forgot password?
              </p>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 transition mt-4 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
            <p className="text-center text-sm text-gray-600 mt-4">
              Vous n&apos;avez pas de compte ?{' '}
              <a href="/register" className="text-blue-600 hover:underline">
                S&apos;inscrire
              </a>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}