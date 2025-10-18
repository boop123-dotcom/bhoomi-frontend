import React from "react";

export default function CommunityMembers({ community }) {
  if (!community?.members?.length) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4">👥 Members in this Community</h3>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {community.members.map((m) => (
          <li
            key={m._id}
            className="border border-gray-200 p-3 rounded-lg hover:bg-gray-50 transition-all"
          >
            <span className="font-medium text-gray-800">{m.username}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
