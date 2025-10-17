import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function WindTrend({ lat, lon }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startYear, setStartYear] = useState(2015);
  const [endYear, setEndYear] = useState(2025);
  const backend = process.env.REACT_APP_BACKEND_URL;

  async function fetchTrend() {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${backend}/api/data/windTrend?lat=${lat}&lon=${lon}&start=${startYear}&end=${endYear}`
      );
      const json = await response.json();
      if (json.trend) setData(json.trend);
      else setError("No trend data available");
    } catch (err) {
      console.error("Wind trend fetch error:", err);
      setError("Failed to fetch wind trend data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (lat && lon) fetchTrend();
  }, [lat, lon, startYear, endYear]);

  // 🌬️ Determine wind recommendation based on average
  const avgSpeed =
    data.length > 0
      ? data.reduce((a, b) => a + b.speed, 0) / data.length
      : null;

  let recommendation = "No data";
  if (avgSpeed) {
    if (avgSpeed < 3)
      recommendation = "⚪ Too low for wind energy generation.";
    else if (avgSpeed < 6)
      recommendation =
        "🟡 Marginal – small rooftop turbines may work with limited output.";
    else recommendation = "🟢 Excellent – great potential for home wind energy!";
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <h2 className="text-xl font-semibold mb-3 sm:mb-0">
          🌬️ Wind Speed Trend (10 m)
        </h2>
        <div className="flex items-center space-x-2">
          <select
            value={startYear}
            onChange={(e) => setStartYear(e.target.value)}
            className="border p-1 rounded"
          >
            {Array.from({ length: 11 }, (_, i) => 2015 + i).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <span>to</span>
          <select
            value={endYear}
            onChange={(e) => setEndYear(e.target.value)}
            className="border p-1 rounded"
          >
            {Array.from({ length: 11 }, (_, i) => 2015 + i).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500 italic animate-pulse">
          Loading wind trend data...
        </p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : data.length === 0 ? (
        <p className="text-gray-600 italic">No data available for this range.</p>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 12 }}
                label={{
                  value: "Year",
                  position: "insideBottom",
                  offset: -5,
                }}
              />
              <YAxis
                label={{
                  value: "Wind Speed (m/s)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "10px",
                }}
                formatter={(value) => [`${value} m/s`, "Avg Wind Speed"]}
              />
              <Line
                type="monotone"
                dataKey="speed"
                stroke="#60a5fa"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Wind Speed"
              />
            </LineChart>
          </ResponsiveContainer>

          {/* 💬 Wind Recommendation */}
          <div className="mt-4 bg-blue-50 p-4 rounded-lg text-center">
            <p className="text-gray-800 font-medium">{recommendation}</p>
            {avgSpeed && (
              <p className="text-sm text-gray-600 mt-1">
                Average wind speed:{" "}
                <span className="font-semibold">{avgSpeed.toFixed(2)} m/s</span>
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
