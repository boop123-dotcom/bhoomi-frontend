import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import SolarTrend from "../components/SolarTrend"; // ✅ new import
import WindTrend from "../components/WindTrend";


// 🌍 Consent modal for location permission
function ConsentModal({ onAccept }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96">
        <h2 className="text-xl font-bold mb-2">🌍 Location Access</h2>
        <p className="text-gray-600 mb-4">
          OmniScope uses your location to show local environmental, air-quality, and greenness data.
        </p>
        <button
          onClick={onAccept}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          Allow Access
        </button>
      </div>
    </div>
  );
}

// 🎨 Reusable card
function HealthCard({ icon, title, data }) {
  return (
    <div className={`p-5 rounded-xl shadow ${data.color} flex flex-col justify-between`}>
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
        <h2 className="font-bold">{title}</h2>
      </div>
      <p className="text-2xl font-semibold mt-3">{data.status}</p>
      <p className="text-sm mt-1 italic">{data.message}</p>
    </div>
  );
}

// 🧩 Simple value-to-message interpreter
function getStatus(name, value, unit = "") {
  if (value === "Unknown" || value == null)
    return { status: "Unknown", color: "bg-gray-200", message: "No data" };

  const num = parseFloat(value);

  const styles = {
    temp: [
      [10, "bg-blue-300", "Cold – wear layers"],
      [30, "bg-green-300", "Comfortable"],
      [40, "bg-yellow-300", "Hot – stay hydrated"],
      [Infinity, "bg-red-400", "Dangerously hot"],
    ],
    aqi: [
      [50, "bg-green-300", "Good air"],
      [100, "bg-yellow-300", "Moderate"],
      [150, "bg-orange-300", "Sensitive groups beware"],
      [Infinity, "bg-red-400", "Poor air – stay indoors"],
    ],
    ndvi: [
      [0.2, "bg-yellow-200", "Low vegetation 🌾"],
      [0.5, "bg-green-300", "Moderate vegetation 🌿"],
      [0.8, "bg-green-500", "Dense vegetation 🌳"],
      [Infinity, "bg-green-700", "Very dense / forest 🌲"],
    ],
    default: [[Infinity, "bg-green-200", "OK"]],
  };

  const arr = styles[name] || styles.default;
  const [, color, message] = arr.find(([limit]) => num <= limit);
  return { status: `${num}${unit}`, color, message };
}

// 🌤️ Helper fetchers
const backend = process.env.REACT_APP_BACKEND_URL;

