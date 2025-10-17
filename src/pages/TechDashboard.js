// frontend/src/components/TechDashboard.js
import React, { useState, useEffect } from "react";
import api from "../api";
import { auth } from "../firebase"; // ✅ Firebase login

function TechDashboard() {
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [streak, setStreak] = useState(0);
  const [history, setHistory] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // ✅ Get the logged-in user or fallback to Guest
  const user = auth.currentUser;
  const username = user?.displayName || user?.email || "Guest";

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch today’s question
        const qRes = await api.get("/api/questions/today");
        setQuestion(qRes.data);

        // Fetch user streak & history
        const uRes = await api.get(
          `/api/questions/users/${encodeURIComponent(username)}/history`
        );
        setStreak(uRes.data.streak);
        setHistory(uRes.data.history);
      } catch (err) {
        console.error(
          "Error fetching data:",
          err?.response?.data || err.message
        );
        setQuestion(null);
      }
    }
    fetchData();
  }, [username]);

  const handleSubmit = async () => {
    if (!selectedAnswer || !question?._id) return;

    try {
      setSubmitting(true);
      setFeedback("");

      const res = await api.post("/api/questions/answer", {
        username,
        questionId: question._id,
        answer: selectedAnswer,
      });

      setFeedback(res.data.correct ? "✅ Correct!" : "❌ Try again.");
      setStreak(res.data.streak);

      // Refresh history
      const uRes = await api.get(
        `/api/questions/users/${encodeURIComponent(username)}/history`
      );
      setHistory(uRes.data.history);
    } catch (err) {
      const msg = err?.response?.data?.error || err.message;
      if (msg?.toLowerCase().includes("already answered")) {
        setFeedback("ℹ️ You already answered today’s question.");
        setSelectedAnswer(""); // ✅ clear highlight when already answered
      } else {
        setFeedback(`⚠️ ${msg}`);
      }
      console.error("Answer error:", msg);
    } finally {
      setSubmitting(false);
    }
  };

  const OptionButton = ({ opt }) => {
    const selected = selectedAnswer === opt;

    const fallbackStyle = selected
      ? { backgroundColor: "#2563EB", color: "#FFFFFF", borderColor: "#1D4ED8" }
      : { backgroundColor: "#E5E7EB", color: "#111827", borderColor: "#D1D5DB" };

    return (
      <button
        type="button"
        onClick={() => setSelectedAnswer(opt)}
        aria-pressed={selected}
        className={[
          "w-full text-left p-3 rounded-lg border font-medium transition-colors duration-150",
          "cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400",
          selected
            ? "bg-blue-600 text-white border-blue-700"
            : "bg-gray-200 text-gray-900 hover:bg-blue-50 border-gray-300",
        ].join(" ")}
        style={fallbackStyle}
      >
        {opt}
      </button>
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">⚡ Tech Dashboard</h1>

      {/* Daily Question */}
      {question && question.text ? (
        <div className="bg-white shadow-md p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">📅 Daily Question</h2>
          <p className="mb-4">{question.text}</p>

          {/* Multiple Choice */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {question.options?.map((opt, idx) => (
              <OptionButton key={idx} opt={opt} />
            ))}
          </div>

          <p className="mt-3 text-sm text-gray-600">
            Select an option, then click <strong>Submit Answer</strong>.
          </p>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!selectedAnswer || submitting}
            className={[
              "mt-4 px-4 py-2 rounded-lg font-semibold transition-colors duration-150",
              "disabled:opacity-60 disabled:cursor-not-allowed",
              submitting
                ? "bg-blue-400 text-white"
                : "bg-blue-600 text-white hover:bg-blue-700",
            ].join(" ")}
            style={
              !selectedAnswer || submitting
                ? {}
                : {
                    backgroundColor: "#2563EB",
                    color: "#FFFFFF",
                    borderColor: "#1D4ED8",
                  }
            }
          >
            {submitting ? "Submitting..." : "Submit Answer"}
          </button>

          {selectedAnswer && (
            <p className="mt-2 text-sm text-gray-700">
              Selected: <span className="font-semibold">{selectedAnswer}</span>
            </p>
          )}

          {feedback && <p className="mt-3 font-semibold">{feedback}</p>}
        </div>
      ) : (
        <p>No question set yet. ⏳</p>
      )}

      {/* Streak */}
      <div className="bg-green-50 p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold">🔥 Streak</h2>
        <p>You are on a {streak}-day streak!</p>
      </div>

      {/* History */}
      <div className="bg-gray-50 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">🕑 Recent Answers</h2>
        <ul className="list-disc pl-6">
          {history.map((h, idx) => (
            <li key={idx}>
              {h.questionId?.text} — {h.isCorrect ? "✅ Correct" : "❌ Incorrect"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TechDashboard;
