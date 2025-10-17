// frontend/src/pages/LandingPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EarthModel from "../components/EarthModel";

export default function LandingPage() {
  // eslint-disable-next-line no-unused-vars
  const [_, setLocation] = useState(null); // reserved for future use
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🌍 Ask for location permission & resolve city name
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        try {
          // 🌎 Use OpenCage API to get city + country name
          const res = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${process.env.REACT_APP_OPENCAGE_API_KEY}`
          );
          const data = await res.json();
          const components = data.results[0]?.components;
          const cityName =
            components.city ||
            components.town ||
            components.village ||
            "Unknown City";
          const country = components.country || "";
          setCity(`${cityName}, ${country}`);
        } catch (err) {
          console.error("Geocoding error:", err);
          setCity("Location unavailable");
        }

        setLocation({ lat, lon });
        setLoading(false);
      },
      (err) => {
        console.warn("Location permission denied:", err);
        setCity("Location permission denied");
        setLoading(false);
      }
    );
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white text-center overflow-hidden relative">
      <div className="w-full max-w-3xl mx-auto px-4">
        {/* 🌍 3D Earth Model */}
        <EarthModel />

        {/* 🪩 Website Name */}
        <h1 className="text-5xl font-bold mt-10 tracking-tight">OmniScope</h1>

        {/* 👋 Greeting */}
        <p className="text-lg mt-3 text-gray-300">
          {loading
            ? "Detecting your location..."
            : city && `Welcome from ${city}!`}
        </p>

        {/* 🚀 CTA Button */}
        <button
          onClick={() => navigate("/about")} // ✅ Redirect to About page
          className="mt-8 px-6 py-3 text-lg bg-blue-500 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300"
        >
          Explore Your Planet →
        </button>
      </div>

      {/* ✨ Subtle footer */}
      <p className="absolute bottom-4 text-xs text-gray-500">
        Powered by OpenCage + OpenWeather APIs
      </p>
    </div>
  );
}
