// LoadGoogleMaps.jsx
import { useEffect, useState } from "react";

export default function LoadGoogleMaps({ apiKey, onLoad, children }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!apiKey) return;
    if (window.google) {
      setLoaded(true);
      onLoad?.();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setLoaded(true);
      onLoad?.();
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [apiKey, onLoad]);

  // Monte les enfants seulement après chargement
  return loaded ? children : null;
}
