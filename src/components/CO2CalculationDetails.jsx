// src/components/CO2CalculationDetails.jsx
import React from "react";

export default function CO2CalculationDetails({ totalCO2, transportMode, accomType, diet }) {
  return (
    <div className="mt-6 p-6 rounded-3xl bg-white shadow-lg space-y-4 border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 text-center">Détails et sources de calcul</h2>
      <ul className="list-disc list-inside text-gray-700">
        <li><strong>Transport:</strong> {transportMode} → facteur CO2 basé sur ADEME et calculs standards.</li>
        <li><strong>Hébergement:</strong> {accomType} → facteurs ADEME + options (air conditionné, piscine, petit-déjeuner, demi-pension).</li>
        <li><strong>Alimentation:</strong> {diet} → kg CO2 par repas selon régime alimentaire (omnivore, végétarien, vegan).</li>
        <li><strong>Activités:</strong> Facteurs selon intensité (low, medium, high) et études de consommation énergétique locale.</li>
        <li><strong>Total CO2:</strong> {totalCO2?.toFixed(1)} kg CO2e</li>
      </ul>
      <p className="text-gray-600 text-sm mt-2">
        Sources : <a href="https://www.ademe.fr/" target="_blank" className="text-blue-600 underline">ADEME</a>, études scientifiques sur empreinte carbone.
      </p>
    </div>
  );
}
