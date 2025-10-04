import React from "react";

export default function Co2Result({ totalResult }) {
  if (!totalResult || totalResult.total === 0) return null;

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 space-y-4 border-l-4 border-green-600">
      <h2 className="text-2xl font-bold text-green-700">Résultat CO2</h2>
      <p><strong>Transport:</strong> {totalResult.transport.toFixed(1)} kg CO2e</p>
      <p><strong>Hébergement:</strong> {totalResult.accommodation.toFixed(1)} kg CO2e</p>
      <p><strong>Alimentation:</strong> {totalResult.food.toFixed(1)} kg CO2e</p>
      <p><strong>Activités:</strong> {totalResult.activitiesCO2?.toFixed(1) ?? 0} kg CO2e</p>
      <p className="mt-2 text-xl font-bold text-green-800">Total: {totalResult.total.toFixed(1)} kg CO2e</p>
    </div>
  );
}
