import { useState, useEffect } from "react";
import { getTwinReply } from "../twinService";  // ✅ Updated import

export function useTwinLogic() {
  // store daily goals
  const [goals, setGoals] = useState([
    { id: 1, title: "Wake up by 7 AM", status: "Pending" },
    { id: 2, title: "Drink 3 cups of water", status: "Pending" },
  ]);

  // store chat-like message feed between user ↔ twin
  const [messages, setMessages] = useState([]);

  // load the user's saved Twin profile from localStorage (from onboarding)
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const storedProfile = localStorage.getItem("twinProfile");
    if (storedProfile) {
      setUserProfile(JSON.parse(storedProfile));
    }
  }, []);

  /**
   * Adds a new message to the twin chat area.
   * @param {string} userAction - description of what user did (e.g., "completed goal 1").
   * @param {object} [extraContext] - any contextual data like time or location.
   */
  const addMessage = async (userAction, extraContext = {}) => {
    if (!userProfile) {
      console.warn("No twin profile found yet — skipping AI call.");
      return;
    }

    // context object: describes what event just happened
    const context = {
      event: "user_action",
      description: userAction,
      timestamp: new Date().toISOString(),
      ...extraContext,
    };

    // get AI twin’s dynamic reply from backend
    const twinReply = await getTwinReply(userProfile, context);

    // push message to state for display in TwinDashboard
    setMessages((prev) => [
      ...prev,
      { from: "twin", text: twinReply, time: new Date().toLocaleTimeString() },
    ]);
  };

  /**
   * Marks a goal complete and triggers twin feedback.
   */
  const completeGoal = (goalId) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId ? { ...g, status: "Done" } : g
      )
    );

    // find the completed goal’s title for context
    const goal = goals.find((g) => g.id === goalId);
    const goalTitle = goal ? goal.title : `Goal ${goalId}`;

    // tell the AI what just happened
    addMessage(`Completed goal: ${goalTitle}`, { goalId, goalTitle });
  };

  return { goals, completeGoal, messages, addMessage };
}
