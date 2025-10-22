"use client"
import WelcomeMessage from "@/components/WelcomeMessage"

export default function DashboardPatient() {
  return (
    <div className="p-6">
      <WelcomeMessage />
      <div className="mt-6">
        <p className="text-gray-600 mb-6">
          Consultez vos rendez-vous, historique, paiements et ordonnances en un seul endroit.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 className="font-bold text-gray-800 text-lg mb-2">Prochain Rendez-vous</h3>
            <p className="text-gray-600">Aucun rendez-vous prévu.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 className="font-bold text-gray-800 text-lg mb-2">Dernière Consultation</h3>
            <p className="text-gray-600">Dr. Dupont – 10/10/2025</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 className="font-bold text-gray-800 text-lg mb-2">Paiements</h3>
            <p className="text-gray-600">Aucun paiement en attente.</p>
          </div>
        </div>
      </div>
    </div>
  )
}