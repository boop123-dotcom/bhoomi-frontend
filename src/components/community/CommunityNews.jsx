import React, { useEffect, useState } from "react";

/**
 * 🌿 CommunityNews component
 * Dynamically fetches and displays environmental/climate/sustainability news
 * specific to the user's county, or defaults to California-wide news.
 *
 * 🪄 Setup:
 * 1. Create a free API key at https://newsapi.org/
 * 2. Add it to your .env file:
 *    REACT_APP_NEWS_API_KEY=your_api_key_here
 */

export default function CommunityNews({ community }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🗞️ Build query dynamically
  const countyName =
    community?.name && community?.state
      ? `${community.name}, ${community.state}`
      : "California";

  const NEWS_API = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
    countyName + " environment OR climate OR sustainability"
  )}&language=en&pageSize=6&sortBy=publishedAt&apiKey=${
    process.env.REACT_APP_NEWS_API_KEY
  }`;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(NEWS_API);
        const data = await res.json();

        if (data.articles && Array.isArray(data.articles)) {
          setArticles(data.articles);
        } else {
          setError("No environmental news found.");
        }
      } catch (err) {
        console.error("Error fetching environmental news:", err);
        setError("Failed to load news. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [countyName]); // refetch when community changes

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold mb-4">
        🌿 Environmental News —{" "}
        <span className="text-green-700">{countyName}</span>
      </h3>

      {loading && (
        <p className="text-gray-600 italic animate-pulse">Loading news...</p>
      )}

      {error && <p className="text-gray-500">{error}</p>}

      {!loading && !error && articles.length > 0 && (
        <div className="space-y-4">
          {articles.map((a, i) => (
            <a
              key={i}
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block border border-gray-100 hover:border-green-300 p-4 rounded-lg transition duration-200 hover:bg-green-50"
            >
              <p className="font-medium text-gray-800 mb-1">{a.title}</p>
              <p className="text-sm text-gray-500 mb-2">
                {a.source?.name ?? "Unknown source"} •{" "}
                {new Date(a.publishedAt).toLocaleDateString()}
              </p>
              {a.urlToImage && (
                <img
                  src={a.urlToImage}
                  alt={a.title}
                  className="rounded-md mt-2 w-full h-48 object-cover"
                />
              )}
              <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                {a.description || "No summary available."}
              </p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
