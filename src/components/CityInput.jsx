import React, { useEffect, useRef } from "react";

export default function CityInput({ value, onChange }) {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    if (!window.google) return;

    // initialisation de l'autocomplete
    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ["(cities)"],
      componentRestrictions: { country: [] },
    });

    // listener sur place_changed
    const listener = autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place && place.formatted_address) {
        onChange(place.formatted_address);
      }
    });

    // stocke la référence pour nettoyage
    autocompleteRef.current = autocomplete;

    // cleanup à la destruction du composant
    return () => {
      if (listener) {
        window.google.maps.event.removeListener(listener);
      }
      autocompleteRef.current = null;
    };
  }, [onChange]);

  return (
    <input
      ref={inputRef}
      type="text"
      className="border p-2 rounded-xl"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Entrez une ville"
    />
  );
}
