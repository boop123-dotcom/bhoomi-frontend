/*

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const backend = process.env.REACT_APP_BACKEND_URL;

export default function CommunityDashboard() {
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lon: longitude });
      },
      (err) => {
        console.error(err);
        alert("Location permission denied. Cannot show nearby users.");
      }
    );
  }, []);

  useEffect(() => {
    async function fetchNearby() {
      if (!userLocation) return;
      try {
        setLoading(true);
        const response = await fetch(
          `${backend}/api/community/nearby?lat=${userLocation.lat}&lon=${userLocation.lon}`
        );
        const data = await response.json();
        setNearbyUsers(data.users);

        const avgSolar =
          data.users.reduce((s, u) => s + (u.solarPotential || 0), 0) / data.users.length;
        const avgNDVI =
          data.users.reduce((s, u) => s + (u.ndvi || 0), 0) / data.users.length;
        const avgAir =
          data.users.reduce((s, u) => s + (u.airQuality || 0), 0) / data.users.length;

        const tempBadges = [];
        if (avgSolar > 5) tempBadges.push("🥇 Top 5% in Solar Energy Potential ☀️");
        if (avgNDVI > 0.6) tempBadges.push("🌿 High Greenness Zone");
        if (avgAir > 100) tempBadges.push("🌫️ Low Air Quality Area — Working to Improve!");
        setBadges(tempBadges);
      } catch (err) {
        console.error("Error fetching nearby users:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchNearby();
  }, [userLocation]);

  const userIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
    iconSize: [32, 32],
  });

  const otherUserIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64145.png",
    iconSize: [28, 28],
  });

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold mb-4">🌍 Community Dashboard</h1>

      {loading ? (
        <p className="italic text-gray-600 animate-pulse">Fetching nearby users...</p>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h2 className="text-xl font-semibold mb-2">👥 People Near You</h2>
          <p className="text-gray-700">
            {nearbyUsers.length
              ? `${nearbyUsers.length} other OmniScope users are active within 10 km of you!`
              : "No nearby users found yet."}
          </p>
          {nearbyUsers.length > 0 && (
            <a href="#map" className="inline-block mt-3 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
              View Local Network
            </a>
          )}
        </div>
      )}

      {badges.length > 0 && (
        <div className="flex flex-wrap gap-3 justify-center">
          {badges.map((b, i) => (
            <span
              key={i}
              className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium"
            >
              {b}
            </span>
          ))}
        </div>
      )}

      <div id="map" className="bg-gray-50 p-4 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-3">🗺️ Local Network Map</h2>
        {userLocation ? (
          <MapContainer
            center={[userLocation.lat, userLocation.lon]}
            zoom={12}
            style={{ height: "400px", width: "100%" }}
          >
            <TileLayer
              attribution='© <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={[userLocation.lat, userLocation.lon]}
              icon={userIcon}
            >
              <Popup>You are here 📍</Popup>
            </Marker>

            {nearbyUsers.map((u, i) => (
              <Marker
                key={i}
                position={[u.location.lat, u.location.lon]}
                icon={otherUserIcon}
              >
                <Popup>
                  <strong>{u.username}</strong>
                  <br />
                  🌡️ Temp: {u.temp ?? "?"}°C
                  <br />
                  🌬️ AQI: {u.airQuality ?? "?"}
                  <br />
                  ☀️ Solar: {u.solarPotential ?? "?"} kWh/m²/yr
                  <br />
                  🌿 NDVI: {u.ndvi ?? "?"}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        ) : (
          <p className="italic text-gray-600">Awaiting location access...</p>
        )}
      </div>
    </div>
  );
}


//oolala settingspage.js*/