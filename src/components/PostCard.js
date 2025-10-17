// frontend/src/components/PostCard.js
import React from "react";

export default function PostCard({ post }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow transition-all duration-200">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-gray-800">{post.username}</h3>
        <span className="text-xs text-gray-500">
          {new Date(post.createdAt).toLocaleString()}
        </span>
      </div>
      <p className="text-gray-700 leading-relaxed">{post.content}</p>
    </div>
  );
}
