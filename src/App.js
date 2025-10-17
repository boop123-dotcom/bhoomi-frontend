/* eslint-disable no-unused-vars */

// frontend/src/App.js
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 🌍 Public Pages
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import AuthPage from "./pages/AuthPage";
import UsernameSetup from "./pages/UsernameSetup";

// 🧭 Layouts
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// 🧠 Social Feed
import SocialFeed from "./pages/SocialFeed";

// 🏆 Accomplishments (✅ unified)
import AccomplishmentsDashboard from "./pages/AccomplishmentsDashboard";

// 📊 Dashboards
import DashboardHome from "./pages/DashboardHome";
import HealthModule from "./pages/HealthModule";
import TechDashboard from "./pages/TechDashboard";
import EnergyDashboard from "./pages/EnergyDashboard";
import PlanetDashboard from "./pages/PlanetDashboard";
import SustainabilityActionsPage from "./pages/SustainabilityActionsPage";

// ⚙️ Settings
import SettingsPage from "./pages/SettingsPage";

// 🤖 Twin AI
import TwinDashboard from "./twin/pages/TwinDashboard";
import OnboardingPage from "./twin/pages/OnboardingPage";
import ChooseGoalsPage from "./twin/pages/ChooseGoalsPage";

// 🌎 Community Dashboard (🆕 Nearby Users Feature)
import CommunityDashboard from "./pages/CommunityDashboard";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Handle Firebase authentication and routing
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const res = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/users/${firebaseUser.uid}`
          );

          if (res.ok) {
            const data = await res.json();
            if (data && data.username) {
              setUser(data);

              // Redirect only if user is on a public page
              const publicPaths = ["/auth", "/landing", "/about", "/"];
              if (publicPaths.includes(window.location.pathname)) {
                navigate("/dashboard/home", { replace: true });
              }
            } else {
              navigate("/username-setup", { replace: true });
            }
          } else {
            navigate("/username-setup", { replace: true });
          }
        } catch (err) {
          navigate("/username-setup", { replace: true });
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, [navigate, setUser]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-700">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-900 bg-gray-100">
      <ToastContainer position="top-center" />

      <Routes>
        {/* 🌍 Public Pages (No Sidebar) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Navigate to="/landing" replace />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/auth" element={<AuthPage />} />
        </Route>

        {/* 🧠 Username Setup */}
        <Route path="/username-setup" element={<UsernameSetup />} />

        {/* 🌟 Twin AI Flow */}
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/choose-goals" element={<ChooseGoalsPage />} />
        <Route path="/twin" element={<TwinDashboard />} />

        {/* 🔒 Private Dashboard (With Sidebar) */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard/home" replace />} />
          <Route path="home" element={<DashboardHome />} />
          <Route path="social" element={<SocialFeed />} />

          {/* 🏆 Unified Accomplishments Dashboard */}
          <Route path="accomplishments" element={<AccomplishmentsDashboard />} />

          <Route path="health" element={<HealthModule />} />
          <Route path="tech" element={<TechDashboard />} />
          <Route path="energy" element={<EnergyDashboard />} />
          <Route path="planet" element={<PlanetDashboard />} />
          <Route
            path="sustainability"
            element={<SustainabilityActionsPage />}
          />
          <Route path="settings" element={<SettingsPage />} />

          {/* 🌎 Community Dashboard (Nearby Users + Map) */}
          <Route path="community" element={<CommunityDashboard />} />
        </Route>

        {/* 🚫 Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
