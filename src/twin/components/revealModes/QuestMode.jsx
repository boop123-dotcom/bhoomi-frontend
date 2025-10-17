"use client";
import React from "react";
import { motion } from "framer-motion";

export default function QuestMode({ goal }) {
  return (
    <motion.div
      className="p-5 rounded-2xl bg-gradient-to-r from-green-100 to-emerald-50 border border-emerald-300 shadow-lg"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="font-semibold text-emerald-700">🗺️ Quest Unlocked!</h3>
      <p className="text-gray-700">{goal.title}</p>
      <p className="text-sm text-emerald-600 mt-1">Complete this to advance your journey 🌿</p>
    </motion.div>
  );
}
