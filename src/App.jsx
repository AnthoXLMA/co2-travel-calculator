import React, { useState, useEffect, useCallback } from "react";
import Transport from "./components/Transport";
import Accommodation from "./components/Accommodation";
import Food from "./components/Food";
import Activities, { computeActivitiesCO2 } from "./components/Activities";
import CityInput from "./components/CityInput";
import CO2Context from "./components/CO2Context";
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
  const [legs, setLegs] = useState([{ id: Date.now(), from: "", to: "", distance: 0 }]);

  // Ajouter une étape
  const addLeg = () => setLegs([...legs, { id: Date.now(), from: "", to: "", distance: 0 }]);

  // --- Transport ---
  // const [legs, setLegs] = useState([{ from: "", to: "", distance: 0 }]);
  const [passengers, setPassengers] = useState(1);
  const [transportMode, setTransportMode] = useState("car_petrol");

  // --- Alimentation ---
  const [mealsPerDay, setMealsPerDay] = useState("3");
  const [diet, setDiet] = useState("meal_omnivore");

  // --- Activités ---
  const [activitiesState, setActivitiesState] = useState({});

  // --- Résultat CO2 ---
  const [totalResult, setTotalResult] = useState({});

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

// --- Calcul Distance Google Maps ---
// const updateLegDistance = useCallback(
//   (legId) => {
//     const legIndex = legs.findIndex(l => l.id === legId);
//     if (legIndex === -1) return;

//     const leg = legs[legIndex];
//     if (!window.google || !leg.from || !leg.to) return;

