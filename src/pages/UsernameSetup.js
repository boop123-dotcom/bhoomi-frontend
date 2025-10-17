import React, { useState } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function UsernameSetup() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    const user = auth.currentUser;
    if (!user) {
      setError("You must be logged in.");
      setLoading(false);
      return;
    }
  
    try {
      // 🗺️ Try to get the user's current coordinates
      let lat = null;
      let lon = null;
      if (navigator.geolocation) {
        await new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              lat = pos.coords.latitude;
              lon = pos.coords.longitude;
              resolve();
            },
            () => resolve() // if user denies permission, just continue
          );
        });
      }
  
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseUid: user.uid,
          username,
          email: user.email,
          lat,
          lon,
        }),
      });
  
      const data = await res.json();
      if (data.success) {
        navigate("/dashboard/social");
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error("Error registering username:", err);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-sky-900 to-black text-white">
      <h1 className="text-3xl font-bold mb-6">Choose a Username</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white text-gray-800 p-6 rounded-lg shadow-lg space-y-4 w-80"
      >
        <input
          type="text"
          placeholder="Enter a unique username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all"
        >
          {loading ? "Saving..." : "Save Username"}
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </div>
  );
}
