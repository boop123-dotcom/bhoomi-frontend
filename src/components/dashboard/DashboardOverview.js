import React, { useState, useEffect } from 'react';
import StatsGrid from './StatsGrid'; 

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalAccomplishments: 0,
    weeklyAccomplishments: 0,
    topCategory: ''
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/accomplishments/stats');
        const data = await response.json();
        setStats({
          totalAccomplishments: data.totalCount,
          weeklyAccomplishments: data.weeklyCount,
          topCategory: data.topCategory
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Your Dashboard</h2>
      <StatsGrid {...stats} />
    </div>
  );
};

export default DashboardOverview; 