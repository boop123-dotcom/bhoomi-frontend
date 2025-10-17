export default function TwinMessageBubble({ text }) {
    // Don’t render a blank pill
    if (!text || !String(text).trim()) return null;
  
    return (
      <div className="max-w-3xl mx-auto rounded-xl px-4 py-2 bg-white shadow text-blue-900">
        {text}
      </div>
    );
  }
  