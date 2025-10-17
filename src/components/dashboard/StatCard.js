export default function StatCard({ title, value, icon }) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <span className="text-2xl mr-3">{icon}</span>
          <div>
            <p className="text-gray-500 text-sm">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </div>
      </div>
    );
  }