/**
 * Hybrid Reveal Engine
 * --------------------
 * Chooses how to visually present each goal.
 * The selection logic combines randomness with contextual cues (goal type, time, etc.)
 * to make the twin feel adaptive and “AI-like.”
 */

export function hybridRevealEngine(goal) {
  // 📦 1. Available display modes
  const displayModes = [
    "pomodoro",       // Focus-based timer task
    "twin_compete",   // Compete with your AI twin
    "quest",          // Adventure/achievement-style
    "emotion",        // Emotion-aware reflection
    "adaptive",       // Adapts to user's progress/mood
  ];

  // 🧠 2. Context-aware randomization
  // Weight the selection slightly based on goal category or keywords
  const title = goal.title?.toLowerCase() || "";
  let weights = [1, 1, 1, 1, 1]; // default equal weights

  if (title.includes("sleep") || title.includes("meditation")) {
    weights = [0.5, 0.3, 0.7, 1.5, 1];
  } else if (title.includes("walk") || title.includes("exercise")) {
    weights = [1.2, 1, 1, 0.5, 1];
  } else if (title.includes("hydrate") || title.includes("drink")) {
    weights = [1, 0.8, 0.9, 0.7, 1.2];
  } else if (title.includes("gratitude") || title.includes("journal")) {
    weights = [0.5, 0.6, 1.2, 1.5, 0.9];
  }

  // 🎲 3. Weighted random selection
  const total = weights.reduce((a, b) => a + b, 0);
  const threshold = Math.random() * total;
  let cumulative = 0;

  for (let i = 0; i < displayModes.length; i++) {
    cumulative += weights[i];
    if (threshold < cumulative) {
      return displayModes[i];
    }
  }

  return "adaptive"; // fallback
}