//     const service = new window.google.maps.DistanceMatrixService();
//     service.getDistanceMatrix(
//       {
//         origins: [leg.from],
//         destinations: [leg.to],
//         travelMode: window.google.maps.TravelMode.DRIVING,
//       },
//       (response, status) => {
//         if (status === "OK") {
//           const dist = response.rows[0].elements[0].distance?.value / 1000 || 0;
//           const newLegs = [...legs];
//           newLegs[legIndex].distance = dist;
//           setLegs(newLegs);
//           setTotalResult(computeTotal()); // <- maintenant ça fonctionne
//         } else {
//           console.error("Erreur DistanceMatrix:", status);
//         }
//       }
//     );
//   },
//   [legs, setLegs, computeTotal]
// );


  // // --- Calcul Distance Google Maps ---
  // const updateLegDistance = useCallback(
  //   (legId) => {
  //     const legIndex = legs.findIndex(l => l.id === legId);
  //     if (legIndex === -1) return;

  //     const leg = legs[legIndex];
  //     if (!window.google || !leg.from || !leg.to) return;

  //     const service = new window.google.maps.DistanceMatrixService();
  //     service.getDistanceMatrix(
  //       {
  //         origins: [leg.from],
  //         destinations: [leg.to],
  //         travelMode: window.google.maps.TravelMode.DRIVING,
  //       },
  //       (response, status) => {
  //         if (status === "OK") {
  //           const dist = response.rows[0].elements[0].distance?.value / 1000 || 0;
  //           const newLegs = [...legs];
  //           newLegs[legIndex].distance = dist;
  //           setLegs(newLegs);
  //           setTotalResult(computeTotal()); // recalculer après la mise à jour
  //         } else {
  //           console.error("Erreur DistanceMatrix:", status);
  //         }
  //       }
  //     );
  //   },
  //   [legs, setLegs, computeTotal]
  // );

  // // --- Calcul CO2 total ---
  // const computeTotal = useCallback(() => {
  //   const totalDistance = legs.reduce((sum, leg) => sum + toNum(leg.distance), 0);
  //   const transport =
  //     (DEFAULT_FACTORS[transportMode] || 0) * totalDistance * Math.max(1, toNum(passengers));

  //   const baseAccommodation =
  //     (DEFAULT_FACTORS[accomType] || 0) * Math.max(0, toNum(nights)) * Math.max(1, toNum(numRooms));

  //   const optionsAccommodation =
  //     (airConLevel ? CO2_ADDITIONAL.airCon : 0) * Math.max(0, toNum(nights)) * Math.max(1, toNum(numRooms)) +
  //     (poolLevel ? CO2_ADDITIONAL.pool : 0) * Math.max(0, toNum(nights)) * Math.max(1, toNum(numRooms)) +
  //     (hasBreakfast ? CO2_ADDITIONAL.breakfast : 0) * Math.max(0, toNum(nights)) * Math.max(1, toNum(numGuests)) +
  //     (hasHalfBoard ? CO2_ADDITIONAL.halfBoard : 0) * Math.max(0, toNum(nights)) * Math.max(1, toNum(numGuests));

  //   const accommodation = baseAccommodation + optionsAccommodation;

  //   const includedMeals = (hasBreakfast ? 1 : 0) + (hasHalfBoard ? 2 : 0);
  //   const food = computeFoodCO2(diet, toNum(mealsPerDay), toNum(nights), includedMeals);

  //   const activitiesCO2 = computeActivitiesCO2(activitiesState);

  //   const total = transport + accommodation + food + activitiesCO2;
  //   return { transport, accommodation, food, activitiesCO2, total };
  // }, [
  //   legs,
  //   transportMode,
  //   passengers,
  //   accomType,
  //   nights,
  //   numRooms,
  //   numGuests,
  //   airConLevel,
  //   poolLevel,
  //   hasBreakfast,
  //   hasHalfBoard,
  //   diet,
  //   mealsPerDay,
  //   activitiesState,
  // ]);

  // --- Mise à jour live ---
  useEffect(() => {
    setTotalResult(computeTotal());
  }, [computeTotal]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-green-50 p-6">
      <div className="container mx-auto max-w-6xl space-y-10">
        <h1 className="text-5xl font-extrabold text-center text-blue-900 tracking-tight">
          CO2 Calc
        </h1>

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

        <Activities activitiesState={activitiesState} setActivitiesState={setActivitiesState} />
        {/* Bouton calcul manuel */}
        <div className="text-center">
          <button
            className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-lg font-semibold transition-all"
            onClick={() => setTotalResult(computeTotal())}
          >
            Calculer le CO2 total
          </button>
        </div>

        {/* Résultat CO2 */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p><strong>Transport:</strong> {totalResult.transport?.toFixed(1) ?? 0} kg CO2e</p>
          <p><strong>Hébergement:</strong> {totalResult.accommodation?.toFixed(1) ?? 0} kg CO2e</p>
          <p><strong>Alimentation:</strong> {totalResult.food?.toFixed(1) ?? 0} kg CO2e</p>
          <p><strong>Activités:</strong> {totalResult.activitiesCO2?.toFixed(1) ?? 0} kg CO2e</p>
          <p className="mt-2 text-xl font-bold text-green-700">
            Total: {totalResult.total?.toFixed(1) ?? 0} kg CO2e
          </p>
        </div>

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

        <div className="mt-4 flex gap-4 justify-center">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => {
              const origin = legs[0].from || "CDG";
              const destination = legs[0].to || "JFK";
              const url = `https://www.google.com/flights?hl=fr#flt=${origin}.${destination};c:EUR;t:e`;
              window.open(url, "_blank");
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
              const url = `https://www.booking.com/searchresults.fr.html?ss=${destination}&checkin=${checkin}&checkout=${checkout}&nflt=ht_id%3D204`;
              window.open(url, "_blank");
            }}
          >
            Rechercher des hébergements éco-friendly
          </button>
        </div>
      </div>
    </div>
  );
}

// import React, { useState } from "react";
// import Transport from "./components/Transport";
// import Accommodation from "./components/Accommodation";
// import Food from "./components/Food";
// import Activities, { computeActivitiesCO2 } from "./components/Activities";
// import CityInput from "./components/CityInput";
// import CO2Context from "./components/CO2Context";
// import ProjectsDirectory from "./components/ProjectsDirectory";
// import Co2Result from "./components/Co2Result";


// // Facteurs CO2
// const DEFAULT_FACTORS = {
//   flight_short: 0.15,
//   flight_long: 0.11,
//   train: 0.035,
//   car_petrol: 0.19,
//   car_electric: 0.05,
//   hotel_standard: 15,
//   hotel_luxury: 30,
//   hotel_ecohotel: 6,
//   bnb: 10,
//   airbnb: 10,
//   meal_omnivore: 2.5,
//   meal_vegetarian: 1.2,
//   meal_vegan: 0.9,
//   activity_low: 5,
//   activity_medium: 20,
//   activity_high: 50,
// };

