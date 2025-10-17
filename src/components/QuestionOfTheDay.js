import React, { useState, useEffect } from "react";
import api from "../api";

export default function QuestionOfTheDay({ currentUserName }) {
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [reveal, setReveal] = useState(null);

  // ✅ Fetch today's question
  useEffect(() => {
    async function fetchQuestion() {
      try {
        const res = await api.get("/api/questions/today");
        setQuestion(res.data);
      } catch (err) {
        console.error("Error fetching question:", err);
      }
    }
    fetchQuestion();
  }, []);

  // ✅ Submit answer
  const submitAnswer = async () => {
    if (!answer.trim()) {
      alert("Please enter an answer before submitting.");
      return;
    }

    try {
      await api.post("/api/questions/answer", {
        questionId: question._id,
        user: currentUserName,
        answer,
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting answer:", err);
      alert("Could not submit answer. Maybe you already answered?");
    }
  };

  // ✅ Auto-check for reveal
  useEffect(() => {
    if (!question) return;

    const interval = setInterval(async () => {
      try {
        const res = await api.get(`/api/questions/reveal/${question._id}`);
        setReveal(res.data);
        clearInterval(interval);
      } catch (err) {
        // Ignore 403 until reveal time
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [question]);

  return (
    <div className="p-4 border rounded shadow bg-white">
      {question ? (
        <div>
          <h2 className="text-lg font-semibold mb-2">{question.text}</h2>

          {!submitted ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitAnswer();
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter your answer"
                className="border p-2 rounded flex-1"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
            </form>
          ) : (
            <p className="text-green-600 mt-2">
              ✅ Answer submitted! The reveal will appear automatically at 9 PM.
            </p>
          )}

          {/* Auto-revealed answers */}
          {reveal && (
            <div className="mt-6 bg-gray-100 p-4 rounded">
              <h3 className="font-bold">
                Correct Answer: {reveal.correctAnswer}
              </h3>
              <ul className="mt-2 space-y-1">
                {reveal.answers.map((a, idx) => (
                  <li key={idx}>
                    <b>{a.user}:</b> {a.answer}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <p>Come back tomorrow — today’s question hasn’t been set yet.</p>
      )}
    </div>
  );
}
