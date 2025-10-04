// src/components/factors.js
export const DEFAULT_FACTORS = {
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
  activity_low: 5,
  activity_medium: 20,
  activity_high: 50,
};

export const CO2_ADDITIONAL = {
  airCon: 5,      // kg CO2/nuit
  pool: 10,       // kg CO2/nuit
  breakfast: 2,   // kg CO2/nuit
  halfBoard: 5,   // kg CO2/nuit
};

export const DIET_FACTORS = {
  meal_omnivore: 2.5,
  meal_vegetarian: 1.2,
  meal_vegan: 0.9,
};
