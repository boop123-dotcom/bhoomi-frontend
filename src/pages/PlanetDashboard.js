// frontend/src/components/PlanetDashboard.js
import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// 🟢 Helper: generate a small colored circular marker
function createColoredIcon(color) {
  return L.divIcon({
    className: "custom-div-icon",
    html: `<div style="background-color:${color}; width:12px; height:12px; border-radius:50%; border:1px solid white;"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
}

function PlanetDashboard() {
  const [readings, setReadings] = useState([]);

  // 🟢 Function to fetch latest readings from backend
  const fetchReadings = () => {
    fetch("http://localhost:5000/api/data")
      .then((res) => res.json())
      .then((data) => setReadings(data))
      .catch((err) => console.error("Error fetching data:", err));
  };

  // 🕒 Auto-refresh readings every 5 minutes
  useEffect(() => {
    fetchReadings(); // fetch immediately when page loads
    const interval = setInterval(fetchReadings, 300000); // refresh every 5 min (300000 ms)
    return () => clearInterval(interval); // cleanup interval when unmounted
  }, []);

  // 🎨 Function to determine marker color based on temperature
  function getColor(temp) {
    if (temp === "Unknown" || temp == null) return "#ccc"; // gray if missing
    const num = parseFloat(temp);
    if (num < 10) return "#4f83cc"; // cold = blue
    if (num <= 30) return "#66bb6a"; // comfortable = green
    if (num <= 40) return "#fdd835"; // warm = yellow
    return "#e53935"; // hot = red
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold mb-4">🌍 Planet Dashboard</h1>
      <p className="text-gray-600 mb-4">
        Visualizing real-time environmental data collected from users worldwide.
      </p>

      {/* 🌎 Interactive world map */}
      <MapContainer
        center={[20, 0]} // center on the globe
        zoom={2}
        style={{
          height: "75vh",
          width: "100%",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        {/* 🗺️ Base map layer (OpenStreetMap) */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* 📍 Render a marker for each saved reading */}
        {readings.map((r, i) => {
          if (!r.location) return null;
          const [lat, lon] = r.location.split(",").map(Number);
          return (
            <Marker
              key={i}
              position={[lat, lon]}
              icon={createColoredIcon(getColor(r.temp))}
            >
              <Popup>
                <div className="text-sm">
                  <strong>🌡️ Temp:</strong> {r.temp}°C <br />
                  <strong>💨 AQI:</strong> {r.aqi} <br />
                  <strong>📍 Location:</strong>{" "}
                  {lat.toFixed(2)}, {lon.toFixed(2)}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default PlanetDashboard;
