// src/hooks/useLoadGooglePlaces.js
import { useEffect, useState } from "react";

export default function useLoadGooglePlaces(apiKey) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!apiKey) return;

    if (window.google && window.google.maps && window.google.maps.places) {
      setLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [apiKey]);

  return loaded;
}
