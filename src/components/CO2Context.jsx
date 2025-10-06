import React from "react";

export default function CO2Context({ totalCO2, transportMode, accomType, diet }) {
  const dailyFrance = 27; // kg CO2/jour moyen en France
  const taxeCarbone = 0.05; // €/kg CO2
  const kmVoiture = 0.19;
  const repasOmnivore = 2.5;
  const douche = 0.7;
  const co2PerTree = 10; // kg CO2 absorbé par arbre/an

  if (!totalCO2 || totalCO2 <= 0) return null;

  const recommendations = [];

  if (transportMode?.toLowerCase().includes("flight")) {
    recommendations.push({
      icon: "✈️",
      title: "Réduisez l'impact de vos vols",
      text: "Prenez le train pour ce trajet si possible, ou partez un jour avant pour réduire le stress et la consommation énergétique.",
      potential: totalCO2 * 0.3,
    });
  }

  if (accomType && !accomType.toLowerCase().includes("ecohotel")) {
    recommendations.push({
      icon: "🏨",
      title: "Hébergement plus écologique",
      text: "Choisissez un hôtel ou un logement certifié éco-responsable, ou réduisez votre séjour d'un jour pour limiter l'empreinte CO2.",
      potential: totalCO2 * 0.2,
    });
  }

  if (diet?.toLowerCase() === "meal_omnivore") {
    recommendations.push({
      icon: "🥦",
      title: "Repas plus durable",
      text: "Alternez vos repas omnivores avec des repas végétariens ou vegans pendant le séjour.",
      potential: totalCO2 * 0.1,
    });
  }

  const treesNeeded = Math.ceil(totalCO2 / co2PerTree);
  const compensateCO2 = () => {
    const url =
      "https://www.onf.fr/produits-services/gerer-et-amenager-vos-espaces-naturels/%2B/85b%3A%3Acompensation-carbone-agir-pour-la-planete-snbc.html";
    window.open(url, "_blank");
  };

  return (
    <div className="mt-6 p-6 rounded-3xl bg-gradient-to-r from-pink-100 via-yellow-50 to-green-100 shadow-2xl space-y-6">
      <h2 className="text-3xl font-extrabold text-center text-green-900">
        Contexte CO2 de votre voyage
      </h2>

      {/* Card arbres à planter */}
      <div className="p-6 bg-white/80 backdrop-blur-md rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 col-span-full text-center font-semibold text-green-800">
        <div className="flex flex-wrap justify-center mb-4 gap-3">
          {Array.from({ length: Math.min(treesNeeded, 20) }).map((_, idx) => (
            <div key={idx} className="flex flex-col items-center animate-bounce">
              <span className="text-sm font-bold text-green-700">{idx + 1}</span>
              <span className="text-2xl">🌳</span>
            </div>
          ))}
          {treesNeeded > 20 && (
            <div className="flex flex-col items-center">
              <span className="text-sm font-bold text-green-700">+{treesNeeded - 20}</span>
              <span className="text-2xl">🌳</span>
            </div>
          )}
        </div>

        <p className="text-lg font-medium">
          Pour compenser ce voyage, plantez environ <strong>{treesNeeded}</strong> arbres.
        </p>
        <p className="text-sm text-green-700/80 mt-1">
          Calcul basé sur une absorption de CO2 de 10 kg/an.
        </p>

        <button
          className="mt-5 bg-green-700 hover:bg-green-800 text-white font-bold px-8 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300"
          onClick={compensateCO2}
        >
          Compensez votre CO2
        </button>
      </div>

      {/* Équivalences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800">
        {[
          { icon: "🌍", label: "Consommation équivalente", value: (totalCO2 / dailyFrance).toFixed(1) + " jours" },
          { icon: "🚗", label: "Équivalent voiture", value: (totalCO2 / kmVoiture).toFixed(0) + " km" },
          { icon: "🍽️", label: "Équivalent repas", value: (totalCO2 / repasOmnivore).toFixed(0) + " repas" },
          { icon: "🚿", label: "Équivalent douche", value: (totalCO2 / douche).toFixed(0) + " douches de 10 min" },
          { icon: "💰", label: "Taxe carbone estimée", value: "€" + (totalCO2 * taxeCarbone).toFixed(2), full: true },
        ].map((item, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow ${
              item.full ? "col-span-full text-center font-semibold text-green-800 bg-white/80 backdrop-blur-md" : "bg-white/70 backdrop-blur-sm"
            }`}
          >
            <span className="text-xl">{item.icon}</span> <strong>{item.label}:</strong> {item.value}
          </div>
        ))}
      </div>

      {/* Recommandations détaillées */}
      {recommendations.length > 0 && (
        <div className="space-y-4 mt-4">
          <h3 className="text-2xl font-bold text-green-900 text-center">
            Recommandations pour réduire votre CO2
          </h3>
          {recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white/80 backdrop-blur-md shadow-xl hover:shadow-2xl transition-shadow border-l-4 border-green-400"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{rec.icon}</span>
                <div className="flex-1">
                  <h4 className="font-bold text-green-800">{rec.title}</h4>
                  <p className="text-green-700/90 mt-1">{rec.text}</p>
                  <div className="h-2 bg-green-200 rounded-full overflow-hidden mt-2">
                    <div
                      className="h-2 bg-green-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((rec.potential / totalCO2) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    Potentiel économie : {rec.potential.toFixed(1)} kg CO2
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
