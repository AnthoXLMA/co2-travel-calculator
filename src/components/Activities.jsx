import React, { useState, useEffect } from "react";


// Définition des activités et facteurs CO2 (kg CO2e par unité)
const ACTIVITIES = {
  low: [
    { id: "city_walk", name: "Balade en ville", factor: 2 },
    { id: "museum_visit", name: "Visite musée", factor: 3 },
    { id: "picnic", name: "Pique-nique", factor: 1 },
    { id: "boat_ride_small", name: "Promenade en petit bateau", factor: 4 },
    { id: "beach_walk", name: "Balade sur la plage", factor: 2 },
    { id: "local_market", name: "Visite marché local", factor: 1 },
  ],
  medium: [
    { id: "moderate_hike", name: "Randonnée modérée", factor: 10 },
    { id: "cycling", name: "Vélo", factor: 8 },
    { id: "kayak", name: "Kayak", factor: 12 },
    { id: "horse_riding", name: "Équitation", factor: 15 },
    { id: "snorkeling", name: "Snorkeling", factor: 12 },
    { id: "surf_lesson", name: "Cours de surf", factor: 15 },
  ],
  high: [
    { id: "jet_ski", name: "Jet ski", factor: 50 },
    { id: "quad", name: "Quad", factor: 60 },
    { id: "paragliding", name: "Parapente", factor: 40 },
    { id: "motorboat", name: "Bateau à moteur rapide", factor: 55 },
    { id: "windsurf", name: "Planche à voile", factor: 45 },
    { id: "kite_surf", name: "Kitesurf", factor: 50 },
    { id: "mountain_biking", name: "VTT montagne", factor: 40 },
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

  const renderCategory = (categoryName, activities) => (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-semibold text-gray-800 capitalize">
        {categoryName} activities
      </h3>
      {activities.map((act) => {
        const state = activitiesState[categoryName]?.[act.id] || {
          selected: false,
          quantity: 1,
        };
        return (
          <label key={act.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={state.selected}
              onChange={(e) =>
                handleToggle(categoryName, act.id, e.target.checked)
              }
              className="w-5 h-5"
            />
            <span className="flex-1">
              {act.name} (CO2: {act.factor} kg)
            </span>
            {state.selected && (
              <input
                type="number"
                min={1}
                value={state.quantity}
                onChange={(e) =>
                  handleQuantityChange(categoryName, act.id, e.target.value)
                }
                className="w-16 border border-gray-300 rounded-xl p-1"
              />
            )}
          </label>
        );
      })}
    </div>
  );

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6 flex flex-col gap-5 hover:shadow-3xl transition-shadow">
      <h2 className="text-2xl font-semibold text-blue-800 mb-3">Activités</h2>
      {renderCategory("low", ACTIVITIES.low)}
      {renderCategory("medium", ACTIVITIES.medium)}
      {renderCategory("high", ACTIVITIES.high)}
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
