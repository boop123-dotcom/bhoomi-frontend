"use client";
import React from "react";
import { motion } from "framer-motion";

export default function TwinCompeteMode({ goal }) {
  const twinMessage =
    Math.random() < 0.5
      ? "Your Twin already started this one ⚡"
      : "Your Twin is waiting for you 💪";

  return (
    <motion.div
      className="p-5 rounded-2xl bg-gradient-to-r from-indigo-100 to-sky-50 border border-indigo-300 shadow-lg"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <h3 className="font-semibold text-indigo-700">🤖 Twin Compete Mode</h3>
      <p className="text-gray-700">{goal.title}</p>
      <p className="text-sm text-indigo-600 mt-1">{twinMessage}</p>
    </motion.div>
  );
}
