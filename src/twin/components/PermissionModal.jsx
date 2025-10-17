import React, { useState } from "react";

export default function PermissionModal({ onAllow }) {
  const [permissions, setPermissions] = useState({
    location: false,
    notifications: false,
  });

  const handleToggle = (key) => {
    setPermissions((p) => ({ ...p, [key]: !p[key] }));
  };

  const handleSave = async () => {
    if (permissions.location) {
      navigator.geolocation.getCurrentPosition(
        (pos) => console.log("Location:", pos.coords),
        (err) => console.error("Location denied", err)
      );
    }
    if (permissions.notifications && "Notification" in window) {
      await Notification.requestPermission();
    }
    localStorage.setItem("twinPermissions", JSON.stringify(permissions));
    onAllow();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full">
        <h2 className="text-lg font-bold mb-4">Allow Permissions</h2>
        <div className="space-y-3">
          <label className="flex justify-between items-center">
            Location
            <input
              type="checkbox"
              checked={permissions.location}
              onChange={() => handleToggle("location")}
            />
          </label>
          <label className="flex justify-between items-center">
            Notifications
            <input
              type="checkbox"
              checked={permissions.notifications}
              onChange={() => handleToggle("notifications")}
            />
          </label>
        </div>
        <button
          onClick={handleSave}
          className="mt-5 w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700"
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
}
