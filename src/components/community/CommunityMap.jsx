import React from "react";
import { MapContainer, TileLayer, Marker, Circle, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix marker icons (Leaflet quirk)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function CommunityMap({ userLocation, community }) {
  if (!community?.centroid?.coordinates) return null;

  const [centroidLon, centroidLat] = community.centroid.coordinates;
  const [userLon, userLat] = userLocation || [];

  const center = [centroidLat, centroidLon];

  return (
    <div className="rounded-xl bg-white shadow-md p-3">
      <h3 className="text-lg font-semibold mb-3">🗺️ Your Community Map</h3>

      <MapContainer
        center={center}
        zoom={10}
        style={{ height: "420px", width: "100%", borderRadius: "12px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* County centroid marker */}
        <Marker position={center}>
          <Popup>
            <b>{community.name}</b>
            <br />
            {community.state}
          </Popup>
        </Marker>

        {/* User’s exact location marker */}
        {userLocation && (
          <>
            <Marker position={[userLat, userLon]}>
              <Popup>
                <b>You are here</b>
              </Popup>
            </Marker>
            <Circle
              center={[userLat, userLon]}
              radius={10000} // 10 km radius
              color="red"
            />
          </>
        )}
      </MapContainer>
    </div>
  );
}
