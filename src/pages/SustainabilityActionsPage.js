// frontend/src/pages/SustainabilityActionsPage.js
import React from "react";
import GoogleTripEstimator from "../components/GoogleTripEstimator";
import MonthlyCO2Chart from "../components/MonthlyCO2Chart";

export default function SustainabilityActionsPage() {
  return (
    <div className="fade-in">
      <h1 className="text-2xl font-bold mb-4">🌱 Sustainability Actions</h1>

      {/* Mobility with real map + GPS */}
      <GoogleTripEstimator />

      {/* Advanced cards (software-only ideas) */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Trees */}
        <div className="card">
          <h3 className="text-lg font-semibold">🌳 Smarter Tree Planting (beta)</h3>
          <p className="text-sm text-gray-600 mb-2">
            Get species recommendations for your ZIP (& USDA hardiness zone), estimate CO₂ uptake with age, and find the best sun exposure spots.
          </p>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>Species picker by climate zone & water needs</li>
            <li>Projected CO₂ uptake curve (i-Tree style)</li>
            <li>Sun exposure from roof azimuth + lat tilt (coming)</li>
          </ul>
          <button className="btn-primary mt-3">Plan a new tree</button>
        </div>

        {/* Water */}
        <div className="card">
          <h3 className="text-lg font-semibold">💧 Water Optimization (beta)</h3>
          <p className="text-sm text-gray-600 mb-2">
            Build a personalized watering schedule using **NOAA precipitation** + evapotranspiration estimates (NASA POWER). No hardware required.
          </p>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>Outdoor watering schedule by forecast</li>
            <li>Shower timer → hot water energy impact</li>
            <li>Drought restriction checker (local rules)</li>
          </ul>
          <button className="btn-primary mt-3">Generate my schedule</button>
        </div>

        {/* Electricity */}
        <div className="card">
          <h3 className="text-lg font-semibold">⚡ Smart Electricity Savings (beta)</h3>
          <p className="text-sm text-gray-600 mb-2">
            Upload a utility CSV or connect Green Button to analyze your baseline and **shift loads when the grid is clean** (using your carbon intensity).
          </p>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>Time-of-use baseline from your bills</li>
            <li>“Shift to greener hour” notifications</li>
            <li>Appliance hints from usage shape (NILM-lite)</li>
          </ul>
          <button className="btn-primary mt-3">Analyze my bill</button>
        </div>
      </div>

      {/* Charts */}
      <MonthlyCO2Chart />
    </div>
  );
}
