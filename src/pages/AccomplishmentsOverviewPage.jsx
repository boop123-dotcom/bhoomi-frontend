import React from "react";
import DashboardHome from "../pages/DashboardHome"; // your existing dashboard summary
import Accomplishments from "../components/Accomplishments"; // your existing list

export default function AccomplishmentsOverviewPage() {
  return (
    <div className="space-y-8">
      {/* Summary widgets (what you currently see on /dashboard) */}
      <section>
        <DashboardHome />
      </section>

      {/* List of accomplishments (what you currently see on View Accomplishments) */}
      <section>
        <Accomplishments />
      </section>
    </div>
  );
}
