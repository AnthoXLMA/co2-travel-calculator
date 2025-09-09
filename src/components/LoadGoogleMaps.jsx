// LoadGoogleMaps.jsx
import { useEffect } from "react";

export default function LoadGoogleMaps({ apiKey, onLoad }) {
  useEffect(() => {
    if (!apiKey) return;
    if (window.google) {
      onLoad?.();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = onLoad;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [apiKey, onLoad]);

  return null;
}
