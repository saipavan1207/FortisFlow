import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { TrendingUp } from 'lucide-react';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#64748b'];

/** Safe currency formatter — never shows NaN */
const formatINR = (val) => {
    const n = Number(val);
    if (!isFinite(n) || isNaN(n)) return '₹0';
    if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(1)}L`;
    if (n >= 1_000) return `₹${(n / 1_000).toFixed(1)}k`;
    return `₹${Math.round(n).toLocaleString('en-IN')}`;
};

const CustomLineTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-zinc-900 border border-white/10 p-3 rounded-lg shadow-xl min-w-[160px]">
                <p className="text-zinc-300 font-semibold mb-2 text-sm">{label}</p>
                {payload.map((entry, index) => (
                    <div key={`item-${index}`} className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-xs text-zinc-400">{entry.name}</span>
                        </div>
                        <span className="text-sm font-bold" style={{ color: entry.color }}>
                            {formatINR(entry.value)}
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-zinc-900 border border-white/10 p-3 rounded-lg shadow-xl">
                <p className="text-zinc-300 font-semibold mb-1 text-sm">{label}</p>
                {payload.map((entry, index) => (
                    <p key={`item-${index}`} className="text-sm font-bold" style={{ color: entry.color }}>
                        {formatINR(entry.value)}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const EmptyChart = ({ message = 'No data available for this period.' }) => (
    <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
        <TrendingUp className="w-8 h-8 text-zinc-700" />
        <p className="text-zinc-500 text-sm">{message}</p>
    </div>
);

const AnalyticsCharts = ({ timeSeries = [], categoryBreakdown = [], subcategoryBreakdown = [] }) => {
    // Validate time series — filter out any rows with non-finite income/expense
    const safeTimeSeries = (timeSeries || []).filter(
        row => isFinite(row.income) && isFinite(row.expense)
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ── Line Chart: Income vs Expense over time ── */}
            <div className="bg-zinc-950/50 p-5 rounded-2xl border border-white/5 lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white">Income vs Expense Trend</h3>
                    <span className="text-xs text-zinc-500 font-medium">
                        {safeTimeSeries.length} month{safeTimeSeries.length !== 1 ? 's' : ''} of data
                    </span>
                </div>
                <div className="h-80 w-full">
                    {safeTimeSeries.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={safeTimeSeries}
                                margin={{ top: 5, right: 30, bottom: 5, left: 10 }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#ffffff10"
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="period"
                                    stroke="#ffffff40"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: '#a1a1aa' }}
                                />
                                <YAxis
                                    stroke="#ffffff40"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={formatINR}
                                    tick={{ fill: '#a1a1aa' }}
                                    width={60}
                                />
                                <RechartsTooltip
                                    content={<CustomLineTooltip />}
                                    cursor={{ stroke: '#ffffff15', strokeWidth: 1 }}
                                />
                                <Legend
                                    wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="income"
                                    name="Income"
                                    stroke="#10b981"
                                    strokeWidth={2.5}
                                    dot={{ fill: '#10b981', r: 3 }}
                                    activeDot={{ r: 5 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="expense"
                                    name="Expense"
                                    stroke="#f43f5e"
                                    strokeWidth={2.5}
                                    dot={{ fill: '#f43f5e', r: 3 }}
                                    activeDot={{ r: 5 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <EmptyChart message="No transaction data for the selected date range." />
                    )}
                </div>
            </div>

            {/* ── Donut Chart: Category Distribution ── */}
            <div className="bg-zinc-950/50 p-5 rounded-2xl border border-white/5">
                <h3 className="text-lg font-bold text-white mb-6">Expense by Category</h3>
                <div className="h-72 w-full">
                    {categoryBreakdown.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryBreakdown}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={65}
                                    outerRadius={95}
                                    paddingAngle={3}
                                    dataKey="amount"
                                    nameKey="category"
                                >
                                    {categoryBreakdown.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <RechartsTooltip
                                    formatter={(value, name) => [formatINR(value), name]}
                                />
                                <Legend
                                    formatter={(value) => (
                                        <span style={{ color: '#a1a1aa', fontSize: 12 }}>{value}</span>
                                    )}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <EmptyChart message="No expense category data available." />
                    )}
                </div>
            </div>

            {/* ── Bar Chart: Top Subcategories ── */}
            <div className="bg-zinc-950/50 p-5 rounded-2xl border border-white/5">
                <h3 className="text-lg font-bold text-white mb-6">Top Subcategories</h3>
                <div className="h-72 w-full">
                    {subcategoryBreakdown.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={subcategoryBreakdown.slice(0, 7)}
                                layout="vertical"
                                margin={{ top: 5, right: 30, bottom: 5, left: 40 }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#ffffff10"
                                    horizontal={false}
                                />
                                <XAxis
                                    type="number"
                                    stroke="#ffffff40"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={formatINR}
                                    tick={{ fill: '#a1a1aa' }}
                                />
                                <YAxis
                                    type="category"
                                    dataKey="subcategory"
                                    stroke="#ffffff40"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: '#a1a1aa' }}
                                    width={80}
                                />
                                <RechartsTooltip
                                    content={<CustomBarTooltip />}
                                    cursor={{ fill: '#ffffff05' }}
                                />
                                <Bar dataKey="amount" name="Amount" radius={[0, 4, 4, 0]}>
                                    {subcategoryBreakdown.slice(0, 7).map((_, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <EmptyChart
                            message={
                                categoryBreakdown.length > 0
                                    ? 'No subcategory data for the selected filters.'
                                    : 'No subcategory data available.'
                            }
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsCharts;
