import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { TrendingUp, Users, Calendar } from 'lucide-react';

export default function AdminAnalytics({ members = [], bookings = [] }) {
  const [filter, setFilter] = useState('all');

  // Filter Data based on time selection (Weekly, Monthly, All)
  const filterByDate = (items) => {
    if (filter === 'all') return items;
    const now = new Date();
    const days = filter === 'weekly' ? 7 : 30;
    const cutoff = new Date(now.setDate(now.getDate() - days));

    return items.filter((item) => {
      const itemDate = new Date(item.createdAt || item.date || Date.now());
      return itemDate >= cutoff;
    });
  };

  const filteredMembers = filterByDate(members);
  const filteredBookings = filterByDate(bookings);

  // Calculate Distribution per Plan Tier
  const planCounts = {};
  
  // Count from members active plans
  filteredMembers.forEach((member) => {
    const plan = member.activePlan || member.plan || 'Basic Access';
    planCounts[plan] = (planCounts[plan] || 0) + 1;
  });

  // Count from trial bookings if available
  filteredBookings.forEach((booking) => {
    const plan = booking.selectedPlan || 'Free Trial';
    planCounts[plan] = (planCounts[plan] || 0) + 1;
  });

  // Convert object to Recharts array format
  const chartData = Object.keys(planCounts).map((planName) => ({
    name: planName,
    value: planCounts[planName]
  }));

  // Fallback default data if MongoDB is empty (For immediate visual preview)
  const displayData = chartData.length > 0 ? chartData : [
    { name: 'Free Trial', value: 12 },
    { name: 'Basic Access', value: 8 },
    { name: 'Pro Athlete', value: 15 },
    { name: 'VIP Elite', value: 5 }
  ];

  // Modern Amber & Dark Theme Colors
  const COLORS = ['#f59e0b', '#10b981', '#6366f1', '#ec4899', '#8b5cf6'];

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl mb-8 shadow-xl">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-extrabold text-white">Membership Plan Analytics</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Visual breakdown of member plan subscriptions & trial distributions.
          </p>
        </div>

        {/* Filter Toggle Dropdown */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <Calendar className="w-4 h-4 text-slate-400 ml-2" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-transparent text-amber-500 text-xs font-bold px-2 py-1 focus:outline-none cursor-pointer"
          >
            <option value="weekly" className="bg-slate-900 text-white">This Week</option>
            <option value="monthly" className="bg-slate-900 text-white">This Month</option>
            <option value="all" className="bg-slate-900 text-white">All Time</option>
          </select>
        </div>
      </div>

      {/* Pie Chart Section */}
      <div className="h-72 w-full relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={displayData}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={6}
              dataKey="value"
            >
              {displayData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  stroke="#020617" 
                  strokeWidth={3}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#020617',
                borderColor: '#334155',
                borderRadius: '12px',
                fontSize: '12px',
                color: '#fff',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)'
              }}
              formatter={(value) => [`${value} Members`, 'Count']}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} 
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}