async function getEnvData(lat, lon) {
  const [
    weather,
    heat,
    carbon,
    pollution,
    solar,
    wind,
    vegetation,
    energyMix,
    ndvi,
  ] = await Promise.all([
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_WEATHER_API_KEY}&units=metric`
    ).then((r) => r.json()),
    fetch(`${backend}/api/data/heat?lat=${lat}&lon=${lon}`).then((r) => r.json()),
    fetch(`${backend}/api/data/carbon`).then((r) => r.json()),
    fetch(`${backend}/api/data/pollution?lat=${lat}&lon=${lon}`).then((r) => r.json()),
    fetch(`${backend}/api/data/solar?lat=${lat}&lon=${lon}`).then((r) => r.json()),
    fetch(`${backend}/api/data/wind?lat=${lat}&lon=${lon}`).then((r) => r.json()),
    fetch(`${backend}/api/data/vegetation?lat=${lat}&lon=${lon}`).then((r) => r.json()),
    fetch(`${backend}/api/data/energyMix`).then((r) => r.json()),
    fetch(`${backend}/api/ndvi?lat=${lat}&lon=${lon}`).then((r) => r.json()), // 🌿 NDVI microservice
  ]);

  return { weather, heat, carbon, pollution, solar, wind, vegetation, energyMix, ndvi };
}

function HealthModule() {
  const [showConsent, setShowConsent] = useState(true);
  const [chartData, setChartData] = useState([]);

  const userLat = 34.0522;
  const userLon = -118.2437;

  // ⚡ Main data query (auto-refresh)
  const { data, isLoading } = useQuery({
    queryKey: ["envData"],
    queryFn: async () => {
      const all = await getEnvData(userLat, userLon);

      // Save basic reading
      await fetch(`${backend}/api/data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "sample_user",
          location: `${userLat},${userLon}`,
          temp: all.weather.main?.temp,
          aqi: all.pollution?.aqi,
          ndvi: all.ndvi?.ndvi,
        }),
      });

      return all;
    },
    enabled: !showConsent,
    refetchInterval: 300000, // 5 min
  });

  // 📈 Hourly chart
  useEffect(() => {
    fetch(`${backend}/api/data/hourly`)
      .then((r) => r.json())
      .then(setChartData)
      .catch((e) => console.error(e));
  }, []);

  return (
    <div className="p-8 space-y-8 relative">
      {showConsent && <ConsentModal onAccept={() => setShowConsent(false)} />}

      <h1 className="text-3xl font-bold mb-4">🌎 Health & Environment Dashboard</h1>

      {isLoading || !data ? (
        <p className="animate-pulse text-gray-600">Fetching live data...</p>
      ) : (
        <>
          {/* --- Environmental cards --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <HealthCard icon="🌡️" title="Temperature" data={getStatus("temp", data.weather.main?.temp, "°C")} />
            <HealthCard icon="💧" title="Humidity" data={getStatus("humidity", data.weather.main?.humidity, "%")} />
            <HealthCard icon="☁️" title="Cloud Cover" data={getStatus("cloud", data.weather.clouds?.all, "%")} />
            <HealthCard icon="🌬️" title="Air Quality (WAQI)" data={getStatus("aqi", data.pollution?.aqi)} />
            <HealthCard icon="⚡" title="Carbon Intensity" data={getStatus("carbon", data.carbon?.carbonIntensity, " gCO₂/kWh")} />
            <HealthCard icon="🔋" title="Fossil Fuel Share" data={getStatus("fossil", data.carbon?.fossilFuelPercentage, "%")} />
            <HealthCard icon="🌞" title="Solar Potential (GHI)" data={getStatus("solar", data.solar?.ghi, " kWh/m²/yr")} />
            <HealthCard icon="🌬️" title="Wind Resource" data={getStatus("wind", data.wind?.annual_avg_speed ?? "Unknown", " m/s")} />
            <HealthCard icon="🌿" title="Greenness (NDVI)" data={getStatus("ndvi", data.ndvi?.ndvi)} />
            <HealthCard icon="🔥" title="Heat Index" data={getStatus("temp", data.heat?.heatIndex ?? data.heat?.temperature, " °C")} />
          </div>

          {/* ✅ New Solar Trend Graph */}
          <SolarTrend lat={userLat} lon={userLon} />
          <WindTrend lat={userLat} lon={userLon} />
          {/* --- NDVI Greenness Text Summary --- */}
          <div className="bg-green-50 p-6 rounded-xl shadow text-center">
            <h2 className="text-xl font-semibold mb-2">🌿 Regional Greenness</h2>
            {data.ndvi?.ndvi ? (
              <p className="text-lg text-gray-800">
                Your region’s greenness score:{" "}
                <span className="font-bold text-green-700">{data.ndvi.ndvi}</span>{" "}
                ({getStatus("ndvi", data.ndvi.ndvi).message})
              </p>
            ) : (
              <p className="text-gray-600 italic">No NDVI data available for your area.</p>
            )}
          </div>

          {/* --- Recommendations --- */}
          <div className="bg-white p-6 rounded-xl shadow space-y-3">
            <h2 className="text-xl font-semibold mb-2">📌 Personalized Recommendations</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              {data.pollution?.aqi > 100 && <li>⚠️ Poor air — limit outdoor activity.</li>}
              {data.weather.main?.temp > 30 && <li>🌡️ Hot day — stay hydrated.</li>}
              {data.carbon?.fossilFuelPercentage > 70 && <li>💡 Try using less electricity during peak hours.</li>}
              {data.solar?.ghi > 1500 && <li>☀️ Excellent solar potential in your area!</li>}
              <li>✅ Ideal time for outdoor activity: early morning or after 5 PM.</li>
            </ul>
          </div>

          {/* --- Hourly trends chart --- */}
          <div className="bg-gray-50 p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">📊 Hourly Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="temp" stroke="#8884d8" name="Temp (°C)" />
                <Line type="monotone" dataKey="aqi" stroke="#82ca9d" name="AQI" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}

export default HealthModule;