// const CO2_ADDITIONAL = {
//   airCon: 5,
//   pool: 10,
//   breakfast: 2,
//   halfBoard: 5,
// };

// const DIET_FACTORS = {
//   meal_omnivore: 2.5,
//   meal_vegetarian: 1.2,
//   meal_vegan: 0.9,
// };

// /**
//  * Calcule le CO2 lié à l’alimentation
//  */
// const computeFoodCO2 = (diet, mealsPerDay, numDays, mealsIncluded = 0) => {
//   const factor = DIET_FACTORS[diet] || 0;
//   const totalMeals = Math.max(0, mealsPerDay * numDays - mealsIncluded);
//   return factor * totalMeals;
// };

// export default function App() {
//   // --- Hébergement ---
//   const [nights, setNights] = useState(1);
//   const [accomType, setAccomType] = useState("hotel_standard");
//   const [numRooms, setNumRooms] = useState(1);
//   const [numGuests, setNumGuests] = useState(1);
//   const [airConLevel, setAirConLevel] = useState(0);
//   const [poolLevel, setPoolLevel] = useState(0);
//   const [hasBreakfast, setHasBreakfast] = useState(false);
//   const [hasHalfBoard, setHasHalfBoard] = useState(false);

//   // --- Transport ---
//   const [legs, setLegs] = useState([{ from: "", to: "", distance: 0 }]);
//   const [passengers, setPassengers] = useState(1);
//   const [transportMode, setTransportMode] = useState("car_petrol");

//   // --- Alimentation ---
//   const [mealsPerDay, setMealsPerDay] = useState(3);
//   const [diet, setDiet] = useState("meal_omnivore");

//   // --- Activités ---
//   const [activitiesState, setActivitiesState] = useState({});

//   // --- Résultat ---
//   const [totalResult, setTotalResult] = useState({});

//   const toNum = (s) => {
//     const n = parseFloat(s?.toString().replace(",", "."));
//     return isNaN(n) ? 0 : n;
//   };

//   const updateLegDistance = async (index) => {
//     const leg = legs[index];
//     if (!leg.from || !leg.to) return;
//     try {
//       const response = await fetch(
//         `http://localhost:5001/distance?from=${encodeURIComponent(
//           leg.from
//         )}&to=${encodeURIComponent(leg.to)}`
//       );
//       if (!response.ok) throw new Error("Erreur fetchDistance");
//       const data = await response.json();
//       const newLegs = [...legs];
//       newLegs[index].distance = data.distance || 0;
//       setLegs(newLegs);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const computeTotal = () => {
//     const totalDistance = legs.reduce((sum, leg) => sum + toNum(leg.distance), 0);
//     const transport = (DEFAULT_FACTORS[transportMode] || 0) * totalDistance * Math.max(1, toNum(passengers));

//     const baseAccommodation = (DEFAULT_FACTORS[accomType] || 0) * Math.max(0, toNum(nights)) * Math.max(1, toNum(numRooms));
//     const optionsAccommodation =
//       (airConLevel ? CO2_ADDITIONAL.airCon : 0) * Math.max(0, toNum(nights)) * Math.max(1, toNum(numRooms)) +
//       (poolLevel ? CO2_ADDITIONAL.pool : 0) * Math.max(0, toNum(nights)) * Math.max(1, toNum(numRooms)) +
//       (hasBreakfast ? CO2_ADDITIONAL.breakfast : 0) * Math.max(0, toNum(nights)) * Math.max(1, toNum(numGuests)) +
//       (hasHalfBoard ? CO2_ADDITIONAL.halfBoard : 0) * Math.max(0, toNum(nights)) * Math.max(1, toNum(numGuests));

//     const accommodation = baseAccommodation + optionsAccommodation;

//     const includedMeals = (hasBreakfast ? 1 : 0) + (hasHalfBoard ? 2 : 0);
//     const food = computeFoodCO2(diet, toNum(mealsPerDay), toNum(nights), includedMeals);

