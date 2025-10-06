import React, { useState, useEffect, useCallback } from "react";
import Transport from "./components/Transport";
import Accommodation from "./components/Accommodation";
import Food from "./components/Food";
import Activities, { computeActivitiesCO2 } from "./components/Activities";
import CityInput from "./components/CityInput";
import CO2Context from "./components/CO2Context";
import Co2Result from "./components/Co2Result";
import ProjectsDirectory from "./components/ProjectsDirectory";
import CO2CalculationDetails from "./components/CO2CalculationDetails";
import { LoadScript } from "@react-google-maps/api";

// --- Facteurs CO2 ---
const DEFAULT_FACTORS = {
  flight_short: 0.15,
  flight_long: 0.11,
  train: 0.035,
  car_petrol: 0.19,
  car_electric: 0.05,
  hotel_standard: 15,
  hotel_luxury: 30,
  hotel_ecohotel: 6,
  bnb: 10,
  airbnb: 10,
  meal_omnivore: 2.5,
  meal_vegetarian: 1.2,
  meal_vegan: 0.9,
};

const CO2_ADDITIONAL = { airCon: 5, pool: 10, breakfast: 2, halfBoard: 5 };
const DIET_FACTORS = { meal_omnivore: 2.5, meal_vegetarian: 1.2, meal_vegan: 0.9 };

const toNum = (s) => {
  const n = parseFloat(s?.toString().replace(",", "."));
  return isNaN(n) ? 0 : n;
};

function computeFoodCO2(diet, mealsPerDay, numDays, mealsIncluded = 0) {
  const factor = DIET_FACTORS[diet] || 0;
  const totalMeals = Math.max(0, mealsPerDay * numDays - mealsIncluded);
  return factor * totalMeals;
}

