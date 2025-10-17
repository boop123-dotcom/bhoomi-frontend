// frontend/src/twin/twinService.js
const API_BASE =
  process.env.NODE_ENV === 'production'
    ? '' // use relative path in production
    : 'https://bhoomi-backend-vbrw.onrender.com'; // backend dev port

/**
 * Fetch AI Twin reply from backend
 * @param {object} userProfile - persona info
 * @param {object} context - current situation (goal, action, time)
 * @returns {Promise<string>}
 */
export async function getTwinReply(userProfile, context) {
  try {
    const response = await fetch(`${API_BASE}/api/twin/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userProfile, context }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Twin API error:', response.status, text);
      return "Hmm, I'm having trouble connecting right now.";
    }

    const data = await response.json();
    return data.reply || "I'm thinking… give me a sec.";
  } catch (error) {
    console.error('Error fetching AI reply:', error);
    return "My mind went blank—try again soon!";
  }
}
