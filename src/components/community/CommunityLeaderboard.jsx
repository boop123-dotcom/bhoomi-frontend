import React, { useEffect, useState } from "react";

export default function CommunityLeaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [metric, setMetric] = useState("ndviAvg");
  const backend =
    process.env.REACT_APP_BACKEND_URL ||
    "https://bhoomi-backend-vbrw.onrender.com";

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(
          `${backend}/api/community/leaderboard/top?state=California&metric=${metric}&limit=10`
        );
        const data = await res.json();
        if (data.success) setLeaderboard(data.results);
      } catch (err) {
        console.error("Leaderboard fetch error:", err);
      }
    };
    fetchLeaderboard();
  }, [metric]);

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">🏆 Top Communities in California</h3>
        <select
          value={metric}
          onChange={(e) => setMetric(e.target.value)}
          className="border border-gray-300 rounded-md p-1 text-sm"
        >
          <option value="ndviAvg">🌿 NDVI</option>
          <option value="solarAvg">☀️ Solar</option>
          <option value="aqiAvg">💨 Air Quality</option>
        </select>
      </div>

      {leaderboard.length === 0 ? (
        <p className="text-gray-600 italic">Loading leaderboard...</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {leaderboard.map((c, i) => (
            <li key={c._id} className="py-2 flex justify-between">
              <span>
                {i + 1}. <b>{c.name}</b>
              </span>
              <span>
                {metric === "ndviAvg" && (c.metrics?.ndviAvg ?? 0).toFixed(2)}
                {metric === "solarAvg" && (c.metrics?.solarAvg ?? 0).toFixed(2)}
                {metric === "aqiAvg" && (c.metrics?.aqiAvg ?? 0).toFixed(0)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
