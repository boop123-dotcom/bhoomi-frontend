// frontend/src/components/GoogleTripEstimator.jsx
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Autocomplete,
} from "@react-google-maps/api";
import { auth } from "../firebase";
import { db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

// --- Emission factors (kg CO2e per passenger-km) ---
const EF = {
  car_petrol: 0.192,
  car_hybrid: 0.120,
  car_ev: 0.050,
  bus: 0.082,
  rail: 0.041,
  bike: 0.0,
  walk: 0.0,
};

const mapContainerStyle = { width: "100%", height: "360px" };

export default function GoogleTripEstimator() {
  // ✅ Correct key loading
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  const mapRef = useRef(null);
  const destAutoRef = useRef(null);

  const [origin, setOrigin] = useState(null); // { lat, lng }
  const [destination, setDestination] = useState(null); // { lat, lng, address }
  const [distanceKm, setDistanceKm] = useState(null);
  const [mode, setMode] = useState("car_petrol");
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState(null); // { distanceKm, kgCO2e }

  // 🌍 Get current user GPS location
  const setMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setOrigin({ lat: latitude, lng: longitude });
      },
      (err) => {
        console.error(err);
        alert("Unable to get your location. Check permissions.");
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  // 🗺️ Fit map bounds to show both origin and destination
  const fitBounds = useCallback(() => {
    if (!mapRef.current || !origin || !destination) return;
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(origin);
    bounds.extend({ lat: destination.lat, lng: destination.lng });
    mapRef.current.fitBounds(bounds);
  }, [origin, destination]);

  const onLoadMap = (map) => (mapRef.current = map);

  // 🎯 When destination chosen from autocomplete
  const onPlaceChanged = () => {
    if (!destAutoRef.current) return;
    const place = destAutoRef.current.getPlace();
    if (!place || !place.geometry) return;

    const loc = place.geometry.location;
    setDestination({
      lat: loc.lat(),
      lng: loc.lng(),
      address: place.formatted_address || place.name || "",
    });
  };

  // ✅ Fetch route distance using Flask backend
  const calcRoute = async () => {
    if (!origin || !destination) {
      alert("Please set your location and destination.");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:5002/api/directions?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}`
      );

      const data = await response.json();
      console.log("Directions API response:", data);

      if (!data || data.status !== "OK" || !data.routes?.length) {
        console.error("Directions API error:", data);
        alert("Route could not be calculated. Try another destination.");
        return;
      }

      const leg = data.routes[0].legs[0];
      if (!leg) {
        alert("No route found.");
        return;
      }

      const meters = leg.distance?.value || 0;
      const km = meters / 1000;
      setDistanceKm(km);
      fitBounds();
    } catch (err) {
      console.error("❌ Directions fetch failed:", err);
      alert("Failed to call Directions API.");
    }
  };

  // ♻️ Compute CO₂ impact
  const computeImpact = () => {
    if (!distanceKm) {
      alert("Calculate a route first.");
      return;
    }
    const ef = EF[mode] ?? EF.car_petrol;
    const kgCO2e = ef * distanceKm;
    setResult({ distanceKm, kgCO2e });
  };

  // 💾 Save to Firestore
  const saveAction = async () => {
    if (!result || !auth.currentUser) {
      alert("No result to save or user not logged in.");
      return;
    }

    setSaving(true);
    try {
      const user = auth.currentUser;
      await addDoc(collection(db, "users", user.uid, "actions"), {
        type: "mobility_trip",
        mode,
        distance_km: result.distanceKm,
        kgCO2e: result.kgCO2e,
        origin,
        destination,
        destination_address: destination?.address || "",
        createdAt: serverTimestamp(),
      });
      alert("Saved trip to your sustainability log ✅");
    } catch (e) {
      console.error(e);
      alert("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  // Default map center (Los Angeles fallback)
  const center = useMemo(
    () => ({ lat: origin?.lat ?? 34.0522, lng: origin?.lng ?? -118.2437 }),
    [origin]
  );

  if (!isLoaded) return <div className="card">Loading Google Maps…</div>;

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-2">
        🚶 Mobility Impact (Google Maps)
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Pick your destination, we’ll use your GPS for the start. Choose your
        travel mode to compute emissions and save it to your history.
      </p>

      {/* Controls */}
      <div className="grid md:grid-cols-3 gap-3 mb-4">
        <button onClick={setMyLocation} className="btn-primary">
          📍 Use My Location
        </button>

        <div className="border rounded-lg px-2 py-1 bg-white">
          <Autocomplete
            onLoad={(ref) => (destAutoRef.current = ref)}
            onPlaceChanged={onPlaceChanged}
          >
            <input
              type="text"
              placeholder="Search destination"
              className="w-full outline-none py-2"
            />
          </Autocomplete>
        </div>

        <button onClick={calcRoute} className="btn-primary">
          🛣️ Calculate Route
        </button>
      </div>

      {/* Map */}
      <div className="rounded-lg overflow-hidden border mb-4">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={12}
          onLoad={onLoadMap}
          options={{ streetViewControl: false, mapTypeControl: false }}
        />
      </div>

      {/* Mode + compute */}
      <div className="grid md:grid-cols-3 gap-3 mb-3">
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="border rounded-lg px-3 py-2 bg-white"
        >
          <option value="car_petrol">🚗 Car (petrol)</option>
          <option value="car_hybrid">🚗 Car (hybrid)</option>
          <option value="car_ev">🚗 Car (EV)</option>
          <option value="bus">🚌 Bus</option>
          <option value="rail">🚈 Rail/Metro</option>
          <option value="bike">🚲 Bike</option>
          <option value="walk">🚶 Walk</option>
        </select>

        <button onClick={computeImpact} className="btn-primary">
          📊 Compute Emissions
        </button>

        <button
          onClick={saveAction}
          disabled={!result || saving}
          className="btn-primary disabled:opacity-50"
        >
          💾 Save to My Log
        </button>
      </div>

      {/* Output */}
      <div className="bg-gray-50 rounded-lg p-3 border">
        <p className="text-sm text-gray-600">
          Distance:{" "}
          <strong>{distanceKm ? distanceKm.toFixed(2) : "—"} km</strong> · Mode
          EF: <strong>{EF[mode]} kg CO₂e/km</strong>
        </p>
        <p className="mt-1 text-lg">
          {result ? (
            <>
              Estimated Impact:{" "}
              <strong>{result.kgCO2e.toFixed(2)} kg CO₂e</strong>
            </>
          ) : (
            <>Compute to see results</>
          )}
        </p>
      </div>
    </div>
  );
}
