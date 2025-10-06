// import React from "react";

// export default function Co2Result({ totalResult }) {
//   if (!totalResult || totalResult.total === 0) return null;

//   return (
//     <div className="bg-white shadow-lg rounded-xl p-6 space-y-4 border-l-4 border-green-600">
//       <h2 className="text-2xl font-bold text-green-700">Résultat CO2</h2>
//       <p className="mt-2 text-xl font-bold text-green-800">Total: {totalResult.total.toFixed(1)} kg CO2e</p>
//       <p><strong>Transport:</strong> {totalResult.transport.toFixed(1)} kg CO2e</p>
//       <p><strong>Hébergement:</strong> {totalResult.accommodation.toFixed(1)} kg CO2e</p>
//       <p><strong>Alimentation:</strong> {totalResult.food.toFixed(1)} kg CO2e</p>
//       <p><strong>Activités:</strong> {totalResult.activitiesCO2?.toFixed(1) ?? 0} kg CO2e</p>
//     </div>
//   );
// }
import React from "react";

export default function Co2Result({
  totalResult,
  transportDetails,
  accomDetails,
  mealsDetails,
  activitiesDetails,
}) {
  if (!totalResult || totalResult.total === 0) return null;

  // Création du résumé textuel dynamique
  const transportSummary = transportDetails?.legs?.length
    ? transportDetails.legs.map((leg, idx) => `${leg.from} → ${leg.to} (${leg.distance.toFixed(1)} km)`).join(", ")
    : "Aucun trajet saisi";

  const accomSummary = accomDetails
    ? `${accomDetails.nights} nuits dans ${accomDetails.accomType}, ${accomDetails.numRooms} chambre(s) pour ${accomDetails.numGuests} personne(s)`
    : "Aucun hébergement saisi";

  const mealsSummary = mealsDetails
    ? `Régime ${mealsDetails.diet}, ${mealsDetails.mealsPerDay} repas/jour`
    : "Aucun repas saisi";

  const activitiesSummary = activitiesDetails
    ? Object.keys(activitiesDetails)
        .map((cat) =>
          Object.entries(activitiesDetails[cat])
            .filter(([_, val]) => val.selected)
            .map(([id, val]) => `${id} x${val.quantity}`)
            .join(", ")
        )
        .filter((s) => s.length > 0)
        .join(" | ") || "Aucune activité sélectionnée"
    : "Aucune activité sélectionnée";

  return (
    <div className="mt-6 p-6 rounded-3xl bg-gradient-to-r from-pink-50 via-yellow-50 to-green-50 shadow-2xl space-y-8">
      <h2 className="text-3xl font-extrabold text-center text-green-900 mb-4">
        🌅 Résumé du séjour & CO2
      </h2>

      <div className="p-6 rounded-2xl bg-white/90 backdrop-blur-md shadow-xl space-y-6">
        <p className="text-xl font-bold text-green-800 text-center">
          Total CO2 émis : <span className="text-2xl text-red-600">{totalResult.total.toFixed(1)} kg CO₂e</span>
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 bg-blue-50 rounded-xl shadow hover:shadow-lg transition-all">
            <h3 className="font-semibold text-blue-700 mb-1">🚗 Transport</h3>
            <p className="text-gray-800 text-sm">{transportSummary}</p>
            <div className="mt-2 font-bold text-blue-900 text-lg">{totalResult.transport.toFixed(1)} kg</div>
          </div>

          <div className="p-4 bg-green-50 rounded-xl shadow hover:shadow-lg transition-all">
            <h3 className="font-semibold text-green-700 mb-1">🏨 Hébergement</h3>
            <p className="text-gray-800 text-sm">{accomSummary}</p>
            <div className="mt-2 font-bold text-green-900 text-lg">{totalResult.accommodation.toFixed(1)} kg</div>
          </div>

          <div className="p-4 bg-yellow-50 rounded-xl shadow hover:shadow-lg transition-all">
            <h3 className="font-semibold text-yellow-700 mb-1">🍽️ Alimentation</h3>
            <p className="text-gray-800 text-sm">{mealsSummary}</p>
            <div className="mt-2 font-bold text-yellow-900 text-lg">{totalResult.food.toFixed(1)} kg</div>
          </div>

          <div className="p-4 bg-pink-50 rounded-xl shadow hover:shadow-lg transition-all">
            <h3 className="font-semibold text-pink-700 mb-1">🎯 Activités</h3>
            <p className="text-gray-800 text-sm">{activitiesSummary}</p>
            <div className="mt-2 font-bold text-pink-900 text-lg">{totalResult.activitiesCO2?.toFixed(1) ?? 0} kg</div>
          </div>
        </div>
      </div>
    </div>
  );
}
