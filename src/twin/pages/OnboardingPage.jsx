"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // ✅ Added here

const questions = [
  {
    id: 1,
    title: "🌍 Lifestyle Rhythm",
    question: "How would you describe your typical daily routine?",
    type: "single",
    options: [
      "Early bird",
      "Night owl",
      "Balanced rhythm",
      "Irregular or unpredictable",
    ],
  },
  {
    id: 2,
    title: "💭 Mental Energy Pattern",
    question: "When do you usually feel your most mentally alert?",
    type: "single",
    options: ["Morning", "Afternoon", "Evening", "It varies"],
  },
  {
    id: 3,
    title: "❤️ Emotional Well-Being",
    question: "How have your emotions been lately?",
    type: "single",
    options: [
      "Mostly calm and content",
      "Sometimes stressed or anxious",
      "Often overwhelmed or low",
      "I’m not sure",
    ],
  },
  {
    id: 4,
    title: "⚡ Energy Source",
    question: "What helps you recharge your energy the most?",
    type: "multi",
    options: [
      "Alone time / rest",
      "Exercise or movement",
      "Social interaction",
      "Nature and outdoor time",
      "Creative expression",
    ],
  },
  {
    id: 5,
    title: "🧠 Motivation Style",
    question: "What motivates you to take action?",
    type: "multi",
    options: [
      "Healthy competition",
      "Accountability / tracking progress",
      "Encouragement / emotional support",
      "Curiosity and learning",
      "Rewards and gamification",
    ],
  },
  {
    id: 6,
    title: "🍎 Physical Health Focus",
    question: "What’s your top priority for your physical health right now?",
    type: "single",
    options: [
      "Nutrition and eating habits",
      "Exercise and movement",
      "Sleep improvement",
      "Consistency and discipline",
    ],
  },
  {
    id: 7,
    title: "🧘 Mindfulness & Stress",
    question: "How often do you practice relaxation or mindfulness?",
    type: "single",
    options: ["Daily", "A few times a week", "Occasionally", "Rarely"],
  },
  {
    id: 8,
    title: "🪫 Energy Management",
    question: "How often do you feel low on energy or focus?",
    type: "single",
    options: ["Rarely", "A few times a week", "Daily", "Almost constantly"],
  },
  {
    id: 9,
    title: "🌿 Environmental Awareness",
    question:
      "How connected are you to your physical surroundings (nature, workspace, home)?",
    type: "single",
    options: [
      "Very connected and mindful",
      "Somewhat aware but inconsistent",
      "Not very aware",
      "I’d like to improve that",
    ],
  },
  {
    id: 10,
    title: "💡 Digital Balance",
    question: "How balanced is your relationship with technology?",
    type: "single",
    options: [
      "Very balanced",
      "Sometimes distracting",
      "Often overwhelming",
      "I’m not sure",
    ],
  },
  {
    id: 11,
    title: "📚 Education & Curiosity",
    question: "What kind of learning inspires you most right now?",
    type: "multi",
    options: [
      "Academic / career-based learning",
      "Personal development",
      "Creative / artistic learning",
      "Technical / coding skills",
      "Self-growth and reflection",
    ],
  },
  {
    id: 12,
    title: "🎯 Goal Orientation",
    question: "How do you usually set and track goals?",
    type: "single",
    options: [
      "I plan everything ahead",
      "I go with the flow",
      "I set goals but struggle to follow through",
      "I rarely set goals",
    ],
  },
  {
    id: 13,
    title: "🤝 Social & Support System",
    question: "How connected do you feel to your friends or support network?",
    type: "single",
    options: [
      "Very connected",
      "Somewhat connected",
      "Often feel isolated",
      "Prefer independence",
    ],
  },
  {
    id: 14,
    title: "🧩 Challenge Response",
    question: "How do you react when something doesn’t go as planned?",
    type: "single",
    options: [
      "Stay calm and problem-solve",
      "Feel frustrated but move on",
      "Get discouraged easily",
      "Reflect deeply and restart",
    ],
  },
  {
    id: 15,
    title: "🌈 Growth Intention",
    question: "What’s your biggest focus right now?",
    type: "single",
    options: [
      "Boosting energy",
      "Improving health",
      "Reducing stress",
      "Staying consistent",
      "Building motivation",
    ],
  },
];

export default function Onboarding() {
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate(); // ✅ Correct place for useNavigate

  const handleSelect = (questionId, option, type) => {
    setAnswers((prev) => {
      if (type === "single") {
        return { ...prev, [questionId]: [option] };
      } else {
        const current = prev[questionId] || [];
        if (current.includes(option)) {
          return { ...prev, [questionId]: current.filter((o) => o !== option) };
        } else {
          return { ...prev, [questionId]: [...current, option] };
        }
      }
    });
  };

  const allAnswered = questions.every((q) => answers[q.id]?.length > 0);

  const handleSubmit = () => {
    localStorage.setItem("onboardingAnswers", JSON.stringify(answers)); // ✅ Save answers
    navigate("/choose-goals"); // ✅ Redirect to next page
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 via-blue-300 to-blue-400 flex flex-col items-center px-6 py-12 overflow-y-auto">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold mb-8 text-white drop-shadow-md"
      >
        🌟 Build Your OmniScope Profile
      </motion.h1>

      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-8 space-y-8 overflow-y-auto">
        {questions.map((q, i) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow bg-gradient-to-br from-gray-50 to-white"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {q.title}
            </h2>
            <p className="text-gray-600 mb-4">{q.question}</p>

            <div className="flex flex-wrap gap-3">
              {q.options.map((opt) => {
                const selected = answers[q.id]?.includes(opt);
                return (
                  <button
                    key={opt}
                    onClick={() => handleSelect(q.id, opt, q.type)}
                    className={`px-4 py-2 rounded-full border transition-all ${
                      selected
                        ? "bg-blue-500 text-white border-blue-500 shadow-md"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-blue-100"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </motion.div>
        ))}

        <div className="flex justify-center pt-6">
          <button
            disabled={!allAnswered}
            onClick={handleSubmit}
            className={`px-8 py-3 rounded-full font-semibold text-lg transition-all ${
              allAnswered
                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}
