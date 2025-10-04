// src/components/Activities.jsx
import React, { useEffect } from "react";

// Définition des activités et facteurs CO2 (kg CO2e par unité)
const ACTIVITIES = {
  low: [
    { id: "city_walk", name: "🚶 Balade en ville", factor: 2 },
    { id: "museum_visit", name: "🏛️ Visite musée", factor: 3 },
    { id: "picnic", name: "🥪 Pique-nique", factor: 1 },
    { id: "boat_ride_small", name: "🛶 Petit bateau", factor: 4 },
    { id: "beach_walk", name: "🏖️ Balade sur la plage", factor: 2 },
    { id: "local_market", name: "🛍️ Marché local", factor: 1 },
  ],
  medium: [
    { id: "moderate_hike", name: "🥾 Randonnée modérée", factor: 10 },
    { id: "cycling", name: "🚴 Vélo", factor: 8 },
    { id: "kayak", name: "🛶 Kayak", factor: 12 },
    { id: "horse_riding", name: "🐎 Équitation", factor: 15 },
    { id: "snorkeling", name: "🤿 Snorkeling", factor: 12 },
    { id: "surf_lesson", name: "🏄 Cours de surf", factor: 15 },
  ],
  high: [
    { id: "jet_ski", name: "🚤 Jet ski", factor: 50 },
    { id: "quad", name: "🏍️ Quad", factor: 60 },
    { id: "paragliding", name: "🪂 Parapente", factor: 40 },
    { id: "motorboat", name: "⛵ Bateau rapide", factor: 55 },
    { id: "windsurf", name: "🌊 Planche à voile", factor: 45 },
    { id: "kite_surf", name: "🪁 Kitesurf", factor: 50 },
    { id: "mountain_biking", name: "🚵 VTT montagne", factor: 40 },
  ],
};

export default function Activities({ activitiesState, setActivitiesState }) {
  // Initialise le state pour chaque catégorie si nécessaire
  useEffect(() => {
    ["low", "medium", "high"].forEach((category) => {
      if (!activitiesState[category]) {
        const catState = {};
        ACTIVITIES[category].forEach((act) => {
          catState[act.id] = { selected: false, quantity: 1 };
        });
        setActivitiesState((prev) => ({ ...prev, [category]: catState }));
      }
    });
  }, [activitiesState, setActivitiesState]);

  const handleToggle = (category, id, checked) => {
    setActivitiesState((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [id]: { ...prev[category][id], selected: checked },
      },
    }));
  };

  const handleQuantityChange = (category, id, value) => {
    setActivitiesState((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [id]: { ...prev[category][id], quantity: Number(value) },
      },
    }));
  };

  const renderCategory = (categoryName, activities, color) => (
    <div className="flex flex-col gap-3">
      <h3
        className={`text-lg font-bold bg-clip-text text-transparent ${color}`}
      >
        {categoryName === "low" && "🌿 Activités douces"}
        {categoryName === "medium" && "⛰️ Activités sportives"}
        {categoryName === "high" && "🔥 Activités intenses"}
      </h3>
      {activities.map((act) => {
        const state = activitiesState[categoryName]?.[act.id] || {
          selected: false,
          quantity: 1,
        };
        return (
          <label
            key={act.id}
            className="flex items-center justify-between gap-2 bg-white/70 p-3 rounded-xl shadow-sm border border-white/40"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={state.selected}
                onChange={(e) =>
                  handleToggle(categoryName, act.id, e.target.checked)
                }
                className="w-5 h-5 accent-orange-400"
              />
              <span className="text-sm text-gray-800">{act.name}</span>
            </div>
            <span className="text-xs text-red-500 whitespace-nowrap">
              {act.factor} kg CO₂
            </span>
            {state.selected && (
              <input
                type="number"
                min={1}
                value={state.quantity}
                onChange={(e) =>
                  handleQuantityChange(categoryName, act.id, e.target.value)
                }
                className="w-16 border border-gray-300 rounded-lg p-1 bg-white/80 focus:ring-2 focus:ring-pink-400"
              />
            )}
          </label>
        );
      })}
    </div>
  );

  return (
    <div className="rounded-3xl p-8 shadow-2xl bg-gradient-to-br from-orange-100 via-pink-50 to-blue-50 border border-white/40 backdrop-blur-lg flex flex-col gap-6">
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-pink-500 to-blue-600 mb-3">
        🎯 Activités
      </h2>
      {renderCategory("low", ACTIVITIES.low, "bg-gradient-to-r from-green-500 to-green-700")}
      {renderCategory("medium", ACTIVITIES.medium, "bg-gradient-to-r from-yellow-500 to-orange-600")}
      {renderCategory("high", ACTIVITIES.high, "bg-gradient-to-r from-red-500 to-pink-600")}
    </div>
  );
}

/**
 * Calcule les émissions CO2 pour toutes les activités sélectionnées
 * @param {Object} activitiesState - state complet des activités
 * @returns {number} total CO2 en kg
 */
export function computeActivitiesCO2(activitiesState) {
  let total = 0;
  Object.keys(activitiesState).forEach((category) => {
    Object.keys(activitiesState[category]).forEach((id) => {
      const { selected, quantity } = activitiesState[category][id];
      if (selected) {
        const factor =
          ACTIVITIES[category].find((a) => a.id === id)?.factor || 0;
        total += factor * (quantity || 1);
      }
    });
  });
  return total;
}
