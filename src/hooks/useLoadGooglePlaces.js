import { useState, useEffect } from "react";

let googleMapsPromise = null;

export default function useLoadGooglePlaces(apiKey, { language = "fr", region } = {}) {
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    if (!apiKey) return;

    if (window.google && window.google.maps && window.google.maps.places) {
      setLoaded(true);
      return;
    }

    if (!googleMapsPromise) {
      googleMapsPromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=${language}${region ? `&region=${region}` : ""}`;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Google Maps script failed to load"));
        document.body.appendChild(script);
      });
    }

    googleMapsPromise.then(() => setLoaded(true)).catch(console.error);
  }, [apiKey, language, region]);

  return loaded;
}
