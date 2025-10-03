import React, { useEffect, useRef } from "react";
import { Autocomplete } from "@react-google-maps/api";


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


// import React, { useState } from "react";
// // import { Autocomplete } from "@react-google-maps/api";
// import Autocomplete from './Autocomplete';


// export default function CityInput({ value, onChange }) {
//   const [autocomplete, setAutocomplete] = useState(null);

//   const handleLoad = (auto) => setAutocomplete(auto);

//   const handlePlaceChanged = () => {
//     if (autocomplete) {
//       const place = autocomplete.getPlace();
//       onChange(place.formatted_address || "");
//     }
//   };

//   return (
//     <Autocomplete
//       onLoad={handleLoad}
//       onPlaceChanged={handlePlaceChanged}
//       options={{ types: ["(cities)"] }}
//     >
//       <input
//         type="text"
//         placeholder="Entrez une ville"
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="border p-2 rounded-xl w-full"
//       />
//     </Autocomplete>
//   );
// }
