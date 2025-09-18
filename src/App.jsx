import React, { useState } from "react";
import Transport from "./components/Transport";
import Accommodation from "./components/Accommodation";
import Food from "./components/Food";
import Activities, { computeActivitiesCO2 } from "./components/Activities";
import LoadGoogleMaps from "./components/LoadGoogleMaps";
import { LoadScript } from '@react-google-maps/api';
import CityInput from './components/CityInput'; // adapte le chemin selon ton projet
import CO2Context from './components/CO2Context';
import ProjectsDirectory from "./components/ProjectsDirectory";
// import HelpBeesButton from "./components/HelpBeesButton";
import CO2CalculationDetails from "./components/CO2CalculationDetails";
import { Autocomplete } from "@react-google-maps/api";


// Facteurs CO2
const DEFAULT_FACTORS = {
  flight_short: 0.15,
  flight_long: 0.11,
  train: 0.035,
  car_petrol: 0.19,
  car_electric: 0.05,
  hotel_standard: 15,
  hotel_luxury: 30,
  hotel_ecohotel: 6,
  bnb:10,
  airbnb:10,
  meal_omnivore: 2.5,
  meal_vegetarian: 1.2,
  meal_vegan: 0.9,
  activity_low: 5,
  activity_medium: 20,
  activity_high: 50,
};

const CO2_ADDITIONAL = {
  airCon: 5,      // kg CO2/nuit
  pool: 10,       // kg CO2/nuit
  breakfast: 2,   // kg CO2/nuit
  halfBoard: 5,   // kg CO2/nuit
};

// Facteurs CO2 par type de régime (kg CO2e par repas)
const DIET_FACTORS = {
  meal_omnivore: 2.5,
  meal_vegetarian: 1.2,
  meal_vegan: 0.9,
};

/**
 * Calcule les émissions de CO2 liées à l'alimentation d'un voyageur
 * @param {string} diet - Régime alimentaire : 'meal_omnivore', 'meal_vegetarian', 'meal_vegan'
 * @param {number} mealsPerDay - Nombre de repas consommés par jour
 * @param {number} numDays - Nombre de jours du séjour
 * @param {number} mealsIncluded - Nombre de repas inclus dans l'hébergement (à déduire si souhaité)
 * @returns {number} Emissions totales en kg CO2e
 */
function computeFoodCO2(diet, mealsPerDay, numDays, mealsIncluded = 0) {
  const factor = DIET_FACTORS[diet] || 0; // kg CO2e par repas
  const totalMeals = Math.max(0, mealsPerDay * numDays - mealsIncluded);
  return factor * totalMeals;
}

