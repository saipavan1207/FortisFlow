import React, { useState, useEffect } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from 'recharts';
import { Loader2 } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-zinc-900 border border-white/10 p-3 rounded-lg shadow-xl backdrop-blur-xl">
        <p className="text-sm font-semibold text-white mb-1">{data.category}</p>
        <p className="text-sm text-zinc-300">
          <span className="font-medium">Total:</span> ₹{Number(data.total_amount).toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }) => {
  return (
    <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 px-2">
      {payload.map((entry, index) => (
        <li key={`item-${index}`} className="flex items-center gap-2 text-xs text-zinc-400">
          <span 
            className="block w-3 h-3 rounded-full" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="font-medium text-white/90">{entry.value}</span>
          <span className="font-bold text-white ml-1">
            ₹{Number(entry.payload.total_amount).toLocaleString()}
          </span>
        </li>
      ))}
    </ul>
  );
};

export const CategoryExpenseChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Replace with your actual auth token gathering logic
        const token = localStorage.getItem('supabase.auth.token'); 
        
        const response = await fetch('/api/analytics/category-expense', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error("Error loading category expenses:", err);
        setError("Could not load chart data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center bg-zinc-950/50 rounded-2xl border border-white/5">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error || !data || data.length === 0) {
    return (
      <div className="h-[300px] w-full flex flex-col items-center justify-center bg-zinc-950/50 rounded-2xl border border-white/5 text-zinc-500">
        <PieChart className="w-8 h-8 mb-2 opacity-50" />
        <p className="text-sm">{error || "No expense data for this period"}</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-zinc-950/50 border border-white/5 rounded-3xl p-6 group transition-colors hover:border-white/10">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white tracking-tight">Spending by Category</h3>
        <p className="text-xs text-zinc-500 mt-1">Current Month Breakdown</p>
      </div>

      <div className="h-[280px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={70}
              outerRadius={95}
              paddingAngle={4}
              dataKey="total_amount"
              nameKey="category"
              stroke="none"
              // Add a subtle pop effect on hover handled by generic CSS or Recharts defaults
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  className="hover:opacity-80 transition-opacity duration-300"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} verticalAlign="bottom" height={80} />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Label Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none -mt-[30px]">
          <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-1">Total</span>
          <span className="text-xl font-bold text-white">
            ₹{data.reduce((sum, item) => sum + Number(item.total_amount), 0).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CategoryExpenseChart;
