import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../firebase';
import { toast } from 'react-toastify';
import StatsGrid from '../components/dashboard/StatsGrid';

const DashboardHome = () => {
  const [randomAccomplishment, setRandomAccomplishment] = useState(null);
  const [userId, setUserId] = useState(null);
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAccomplishments: 0,
    weeklyAccomplishments: 0,
    topCategory: ''
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserId(user?.uid || null);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!userId) return;
    
    const fetchRandomAccomplishment = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/accomplishments/random/${userId}`,
            { params: { category } }
          );
        setRandomAccomplishment(response.data);
      } catch (error) {
        console.error("Error fetching random accomplishment:", error);
        toast.error("Failed to load random accomplishment");
      } finally {
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/accomplishments/stats/${userId}`
          );
        setStats({
          totalAccomplishments: response.data.totalCount,
          weeklyAccomplishments: response.data.weeklyCount,
          topCategory: response.data.topCategory
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchRandomAccomplishment();
    fetchStats();
  }, [userId, category]);

  const refreshAccomplishment = () => {
    setRandomAccomplishment(null);
    setLoading(true);
    setTimeout(() => {
      const fetchNewAccomplishment = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}/api/accomplishments/random/${userId}`,
                { params: { category } }
              );
          setRandomAccomplishment(response.data);
        } catch (error) {
          console.error("Error fetching random accomplishment:", error);
          toast.error("Failed to load random accomplishment");
        } finally {
          setLoading(false);
        }
      };
      fetchNewAccomplishment();
    }, 300);
  };

  return (
    <div className="space-y-6">
      <StatsGrid {...stats} />
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Motivation Boost</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category Filter
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="all">All Categories</option>
            <option value="Academic">Academic</option>
            <option value="Mental">Mental</option>
            <option value="Physical">Physical</option>
          </select>
        </div>

        {loading ? (
          <div className="p-8 text-center">Loading your motivation...</div>
        ) : randomAccomplishment ? (
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-100 fade-in">
            <div className="flex justify-between items-start mb-4">
              <span className={`inline-block px-3 py-1 text-xs rounded-full ${
                randomAccomplishment.category === 'Academic' ? 'bg-blue-100 text-blue-800' :
                randomAccomplishment.category === 'Mental' ? 'bg-purple-100 text-purple-800' :
                'bg-green-100 text-green-800'
              }`}>
                {randomAccomplishment.category}
              </span>
              <button 
                onClick={refreshAccomplishment}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Refresh
              </button>
            </div>
            
            <div className="text-center">
              <p className="text-lg font-medium mb-2">Remember when you:</p>
              <p className="text-xl italic mb-4">"{randomAccomplishment.text}"</p>
              <p className="text-sm text-gray-500">
                {new Date(randomAccomplishment.date).toLocaleDateString()}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center bg-yellow-50 rounded-lg border border-yellow-100">
            <p className="text-gray-600 mb-4">No accomplishments found in this category.</p>
            <a 
              href="/dashboard/add" 
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Your First Accomplishment
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;