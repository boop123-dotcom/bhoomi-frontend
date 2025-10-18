import React from "react";

export default function CommunityStats({ community }) {
  const metrics = community?.metrics || {};

  return (
    <div className="bg-green-50 border border-green-200 rounded-xl shadow-sm p-5">
      <h3 className="text-lg font-semibold text-green-800 mb-3">
        📊 County Environmental Averages
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* ☀️ Solar Potential */}
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <p className="text-gray-600 text-sm">☀️ Solar Potential</p>
          <p className="font-semibold text-gray-800">
            {metrics.solarAvg?.toFixed(2) ?? "0.00"} kWh/m²/day
          </p>
        </div>

        {/* 🌿 NDVI */}
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <p className="text-gray-600 text-sm">🌿 NDVI</p>
          <p className="font-semibold text-gray-800">
            {metrics.ndviAvg?.toFixed(2) ?? "0.00"}
          </p>
        </div>

        {/* 💨 Air Quality */}
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <p className="text-gray-600 text-sm">💨 Air Quality (AQI)</p>
          <p className="font-semibold text-gray-800">
            {metrics.aqiAvg?.toFixed(0) ?? "0"}
          </p>
        </div>

        {/* 👥 Members */}
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <p className="text-gray-600 text-sm">👥 Members</p>
          <p className="font-semibold text-gray-800">
            {community.members?.length ?? 0}
          </p>
        </div>
      </div>
    </div>
  );
}
