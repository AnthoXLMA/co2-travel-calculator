// src/components/Food.jsx
import React from "react";

export default function Food({
  mealsPerDay,
  setMealsPerDay,
  diet,
  setDiet,
  hasBreakfast,
  setHasBreakfast,
  hasHalfBoard,
  setHasHalfBoard,
}) {
  return (
    <div className="rounded-3xl p-8 shadow-2xl bg-gradient-to-br from-orange-100 via-pink-50 to-blue-50 border border-white/40 backdrop-blur-lg">
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-pink-500 to-blue-600 mb-6">
        🍽️ Alimentation
      </h2>

      {/* Type de régime */}
      <div className="flex flex-col gap-2">
        <label
          className="text-sm font-medium text-gray-700"
          htmlFor="diet"
        >
          Type de régime alimentaire
        </label>
        <select
          id="diet"
          className="border border-gray-300 rounded-xl p-3 bg-white/70 focus:ring-2 focus:ring-orange-400 focus:outline-none"
          value={diet}
          onChange={(e) => setDiet(e.target.value)}
        >
          <option value="meal_omnivore">🍖 Omnivore</option>
          <option value="meal_vegetarian">🥗 Végétarien</option>
          <option value="meal_vegan">🌱 Vegan</option>
        </select>
      </div>

      {/* Nombre de repas par jour */}
      <div className="flex flex-col gap-2">
        <label
          className="text-sm font-medium text-gray-700"
          htmlFor="mealsPerDay"
        >
          Nombre de repas par jour
        </label>
        <input
          id="mealsPerDay"
          type="number"
          min={0}
          max={10}
          className="border border-gray-300 rounded-xl p-3 bg-white/70 focus:ring-2 focus:ring-pink-400 focus:outline-none"
          value={mealsPerDay}
          onChange={(e) => setMealsPerDay(parseInt(e.target.value) || 0)}
          placeholder="Ex : 3"
        />
      </div>

      {/* Repas inclus dans l'hébergement */}
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
          </label>
        </div>
      </div>
    </div>
  );
}
