// src/components/Transport.jsx
import React, { useState, useEffect } from "react";
import CityInput from "./CityInput";
import { DEFAULT_FACTORS } from "./factors";

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

  const addLeg = () =>
    setLegs([...legs, { id: Date.now(), from: "", to: "", distance: 0 }]);
  const removeLeg = (id) => setLegs(legs.filter((leg) => leg.id !== id));

  const updateLegDistance = async (index) => {
    const leg = legs[index];
    if (!leg.from || !leg.to || !window.google) return;

    const service = new window.google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [leg.from],
        destinations: [leg.to],
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === "OK") {
          const dist = response.rows[0].elements[0].distance?.value / 1000 || 0;
          setLegs((prev) => {
            const newLegs = [...prev];
            newLegs[index].distance = dist;
            return newLegs;
          });
          recalcTransport();
        } else {
          console.error("Erreur DistanceMatrix:", status);
        }
      }
    );
  };

  const recalcTransport = () => {
    const totalDistance = legs.reduce((sum, leg) => sum + toNum(leg.distance), 0);
    const transport =
      (DEFAULT_FACTORS[transportMode] || 0) *
      totalDistance *
      Math.max(1, toNum(passengers));

    setTotalResult((prev) => ({
      ...prev,
      transport,
      total:
        transport +
        (prev.accommodation || 0) +
        (prev.food || 0) +
        (prev.activitiesCO2 || 0),
    }));
  };

  useEffect(() => {
    if (window.google) return;

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="rounded-3xl p-8 shadow-2xl bg-gradient-to-br from-orange-100 via-pink-50 to-blue-50 border border-white/40 backdrop-blur-lg">
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-pink-500 to-blue-600 mb-6">
        🌍 Transport
      </h2>

      {legs.map((leg, idx) => (
        <div
          key={leg.id}
          className="flex flex-col md:flex-row gap-4 items-center bg-white/60 p-4 rounded-2xl shadow-sm border border-white/40"
        >
          <div className="flex-1 flex flex-col">
            <label className="text-xs font-medium text-gray-600">Départ</label>
            <CityInput
              value={leg.from}
              onChange={(val) => {
                setLegs((prev) => {
                  const newLegs = [...prev];
                  newLegs[idx].from = val;
                  return newLegs;
                });
                updateLegDistance(idx);
              }}
            />
          </div>

          <div className="flex-1 flex flex-col">
            <label className="text-xs font-medium text-gray-600">Arrivée</label>
            <CityInput
              value={leg.to}
              onChange={(val) => {
                setLegs((prev) => {
                  const newLegs = [...prev];
                  newLegs[idx].to = val;
                  return newLegs;
                });
                updateLegDistance(idx);
              }}
            />
          </div>

          <div className="w-28 text-center">
            <label className="text-xs font-medium text-gray-600">Distance</label>
            <span className="block text-lg font-semibold text-blue-700">
              {toNum(leg.distance).toFixed(1)} km
            </span>
          </div>

          {legs.length > 1 && (
            <button
              className="px-3 py-1 text-sm rounded-xl bg-gradient-to-r from-red-400 to-pink-500 text-white font-medium shadow hover:scale-105 transition-transform"
              onClick={() => removeLeg(leg.id)}
            >
              ✕ Supprimer
            </button>
          )}
        </div>
      ))}

      <button
        className="mt-4 px-6 py-2 rounded-xl bg-gradient-to-r from-orange-500 via-pink-500 to-blue-500 text-white font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all"
        onClick={addLeg}
      >
        ➕ Ajouter une étape
      </button>

      <div className="mt-6">
        <label className="text-sm font-medium text-gray-700">Nombre de passagers</label>
        <input
          type="number"
          className="mt-1 border border-gray-300 p-2 rounded-xl w-full focus:ring-2 focus:ring-pink-400 focus:outline-none bg-white/70"
          value={passengers}
          onChange={(e) => {
            setPassengers(e.target.value);
            recalcTransport();
          }}
        />
      </div>

      <div className="mt-6">
        <label className="text-sm font-medium text-gray-700">Mode de transport</label>
        <select
          className="mt-1 border border-gray-300 p-2 rounded-xl w-full focus:ring-2 focus:ring-orange-400 focus:outline-none bg-white/70"
          value={transportMode}
          onChange={(e) => {
            setTransportMode(e.target.value);
            recalcTransport();
          }}
        >
          <option value="flight_short">✈️ Avion (court-courrier)</option>
          <option value="flight_long">🌐 Avion (long-courrier)</option>
          <option value="train">🚆 Train</option>
          <option value="car_petrol">🚗 Voiture essence</option>
          <option value="car_electric">⚡ Voiture électrique</option>
        </select>
      </div>
    </div>
  );
}
