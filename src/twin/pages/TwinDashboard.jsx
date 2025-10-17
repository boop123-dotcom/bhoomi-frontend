// frontend/src/twin/pages/TwinDashboard.jsx
"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TwinAvatar from "../components/TwinAvatar";
import TwinMessageBubble from "../components/TwinMessageBubble";
import { useTwinLogic } from "../hooks/useTwinLogic";
import { hybridRevealEngine } from "../utils/hybridRevealEngine";

// 🎨 Import all reveal-mode components
import PomodoroMode from "../components/revealModes/PomodoroMode";
import QuestMode from "../components/revealModes/QuestMode";
import EmotionMode from "../components/revealModes/EmotionMode";
import AdaptiveMode from "../components/revealModes/AdaptiveMode";
import TwinCompeteMode from "../components/revealModes/TwinCompeteMode";

export default function TwinDashboard() {
  const { messages, addMessage } = useTwinLogic();
  const [goals, setGoals] = useState([]);

  // 🧠 Load selected goals and assign reveal modes dynamically
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("selectedGoals") || "[]");

    const goalsWithModes = stored.map((goal) => ({
      ...goal,
      displayMode: hybridRevealEngine(goal), // dynamically pick mode
    }));

    setGoals(goalsWithModes);
  }, []);

  // 💬 Welcome message on load
  useEffect(() => {
    addMessage("screen_opened", { page: "twin_dashboard" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🧩 Renders a unique component per reveal type
  const renderGoalCard = (goal) => {
    switch (goal.displayMode) {
      case "pomodoro":
        return <PomodoroMode goal={goal} />;
      case "quest":
        return <QuestMode goal={goal} />;
      case "emotion":
        return <EmotionMode goal={goal} />;
      case "adaptive":
        return <AdaptiveMode goal={goal} />;
      case "twin_compete":
        return <TwinCompeteMode goal={goal} />;
      default:
        return (
          <motion.div
            className="bg-white rounded-2xl shadow-md p-4 flex justify-between items-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div>
              <h3 className="font-semibold text-gray-800">
                {goal.title || goal.id.replace("custom-", "Custom Goal ")}
              </h3>
              <p className="text-gray-500 text-sm">
                {goal.desc || "No description provided"}
              </p>
            </div>
            <span className="text-blue-500 font-medium">Pending</span>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-100 text-blue-950 p-6">
      {/* --- Header --- */}
      <motion.h1
        className="text-3xl font-bold mb-6 flex items-center gap-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🤖 Your AI Twin
      </motion.h1>

      {/* --- Twin Messages --- */}
      <div className="mb-6 space-y-3">
        <TwinAvatar />
        {messages.length === 0 ? (
          <TwinMessageBubble text="Hey! Ready to start our day?" />
        ) : (
          messages.map((m, i) => (
            <TwinMessageBubble key={i} text={m.text} from={m.from} />
          ))
        )}
      </div>

      {/* --- Goals Section --- */}
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold mb-3">Today's Goals</h2>
        {goals.length === 0 ? (
          <p className="text-gray-500 italic">No goals selected yet.</p>
        ) : (
          <div className="space-y-6">
            {goals.map((goal) => (
              <div key={goal.id}>{renderGoalCard(goal)}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
