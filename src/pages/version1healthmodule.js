// frontend/src/components/HealthModule.js
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query"; // ✅ React Query for auto-refresh
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// 🌍 Consent modal for location permission
function ConsentModal({ onAccept }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96">
        <h2 className="text-xl font-bold mb-2">🌍 Location Access</h2>
        <p className="text-gray-600 mb-4">
          OmniScope uses your location to display local weather and air quality
          data in your dashboard.
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

// 🌤️ Get live weather
async function getWeather(lat, lon) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_WEATHER_API_KEY}&units=metric`
  );
  return await res.json();
}

// 🌬️ Get air quality with fallback chain
async function getAirQuality(lat, lon) {
  // Try OpenAQ first (via backend proxy)
  try {
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/data/airquality?lat=${lat}&lon=${lon}`
    );
    const data = await res.json();

    const found = data?.results?.[0]?.measurements?.find(
      (m) =>
        m.parameter === "pm25" ||
        m.parameter === "pm10" ||
        m.parameter === "o3"
    );

    if (found && found.value != null) {
      console.log("✅ AQI from OpenAQ:", found.value);
      return { value: found.value, source: "OpenAQ" };
    }
  } catch (err) {
    console.warn("❌ OpenAQ failed:", err);
  }

  // Fallback → Try OpenWeather Air Pollution API
  try {
    const res2 = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`
    );
    const data2 = await res2.json();

    if (data2?.list?.[0]?.main?.aqi) {
      const openWeatherAqi = data2.list[0].main.aqi;
      console.log("✅ AQI from OpenWeather:", openWeatherAqi);
      // Map OpenWeather's 1–5 scale → approximate 0–300 AQI
      const mapped = [0, 50, 100, 150, 200, 300][openWeatherAqi] ?? 100;
      return { value: mapped, source: "OpenWeather" };
    }
  } catch (err) {
    console.warn("❌ OpenWeather fallback failed:", err);
  }

  // Fallback → Return Unknown
  console.warn("⚠️ No air quality data available.");
  return { value: "Unknown", source: "None" };
}

// 🧩 Interpret values into messages + colors
function getStatus(parameter, value) {
  if (value === "Unknown" || value == null) {
    return {
      status: "Unknown",
      color: "bg-gray-200",
      message: "No data available",
    };
  }

  const num = parseFloat(value);

  switch (parameter) {
    case "temp":
      if (num < 10)
        return {
          status: num + " °C",
          color: "bg-blue-300",
          message: "Cold – wear layers",
        };
      if (num <= 30)
        return {
          status: num + " °C",
          color: "bg-green-300",
          message: "Comfortable",
        };
      if (num <= 40)
        return {
          status: num + " °C",
          color: "bg-yellow-300",
          message: "Hot – stay hydrated",
        };
      return {
        status: num + " °C",
        color: "bg-red-400",
        message: "Dangerously hot",
      };

    case "humidity":
      if (num < 30)
        return {
          status: num + " %",
          color: "bg-yellow-200",
          message: "Dry air – hydrate",
        };
      if (num <= 60)
        return {
          status: num + " %",
          color: "bg-green-300",
          message: "Comfortable",
        };
      if (num <= 80)
        return {
          status: num + " %",
          color: "bg-orange-300",
          message: "Humid – sticky",
        };
      return {
        status: num + " %",
        color: "bg-red-400",
        message: "Very humid – heat stress risk",
      };

    case "cloud":
      if (num < 20)
        return {
          status: num + " %",
          color: "bg-yellow-200",
          message: "Clear skies – UV risk",
        };
      if (num <= 60)
        return {
          status: num + " %",
          color: "bg-green-300",
          message: "Partly cloudy – balanced",
        };
      return {
        status: num + " %",
        color: "bg-gray-300",
        message: "Mostly cloudy",
      };

    case "aqi":
      if (num <= 50)
        return {
          status: num,
          color: "bg-green-300",
          message: "Good air quality",
        };
      if (num <= 100)
        return {
          status: num,
          color: "bg-yellow-300",
          message: "Moderate – acceptable",
        };
      if (num <= 150)
        return {
          status: num,
          color: "bg-orange-300",
          message: "Unhealthy for sensitive groups",
        };
      return {
        status: num,
        color: "bg-red-400",
        message: "Poor air quality – limit outdoor activity",
      };

    default:
      return {
        status: value,
        color: "bg-gray-200",
        message: "No interpretation",
      };
  }
}

// 🎨 Reusable Card
function HealthCard({ icon, title, data }) {
  return (
    <div
      className={`p-5 rounded-xl shadow ${data.color} flex flex-col justify-between`}
    >
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
        <h2 className="font-bold">{title}</h2>
      </div>
      <p className="text-2xl font-semibold mt-3">{data.status}</p>
      <p className="text-sm mt-1 italic">{data.message}</p>
    </div>
  );
}

function HealthModule() {
  const [showConsent, setShowConsent] = useState(true);
  const [chartData, setChartData] = useState([]);

  // ✅ React Query: auto-refresh weather + air data
  const { data, isLoading } = useQuery({
    queryKey: ["weatherData"],
    queryFn: async () => {
      const pos = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );

      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      const weatherRes = await getWeather(lat, lon);
      const { value: aqiValue, source } = await getAirQuality(lat, lon);

      console.log(`🌬️ AQI fetched from: ${source}`);

      // 🧠 Send to backend for persistence
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "sample_user",
          location: `${lat},${lon}`,
          temp: weatherRes.main?.temp ?? "Unknown",
          aqi: aqiValue,
        }),
      });

      return {
        temp: weatherRes.main?.temp ?? "Unknown",
        humidity: weatherRes.main?.humidity ?? "Unknown",
        cloud: weatherRes.clouds?.all ?? "Unknown",
        aqi: aqiValue,
      };
    },
    enabled: !showConsent,
    refetchInterval: 300000,
  });

  // ✅ Fetch hourly chart data from backend
  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/data/hourly`)
      .then((res) => res.json())
      .then((data) => setChartData(data))
      .catch((err) => console.error("Error fetching hourly data:", err));
  }, []);

  return (
    <div className="p-8 space-y-8 relative">
      {showConsent && <ConsentModal onAccept={() => setShowConsent(false)} />}

      <h1 className="text-3xl font-bold mb-4">🌍 Health Dashboard</h1>

      {isLoading ? (
        <p className="animate-pulse text-gray-600">Fetching live data...</p>
      ) : data ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <HealthCard
              icon="🌡️"
              title="Temperature"
              data={getStatus("temp", data.temp)}
            />
            <HealthCard
              icon="💧"
              title="Humidity"
              data={getStatus("humidity", data.humidity)}
            />
            <HealthCard
              icon="☁️"
              title="Cloud Cover"
              data={getStatus("cloud", data.cloud)}
            />
            <HealthCard
              icon="🌬️"
              title="Air Quality"
              data={getStatus("aqi", data.aqi)}
            />
          </div>

          <div className="bg-white p-6 rounded-xl shadow space-y-3">
            <h2 className="text-xl font-semibold mb-2">
              📌 Personalized Recommendations
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              {data.aqi !== "Unknown" && data.aqi > 100 && (
                <li>⚠️ Air quality is poor — limit outdoor activities.</li>
              )}
              {data.humidity !== "Unknown" && data.humidity > 80 && (
                <li>💧 High humidity — drink plenty of water.</li>
              )}
              {data.temp !== "Unknown" && data.temp > 30 && (
                <li>🌡️ It’s hot — avoid direct sunlight at noon.</li>
              )}
              <li>✅ Best time for Vitamin D: 9–10 AM</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">📊 Hourly Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="temp"
                  stroke="#8884d8"
                  name="Temperature (°C)"
                />
                <Line
                  type="monotone"
                  dataKey="aqi"
                  stroke="#82ca9d"
                  name="AQI"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <p className="text-gray-500">No data available.</p>
      )}
    </div>
  );
}

export default HealthModule;
