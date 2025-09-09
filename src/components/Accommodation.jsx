import React from "react";

export default function Accommodation({
  nights,
  setNights,
  accomType,
  setAccomType,
  numRooms,
  setNumRooms,
  numGuests,
  setNumGuests,
  airConLevel,
  setAirConLevel,
  poolLevel,
  setPoolLevel,
  hasBreakfast,
  setHasBreakfast,
  hasHalfBoard,
  setHasHalfBoard,
}) {
  // Facteurs CO2 approximatifs par nuit ou par service
  const CO2_FACTORS = {
    airCon: 5,       // kg CO2/nuit
    pool: 10,        // kg CO2/nuit
    breakfast: 2,    // kg CO2/nuit
    halfBoard: 5,    // kg CO2/nuit
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 flex flex-col gap-6 hover:shadow-3xl transition-shadow">
      <h2 className="text-2xl font-semibold text-blue-800 mb-3">Hébergement</h2>

      {/* Type d'hébergement */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-700 font-medium" htmlFor="accomType">
          Type d'hébergement
        </label>
        <select
          id="accomType"
          className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
          value={accomType}
          onChange={(e) => setAccomType(e.target.value)}
        >
          <option value="hotel_standard">Hôtel standard</option>
          <option value="hotel_luxury">Hôtel luxe</option>
          <option value="hotel_ecohotel">Éco-hôtel</option>
          <option value="bnb">Chambre d'hôtes / BnB</option>
          <option value="airbnb">Location Airbnb</option>
          <option value="camping">Camping</option>
        </select>
      </div>

      {/* Nombre de nuits */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-700 font-medium" htmlFor="nights">
          Nombre de nuits
        </label>
        <input
          id="nights"
          type="number"
          min={1}
          max={365}
          className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
          value={nights}
          onChange={(e) => setNights(e.target.value)}
        />
      </div>

      {/* Nombre de chambres */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-700 font-medium" htmlFor="numRooms">
          Nombre de chambres
        </label>
        <input
          id="numRooms"
          type="number"
          min={1}
          max={20}
          className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
          value={numRooms}
          onChange={(e) => setNumRooms(e.target.value)}
        />
      </div>

      {/* Nombre de voyageurs */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-700 font-medium" htmlFor="numGuests">
          Nombre de voyageurs
        </label>
        <input
          id="numGuests"
          type="number"
          min={1}
          max={50}
          className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
          value={numGuests}
          onChange={(e) => setNumGuests(e.target.value)}
        />
      </div>

      {/* Confort / impact CO2 */}
      <div className="flex flex-col gap-3">
        <span className="text-sm text-gray-700 font-medium">Confort / impact CO2</span>
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-2">
          <label className="flex items-center gap-2 justify-between w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-5 h-5"
                checked={airConLevel > 0}
                onChange={(e) => setAirConLevel(e.target.checked ? 1 : 0)}
              />
              <span className="text-sm text-gray-700">Climatisation</span>
            </div>
            <span className="text-xs text-red-500">+ {airConLevel ? CO2_FACTORS.airCon : 0} kg CO₂/nuit</span>
          </label>

          <label className="flex items-center gap-2 justify-between w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-5 h-5"
                checked={poolLevel > 0}
                onChange={(e) => setPoolLevel(e.target.checked ? 1 : 0)}
              />
              <span className="text-sm text-gray-700">Piscine / spa</span>
            </div>
            <span className="text-xs text-red-500">+ {poolLevel ? CO2_FACTORS.pool : 0} kg CO₂/nuit</span>
          </label>
        </div>
      </div>

      {/* Repas inclus */}
      <div className="flex flex-col gap-3">
        <span className="text-sm text-gray-700 font-medium">Repas inclus</span>
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-2">
          <label className="flex items-center gap-2 justify-between w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-5 h-5"
                checked={hasBreakfast}
                onChange={(e) => setHasBreakfast(e.target.checked)}
              />
              <span className="text-sm text-gray-700">Petit-déjeuner</span>
            </div>
            <span className="text-xs text-red-500">+ {hasBreakfast ? CO2_FACTORS.breakfast : 0} kg CO₂/nuit</span>
          </label>

          <label className="flex items-center gap-2 justify-between w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-5 h-5"
                checked={hasHalfBoard}
                onChange={(e) => setHasHalfBoard(e.target.checked)}
              />
              <span className="text-sm text-gray-700">Demi-pension</span>
            </div>
            <span className="text-xs text-red-500">+ {hasHalfBoard ? CO2_FACTORS.halfBoard : 0} kg CO₂/nuit</span>
          </label>
        </div>
      </div>
    </div>
  );
}
