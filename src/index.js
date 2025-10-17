// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // ✅ Added for React Query
import './index.css';
import App from './App';

// ✅ Initialize React Query Client
const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>  {/* ✅ Wrap App with React Query provider */}
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// =====================================================
// 🚫 Disable Service Worker in local development
// (prevents stale cache / blank screen issues)
// =====================================================
if (process.env.NODE_ENV === "development" && "serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((regs) => {
    regs.forEach((reg) => reg.unregister());
  });
  console.log("🧹 Service workers unregistered for local development");
} else if ("serviceWorker" in navigator) {
  // ✅ Only register in production builds
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((reg) => console.log("✅ Service Worker registered:", reg.scope))
      .catch((err) => console.log("❌ Service Worker registration failed:", err));
  });
}
