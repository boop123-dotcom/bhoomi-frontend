import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AccomplishmentForm = ({ userId, userName }) => {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("Energy Efficiency");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Siemens-aligned categories
  const categories = [
    "Energy Efficiency",
    "Sustainable Transport",
    "Health & Wellness",
    "Waste Reduction",
    "Water Conservation"
  ];

  // ✅ Hints for each category
  const categoryHints = {
    "Energy Efficiency":
      "Examples: turned off lights, unplugged devices, used natural light.",
    "Sustainable Transport":
      "Examples: walked instead of driving, carpooled, used public transport.",
    "Health & Wellness":
      "Examples: took stairs instead of elevator, 30-min walk, meditation.",
    "Waste Reduction":
      "Examples: recycled paper/plastic, used reusable bottles, composted food waste.",
    "Water Conservation":
      "Examples: short shower under 5 mins, did full-load laundry, turned off faucet while brushing."
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/accomplishments/add`;

    // ✅ Debug: check if BACKEND_URL is loading correctly
    console.log("[DEBUG] BACKEND_URL:", process.env.REACT_APP_BACKEND_URL);
    console.log("[DEBUG] Submitting:", {
      userId,
      category,
      text,
      apiUrl,
    });

    if (!text.trim()) {
      setError("Please enter an accomplishment");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        apiUrl,
        { userId, userName, category, text },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      console.log("[DEBUG] API Response:", response);

      if (response.status === 201 || response.status === 200) {
        toast.success("Accomplishment saved!");
        setText("");
        setCategory("Energy Efficiency"); // reset back to default
      }
    } catch (error) {
      console.error("[DEBUG] Full Error:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Error adding accomplishment";
      setError(errorMessage);
      toast.error(`Failed to save: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Add New Accomplishment
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* ✅ Show category-specific hint */}
          {category && (
            <p className="text-sm text-gray-500 mt-1">
              {categoryHints[category]}
            </p>
          )}
        </div>

        {/* Description textarea */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            placeholder="What did you accomplish today?"
            required
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`
            w-full py-3 px-4 
            bg-yellow-400 hover:bg-yellow-500 
            text-black font-bold 
            rounded-md
            transition-colors duration-200 ease-in-out
            shadow-sm hover:shadow-md
            border border-yellow-500
            focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2
            ${isLoading ? "opacity-70 cursor-not-allowed" : ""}
          `}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              ></svg>
              Saving...
            </span>
          ) : (
            "Save Accomplishment"
          )}
        </button>
      </form>
    </div>
  );
};

export default AccomplishmentForm;
