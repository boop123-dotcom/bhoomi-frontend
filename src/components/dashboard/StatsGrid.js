import StatCard from './StatCard';

export default function StatsGrid({ 
  totalAccomplishments, 
  weeklyAccomplishments, 
  topCategory 
}) {
  const categoryIcons = {
    Academic: "🎓",
    Work: "💼",
    Personal: "🌟",
    Health: "🏋️"
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <StatCard 
        title="Total Accomplishments" 
        value={totalAccomplishments} 
        icon="📝"
      />
      <StatCard 
        title="This Week" 
        value={weeklyAccomplishments} 
        icon="🗓️" 
      />
      <StatCard 
        title="Top Category" 
        value={topCategory} 
        icon={categoryIcons[topCategory] || "✅"}
      />
    </div>
  );
}