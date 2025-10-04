import React, { useRef, useEffect, useState, useCallback } from "react";

/**
 * CityInput optimisé pour Google Maps Autocomplete
 * @param {string} value - valeur du parent
 * @param {function} onChange - callback lors du changement
 * @param {function} onPlaceSelected - callback lors de la sélection d'une ville
 */
export default function CityInput({ value, onChange, onPlaceSelected }) {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [localValue, setLocalValue] = useState(value);

  // Sync localValue avec value du parent
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounce pour limiter la fréquence des updates
  const debounce = (func, delay = 300) => {
    let timer;
    return (...args) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const handleInputChange = useCallback(
    debounce((val) => {
      onChange(val);
    }, 300),
    [onChange]
  );

  // Autocomplete Google Maps
  // useEffect(() => {
  //   if (!window.google || !window.google.maps || !inputRef.current) return;

  //   const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
  //     types: ["(cities)"],
  //     componentRestrictions: { country: [] },
  //   });

  //   const listener = autocomplete.addListener("place_changed", () => {
  //     const place = autocomplete.getPlace();
  //     if (place && place.formatted_address) {
  //       setLocalValue(place.formatted_address);
  //       onChange(place.formatted_address);
  //       if (onPlaceSelected) onPlaceSelected(place.formatted_address);
  //     }
  //   });

  //   autocompleteRef.current = autocomplete;

  //   return () => {
  //     if (listener) window.google.maps.event.removeListener(listener);
  //     autocompleteRef.current = null;
  //   };
  // }, [onChange, onPlaceSelected]);

  useEffect(() => {
  if (!window.google || !inputRef.current) return;

  const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
    types: ["(cities)"],
  });

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (place.formatted_address) {
      onChange(place.formatted_address);
    }
  });
}, [onChange]);


  return (
    <input
      ref={inputRef}
      type="text"
      className="border p-2 rounded-xl w-full focus:ring-2 focus:ring-blue-400 transition"
      value={localValue}
      onChange={(e) => {
        const val = e.target.value;
        setLocalValue(val);
        handleInputChange(val);
      }}
      placeholder="Entrez une ville"
    />
  );
}
