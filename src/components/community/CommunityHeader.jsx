// frontend/src/components/community/CommunityHeader.jsx
import React from "react";

export default function CommunityHeader({ community, isMember, onJoin }) {
  const { name, state, metrics } = community;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row justify-between items-center">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          {name}, {state}
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          NDVI: {metrics?.ndviAvg?.toFixed(2) ?? "0.00"} ·
          Solar: {metrics?.solarAvg?.toFixed(2) ?? "0.00"} ·
          AQI: {metrics?.aqiAvg?.toFixed(0) ?? "0"}
        </p>
      </div>

      <div className="mt-4 md:mt-0">
        {isMember ? (
          <button
            disabled
            className="px-5 py-2 bg-green-100 text-green-700 rounded-lg font-medium cursor-default"
          >
            ✅ Joined Community
          </button>
        ) : (
          <button
            onClick={onJoin}
            className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all"
          >
            Join Community
          </button>
        )}
      </div>
    </div>
  );
}