export default function App() {
  // --- Hébergement ---
  const [nights, setNights] = useState(1);
  const [accomType, setAccomType] = useState("hotel_standard");
  const [numRooms, setNumRooms] = useState(1);
  const [numGuests, setNumGuests] = useState(1);
  const [airConLevel, setAirConLevel] = useState(0);
  const [poolLevel, setPoolLevel] = useState(0);
  const [hasBreakfast, setHasBreakfast] = useState(false);
  const [hasHalfBoard, setHasHalfBoard] = useState(false);

  // --- Transport ---
  const [legs, setLegs] = useState([{ id: Date.now(), from: "", to: "", distance: 0 }]);
  const [passengers, setPassengers] = useState(1);
  const [transportMode, setTransportMode] = useState("car_petrol");

  // --- Alimentation ---
  const [mealsPerDay, setMealsPerDay] = useState("3");
  const [diet, setDiet] = useState("meal_omnivore");

  // --- Activités ---
  const [activitiesState, setActivitiesState] = useState({});

  // --- Détails pour le résumé ---
  const [transportDetails, setTransportDetails] = useState({ legs });
  const [accomDetails, setAccomDetails] = useState({ nights, accomType, numRooms, numGuests, airConLevel, poolLevel, hasBreakfast, hasHalfBoard });
  const [mealsDetails, setMealsDetails] = useState({ diet, mealsPerDay });
  const [activitiesDetails, setActivitiesDetails] = useState(activitiesState);

  // --- Résultat CO2 ---
  const [totalResult, setTotalResult] = useState({});

  // Ajouter une étape
  const addLeg = () => setLegs([...legs, { id: Date.now(), from: "", to: "", distance: 0 }]);

  // --- Calcul CO2 total ---
  const computeTotal = useCallback(() => {
    const totalDistance = legs.reduce((sum, leg) => sum + toNum(leg.distance), 0);
    const transport =
      (DEFAULT_FACTORS[transportMode] || 0) * totalDistance * Math.max(1, toNum(passengers));

    const baseAccommodation =
      (DEFAULT_FACTORS[accomType] || 0) * Math.max(0, toNum(nights)) * Math.max(1, toNum(numRooms));

    const optionsAccommodation =
      (airConLevel ? CO2_ADDITIONAL.airCon : 0) * Math.max(0, toNum(nights)) * Math.max(1, toNum(numRooms)) +
      (poolLevel ? CO2_ADDITIONAL.pool : 0) * Math.max(0, toNum(nights)) * Math.max(1, toNum(numRooms)) +
      (hasBreakfast ? CO2_ADDITIONAL.breakfast : 0) * Math.max(0, toNum(nights)) * Math.max(1, toNum(numGuests)) +
      (hasHalfBoard ? CO2_ADDITIONAL.halfBoard : 0) * Math.max(0, toNum(nights)) * Math.max(1, toNum(numGuests));

    const accommodation = baseAccommodation + optionsAccommodation;

    const includedMeals = (hasBreakfast ? 1 : 0) + (hasHalfBoard ? 2 : 0);
    const food = computeFoodCO2(diet, toNum(mealsPerDay), toNum(nights), includedMeals);

    const activitiesCO2 = computeActivitiesCO2(activitiesState);

    const total = transport + accommodation + food + activitiesCO2;
    return { transport, accommodation, food, activitiesCO2, total };
  }, [
    legs,
    transportMode,
    passengers,
    accomType,
    nights,
    numRooms,
    numGuests,
    airConLevel,
    poolLevel,
    hasBreakfast,
    hasHalfBoard,
    diet,
    mealsPerDay,
    activitiesState,
  ]);

  // --- Mise à jour live ---
  useEffect(() => {
    setTotalResult(computeTotal());
    setTransportDetails({ legs, transportMode, passengers });
    setAccomDetails({ nights, accomType, numRooms, numGuests, airConLevel, poolLevel, hasBreakfast, hasHalfBoard });
    setMealsDetails({ diet, mealsPerDay });
    setActivitiesDetails(activitiesState);
  }, [
    computeTotal,
    legs,
    transportMode,
    passengers,
    nights,
    accomType,
    numRooms,
    numGuests,
    airConLevel,
    poolLevel,
    hasBreakfast,
    hasHalfBoard,
    diet,
    mealsPerDay,
    activitiesState,
  ]);

  // --- Bouton calcul manuel ---
  const handleCalculate = () => {
    setTransportDetails({ legs, transportMode, passengers });
    setAccomDetails({ nights, accomType, numRooms, numGuests, airConLevel, poolLevel, hasBreakfast, hasHalfBoard });
    setMealsDetails({ diet, mealsPerDay });
    setActivitiesDetails(activitiesState);
    setTotalResult(computeTotal());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDE2E4] via-[#FFF1E6] to-[#E2ECE9] text-gray-800">
      <div className="container mx-auto max-w-6xl space-y-12 py-12">
        <h1 className="text-6xl font-extrabold text-center bg-gradient-to-r from-rose-500 via-orange-400 to-amber-500 bg-clip-text text-transparent tracking-tight drop-shadow-md">
          🌅 CO₂ Journey Calculator
        </h1>
        <p className="text-center text-lg text-gray-600 max-w-2xl mx-auto">
          Mesurez l’impact CO₂ de vos vacances.
        </p>

        <div className="grid gap-10">
          <Transport
            legs={legs}
            setLegs={setLegs}
            passengers={passengers}
            setPassengers={setPassengers}
            transportMode={transportMode}
            setTransportMode={setTransportMode}
            totalResult={totalResult}
            setTotalResult={setTotalResult}
          />

          <Accommodation
            nights={nights}
            setNights={setNights}
            accomType={accomType}
            setAccomType={setAccomType}
            numRooms={numRooms}
            setNumRooms={setNumRooms}
            numGuests={numGuests}
            setNumGuests={setNumGuests}
            airConLevel={airConLevel}
            setAirConLevel={setAirConLevel}
            poolLevel={poolLevel}
            setPoolLevel={setPoolLevel}
            hasBreakfast={hasBreakfast}
            setHasBreakfast={setHasBreakfast}
            hasHalfBoard={hasHalfBoard}
            setHasHalfBoard={setHasHalfBoard}
          />

          <Food
            mealsPerDay={mealsPerDay}
            setMealsPerDay={setMealsPerDay}
            diet={diet}
            setDiet={setDiet}
            hasBreakfast={hasBreakfast}
            setHasBreakfast={setHasBreakfast}
            hasHalfBoard={hasHalfBoard}
            setHasHalfBoard={setHasHalfBoard}
          />

          <Activities
            activitiesState={activitiesState}
            setActivitiesState={setActivitiesState}
          />
        </div>

        <div className="text-center">
          <button
            className="mt-8 bg-gradient-to-r from-rose-400 to-orange-400 hover:from-rose-500 hover:to-orange-500 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-lg transition-all transform hover:scale-105"
            onClick={handleCalculate}
          >
            🔍 Calculer mon empreinte carbone
          </button>
        </div>

        {totalResult && totalResult.total > 0 && (
          <Co2Result
            totalResult={totalResult}
            transportDetails={transportDetails}
            accomDetails={accomDetails}
            mealsDetails={mealsDetails}
            activitiesDetails={activitiesDetails}
          />
        )}

{/*        <div className="mt-10 bg-white/70 backdrop-blur-xl border border-rose-100 rounded-3xl shadow-2xl p-8 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-rose-600 mb-4">Résultats</h2>
          <div className="grid md:grid-cols-2 gap-4 text-lg">
            <p><strong>🚗 Transport:</strong> {totalResult.transport?.toFixed(1) ?? 0} kg CO₂e</p>
            <p><strong>🏨 Hébergement:</strong> {totalResult.accommodation?.toFixed(1) ?? 0} kg CO₂e</p>
            <p><strong>🥗 Alimentation:</strong> {totalResult.food?.toFixed(1) ?? 0} kg CO₂e</p>
            <p><strong>🎯 Activités:</strong> {totalResult.activitiesCO2?.toFixed(1) ?? 0} kg CO₂e</p>
          </div>
          <p className="mt-6 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600 drop-shadow-lg">
            🌍 Total : {totalResult.total?.toFixed(1) ?? 0} kg CO₂e
          </p>
        </div>*/}

        <CO2Context
          totalCO2={totalResult.total}
          transportMode={transportMode}
          accomType={accomType}
          diet={diet}
        />

        <CO2CalculationDetails
          totalCO2={totalResult.total}
          transportCO2={totalResult.transport}
          accomType={accomType}
          diet={diet}
        />

        <div className="mt-10 flex flex-wrap gap-6 justify-center">
          <button
            className="bg-gradient-to-r from-sky-400 to-blue-500 text-white px-6 py-3 rounded-2xl shadow-lg font-semibold hover:scale-105 transition-all"
            onClick={() => {
              const origin = legs[0].from || "CDG";
              const destination = legs[0].to || "JFK";
              const url = `https://www.google.com/flights?hl=fr#flt=${origin}.${destination};c:EUR;t:e`;
              window.open(url, "_blank");
            }}
          >
            ✈️ Vols éco-friendly
          </button>

          <ProjectsDirectory />

          <button
            className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-6 py-3 rounded-2xl shadow-lg font-semibold hover:scale-105 transition-all"
            onClick={() => {
              const destination = legs[0].to || "Paris";
              const today = new Date();
              const checkin = today.toISOString().split("T")[0];
              const checkoutDate = new Date(today);
              checkoutDate.setDate(today.getDate() + toNum(nights));
              const checkout = checkoutDate.toISOString().split("T")[0];
              const url = `https://www.booking.com/searchresults.fr.html?ss=${destination}&checkin=${checkin}&checkout=${checkout}&nflt=ht_id%3D204`;
              window.open(url, "_blank");
            }}
          >
            🏨 Hébergements durables
          </button>
        </div>
      </div>
    </div>
  );
}
