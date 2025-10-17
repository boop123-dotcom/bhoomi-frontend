import React, { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../firebase";

export default function AccomplishmentsDashboard() {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");
  const [stats, setStats] = useState(null);
  const [userAccomplishments, setUserAccomplishments] = useState([]);
  const [globalAccomplishments, setGlobalAccomplishments] = useState([]);
  const [category, setCategory] = useState("All Categories");
  const [newCategory, setNewCategory] = useState("Energy Efficiency");
  const [newText, setNewText] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [ecoPoints, setEcoPoints] = useState(0);

  const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/accomplishments`;

  // ✅ Track user + name
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
        setUserName(user.displayName || "Anonymous");
      } else {
        setUserId(null);
        setUserName("");
      }
    });
    return unsub;
  }, []);

  // ✅ Personal stats
  useEffect(() => {
    if (!userId) return;
    async function fetchStats() {
      try {
        const res = await axios.get(`${API_URL}/stats/${userId}`);
        setStats(res.data);
      } catch (e) {
        console.error("Stats error:", e);
      }
    }
    fetchStats();
  }, [userId, API_URL]);

  // ✅ User accomplishments
  useEffect(() => {
    if (!userId) return;
    async function fetchUserAccomplishments() {
      try {
        const res = await axios.get(`${API_URL}/user/${userId}/${category}`);
        setUserAccomplishments(res.data);
      } catch (e) {
        console.error("User accomplishments error:", e);
      }
    }
    fetchUserAccomplishments();
  }, [userId, category, API_URL]);

  // ✅ Community feed + auto-refresh every 10 s
  useEffect(() => {
    async function fetchGlobalAccomplishments() {
      try {
        const res = await axios.get(`${API_URL}/all/${category}`);
        setGlobalAccomplishments(res.data);
      } catch (e) {
        console.error("Global accomplishments error:", e);
      }
    }

    fetchGlobalAccomplishments();
    const interval = setInterval(fetchGlobalAccomplishments, 10000); // 🔁 10 s
    return () => clearInterval(interval);
  }, [category, API_URL]);

  // ✅ Get user geolocation (city / country via ipinfo)
  async function getUserLocation() {
    try {
      const res = await axios.get("https://ipapi.co/json/");
      return `${res.data.city}, ${res.data.country_name}`;
    } catch {
      return "Unknown";
    }
  }

  // ✅ Add new accomplishment (with location)
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newText.trim()) {
      setMessage("Please enter a description.");
      return;
    }

    try {
      setLoading(true);
      const userLocation = await getUserLocation();

      const res = await axios.post(`${API_URL}/add`, {
        userId,
        userName,
        category: newCategory,
        text: newText,
        userLocation,
      });

      setMessage("✅ Accomplishment added!");
      setNewText("");
      setEcoPoints((p) => p + 10); // +10 pts per post

      setUserAccomplishments((prev) => [res.data.accomplishment, ...prev]);
      setGlobalAccomplishments((prev) => [res.data.accomplishment, ...prev]);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to add accomplishment.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Upvote (reaction)
  const handleUpvote = async (id) => {
    try {
      await axios.put(`${API_URL}/react/${id}`);
      setEcoPoints((p) => p + 2); // +2 pts per upvote given
      setGlobalAccomplishments((prev) =>
        prev.map((a) =>
          a._id === id ? { ...a, likes: (a.likes || 0) + 1 } : a
        )
      );
    } catch (err) {
      console.error("Reaction failed:", err);
    }
  };

  // ✅ Leaderboard
  const leaderboard = Object.entries(
    globalAccomplishments.reduce((acc, item) => {
      if (!item.userName) return acc;
      acc[item.userName] = (acc[item.userName] || 0) + 1 + (item.likes || 0) * 0.1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  if (!userId)
    return (
      <div className="flex items-center justify-center h-screen text-gray-600 text-lg">
        Please log in to add accomplishments.
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-4">🌱 Accomplishments Overview</h1>

      {/* 🏆 Leaderboard */}
      <div className="p-5 bg-white rounded-lg shadow mb-8">
        <h3 className="text-xl font-semibold mb-3">
          🏆 Top Contributors (All Users)
        </h3>
        {leaderboard.length === 0 ? (
          <p>No leaderboard data yet.</p>
        ) : (
          <ul className="space-y-2">
            {leaderboard.map(([name, score], idx) => (
              <li key={idx} className="flex justify-between border-b pb-1">
                <span>
                  {idx + 1}. <strong>{name}</strong>
                </span>
                <span>{Math.round(score)} pts</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 🌿 Eco-points */}
      <div className="p-4 bg-green-50 rounded-lg shadow mb-8">
        <h3 className="text-lg font-medium">
          🌍 Your Eco-Points: <span className="font-bold">{ecoPoints}</span>
        </h3>
        <p className="text-sm text-gray-600">
          Earn points by posting (+10) or upvoting (+2). Redeem for community
          rewards later!
        </p>
      </div>

      {/* 🧮 Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium">📝 Total Accomplishments</h3>
          <p className="text-2xl font-bold mt-2">{stats?.totalCount ?? 0}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium">🗓️ This Week</h3>
          <p className="text-2xl font-bold mt-2">{stats?.weeklyCount ?? 0}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium">✅ Top Category</h3>
          <p className="text-2xl font-bold mt-2">
            {stats?.topCategory ?? "None"}
          </p>
        </div>
      </div>

      {/* ➕ Add */}
      <div className="p-5 bg-white rounded-lg shadow mb-8">
        <h3 className="text-xl font-semibold mb-3">
          ➕ Add New Accomplishment
        </h3>
        <form onSubmit={handleAdd} className="space-y-3">
          <select
            className="border p-2 rounded w-full"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          >
            <option>Energy Efficiency</option>
            <option>Health & Wellness</option>
            <option>Water Conservation</option>
            <option>Waste Reduction</option>
            <option>Sustainable Transport</option>
          </select>
          <textarea
            placeholder="What did you accomplish today?"
            className="border rounded w-full p-2"
            rows="3"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
          ></textarea>
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {loading ? "Saving..." : "Save Accomplishment"}
          </button>
          {message && (
            <p className="text-sm text-gray-700 mt-1">{message}</p>
          )}
        </form>
      </div>

      {/* 👤 My list */}
      <div className="bg-gray-50 p-5 rounded-lg shadow mb-8">
        <h3 className="text-xl font-semibold mb-3">
          🧍‍♀️ My Recent Accomplishments
        </h3>
        {userAccomplishments.length === 0 ? (
          <p>No accomplishments yet.</p>
        ) : (
          <ul className="space-y-2">
            {userAccomplishments.map((a) => (
              <li key={a._id} className="border-b pb-1">
                <strong>{a.category}</strong> — {a.text}
                {a.userLocation && (
                  <span className="text-sm text-gray-500 ml-2">
                    📍{a.userLocation}
                  </span>
                )}
                <span className="text-sm text-gray-500 ml-2">
                  {new Date(a.date).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 🌎 Community feed */}
      <div className="bg-white p-5 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-3">
          🌍 Community Accomplishments
        </h3>
        {globalAccomplishments.length === 0 ? (
          <p>No community accomplishments yet.</p>
        ) : (
          <ul className="space-y-2">
            {globalAccomplishments.map((a) => (
              <li key={a._id} className="border-b pb-1 flex justify-between">
                <div>
                  <strong>{a.userName || "Anonymous"}</strong> — {a.text}{" "}
                  <span className="text-sm text-gray-500 ml-2">
                    ({a.category})
                  </span>
                  {a.userLocation && (
                    <span className="text-sm text-gray-500 ml-2">
                      📍{a.userLocation}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleUpvote(a._id)}
                  className="text-sm bg-blue-100 px-2 py-1 rounded hover:bg-blue-200"
                >
                  👍 {a.likes || 0}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
