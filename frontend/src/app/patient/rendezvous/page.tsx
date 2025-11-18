"use client"
import React, { useState, useEffect } from "react"
import { API_ENDPOINTS } from "@/config/api"

interface RendezVous {
  id: number;
  date: string;
  heure: string;
  medecin: string;
  statut: string;
}

export default function RendezVousPage() {
  const [rendezVous, setRendezVous] = useState<RendezVous[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRendezVous = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token manquant");

        const res = await fetch(`${API_ENDPOINTS.APPOINTMENTS.BASE}/me`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error(`Erreur ${res.status}`);

        const data = await res.json();

        // On transforme le résultat pour correspondre au frontend
        const formatted = data.map((rdv: any) => ({
          id: rdv.id,
          date: new Date(rdv.dateReservation).toISOString().split("T")[0],
          heure: rdv.dateReservation.split("T")[1]?.substring(0,5) || "09:00",
          medecin: rdv.medecin.name, // si c’est un Service avec champ name
          statut: "En attente", // ou récupère un champ statut si existant
        }));

        setRendezVous(formatted);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    fetchRendezVous();
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Vos prochains rendez-vous</h2>
      {rendezVous.length === 0 ? (
        <p className="text-gray-600">Aucun rendez-vous programmé.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-700">
              <th className="p-3 border-b">Date</th>
              <th className="p-3 border-b">Heure</th>
              <th className="p-3 border-b">Médecin</th>
              <th className="p-3 border-b">Statut</th>
              <th className="p-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rendezVous.map((rdv) => (
              <tr key={rdv.id} className="hover:bg-gray-50 transition">
                <td className="p-3 border-b">{rdv.date}</td>
                <td className="p-3 border-b">{rdv.heure}</td>
                <td className="p-3 border-b">{rdv.medecin}</td>
                <td className={`p-3 border-b font-medium ${rdv.statut === "Confirmé" ? "text-green-600" : "text-yellow-600"}`}>
                  {rdv.statut}
                </td>
                <td className="p-3 border-b">
                  <button className="text-blue-600 hover:underline mr-2">Modifier</button>
                  <button className="text-red-600 hover:underline">Annuler</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
