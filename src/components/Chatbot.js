// frontend/src/components/Chatbot.js
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

const backend = process.env.REACT_APP_BACKEND_URL || "https://bhoomi-backend-vbrw.onrender.com";

function ChatbotInner() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Hey there! I’m Omni, your sustainability assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // default: general chat
      let endpoint = "/api/chat";
      let body = { message: userMsg.text };

      // quick action mapper (tree, walk, recycle, solar, compost)
      const actionMap = {
        tree: "plant_tree",
        walk: "walk_instead_drive",
        recycle: "recycle_plastic",
        solar: "install_solar",
        compost: "compost_food_waste",
      };
      const found = Object.keys(actionMap).find((k) =>
        userMsg.text.toLowerCase().includes(k)
      );
      if (found) {
        endpoint = "/api/impact";
        body = { action: actionMap[found], quantity: 1 };
      }

      const res = await fetch(`${backend}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      const replyText =
        data.reply || data.message || "⚠️ Sorry, I couldn’t process that. Try again!";
      setMessages((prev) => [...prev, { sender: "bot", text: replyText }]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // zIndex is set HUGE to sit above any sticky footers/headers
  const containerStyle = { zIndex: 2147483647 }; // maxed out

  return (
    <>
      {/* Floating Chat Button — bottom right of the viewport */}
      <motion.button
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-6 right-6 bg-green-600 text-white rounded-full p-4 shadow-2xl hover:bg-green-700 focus:outline-none"
        style={containerStyle}
        whileHover={{ scale: 1.05 }}
        aria-label="Open Omni assistant"
      >
        💬
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 50, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-6 w-80 md:w-96 bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200"
            style={{ ...containerStyle, maxHeight: "75vh" }}
            role="dialog"
            aria-label="Omni assistant chat window"
          >
            {/* Header */}
            <div className="bg-green-600 text-white px-4 py-3 rounded-t-2xl font-semibold flex justify-between items-center">
              <span>Omni Assistant 🌿</span>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:text-gray-200 text-xl leading-none"
                aria-label="Close chat"
              >
                ×
              </button>
            </div>

            {/* Messages */}
            <div className="p-4 flex-1 overflow-y-auto space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl max-w-[80%] text-sm ${
                    msg.sender === "user"
                      ? "bg-green-100 ml-auto text-right"
                      : "bg-gray-100"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              {loading && (
                <p className="text-sm text-gray-400 italic">Omni is typing…</p>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button
                onClick={sendMessage}
                className="bg-green-500 text-white px-3 rounded-lg hover:bg-green-600"
              >
                ➤
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// 🚪 Portal to document.body so it ignores any layout/transform of the app
export default function Chatbot() {
  return ReactDOM.createPortal(<ChatbotInner />, document.body);
}
