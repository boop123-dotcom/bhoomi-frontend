// frontend/src/pages/AboutPage.js
import React from "react";

export default function AboutPage() {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-screen py-20 bg-gradient-to-b from-blue-100 via-blue-200 to-blue-300">
      <h1 className="text-4xl font-extrabold mb-6 text-blue-900">
        About OmniScope
      </h1>
      <p className="max-w-2xl text-gray-800 leading-relaxed text-lg px-4">
        OmniScope is a unified environmental and personal dashboard that connects
        your planet, energy, and lifestyle data — helping you make impactful,
        data-driven choices that benefit both you and Earth.
      </p>
    </div>
  );
}
