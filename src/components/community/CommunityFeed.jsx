import React, { useEffect, useState } from "react";

export default function CommunityFeed({ community }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const backend =
    process.env.REACT_APP_BACKEND_URL ||
    "https://bhoomi-backend-vbrw.onrender.com";

  useEffect(() => {
    const fetchPosts = async () => {
      if (!community?._id) return;
      try {
        setLoading(true);
        const res = await fetch(`${backend}/api/posts/community/${community._id}`);
        const data = await res.json();
        if (data.success) {
          setPosts(data.posts);
        } else {
          setError("No posts found for this community");
        }
      } catch (err) {
        console.error("Error fetching community posts:", err);
        setError("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [community]);

  if (loading)
    return (
      <div className="bg-white p-6 rounded-xl shadow text-center">
        <p className="italic text-gray-600 animate-pulse">Loading posts...</p>
      </div>
    );

  if (error)
    return (
      <div className="bg-white p-6 rounded-xl shadow text-center text-gray-600">
        {error}
      </div>
    );

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4">📰 Community Feed</h3>
      {posts.length === 0 ? (
        <p className="text-gray-600 italic">
          No updates yet — be the first to share something with your community!
        </p>
      ) : (
        <div className="space-y-4">
          {posts.map((p) => (
            <div
              key={p._id}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <h4 className="font-semibold text-gray-800">{p.title}</h4>
              <p className="text-gray-700 text-sm mt-1">{p.content}</p>
              <p className="text-gray-400 text-xs mt-2">
                Posted by {p.author?.username || "Anonymous"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
