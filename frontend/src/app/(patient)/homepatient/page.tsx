export default function DashboardPatient() {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Bienvenue sur votre espace patient 👋</h2>
        <p className="text-gray-600">
          Consultez vos rendez-vous, historique, paiements et ordonnances en un seul endroit.
        </p>
  
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="font-bold text-gray-700">Prochain Rendez-vous</h3>
            <p className="text-gray-500 mt-2">Aucun rendez-vous prévu.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="font-bold text-gray-700">Dernière Consultation</h3>
            <p className="text-gray-500 mt-2">Dr. Dupont – 10/10/2025</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="font-bold text-gray-700">Paiements</h3>
            <p className="text-gray-500 mt-2">Aucun paiement en attente.</p>
          </div>
        </div>
      </div>
    );
  }
  