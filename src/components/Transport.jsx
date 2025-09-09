// Transport.jsx
import React from "react";
import CityInput from "./CityInput";

// Facteurs CO2
const DEFAULT_FACTORS = {
  flight_short: 0.15,
  flight_long: 0.11,
  train: 0.035,
  car_petrol: 0.19,
  car_electric: 0.05,
};

export default function Transport({
  legs,
  setLegs,
  passengers,
  setPassengers,
  transportMode,
  setTransportMode,
  totalResult,
  setTotalResult,
}) {
  const toNum = (s) => {
    if (s == null) return 0;
    const n = parseFloat(s.toString().replace(",", "."));
    return isNaN(n) ? 0 : n;
  };

  // Ajouter / supprimer une étape
  const addLeg = () => setLegs([...legs, { from: "", to: "", distance: 0 }]);
  const removeLeg = (index) => setLegs(legs.filter((_, i) => i !== index));

  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  // ⚡ Fetch distance depuis backend
  const fetchDistance = async (from, to) => {
    if (!from || !to) return 0;
    try {
      const res = await fetch(
        `http://localhost:5001/distance?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
      );
      const data = await res.json();
      if (
        data.rows &&
        data.rows[0] &&
        data.rows[0].elements &&
        data.rows[0].elements[0] &&
        data.rows[0].elements[0].distance
      ) {
        return data.rows[0].elements[0].distance.value / 1000; // m → km
      }
      return 0;
    } catch (err) {
      console.error("Erreur fetchDistance:", err);
      return 0;
    }
  };

  // Mettre à jour une étape et recalculer distance
  const updateLeg = async (index, field, value) => {
    const newLegs = [...legs];
    newLegs[index][field] = value;

    if (field === "from" || field === "to") {
      const distance = await fetchDistance(newLegs[index].from, newLegs[index].to);
      newLegs[index].distance = distance;
    }

    setLegs(newLegs);
    recalcTransport(newLegs);
  };

  // Recalcul CO2 transport
  const recalcTransport = (currentLegs) => {
    const totalDistance = currentLegs.reduce((sum, leg) => sum + toNum(leg.distance), 0);
    const transport = (DEFAULT_FACTORS[transportMode] || 0) * totalDistance * Math.max(1, toNum(passengers));

    setTotalResult(prev => ({
      ...prev,
      transport,
      total: transport + (prev.accommodation || 0) + (prev.food || 0) + (prev.activities || 0),
    }));
  };

  // Bouton calcul manuel
  const handleCalculate = () => recalcTransport(legs);

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6 flex flex-col gap-4">
      <h2 className="text-2xl font-semibold text-blue-800">Transport</h2>

      {/* Étapes */}
      {legs.map((leg, idx) => (
        <div key={idx} className="flex flex-col md:flex-row gap-3 items-center">
          <div className="flex-1 flex flex-col">
            <label className="text-sm text-gray-700">Départ</label>
            <CityInput
              value={leg.from}
              onChange={(val) => updateLeg(idx, "from", val)}
            />
          </div>

          <div className="flex-1 flex flex-col">
            <label className="text-sm text-gray-700">Arrivée</label>
            <CityInput
              value={leg.to}
              onChange={(val) => updateLeg(idx, "to", val)}
            />
          </div>

          <div className="w-24 text-center">
            <label className="text-sm text-gray-700">Distance</label>
            <span>{typeof leg.distance === "number" ? leg.distance.toFixed(1) : "0.0"} km</span>
          </div>

          {legs.length > 1 && (
            <button
              className="text-red-500 font-semibold mt-2 md:mt-0"
              onClick={() => removeLeg(idx)}
            >
              Supprimer
            </button>
          )}
        </div>
      ))}

      {/* Ajouter une étape */}
      <button
        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-xl"
        onClick={addLeg}
      >
        Ajouter une étape
      </button>

      {/* Passagers */}
      <div className="mt-4">
        <label className="text-sm text-gray-700">Nombre de passagers</label>
        <input
          type="number"
          className="border p-2 rounded-xl w-full"
          value={passengers}
          onChange={(e) => {
            setPassengers(e.target.value);
            recalcTransport(legs);
          }}
        />
      </div>

      {/* Mode de transport */}
      <div className="mt-4">
        <label className="text-sm text-gray-700">Mode de transport</label>
        <select
          className="border p-2 rounded-xl w-full"
          value={transportMode}
          onChange={(e) => {
            setTransportMode(e.target.value);
            recalcTransport(legs);
          }}
        >
          <option value="flight_short">Avion (court-courrier)</option>
          <option value="flight_long">Avion (long-courrier)</option>
          <option value="train">Train</option>
          <option value="car_petrol">Voiture essence</option>
          <option value="car_electric">Voiture électrique</option>
        </select>
      </div>

      {/* Bouton calcul manuel */}
      <button
        className="mt-4 bg-green-600 text-white px-6 py-3 rounded-xl"
        onClick={handleCalculate}
      >
        Calculer l'itinéraire
      </button>
    </div>
  );
}
