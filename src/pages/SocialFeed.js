// frontend/src/pages/SocialFeed.js
import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import PostCard from "../components/PostCard";

export default function SocialFeed() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [posting, setPosting] = useState(false);

  // ✅ Fetch all posts from backend
  const fetchPosts = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/posts`);
      const data = await res.json();
      setPosts(data.reverse()); // newest first
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // ✅ Get logged-in user info from backend (for username)
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/${user.uid}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.username) setLoggedInUser(data);
      })
      .catch((err) => console.error("Error fetching user info:", err));
  }, []);

  // ✅ Handle new post submission
  const handlePost = async (e) => {
    e.preventDefault();
    if (!content.trim() || !loggedInUser) return;

    setPosting(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: auth.currentUser.uid,
          username: loggedInUser.username,
          content,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setPosts([data.post, ...posts]); // add new post on top
        setContent(""); // clear text box
      }
    } catch (err) {
      console.error("Error posting:", err);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 py-10 px-4">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-xl p-6">
        {/* 🧭 Header */}
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-700">
          🌐 Social Feed
        </h1>

        {/* 📝 Create Post */}
        <form onSubmit={handlePost} className="space-y-3 mb-6">
          <textarea
            placeholder={
              loggedInUser
                ? "What's on your mind?"
                : "Sign in to post something..."
            }
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={!loggedInUser}
            className="w-full border border-gray-300 rounded-lg p-3 resize-none focus:ring-2 focus:ring-blue-400 focus:outline-none disabled:bg-gray-100"
            rows="3"
          />
          <button
            type="submit"
            disabled={posting || !loggedInUser}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {posting ? "Posting..." : "Post"}
          </button>
        </form>

        {/* 🧾 Posts List */}
        {loadingPosts ? (
          <p className="text-gray-500 text-center">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-gray-500 text-center">No posts yet. Be the first!</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
