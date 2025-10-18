// frontend/src/pages/CommunityDashboard.js
import React, { useEffect, useState } from "react";
import { auth } from "../firebase"; // Firebase auth for current user

// Existing community UI
import CommunityHeader from "../components/community/CommunityHeader";
import CommunityMap from "../components/community/CommunityMap";
import CommunityStats from "../components/community/CommunityStats";

// ✅ NEW: add these
import CommunityFeed from "../components/community/CommunityFeed";
import CommunityMembers from "../components/community/CommunityMembers";
import CommunityLeaderboard from "../components/community/CommunityLeaderboard";

const backend =
  process.env.REACT_APP_BACKEND_URL ||
  "https://bhoomi-backend-vbrw.onrender.com";

export default function CommunityDashboard() {
  const [userLocation, setUserLocation] = useState(null); // [lon, lat]
  const [userData, setUserData] = useState(null);
  const [community, setCommunity] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  // ✅ Fetch user data and location from MongoDB
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const res = await fetch(`${backend}/api/users/${user.uid}`);
        const data = await res.json();

        if (data && data.location?.coordinates) {
          const [lon, lat] = data.location.coordinates;
          setUserLocation([lon, lat]); // store as [lon, lat]
          setUserData(data);
        } else {
          console.warn("No location found for user in MongoDB");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, []);

  // 🌍 Discover user's community
  useEffect(() => {
    const discoverCommunity = async () => {
      if (!userLocation || !userData?.firebaseUid) return;

      try {
        const res = await fetch(`${backend}/api/community/discover`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lat: userLocation[1], // lat
            lon: userLocation[0], // lon
            firebaseUid: userData.firebaseUid,
          }),
        });

        const data = await res.json();
        if (data.success) {
          setCommunity(data.community);
          setIsMember(data.isMember);
        } else {
          console.warn("No community found:", data.message);
        }
      } catch (err) {
        console.error("Error discovering community:", err);
      }
    };

    discoverCommunity();
  }, [userLocation, userData]);

  // ➕ Join community handler
  const handleJoinCommunity = async () => {
    if (!community || !userData) return;
    setJoining(true);
    try {
      const res = await fetch(`${backend}/api/community/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseUid: userData.firebaseUid,
          communityId: community._id,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsMember(true);
      } else {
        alert(data.message || "Failed to join community");
      }
    } catch (err) {
      console.error("Join community error:", err);
    } finally {
      setJoining(false);
    }
  };

  // 👥 Fetch nearby communities once userLocation is available
  useEffect(() => {
    const fetchNearby = async () => {
      if (!userLocation) return;

      try {
        setLoading(true);
        const res = await fetch(
          `${backend}/api/community/nearby/search?lat=${userLocation[1]}&lon=${userLocation[0]}&radiusKm=10`
        );
        const data = await res.json();

        if (data && data.success) {
          setNearbyUsers(data.results || []);
        }
      } catch (err) {
        console.error("Error fetching nearby users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNearby();
  }, [userLocation]);

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold mb-4">🌍 Community Dashboard</h1>

      {/* 🏙️ Detected Community Info */}
      {community && (
        <CommunityHeader
          community={community}
          isMember={isMember}
          onJoin={handleJoinCommunity}
          joining={joining}
        />
      )}

      {/* 📊 Community Stats */}
      {community && <CommunityStats community={community} />}

      {/* 👥 Nearby Communities Summary */}
      {loading ? (
        <p className="italic text-gray-600 animate-pulse">
          Fetching nearby communities...
        </p>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h2 className="text-xl font-semibold mb-2">👥 Nearby Communities</h2>
          <p className="text-gray-700">
            {nearbyUsers.length
              ? `${nearbyUsers.length} nearby communities detected within 10 km!`
              : "No nearby communities found yet."}
          </p>
        </div>
      )}

      {/* 🗺️ Map Section */}
      {community && (
        <CommunityMap userLocation={userLocation} community={community} />
      )}

      {/* 📰 Community Feed */}
      {community && <CommunityFeed community={community} />}

      {/* 👥 Members */}
      {community && <CommunityMembers community={community} />}

      {/* 🏆 Leaderboard */}
      <CommunityLeaderboard />
    </div>
  );
}
