// frontend/src/twin/components/revealModes/PomodoroMode.jsx
"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function PomodoroMode({ goal }) {
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      setSeconds((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [running]);

  const minutes = Math.floor(seconds / 60);
  const sec = seconds % 60;

  return (
    <motion.div
      className="p-5 rounded-2xl bg-gradient-to-r from-rose-100 to-pink-50 border border-rose-300 shadow-lg text-gray-800"
      whileHover={{ scale: 1.02 }}
    >
      <h3 className="font-semibold text-lg">🍅 {goal.title}</h3>
      <p className="text-gray-600 mb-2">{goal.desc}</p>
      <p className="text-xl font-mono mb-2">{minutes}:{sec.toString().padStart(2, "0")}</p>
      <button
        className="bg-rose-500 text-white px-4 py-2 rounded-md hover:bg-rose-600"
        onClick={() => setRunning((r) => !r)}
      >
        {running ? "Pause" : "Start"}
      </button>
    </motion.div>
  );
}