export default function App() {

  // Hébergement
  const [nights, setNights] = useState(1);
  const [accomType, setAccomType] = useState('hotel_standard');
  const [numRooms, setNumRooms] = useState(1);
  const [numGuests, setNumGuests] = useState(1);
  const [airConLevel, setAirConLevel] = useState(0); // pour slider ou checkbox
  const [poolLevel, setPoolLevel] = useState(0);
  const [hasBreakfast, setHasBreakfast] = useState(false);

  // Transport
  const [legs, setLegs] = useState([{ from: '', to: '', distance: 0 }]);
  const [passengers, setPassengers] = useState(1);
  const [transportMode, setTransportMode] = useState('car_petrol');
  const [totalResult, setTotalResult] = useState({});

  // --- State global ---
  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  const [mealsPerDay, setMealsPerDay] = useState("3");
  const [diet, setDiet] = useState("meal_omnivore");
  const [hasHalfBoard, setHasHalfBoard] = useState(false);


  const [numLowActivities, setNumLowActivities] = useState("0");
  const [numMediumActivities, setNumMediumActivities] = useState("1");
  const [numHighActivities, setNumHighActivities] = useState("0");
  // State initial dans App.jsx
  const [activitiesState, setActivitiesState] = useState({});

//   const [totalResult, setTotalResult] = useState({
//   transport: 0,
//   accommodation: 0,
//   food: 0,
//   activities: 0,
//   total: 0
// });

  // --- Helper ---
  const toNum = (s) => {
    if (s == null) return 0;
    const n = parseFloat(s.toString().replace(",", "."));
    return isNaN(n) ? 0 : n;
  };

  // --- Calcul total CO2 ---
  const computeTotal = () => {
  const totalDistance = legs.reduce((sum, leg) => sum + toNum(leg.distance), 0);
  const transport = (DEFAULT_FACTORS[transportMode] || 0) * totalDistance * Math.max(1, toNum(passengers));

  // Hébergement : on prend en compte nuits, chambres, voyageurs et options
  const baseAccommodation = (DEFAULT_FACTORS[accomType] || 0) * Math.max(0, toNum(nights)) * Math.max(1, toNum(numRooms));
  const optionsAccommodation =
    (airConLevel ? CO2_ADDITIONAL.airCon : 0) * Math.max(0, toNum(nights)) * Math.max(1, toNum(numRooms)) +
    (poolLevel ? CO2_ADDITIONAL.pool : 0) * Math.max(0, toNum(nights)) * Math.max(1, toNum(numRooms)) +
    (hasBreakfast ? CO2_ADDITIONAL.breakfast : 0) * Math.max(0, toNum(nights)) * Math.max(1, toNum(numGuests)) +
    (hasHalfBoard ? CO2_ADDITIONAL.halfBoard : 0) * Math.max(0, toNum(nights)) * Math.max(1, toNum(numGuests));

  const accommodation = baseAccommodation + optionsAccommodation;

  // Nombre de repas inclus dans l'hébergement
  const includedMeals = (hasBreakfast ? 1 : 0) + (hasHalfBoard ? 2 : 0);

  const food = computeFoodCO2(diet, toNum(mealsPerDay), toNum(nights), includedMeals);

    // Calcul CO2 lors du calcul total
  const activitiesCO2 = computeActivitiesCO2(activitiesState);


  const total = transport + accommodation + food + activitiesCO2;

  return { transport, accommodation, food, activitiesCO2, total };
};


  const handleCalculate = () => {
    const result = computeTotal();
    setTotalResult(result);
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-green-50 p-6">
      <div className="container mx-auto max-w-6xl space-y-10">
        <h1 className="text-5xl font-extrabold text-center text-blue-900 tracking-tight">
          Co2 Calc
        </h1>
          <LoadScript
            googleMapsApiKey={googleMapsApiKey}
            libraries={['places']}
          >
            <CityInput
              value={legs[0].from} // par exemple
              onChange={(val) => {
                const newLegs = [...legs];
                newLegs[0].from = val;
                setLegs(newLegs);
              }}
            />
          </LoadScript>
        {/* Blocs */}
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


        {/*<Activities
          numLowActivities={numLowActivities}
          setNumLowActivities={setNumLowActivities}
          numMediumActivities={numMediumActivities}
          setNumMediumActivities={setNumMediumActivities}
          numHighActivities={numHighActivities}
          setNumHighActivities={setNumHighActivities}
        />*/}
          <Activities
            activitiesState={activitiesState}
            setActivitiesState={setActivitiesState}
          />
        {/* Résultat final */}
        <button
          className="mt-6 bg-green-600 text-white px-6 py-3 rounded-xl block mx-auto"
          onClick={handleCalculate}
        >
          Calculer le CO2 total
        </button>
        {totalResult && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <p><strong>Transport:</strong> {(totalResult?.transport ?? 0).toFixed(1)} kg CO2e</p>
            <p><strong>Hébergement:</strong> {(totalResult?.accommodation ?? 0).toFixed(1)} kg CO2e</p>
            <p><strong>Alimentation:</strong> {(totalResult?.food ?? 0).toFixed(1)} kg CO2e</p>
            <p><strong>Activités:</strong> {(totalResult?.activities ?? 0).toFixed(1)} kg CO2e</p>
            <p className="mt-2 text-xl font-bold text-green-700">
              Total: {(totalResult?.total ?? 0).toFixed(1)} kg CO2e
            </p>
          </div>
        )}
        <CO2Context
          totalCO2={totalResult?.total}
          transportMode={transportMode}
          accomType={accomType}
          diet={diet}
        />
      </div>
      <CO2Context
        totalCO2={totalResult?.total}
        transportMode={transportMode}
        accomType={accomType}
        diet={diet}
      />

    {/* Boutons pour rechercher vols et hébergements */}
    <div className="mt-4 flex gap-4 justify-center">
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => {
          const origin = legs[0].from || "CDG";
          const destination = legs[0].to || "JFK";
          const url = `https://www.google.com/flights?hl=fr#flt=${origin}.${destination};c:EUR;t:e`;
          window.open(url, "_blank");
          console.log(`Vol eco-friendly pour ${origin} → ${destination}, total CO2: ${totalResult.total.toFixed(1)} kg`);
        }}
      >
        Rechercher des vols éco-friendly
      </button>
      <ProjectsDirectory />
      <button
        className="bg-orange-600 text-white px-4 py-2 rounded"
        onClick={() => {
          const destination = legs[0].to || "Paris";
          const today = new Date();
          const checkin = today.toISOString().split("T")[0];
          const checkoutDate = new Date(today);
          checkoutDate.setDate(today.getDate() + toNum(nights));
          const checkout = checkoutDate.toISOString().split("T")[0];
          // Booking.com filtre hôtels “green” avec ht_id=204 (éco-friendly)
          const url = `https://www.booking.com/searchresults.fr.html?ss=${destination}&checkin=${checkin}&checkout=${checkout}&nflt=ht_id%3D204`;
          window.open(url, "_blank");
          console.log(`Hébergement éco-friendly à ${destination}, total CO2: ${totalResult.total.toFixed(1)} kg`);
        }}
      >
        Rechercher des hébergements éco-friendly
      </button>
    </div>
  </div>
  );
}