//     const activitiesCO2 = computeActivitiesCO2(activitiesState);

//     const total = transport + accommodation + food + activitiesCO2;
//     return { transport, accommodation, food, activitiesCO2, total };
//   };

//   const handleCalculate = () => {
//     setTotalResult(computeTotal());
//   };

//   return (
//     <CO2Context.Provider value={{ totalResult, transportMode, accomType, diet }}>
//       <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-green-50 p-6">
//         <div className="max-w-6xl mx-auto space-y-10">
//           <h1 className="text-5xl font-extrabold text-center text-blue-900 tracking-tight">
//             🌍 CO2 Travel Calculator
//           </h1>

//           <Transport
//             legs={legs}
//             setLegs={setLegs}
//             passengers={passengers}
//             setPassengers={setPassengers}
//             transportMode={transportMode}
//             setTransportMode={setTransportMode}
//             totalResult={totalResult}
//             setTotalResult={setTotalResult}
//           />

//           <Accommodation
//             nights={nights}
//             setNights={setNights}
//             accomType={accomType}
//             setAccomType={setAccomType}
//             numRooms={numRooms}
//             setNumRooms={setNumRooms}
//             numGuests={numGuests}
//             setNumGuests={setNumGuests}
//             airConLevel={airConLevel}
//             setAirConLevel={setAirConLevel}
//             poolLevel={poolLevel}
//             setPoolLevel={setPoolLevel}
//             hasBreakfast={hasBreakfast}
//             setHasBreakfast={setHasBreakfast}
//             hasHalfBoard={hasHalfBoard}
//             setHasHalfBoard={setHasHalfBoard}
//           />

//           <Food
//             mealsPerDay={mealsPerDay}
//             setMealsPerDay={setMealsPerDay}
//             diet={diet}
//             setDiet={setDiet}
//           />
//            <Activities
//              activitiesState={activitiesState}
//              setActivitiesState={setActivitiesState}
//            />
//           <div className="flex flex-col md:flex-row gap-4">
//             <CityInput
//               value={legs[0].from}
//               onChange={(val) => {
//                 const newLegs = [...legs];
//                 newLegs[0].from = val;
//                 setLegs(newLegs);
//               }}
//               onPlaceSelected={() => updateLegDistance(0)}
//             />
//             <CityInput
//               value={legs[0].to}
//               onChange={(val) => {
//                 const newLegs = [...legs];
//                 newLegs[0].to = val;
//                 setLegs(newLegs);
//               }}
//               onPlaceSelected={() => updateLegDistance(0)}
//             />
//           </div>

//           <div className="text-center">
//             <button
//               className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-lg font-semibold transition-all"
//               onClick={handleCalculate}
//             >
//               Calculer le CO2 total
//             </button>
//           </div>

//           <Co2Result totalResult={totalResult} />

//           <div className="mt-6 flex gap-4 justify-center flex-wrap">
//             <button
//               className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
//               onClick={() => {
//                 const origin = legs[0].from || "CDG";
//                 const destination = legs[0].to || "JFK";
//                 const url = `https://www.google.com/flights?hl=fr#flt=${origin}.${destination};c:EUR;t:e`;
//                 window.open(url, "_blank", "noopener,noreferrer");
//               }}
//             >
//               Vols éco-friendly
//             </button>

//             <ProjectsDirectory />

//             <button
//               className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded"
//               onClick={() => {
//                 const destination = legs[0].to || "Paris";
//                 const today = new Date();
//                 const checkin = today.toISOString().split("T")[0];
//                 const checkoutDate = new Date(today);
//                 checkoutDate.setDate(today.getDate() + toNum(nights));
//                 const checkout = checkoutDate.toISOString().split("T")[0];
//                 const url = `https://www.booking.com/searchresults.fr.html?ss=${destination}&checkin=${checkin}&checkout=${checkout}&nflt=ht_id%3D204`;
//                 window.open(url, "_blank", "noopener,noreferrer");
//               }}
//             >
//               Hôtels éco-friendly
//             </button>
//           </div>
//         </div>
//       </div>
//     </CO2Context.Provider>
//   );
// }
