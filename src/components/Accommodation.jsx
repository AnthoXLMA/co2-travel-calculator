// src/components/Accommodation.jsx
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
  const CO2_FACTORS = {
    airCon: 5,
    pool: 10,
    breakfast: 2,
    halfBoard: 5,
  };

  return (
    <div className="rounded-3xl p-8 shadow-2xl bg-gradient-to-br from-orange-100 via-pink-50 to-blue-50 border border-white/40 backdrop-blur-lg">
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-pink-500 to-blue-600 mb-6">
        🏨 Hébergement
      </h2>

      {/* Type d'hébergement */}
      <div className="flex flex-col gap-2">
        <label
          className="text-sm font-medium text-gray-700"
          htmlFor="accomType"
        >
          Type d'hébergement
        </label>
        <select
          id="accomType"
          className="border border-gray-300 rounded-xl p-3 bg-white/70 focus:ring-2 focus:ring-orange-400 focus:outline-none"
          value={accomType}
          onChange={(e) => setAccomType(e.target.value)}
        >
          <option value="hotel_standard">🏨 Hôtel standard</option>
          <option value="hotel_luxury">✨ Hôtel luxe</option>
          <option value="hotel_ecohotel">🌿 Éco-hôtel</option>
          <option value="bnb">🏡 Chambre d'hôtes / BnB</option>
          <option value="airbnb">🛋️ Location Airbnb</option>
          <option value="camping">⛺ Camping</option>
        </select>
      </div>

      {/* Nombre de nuits */}
      <div className="flex flex-col gap-2">
        <label
          className="text-sm font-medium text-gray-700"
          htmlFor="nights"
        >
          Nombre de nuits
        </label>
        <input
          id="nights"
          type="number"
          min={1}
          max={365}
          className="border border-gray-300 rounded-xl p-3 bg-white/70 focus:ring-2 focus:ring-pink-400 focus:outline-none"
          value={nights}
          onChange={(e) => setNights(e.target.value)}
        />
      </div>

      {/* Nombre de chambres */}
      <div className="flex flex-col gap-2">
        <label
          className="text-sm font-medium text-gray-700"
          htmlFor="numRooms"
        >
          Nombre de chambres
        </label>
        <input
          id="numRooms"
          type="number"
          min={1}
          max={20}
          className="border border-gray-300 rounded-xl p-3 bg-white/70 focus:ring-2 focus:ring-pink-400 focus:outline-none"
          value={numRooms}
          onChange={(e) => setNumRooms(e.target.value)}
        />
      </div>

      {/* Nombre de voyageurs */}
      <div className="flex flex-col gap-2">
        <label
          className="text-sm font-medium text-gray-700"
          htmlFor="numGuests"
        >
          Nombre de voyageurs
        </label>
        <input
          id="numGuests"
          type="number"
          min={1}
          max={50}
          className="border border-gray-300 rounded-xl p-3 bg-white/70 focus:ring-2 focus:ring-pink-400 focus:outline-none"
          value={numGuests}
          onChange={(e) => setNumGuests(e.target.value)}
        />
      </div>

      {/* Confort / impact CO2 */}
      <div className="flex flex-col gap-4 mt-4">
        <span className="text-sm font-medium text-gray-700">
          Confort / impact CO₂
        </span>
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-3">
          <label className="flex items-center justify-between w-full sm:w-auto bg-white/60 p-3 rounded-xl shadow-sm border border-white/40">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-5 h-5 accent-orange-500"
                checked={airConLevel > 0}
                onChange={(e) => setAirConLevel(e.target.checked ? 1 : 0)}
              />
              <span className="text-sm">❄️ Climatisation</span>
            </div>
            <span className="text-xs text-red-500">
              + {airConLevel ? CO2_FACTORS.airCon : 0} kg CO₂/nuit
            </span>
          </label>

          <label className="flex items-center justify-between w-full sm:w-auto bg-white/60 p-3 rounded-xl shadow-sm border border-white/40">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-5 h-5 accent-pink-500"
                checked={poolLevel > 0}
                onChange={(e) => setPoolLevel(e.target.checked ? 1 : 0)}
              />
              <span className="text-sm">🏊 Piscine / spa</span>
            </div>
            <span className="text-xs text-red-500">
              + {poolLevel ? CO2_FACTORS.pool : 0} kg CO₂/nuit
            </span>
          </label>
        </div>
      </div>

      {/* Repas inclus */}
      <div className="flex flex-col gap-4 mt-4">
        <span className="text-sm font-medium text-gray-700">Repas inclus</span>
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-3">
          <label className="flex items-center justify-between w-full sm:w-auto bg-white/60 p-3 rounded-xl shadow-sm border border-white/40">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-5 h-5 accent-orange-400"
                checked={hasBreakfast}
                onChange={(e) => setHasBreakfast(e.target.checked)}
              />
              <span className="text-sm">🍳 Petit-déjeuner</span>
            </div>
            <span className="text-xs text-red-500">
              + {hasBreakfast ? CO2_FACTORS.breakfast : 0} kg CO₂/nuit
            </span>
          </label>

          <label className="flex items-center justify-between w-full sm:w-auto bg-white/60 p-3 rounded-xl shadow-sm border border-white/40">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-5 h-5 accent-pink-400"
                checked={hasHalfBoard}
                onChange={(e) => setHasHalfBoard(e.target.checked)}
              />
              <span className="text-sm">🍽️ Demi-pension</span>
            </div>
            <span className="text-xs text-red-500">
              + {hasHalfBoard ? CO2_FACTORS.halfBoard : 0} kg CO₂/nuit
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
