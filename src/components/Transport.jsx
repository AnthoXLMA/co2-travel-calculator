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

  // Ajouter / supprimer des étapes
  const addLeg = () =>
    setLegs([...legs, { id: Date.now(), from: "", to: "", distance: 0 }]);
  const removeLeg = (id) => setLegs(legs.filter((leg) => leg.id !== id));

  // --- Fonction pour récupérer la distance avec Google Maps ---
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

  // --- Recalcul du CO2 transport ---
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

  // --- Charger Google Maps API si non présent ---
  useEffect(() => {
    if (window.google) return; // déjà chargé

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6 flex flex-col gap-4">
      <h2 className="text-2xl font-semibold text-blue-800">Transport</h2>

      {legs.map((leg, idx) => (
        <div key={leg.id} className="flex flex-col md:flex-row gap-3 items-center">
          <div className="flex-1 flex flex-col">
            <label className="text-sm text-gray-700">Départ</label>
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
            <label className="text-sm text-gray-700">Arrivée</label>
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

          <div className="w-24 text-center">
            <label className="text-sm text-gray-700">Distance</label>
            <span>{toNum(leg.distance).toFixed(1)} km</span>
          </div>

          {legs.length > 1 && (
            <button
              className="text-red-500 font-semibold mt-2 md:mt-0"
              onClick={() => removeLeg(leg.id)}
            >
              Supprimer
            </button>
          )}
        </div>
      ))}

      <button
        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-xl"
        onClick={addLeg}
      >
        Ajouter une étape
      </button>

      <div className="mt-4">
        <label className="text-sm text-gray-700">Nombre de passagers</label>
        <input
          type="number"
          className="border p-2 rounded-xl w-full"
          value={passengers}
          onChange={(e) => {
            setPassengers(e.target.value);
            recalcTransport();
          }}
        />
      </div>

      <div className="mt-4">
        <label className="text-sm text-gray-700">Mode de transport</label>
        <select
          className="border p-2 rounded-xl w-full"
          value={transportMode}
          onChange={(e) => {
            setTransportMode(e.target.value);
            recalcTransport();
          }}
        >
          <option value="flight_short">Avion (court-courrier)</option>
          <option value="flight_long">Avion (long-courrier)</option>
          <option value="train">Train</option>
          <option value="car_petrol">Voiture essence</option>
          <option value="car_electric">Voiture électrique</option>
        </select>
      </div>
    </div>
  );
}
