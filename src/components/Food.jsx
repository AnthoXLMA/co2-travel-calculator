import React from "react";

export default function Food({
  mealsPerDay,
  setMealsPerDay,
  diet,
  setDiet,
  hasBreakfast,
  setHasBreakfast,
  hasHalfBoard,
  setHasHalfBoard
}) {
  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6 flex flex-col gap-5 hover:shadow-3xl transition-shadow">
      <h2 className="text-2xl font-semibold text-blue-800 mb-3">Alimentation</h2>

      {/* Type de régime */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-700 font-medium" htmlFor="diet">
          Type de régime alimentaire
        </label>
        <select
          id="diet"
          className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
          value={diet}
          onChange={(e) => setDiet(e.target.value)}
        >
          <option value="meal_omnivore">Omnivore</option>
          <option value="meal_vegetarian">Végétarien</option>
          <option value="meal_vegan">Vegan</option>
        </select>
      </div>

      {/* Nombre de repas par jour */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-700 font-medium" htmlFor="mealsPerDay">
          Nombre de repas par jour
        </label>
        <input
          id="mealsPerDay"
          type="number"
          min={0}
          max={10}
          className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
          value={mealsPerDay}
          onChange={(e) => setMealsPerDay(parseInt(e.target.value) || 0)}
          placeholder="Ex : 3"
        />
      </div>

      {/* Repas inclus dans l'hébergement */}
      <div className="flex flex-col gap-2">
        <span className="text-sm text-gray-700 font-medium">Repas inclus</span>
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="w-5 h-5"
              checked={hasBreakfast}
              onChange={(e) => setHasBreakfast(e.target.checked)}
            />
            <span className="text-sm text-gray-700">Petit-déjeuner</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="w-5 h-5"
              checked={hasHalfBoard}
              onChange={(e) => setHasHalfBoard(e.target.checked)}
            />
            <span className="text-sm text-gray-700">Demi-pension</span>
          </label>
        </div>
      </div>
    </div>
  );
}
