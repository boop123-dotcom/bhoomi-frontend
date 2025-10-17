import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import { auth } from "../firebase"; // Firebase auth for current user

const backend = process.env.REACT_APP_BACKEND_URL || "https://bhoomi-backend-vbrw.onrender.com";

export default function CommunityDashboard() {
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [communityAverages, setCommunityAverages] = useState(null);

  // ✅ Fetch user location from MongoDB
  useEffect(() => {
    const fetchUserLocation = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const res = await fetch(`${backend}/api/users/${user.uid}`);
        const data = await res.json();

        if (data && data.location && data.location.coordinates) {
          const [lon, lat] = data.location.coordinates;
          setUserLocation({ lat, lon });
        } else {
          console.warn("No location found for user in MongoDB");
        }
      } catch (err) {
        console.error("Error fetching user location:", err);
      }
    };

    fetchUserLocation();
  }, []);

  // 🧩 Fetch nearby users when userLocation is ready
  useEffect(() => {
    async function fetchNearby() {
      if (!userLocation) return;

      try {
        setLoading(true);
        const res = await fetch(
          `${backend}/api/community/nearby?lat=${userLocation.lat}&lon=${userLocation.lon}&radius=10000`
        );
        const data = await res.json();

        if (data && data.users) {
          setNearbyUsers(data.users);

          // 📊 Compute community averages from real user data
          const count = data.users.length;
          if (count > 0) {
            const avgSolar =
              data.users.reduce((s, u) => s + (u.solarPotential || 0), 0) / count;
            const avgNDVI =
              data.users.reduce((s, u) => s + (u.ndvi || 0), 0) / count;
            const avgAir =
              data.users.reduce((s, u) => s + (u.airQuality || 0), 0) / count;

            setCommunityAverages({
              solar: avgSolar.toFixed(2),
              ndvi: avgNDVI.toFixed(2),
              air: avgAir.toFixed(0),
            });
          }
        }
      } catch (err) {
        console.error("Error fetching nearby users:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchNearby();
  }, [userLocation]);

  // 🗺️ Marker icons
  const userIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
    iconSize: [32, 32],
  });

  const otherUserIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149059.png",
    iconSize: [28, 28],
  });

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold mb-4">🌍 Community Dashboard</h1>

      {/* 👥 Nearby Users Summary */}
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
            <a
              href="#map"
              className="inline-block mt-3 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              View Local Network
            </a>
          )}
        </div>
      )}

      {/* 📊 Community Averages */}
      {communityAverages && (
        <div className="bg-green-50 p-4 rounded-xl text-center shadow">
          <h2 className="text-lg font-semibold mb-2">
            📊 Community Averages (10 km radius)
          </h2>
          <p>
            ☀️ Solar Potential:{" "}
            <strong>{communityAverages.solar} kWh/m²/day</strong>
          </p>
          <p>
            🌿 NDVI: <strong>{communityAverages.ndvi}</strong>
          </p>
          <p>
            🌫️ Air Quality Index (AQI): <strong>{communityAverages.air}</strong>
          </p>
        </div>
      )}

      {/* 🗺️ Map Section */}
      <div id="map" className="bg-gray-50 p-4 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-3">🗺️ Local Network Map</h2>
        {userLocation ? (
          <MapContainer
            center={[userLocation.lat, userLocation.lon]}
            zoom={11}
            style={{ height: "400px", width: "100%" }}
          >
            <TileLayer
              attribution='© <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* 🟢 User Marker */}
            <Marker position={[userLocation.lat, userLocation.lon]} icon={userIcon}>
              <Popup>
                <strong>You are here 📍</strong>
              </Popup>
            </Marker>

            {/* 🔴 Other Users */}
            {nearbyUsers.map((u, i) => {
              const [lon, lat] = u.location?.coordinates || [];
              if (!lat || !lon) return null;

              return (
                <Marker key={i} position={[lat, lon]} icon={otherUserIcon}>
                  <Popup>
                    <strong>{u.username}</strong>
                    <br />
                    ☀️ Solar: {u.solarPotential?.toFixed(2) ?? "?"} kWh/m²/day
                    <br />
                    🌿 NDVI: {u.ndvi?.toFixed(2) ?? "?"}
                    <br />
                    🌫️ AQI: {u.airQuality ?? "?"}
                  </Popup>
                </Marker>
              );
            })}

            {/* 🔴 Circle around user */}
            <Circle
              center={[userLocation.lat, userLocation.lon]}
              radius={10000}
              pathOptions={{ color: "red", fillOpacity: 0 }}
            />
          </MapContainer>
        ) : (
          <p className="italic text-gray-600">Loading your location...</p>
        )}
      </div>
    </div>
  );
}
