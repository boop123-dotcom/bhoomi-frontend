import React, { useState, useEffect } from "react";
import axios from "axios";
import { auth } from '../firebase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CATEGORIES = [
  "All Categories",
  "Energy Efficiency",
  "Sustainable Transport",
  "Health & Wellness",
  "Waste Reduction",
  "Water Conservation",
];

const Accomplishments = () => {
  const [accomplishments, setAccomplishments] = useState([]);
  const [userId, setUserId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [viewMode, setViewMode] = useState("mine"); // "mine" | "family"
  const [loading, setLoading] = useState(true);

  // watch auth
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setUserId(user?.uid || null);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (viewMode === "mine" && !userId) return;

    const fetchAccomplishments = async () => {
      try {
        setLoading(true);

        // normalize category param
        const catParam =
          selectedCategory === "All Categories" ? "all" : encodeURIComponent(selectedCategory);

        const base = `${process.env.REACT_APP_BACKEND_URL}/api/accomplishments`;

        const url =
          viewMode === "family"
            ? `${base}/all/${catParam}`
            : `${base}/user/${userId}/${catParam}`;

        console.log("[DEBUG] Fetching URL:", url);

        const res = await axios.get(url);
        const data = Array.isArray(res.data) ? res.data : [];
        setAccomplishments(data);
      } catch (error) {
        console.error("Fetch Error:", {
          message: error.message,
          response: error.response?.data,
          config: error.config,
        });
        toast.error("Failed to load accomplishments");
        setAccomplishments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAccomplishments();
  }, [userId, selectedCategory, viewMode]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Accomplishments</h2>

            {/* View toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("mine")}
                className={`px-3 py-1 rounded ${
                  viewMode === "mine" ? "bg-blue-600 text-white" : "bg-gray-100"
                }`}
              >
                My Accomplishments
              </button>
              <button
                onClick={() => setViewMode("family")}
                className={`px-3 py-1 rounded ${
                  viewMode === "family" ? "bg-blue-600 text-white" : "bg-gray-100"
                }`}
              >
                Family Accomplishments
              </button>
            </div>

            {/* Category filter */}
            <div className="flex items-center">
              <label className="mr-2 text-sm font-medium">Filter by:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="p-2 border rounded"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : accomplishments.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {accomplishments.map((acc) => (
              <div key={acc._id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`inline-block px-3 py-1 text-xs rounded-full ${
                          acc.category === "Energy Efficiency"
                            ? "bg-yellow-100 text-yellow-800"
                            : acc.category === "Sustainable Transport"
                            ? "bg-blue-100 text-blue-800"
                            : acc.category === "Health & Wellness"
                            ? "bg-green-100 text-green-800"
                            : acc.category === "Waste Reduction"
                            ? "bg-purple-100 text-purple-800"
                            : acc.category === "Water Conservation"
                            ? "bg-teal-100 text-teal-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {acc.category}
                      </span>

                      {/* show who (for family view) */}
                      {viewMode === "family" && (
                        <span className="text-xs text-gray-500">
                          {acc.userName || "Unknown user"}
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-gray-800">{acc.text}</p>
                    <p className="mt-1 text-sm text-gray-500">
                      {new Date(acc.date).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            No accomplishments found in this view.
          </div>
        )}
      </div>
    </div>
  );
};

export default Accomplishments;
