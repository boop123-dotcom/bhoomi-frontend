import React, { useEffect, useState } from "react";
import { auth } from "../firebase";

// Components
import CommunityHeader from "../components/community/CommunityHeader";
import CommunityMap from "../components/community/CommunityMap";
import CommunityStats from "../components/community/CommunityStats";
import CommunityFeed from "../components/community/CommunityFeed";
import CommunityMembers from "../components/community/CommunityMembers";
import CommunityLeaderboard from "../components/community/CommunityLeaderboard";
import CommunityNews from "../components/community/CommunityNews";

const backend =
  process.env.REACT_APP_BACKEND_URL ||
  "https://bhoomi-backend-vbrw.onrender.com";

export default function CommunityDashboard() {
  const [userLocation, setUserLocation] = useState(null);
  const [userData, setUserData] = useState(null);
  const [community, setCommunity] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [joining, setJoining] = useState(false);

  // ✅ Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const res = await fetch(`${backend}/api/users/${user.uid}`);
        const data = await res.json();

        if (data?.location?.coordinates) {
          const [lon, lat] = data.location.coordinates;
          setUserLocation([lon, lat]);
          setUserData(data);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, []);

  // 🌍 Discover community
  useEffect(() => {
    const discoverCommunity = async () => {
      if (!userLocation || !userData?.firebaseUid) return;
      try {
        const res = await fetch(`${backend}/api/community/discover`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lat: userLocation[1],
            lon: userLocation[0],
            firebaseUid: userData.firebaseUid,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setCommunity(data.community);
          setIsMember(data.isMember);
        }
      } catch (err) {
        console.error("Error discovering community:", err);
      }
    };
    discoverCommunity();
  }, [userLocation, userData]);

  // ➕ Join community
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

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold mb-4">🌍 Community Dashboard</h1>

      {/* 🏙️ Header */}
      {community && (
        <CommunityHeader
          community={community}
          isMember={isMember}
          onJoin={handleJoinCommunity}
          joining={joining}
        />
      )}

      {/* 🟡 Before Joining */}
      {!isMember && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center shadow">
          <h2 className="text-xl font-semibold mb-2">
            👋 Welcome to {community?.name || "your community"}!
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Join your local community to unlock environmental insights,
            regional data, and connect with others near you.
          </p>

          {/* Locked preview */}
          <div className="mt-6 grid md:grid-cols-3 gap-4 opacity-50 blur-sm">
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="font-medium text-gray-800">📊 County Averages</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="font-medium text-gray-800">🗺️ County Map</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="font-medium text-gray-800">🌿 Environmental News</p>
            </div>
          </div>

          <p className="text-gray-500 text-sm mt-4 italic">
            (Join to unlock full access)
          </p>
        </div>
      )}

      {/* 🟢 After Joining → Full Dashboard */}
      {isMember && (
        <>
          <CommunityStats community={community} />
          <CommunityMap userLocation={userLocation} community={community} />
          <CommunityNews community={community} />
          <CommunityFeed community={community} />
          <CommunityMembers community={community} />
          <CommunityLeaderboard />
        </>
      )}
    </div>
  );
}
