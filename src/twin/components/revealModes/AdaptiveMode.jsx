"use client";
import React from "react";
import { motion } from "framer-motion";

export default function AdaptiveMode({ goal }) {
  return (
    <motion.div
      className="p-5 rounded-2xl bg-gradient-to-r from-purple-100 to-pink-50 border border-purple-300 shadow-lg"
      animate={{ scale: [1, 1.03, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <h3 className="font-semibold text-purple-700">🌈 Adaptive Challenge</h3>
      <p className="text-gray-700">{goal.title}</p>
      <p className="text-sm text-purple-600 mt-1">Adapting to your day’s rhythm ✨</p>
    </motion.div>
  );
}
