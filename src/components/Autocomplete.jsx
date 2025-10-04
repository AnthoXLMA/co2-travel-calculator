import { useRef, useEffect } from "react";
import useLoadGooglePlaces from "../hooks/useLoadGooglePlaces";


export default function Autocomplete({ value, onChange }) {
  const inputRef = useRef(null);
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const loaded = useLoadGooglePlaces(apiKey);

  useEffect(() => {
    if (!loaded || !inputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current);
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      onChange(place.name || place.formatted_address || "");
    });
  }, [loaded, onChange]);

  return (
    <input
      ref={inputRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Entrez une ville"
      className="border p-2 rounded w-full"
    />
  );
}
