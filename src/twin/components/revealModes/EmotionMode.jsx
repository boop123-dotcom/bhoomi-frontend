"use client";
import React from "react";
import { motion } from "framer-motion";

export default function EmotionMode({ goal }) {
  return (
    <motion.div
      className="p-5 rounded-2xl bg-gradient-to-r from-blue-100 to-indigo-50 border border-indigo-300 shadow-lg"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="font-semibold text-indigo-700">💭 Emotional Reflection</h3>
      <p className="text-gray-700">{goal.title}</p>
      <p className="text-sm text-indigo-600 mt-1">Take a deep breath and tune in 💙</p>
    </motion.div>
  );
}
