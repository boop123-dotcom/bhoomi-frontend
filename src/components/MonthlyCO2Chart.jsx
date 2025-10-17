// frontend/src/components/MonthlyCO2Chart.jsx
import React, { useEffect, useMemo, useState } from "react";
import { auth, db } from "../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import dayjs from "dayjs";

export default function MonthlyCO2Chart() {
  const [actions, setActions] = useState([]);

  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(
      collection(db, "users", auth.currentUser.uid, "actions"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const rows = [];
      snap.forEach((d) => rows.push({ id: d.id, ...d.data() }));
      setActions(rows);
    });
    return () => unsub();
  }, []);

  const data = useMemo(() => {
    const buckets = new Map(); // "YYYY-MM" -> total_kg
    for (const a of actions) {
      if (!a.createdAt?.toDate) continue;
      const monthKey = dayjs(a.createdAt.toDate()).format("YYYY-MM");
      const prev = buckets.get(monthKey) || 0;
      buckets.set(monthKey, prev + (a.kgCO2e || 0));
    }
    return Array.from(buckets.entries()).map(([month, total]) => ({
      month,
      kgCO2e: Number(total.toFixed(2)),
    }));
  }, [actions]);

  if (!auth.currentUser) {
    return <div className="card">Sign in to see your monthly savings.</div>;
  }

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-2">📅 Monthly CO₂e (all actions)</h3>
      <div className="w-full h-72">
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="kgCO2e" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
