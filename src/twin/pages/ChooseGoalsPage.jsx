"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* 🎯 All 10 Goal Categories */
const goalCategories = [
  {
    id: "health",
    icon: "🌍",
    title: "Health & Movement",
    color: "from-green-300 to-emerald-500",
    goals: [
      { id: "walk", title: "Walk", desc: "Walk customizable steps", default: "5000 steps" },
      { id: "hydrate", title: "Hydrate", desc: "Drink customizable number of glasses", default: "8 glasses" },
      { id: "sleep", title: "Sleep", desc: "Set target bedtime and hours", default: "7 hrs" },
      { id: "activityMix", title: "Activity Mix", desc: "Yoga, stretching, or cycling", default: "30 mins" },
      { id: "rest", title: "Rest & Recharge", desc: "Take a mindful rest day", default: "1 day" },
    ],
  },
  {
    id: "nutrition",
    icon: "🍎",
    title: "Nutrition & Energy",
    color: "from-orange-300 to-red-400",
    goals: [
      { id: "meals", title: "Meals", desc: "Balanced meals per day", default: "3 meals" },
      { id: "fruits", title: "Fruits/Vegetables", desc: "Eat more fresh foods", default: "5 servings" },
      { id: "caffeine", title: "Caffeine Limit", desc: "Limit daily caffeine intake", default: "2 cups" },
      { id: "sugar", title: "Sugar Limit", desc: "Reduce processed foods", default: "2 treats" },
      { id: "timing", title: "Meal Timing", desc: "Stay consistent with meals", default: "3 intervals" },
    ],
  },
  {
    id: "mental",
    icon: "🧘",
    title: "Mental Wellness",
    color: "from-blue-300 to-indigo-500",
    goals: [
      { id: "meditation", title: "Meditation", desc: "Focus, breathe, reflect", default: "10 mins" },
      { id: "breathing", title: "Breathing Exercise", desc: "Try 4-7-8 or box breathing", default: "5 mins" },
      { id: "affirmations", title: "Affirmations", desc: "Positive self talk", default: "3 times" },
      { id: "music", title: "Music Reset", desc: "Play a calming song", default: "1 track" },
      { id: "journal", title: "Reflective Journal", desc: "Write your thoughts", default: "1 entry" },
    ],
  },
  {
    id: "emotional",
    icon: "💌",
    title: "Emotional Growth & Mindset",
    color: "from-pink-300 to-rose-400",
    goals: [
      { id: "gratitude", title: "Gratitude Log", desc: "List things you’re thankful for", default: "3 items" },
      { id: "selfKindness", title: "Self-Kindness", desc: "Say kind words to yourself", default: "3 compliments" },
      { id: "forgiveness", title: "Forgiveness Practice", desc: "Let go of past worries", default: "1 reflection" },
      { id: "mood", title: "Mood Naming", desc: "Label and understand emotions", default: "daily" },
    ],
  },
  {
    id: "environment",
    icon: "🌿",
    title: "Environment & Sustainability",
    color: "from-teal-300 to-green-400",
    goals: [
      { id: "standOutside", title: "Stand Outside", desc: "Spend time outdoors", default: "10 mins" },
      { id: "sunlight", title: "Sunlight Exposure", desc: "Get natural light", default: "15 mins" },
      { id: "reduceEmissions", title: "Reduce Emissions", desc: "Walk or bike instead of drive", default: "1 trip" },
      { id: "airQuality", title: "Air Quality Awareness", desc: "Go outside when AQI < 80", default: "auto" },
      { id: "declutter", title: "Declutter Session", desc: "Organize your workspace", default: "15 mins" },
    ],
  },
  {
    id: "learning",
    icon: "📚",
    title: "Learning & Growth",
    color: "from-purple-300 to-indigo-400",
    goals: [
      { id: "reading", title: "Reading", desc: "Read something inspiring", default: "10 pages" },
      { id: "skill", title: "Skill Learning", desc: "Study a new topic", default: "20 mins" },
      { id: "creative", title: "Creative Session", desc: "Draw, write, or play", default: "30 mins" },
      { id: "trivia", title: "Trivia Quest", desc: "Learn a fun fact daily", default: "1 fact" },
    ],
  },
  {
    id: "productivity",
    icon: "⏰",
    title: "Productivity & Focus",
    color: "from-yellow-200 to-amber-400",
    goals: [
      { id: "focusBlock", title: "Focus Block", desc: "Work deeply for a set time", default: "25 mins" },
      { id: "top3", title: "Top 3 Priorities", desc: "Define key tasks for the day", default: "3 items" },
      { id: "screenDetox", title: "Screen Detox", desc: "Go offline intentionally", default: "30 mins" },
      { id: "review", title: "End-of-Day Review", desc: "Reflect on accomplishments", default: "5 mins" },
    ],
  },
  {
    id: "social",
    icon: "💬",
    title: "Social & Connection",
    color: "from-blue-200 to-sky-400",
    goals: [
      { id: "message", title: "Message Someone", desc: "Reach out to friends", default: "2 people" },
      { id: "call", title: "Call a Friend", desc: "Have a real conversation", default: "1 call" },
      { id: "kindness", title: "Do Something Kind", desc: "Perform an act of kindness", default: "1 action" },
      { id: "checkin", title: "Social Check-In", desc: "Ask others how they’re doing", default: "1 time" },
    ],
  },
  {
    id: "creativity",
    icon: "🎨",
    title: "Creativity & Expression",
    color: "from-fuchsia-300 to-pink-400",
    goals: [
      { id: "create", title: "Create Something", desc: "Make something original", default: "1 item" },
      { id: "journal", title: "Journal Entry", desc: "Reflect creatively", default: "1 entry" },
      { id: "playlist", title: "Curate Playlist", desc: "Add uplifting music", default: "1 song" },
      { id: "photo", title: "Take a Photo", desc: "Capture something inspiring", default: "1 photo" },
    ],
  },
  {
    id: "purpose",
    icon: "🎯",
    title: "Purpose & Growth",
    color: "from-indigo-300 to-blue-500",
    goals: [
      { id: "intention", title: "Set Intention", desc: "Define focus for the day", default: "1 line" },
      { id: "lifeReview", title: "Review Goals", desc: "Reflect on long-term vision", default: "1 review" },
      { id: "visualization", title: "Future Visualization", desc: "Imagine tomorrow vividly", default: "10 mins" },
      { id: "miniWin", title: "Mini-Win Capture", desc: "Note small daily victories", default: "3 wins" },
    ],
  },
];

