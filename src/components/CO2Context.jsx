import React from "react";

export default function CO2Context({ totalCO2, transportMode, accomType, diet }) {
  const dailyFrance = 27; // kg CO2/jour moyen en France
  const taxeCarbone = 0.05; // €/kg CO2
  const kmVoiture = 0.19;
  const repasOmnivore = 2.5;
  const douche = 0.7;
  const co2PerTree = 10; // kg CO2 absorbé par arbre/an

  if (!totalCO2 || totalCO2 <= 0) return null;

  // Recommandations
  const recommendations = [];

  if (transportMode?.toLowerCase().includes("flight")) {
    recommendations.push({ icon: "✈️", text: "Remplacez un vol par le train ou le bus.", potential: totalCO2 * 0.3 });
  }

  if (accomType && !accomType.toLowerCase().includes("ecohotel")) {
    recommendations.push({ icon: "🏨", text: "Choisissez un hébergement écologique.", potential: totalCO2 * 0.2 });
  }

  if (diet?.toLowerCase() === "meal_omnivore") {
    recommendations.push({ icon: "🥦", text: "Optez pour des repas végétariens ou vegans.", potential: totalCO2 * 0.1 });
  }

  // Calcul nombre d'arbres nécessaires
  const treesNeeded = Math.ceil(totalCO2 / co2PerTree);

  return (
    <div className="mt-6 p-6 rounded-3xl bg-gradient-to-r from-yellow-50 via-white to-green-50 shadow-lg space-y-6">
      <h2 className="text-2xl font-bold text-center text-green-800">Contexte CO2 de votre voyage</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
        <div className="p-4 bg-white rounded-xl shadow hover:shadow-md transition-shadow">
          🌍 Consommation équivalente : <strong>{(totalCO2 / dailyFrance).toFixed(1)}</strong> jours
        </div>
        <div className="p-4 bg-white rounded-xl shadow hover:shadow-md transition-shadow">
          🚗 Équivalent voiture : <strong>{(totalCO2 / kmVoiture).toFixed(0)}</strong> km
        </div>
        <div className="p-4 bg-white rounded-xl shadow hover:shadow-md transition-shadow">
          🍽️ Équivalent repas : <strong>{(totalCO2 / repasOmnivore).toFixed(0)}</strong> repas
        </div>
        <div className="p-4 bg-white rounded-xl shadow hover:shadow-md transition-shadow">
          🚿 Équivalent douche : <strong>{(totalCO2 / douche).toFixed(0)}</strong> douches de 10 min
        </div>
        <div className="p-4 bg-white rounded-xl shadow hover:shadow-md transition-shadow col-span-full text-center font-semibold text-green-700">
          💰 Taxe carbone estimée : €{(totalCO2 * taxeCarbone).toFixed(2)}
        </div>
        <div className="p-4 bg-white rounded-xl shadow hover:shadow-md transition-shadow col-span-full text-center font-semibold text-green-700">
          🌳 Pour compenser ce voyage, plantez environ <strong>{treesNeeded}</strong> arbres. <p>Calcul basé sur une absorption de Co2 de 10 kg/an.</p>
        </div>
      </div>

      {recommendations.length > 0 && (
        <div className="space-y-3 mt-4">
          <h3 className="text-xl font-semibold text-gray-800">Recommandations pour réduire votre CO2</h3>
          {recommendations.map((rec, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-white shadow hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{rec.icon}</span>
                <span className="font-medium text-gray-800">{rec.text}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-2 bg-green-400 rounded-full" style={{ width: `${Math.min(rec.potential / totalCO2 * 100, 100)}%` }} />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Potentiel économie : {rec.potential.toFixed(1)} kg CO2
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
