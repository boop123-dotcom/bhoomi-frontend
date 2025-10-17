import React, { useState, useEffect } from "react";
import api from "../api"; // ✅ Axios instance pointing to your backend
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function EnergyDashboard() {
  const [airQuality, setAirQuality] = useState(null);
  const [energyMix, setEnergyMix] = useState(null);
  const [prices, setPrices] = useState(null);
  const [hourlyUsage, setHourlyUsage] = useState([]);
  const [runningTotal, setRunningTotal] = useState(0);

  // 🆕 State for chart-friendly data
  const [labels, setLabels] = useState([]);
  const [values, setValues] = useState([]);

  // ✅ Fetch Air Quality
  useEffect(() => {
    async function fetchAirQuality() {
      try {
        const res = await api.get(
          `/api/energy/airquality?lat=${process.env.REACT_APP_LAT}&lon=${process.env.REACT_APP_LON}`
        );
        setAirQuality(res.data);
      } catch (err) {
        console.error("Air quality error:", err);
      }
    }
    fetchAirQuality();
  }, []);

  // ✅ Fetch Energy Mix
  useEffect(() => {
    async function fetchEnergyMix() {
      try {
        const res = await api.get("/api/energy/mix");
        setEnergyMix(res.data);
      } catch (err) {
        console.error("Energy mix error:", err);
      }
    }
    fetchEnergyMix();
  }, []);

  // ✅ Fetch Electricity Prices (simulated)
  useEffect(() => {
    async function fetchPrices() {
      try {
        const res = await api.get("/api/energy/prices");
        setPrices(res.data);
      } catch (err) {
        console.error("Prices error:", err);
      }
    }
    fetchPrices();
  }, []);

  // ✅ Fetch Hourly Usage (via backend Duke proxy)
  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const res = await api.get("/api/duke/hourly");
        const data = res.data;

        if (data.Series1 && data.TickSeries) {
          const usage = data.Series1.map((val, idx) => ({
            hour: data.TickSeries[idx],
            kwh: parseFloat(val),
          }));

          const total = usage.reduce((sum, item) => sum + item.kwh, 0);

          setHourlyUsage(usage);
          setRunningTotal(total);

          // 🆕 chart states
          if (data.ReturnCode === 0) {
            setLabels(data.TickSeries);
            setValues(data.Series1.map(Number));
          }
        }
      } catch (err) {
        console.error("Error fetching Duke hourly usage:", err.message);
      }
    };

    fetchUsage();
    const interval = setInterval(fetchUsage, 15 * 60 * 1000); // refresh every 15 min
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">⚡ Energy Dashboard</h1>

      {/* Air Quality */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="font-semibold">Air Quality (CO₂ Proxy)</h2>
        {airQuality ? (
          <p>
            PM2.5: {airQuality.pm25} µg/m³, PM10: {airQuality.pm10} µg/m³ <br />
            Risk Level: <b>{airQuality.risk}</b>
          </p>
        ) : (
          <p>Loading air quality...</p>
        )}
      </div>

      {/* Energy Mix */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="font-semibold">Florida Energy Mix</h2>
        {energyMix ? (
          <>
            <p>Carbon Intensity: {energyMix.carbonIntensity.toFixed(0)} gCO₂/kWh</p>
            <ul className="mt-2">
              {energyMix.mix.map((m, idx) => (
                <li key={idx}>
                  {m.fueltype}: {m.value}%
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>Loading energy mix...</p>
        )}
      </div>

      {/* Electricity Prices */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="font-semibold">Electricity Prices (Simulated)</h2>
        {prices ? (
          <ul className="grid grid-cols-4 gap-2">
            {prices.map((p) => (
              <li key={p.hour} className="text-sm">
                {p.hour}:00 → ${p.price.toFixed(2)}/kWh
              </li>
            ))}
          </ul>
        ) : (
          <p>Loading prices...</p>
        )}
      </div>

      {/* Live Hourly Usage */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="font-semibold">Today’s Hourly Usage</h2>
        {hourlyUsage.length > 0 ? (
          <>
            <ul className="grid grid-cols-3 gap-2 text-sm">
              {hourlyUsage.map((item, i) => (
                <li key={i}>
                  {item.hour}: {item.kwh.toFixed(2)} kWh
                </li>
              ))}
            </ul>
            <p className="mt-4 font-semibold">
              Running Total: {runningTotal.toFixed(2)} kWh
            </p>
          </>
        ) : (
          <p>Loading hourly usage...</p>
        )}
      </div>

      {/* 🆕 Hourly Usage Line Chart */}
      <div className="bg-white p-4 rounded shadow mt-4">
        <h2 className="font-semibold">Hourly Energy Usage (Chart)</h2>
        {labels.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={labels.map((label, i) => ({
                hour: label,
                kwh: values[i],
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="kwh"
                stroke="#007bff"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p>Loading chart...</p>
        )}
      </div>
    </div>
  );
}

export default EnergyDashboard;
