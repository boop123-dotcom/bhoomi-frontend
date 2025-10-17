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

export default function SolarTrend({ lat, lon }) {
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
        `${backend}/api/data/solarTrend?lat=${lat}&lon=${lon}&start=${startYear}&end=${endYear}`
      );
      const json = await response.json();
      if (json.trend) setData(json.trend);
      else setError("No trend data available");
    } catch (err) {
      console.error("Solar trend fetch error:", err);
      setError("Failed to fetch solar trend data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (lat && lon) fetchTrend();
  }, [lat, lon, startYear, endYear]);

  // ☀️ Calculate average solar potential (GHI)
  const avgGHI =
    data.length > 0
      ? data.reduce((sum, item) => sum + item.ghi, 0) / data.length
      : null;

  // 💡 Generate recommendation message
  let recommendation = "No data available.";
  if (avgGHI !== null) {
    if (avgGHI < 3)
      recommendation = "⚪ Low solar potential — limited benefit from solar panels.";
    else if (avgGHI < 5)
      recommendation = "🟡 Moderate — some benefit from small rooftop solar.";
    else if (avgGHI < 6)
      recommendation = "🟢 Good — viable for solar installations!";
    else
      recommendation = "☀️ Excellent — ideal for solar energy generation!";
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <h2 className="text-xl font-semibold mb-3 sm:mb-0">
          ☀️ Solar Potential Trend (GHI)
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
          Loading solar trend data...
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
                  value: "kWh/m²/year",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "10px",
                }}
                formatter={(value) => [`${value} kWh/m²/year`, "GHI"]}
              />
              <Line
                type="monotone"
                dataKey="ghi"
                stroke="#facc15"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Global Horizontal Irradiance"
              />
            </LineChart>
          </ResponsiveContainer>

          {/* ☀️ Recommendation Summary */}
          <div className="mt-4 bg-yellow-50 p-4 rounded-lg text-center">
            <p className="text-gray-800 font-medium">{recommendation}</p>
            {avgGHI && (
              <p className="text-sm text-gray-600 mt-1">
                Average solar irradiance:{" "}
                <span className="font-semibold">
                  {avgGHI.toFixed(2)} kWh/m²/day
                </span>
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
