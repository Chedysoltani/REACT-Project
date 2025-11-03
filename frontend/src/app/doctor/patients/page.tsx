"use client"
import React, { useState, useEffect } from "react"

interface Patient {
  id: number;
  nom: string;
  age: number;
  diagnostic: string;
  dateReservation: string;
  heure: string;
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token manquant");

        const res = await fetch("http://localhost:5000/reservations/me/medecin", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        const data = await res.json();

        // Formater les données pour le frontend
        const formatted = data.map((rdv: any) => ({
          id: rdv.patient.id,
          nom: rdv.patient.name,
          age: rdv.patient.age ?? "-",
          diagnostic: rdv.patient.diagnostic ?? "-",
          dateReservation: new Date(rdv.dateReservation).toISOString().split("T")[0],
          heure: new Date(rdv.dateReservation).toISOString().split("T")[1].substring(0,5),
        }));

        setPatients(formatted);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">Patients avec rendez-vous</h1>

      {patients.length === 0 ? (
        <p className="text-gray-600">Aucun rendez-vous enregistré.</p>
      ) : (
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="py-2 px-4">Nom</th>
              <th className="py-2 px-4">Âge</th>
              <th className="py-2 px-4">Diagnostic</th>
              <th className="py-2 px-4">Date</th>
              <th className="py-2 px-4">Heure</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="py-2 px-4">{p.nom}</td>
                <td className="py-2 px-4">{p.age}</td>
                <td className="py-2 px-4">{p.diagnostic}</td>
                <td className="py-2 px-4">{p.dateReservation}</td>
                <td className="py-2 px-4">{p.heure}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
