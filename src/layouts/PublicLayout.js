// frontend/src/layouts/PublicLayout.js
import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

export default function PublicLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-900 to-black text-white">
      {/* 🌍 Top Navbar */}
      <header className="flex justify-between items-center px-8 py-4 bg-black/40 backdrop-blur-sm fixed w-full top-0 z-50 border-b border-white/10">
        <h1 className="text-2xl font-bold text-sky-400 tracking-wide">
          OmniScope
        </h1>

        <nav className="space-x-8 text-lg font-medium">
          <Link
            to="/landing"
            className={`hover:text-sky-300 transition ${
              location.pathname === "/landing" ? "text-sky-300 font-semibold" : ""
            }`}
          >
            Home
          </Link>

          <Link
            to="/about"
            className={`hover:text-sky-300 transition ${
              location.pathname === "/about" ? "text-sky-300 font-semibold" : ""
            }`}
          >
            About
          </Link>

          <Link
            to="/auth"
            className={`hover:text-sky-300 transition ${
              location.pathname === "/auth" ? "text-sky-300 font-semibold" : ""
            }`}
          >
            Sign In
          </Link>
        </nav>
      </header>

      {/* ✅ Page Content (child routes render here) */}
      <main className="flex-1 mt-24 px-6 md:px-12">
        <Outlet />
      </main>
    </div>
  );
}
