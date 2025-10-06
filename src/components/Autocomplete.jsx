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
// import { useRef, useEffect } from "react";
// import useLoadGooglePlaces from "../hooks/useLoadGooglePlaces";

// export default function Autocomplete({ value, onChange, language = "fr", country = "" }) {
//   const inputRef = useRef(null);
//   const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

//   // Charge l'API Google Places avec la langue
//   const loaded = useLoadGooglePlaces(apiKey, { language, region: country || undefined });

//   useEffect(() => {
//     if (!loaded || !inputRef.current) return;

//     // Crée l'autocomplete
//     const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
//       types: ["(cities)"], // uniquement les villes
//       componentRestrictions: country ? { country } : undefined, // restreint à un pays si fourni
//     });

//     // Listener pour les changements de sélection
//     const listener = autocomplete.addListener("place_changed", () => {
//       const place = autocomplete.getPlace();

//       if (!place.geometry) return; // si pas de résultat valide

//       onChange({
//         name: place.name || "",
//         address: place.formatted_address || "",
//         lat: place.geometry.location.lat(),
//         lng: place.geometry.location.lng(),
//         country: place.address_components?.find(c => c.types.includes("country"))?.short_name || "",
//       });
//     });

//     // Nettoyage à la destruction du composant
//     return () => window.google.maps.event.removeListener(listener);
//   }, [loaded, onChange, country]);

//   return (
//     <input
//       ref={inputRef}
//       defaultValue={value?.name || value || ""}
//       placeholder="Entrez une ville"
//       disabled={!loaded}
//       className="border p-2 rounded w-full disabled:opacity-50"
//       autoComplete="off"
//     />
//   );
// }