/* ✅ TaskCard Component */
function TaskCard({ icon, title, desc, selected, onSelect }) {
  return (
    <motion.div
      layout
      whileHover={{ scale: 1.02 }}
      className={`flex justify-between items-center p-4 rounded-xl border transition-all cursor-pointer backdrop-blur-md ${
        selected
          ? "bg-gradient-to-r from-indigo-100 to-indigo-200 border-indigo-400 shadow-md"
          : "bg-white/80 border-gray-200 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center gap-4">
        <span className="text-2xl">{icon}</span>
        <div>
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <p className="text-gray-500 text-sm">{desc}</p>
        </div>
      </div>
      <input
        type="checkbox"
        checked={selected}
        readOnly
        className="w-5 h-5 accent-indigo-600 cursor-pointer"
      />
    </motion.div>
  );
}

/* 🚀 Main Component */
export default function ChooseGoalsPage() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState({});
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [search, setSearch] = useState("");

  const toggleTask = (goalId, category, title, desc) => {
    setSelectedGoals((prev) =>
      prev.some((g) => g.id === goalId)
        ? prev.filter((g) => g.id !== goalId)
        : [...prev, { id: goalId, category, title, desc }]
    );
  };

  const handleAddCustomGoal = (categoryId) => {
    const title = prompt("Enter a custom goal name:");
    if (!title) return;
    const newGoal = {
      id: `custom-${Date.now()}`,
      title,
      desc: "Custom user goal",
      category: categoryId,
    };
    setSelectedGoals((prev) => [...prev, newGoal]);
  };

  // 🚫 No reveal logic here — hybrid engine decides later
  const handleContinue = () => {
    localStorage.setItem("selectedGoals", JSON.stringify(selectedGoals));
    navigate("/twin");
  };

  const filteredCategories = goalCategories
    .map((cat) => ({
      ...cat,
      goals: cat.goals.filter(
        (g) =>
          g.title.toLowerCase().includes(search.toLowerCase()) ||
          g.desc.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((cat) => cat.goals.length > 0);

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-start py-16 px-6 bg-gradient-to-br from-[#fefefe] via-[#f8f5ff] to-[#eaf5ff]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold text-gray-800 mb-8 drop-shadow-sm"
      >
        ✨ Choose Your Daily Goals
      </motion.h1>

      {/* Search Bar */}
      <div className="relative w-full max-w-2xl mb-8">
        <Search className="absolute top-3 left-4 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search goals (e.g. sleep, meditation)"
          className="w-full pl-10 pr-4 py-3 rounded-full border shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 bg-white/80 backdrop-blur-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Category Cards */}
      <div className="space-y-6 w-full max-w-4xl">
        {filteredCategories.map((cat) => (
          <motion.div
            key={cat.id}
            layout
            className={`rounded-3xl border border-white/60 bg-gradient-to-br ${cat.color} shadow-lg backdrop-blur-md overflow-hidden`}
          >
            {/* Category Header */}
            <div
              className="flex justify-between items-center px-6 py-4 cursor-pointer"
              onClick={() =>
                setExpanded((prev) => ({ ...prev, [cat.id]: !prev[cat.id] }))
              }
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{cat.icon}</span>
                <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
                  {cat.title}
                </h2>
              </div>
              {expanded[cat.id] ? (
                <ChevronDown className="text-gray-600" />
              ) : (
                <ChevronRight className="text-gray-600" />
              )}
            </div>

            {/* Expanded Goals */}
            <AnimatePresence>
              {expanded[cat.id] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="p-6 space-y-3"
                >
                  {cat.goals.map((goal) => (
                    <TaskCard
                      key={goal.id}
                      icon={cat.icon}
                      title={goal.title}
                      desc={goal.desc}
                      selected={selectedGoals.some((g) => g.id === goal.id)}
                      onSelect={() =>
                        toggleTask(goal.id, cat.title, goal.title, goal.desc)
                      }
                    />
                  ))}
                  <button
                    className="text-indigo-600 text-sm mt-3 hover:underline"
                    onClick={() => handleAddCustomGoal(cat.title)}
                  >
                    + Add Custom Goal
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <motion.div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/70 backdrop-blur-lg border border-gray-200 shadow-lg rounded-full px-6 py-3 flex items-center justify-between gap-8 w-[90%] sm:w-[500px]"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-gray-600 font-medium">
          {selectedGoals.length} Goals Selected
        </p>
        <button
          onClick={handleContinue}
          disabled={selectedGoals.length === 0}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
            selectedGoals.length > 0
              ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Continue →
        </button>
      </motion.div>
    </motion.div>
  );
}
