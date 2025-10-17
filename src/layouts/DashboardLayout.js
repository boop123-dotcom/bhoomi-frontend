// frontend/src/layouts/DashboardLayout.js
import React, { useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase";
import { FiHome, FiSettings, FiLogOut } from "react-icons/fi";
import { FaBrain, FaTrophy, FaChartBar } from "react-icons/fa";
import Chatbot from "../components/Chatbot"; // 💬 Omni Assistant (portal)

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [dataOpen, setDataOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/landing");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getPageTitle = () => {
    const p = location.pathname;
    if (p === "/dashboard" || p === "/dashboard/accomplishments/overview")
      return "Accomplishments Overview";
    if (p === "/dashboard/accomplishments/add") return "Add New Accomplishment";
    if (p === "/dashboard/social") return "Social Feed";
    if (p === "/dashboard/health") return "Health Dashboard";
    if (p === "/dashboard/tech") return "Tech Dashboard";
    if (p === "/dashboard/energy") return "Energy Dashboard";
    if (p === "/dashboard/planet") return "Planet Dashboard";
    if (p === "/dashboard/community") return "Community Dashboard";
    if (p === "/dashboard/settings") return "Settings";
    return "Dashboard";
  };

  return (
    <>
      {/* =======================
          Dashboard main structure
      ======================= */}
      <div className="flex min-h-screen bg-gray-50 overflow-visible relative z-0">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg p-5 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">
              OmniScope
            </h1>

            <nav className="space-y-3">
              <Link
                to="/dashboard"
                className={`block px-3 py-2 rounded-lg ${
                  location.pathname === "/dashboard"
                    ? "bg-blue-100 text-blue-600"
                    : "hover:bg-gray-100"
                }`}
              >
                <FiHome className="inline-block mr-2" /> Home
              </Link>

              <Link
                to="/dashboard/social"
                className={`block px-3 py-2 rounded-lg ${
                  location.pathname.includes("/dashboard/social")
                    ? "bg-blue-100 text-blue-600"
                    : "hover:bg-gray-100"
                }`}
              >
                <FaBrain className="inline-block mr-2" /> Social Feed
              </Link>

              <Link
                to="/dashboard/accomplishments"
                className={`block px-3 py-2 rounded-lg ${
                  location.pathname.includes("/dashboard/accomplishments")
                    ? "bg-blue-100 text-blue-600"
                    : "hover:bg-gray-100"
                }`}
              >
                <FaTrophy className="inline-block mr-2" /> Accomplishments
              </Link>

              {/* 📊 Data Dropdown */}
              <div>
                <button
                  onClick={() => setDataOpen(!dataOpen)}
                  className={`w-full text-left px-3 py-2 rounded-lg ${
                    dataOpen ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100"
                  }`}
                >
                  <FaChartBar className="inline-block mr-2" /> Data ▾
                </button>

                {dataOpen && (
                  <div className="ml-5 mt-2 space-y-2 text-sm">
                    <Link
                      to="/dashboard/energy"
                      className={`block px-2 py-1 rounded ${
                        location.pathname === "/dashboard/energy"
                          ? "text-blue-600 font-medium"
                          : "hover:text-blue-600"
                      }`}
                    >
                      ⚡ Energy
                    </Link>
                    <Link
                      to="/dashboard/health"
                      className={`block px-2 py-1 rounded ${
                        location.pathname === "/dashboard/health"
                          ? "text-blue-600 font-medium"
                          : "hover:text-blue-600"
                      }`}
                    >
                      💚 Health
                    </Link>
                    <Link
                      to="/dashboard/tech"
                      className={`block px-2 py-1 rounded ${
                        location.pathname === "/dashboard/tech"
                          ? "text-blue-600 font-medium"
                          : "hover:text-blue-600"
                      }`}
                    >
                      🧬 Tech
                    </Link>
                    <Link
                      to="/dashboard/planet"
                      className={`block px-2 py-1 rounded ${
                        location.pathname === "/dashboard/planet"
                          ? "text-blue-600 font-medium"
                          : "hover:text-blue-600"
                      }`}
                    >
                      🌎 Planet
                    </Link>
                  </div>
                )}
              </div>

              {/* 🌍 Community Link */}
              <Link
                to="/dashboard/community"
                className={`flex items-center space-x-2 p-2 rounded ${
                  location.pathname.includes("/dashboard/community")
                    ? "bg-blue-100 text-blue-600"
                    : "hover:bg-green-100"
                }`}
              >
                <span>🌍 Community</span>
              </Link>

              <Link
                to="/dashboard/settings"
                className={`block px-3 py-2 rounded-lg ${
                  location.pathname.includes("/dashboard/settings")
                    ? "bg-blue-100 text-blue-600"
                    : "hover:bg-gray-100"
                }`}
              >
                <FiSettings className="inline-block mr-2" /> Settings
              </Link>
            </nav>
          </div>

          {/* 🚪 Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full mt-6 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
          >
            <FiLogOut className="mr-2" /> Logout
          </button>
        </aside>

        {/* Content Area */}
        <main className="flex-1 flex flex-col relative">
          <header className="flex justify-between items-center p-6 bg-white shadow-sm">
            <h2 className="text-xl font-bold text-gray-800">{getPageTitle()}</h2>
          </header>

          <section className="flex-1 p-6 overflow-y-auto bg-gray-50">
            <Outlet />
          </section>
        </main>
      </div>

      {/* 💬 Omni Assistant (portal renders to <body>) */}
      <Chatbot />
    </>
  );
}
