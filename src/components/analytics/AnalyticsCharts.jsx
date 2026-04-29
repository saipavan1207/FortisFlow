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
            <div className="bg-[#0f111a]/95 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl min-w-[180px]">
                <p className="text-zinc-400 font-medium mb-3 text-sm">{label}</p>
                <div className="space-y-2">
                    {payload.map((entry, index) => (
                        <div key={`item-${index}`} className="flex items-center justify-between gap-6">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: entry.color, boxShadow: `0 0 8px ${entry.color}60` }} />
                                <span className="text-sm font-medium text-zinc-300">{entry.name}</span>
                            </div>
                            <span className="text-sm font-bold text-white tracking-wide">
                                {formatINR(entry.value)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0];
        const color = data.payload.fill || data.color;
        return (
            <div className="bg-[#0f111a]/95 backdrop-blur-xl border border-white/10 p-3 rounded-xl shadow-2xl flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}80` }} />
                <div className="flex flex-col">
                    <span className="text-xs text-zinc-400 font-medium">{data.name}</span>
                    <span className="text-sm font-bold text-white tracking-wide">{formatINR(data.value)}</span>
                </div>
            </div>
        );
    }
    return null;
};

const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const data = payload[0];
        return (
            <div className="bg-[#0f111a]/95 backdrop-blur-xl border border-white/10 p-3 rounded-xl shadow-2xl">
                <p className="text-zinc-400 font-medium mb-1.5 text-xs">{label}</p>
                <p className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color }} />
                    {formatINR(data.value)}
                </p>
            </div>
        );
    }
    return null;
};

const EmptyChart = ({ message = 'No data available for this period.' }) => (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-center opacity-70">
        <div className="p-3 bg-white/5 rounded-2xl">
            <TrendingUp className="w-6 h-6 text-zinc-500" />
        </div>
        <p className="text-zinc-400 text-sm font-medium">{message}</p>
    </div>
);

const ChartGradients = () => (
    <defs>
        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
        </linearGradient>
        <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
        </linearGradient>
        {COLORS.map((color, index) => (
            <linearGradient key={`grad-${index}`} id={`grad-${index}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={1}/>
                <stop offset="100%" stopColor={color} stopOpacity={0.7}/>
            </linearGradient>
        ))}
    </defs>
);

const AnalyticsCharts = ({ timeSeries = [], categoryBreakdown = [], subcategoryBreakdown = [] }) => {
    // Validate time series — filter out any rows with non-finite income/expense
    const safeTimeSeries = (timeSeries || []).filter(
        row => isFinite(row.income) && isFinite(row.expense)
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ── Line Chart: Income vs Expense over time ── */}
            <div className="bg-[#0a0a0f] p-6 rounded-[24px] border border-white/[0.04] shadow-2xl lg:col-span-2 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                <div className="flex items-center justify-between mb-8 relative z-10">
                    <div>
                        <h3 className="text-xl font-bold text-white tracking-tight">Income vs Expense Trend</h3>
                        <p className="text-sm text-zinc-500 font-medium mt-1">
                            {safeTimeSeries.length} month{safeTimeSeries.length !== 1 ? 's' : ''} of data
                        </p>
                    </div>
                </div>
                <div className="h-80 w-full relative z-10">
                    {safeTimeSeries.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={safeTimeSeries}
                                margin={{ top: 5, right: 30, bottom: 5, left: 10 }}
                            >
                                <ChartGradients />
                                <CartesianGrid
                                    strokeDasharray="4 4"
                                    stroke="rgba(255,255,255,0.03)"
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="period"
                                    stroke="transparent"
                                    fontSize={12}
                                    fontWeight={500}
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: '#71717a', dy: 10 }}
                                />
                                <YAxis
                                    stroke="transparent"
                                    fontSize={12}
                                    fontWeight={500}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={formatINR}
                                    tick={{ fill: '#71717a', dx: -10 }}
                                    width={60}
                                />
                                <RechartsTooltip
                                    content={<CustomLineTooltip />}
                                    cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                <Legend
                                    wrapperStyle={{ paddingTop: '20px' }}
                                    iconType="circle"
                                    formatter={(value) => <span className="text-zinc-400 font-medium text-sm ml-1">{value}</span>}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="income"
                                    name="Income"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    dot={{ fill: '#0a0a0f', stroke: '#10b981', strokeWidth: 2, r: 4 }}
                                    activeDot={{ fill: '#10b981', stroke: '#fff', strokeWidth: 2, r: 6, style: { filter: 'drop-shadow(0 0 8px rgba(16,185,129,0.6))' } }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="expense"
                                    name="Expense"
                                    stroke="#f43f5e"
                                    strokeWidth={3}
                                    dot={{ fill: '#0a0a0f', stroke: '#f43f5e', strokeWidth: 2, r: 4 }}
                                    activeDot={{ fill: '#f43f5e', stroke: '#fff', strokeWidth: 2, r: 6, style: { filter: 'drop-shadow(0 0 8px rgba(244,63,94,0.6))' } }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <EmptyChart message="No transaction data for the selected date range." />
                    )}
                </div>
            </div>

            {/* ── Donut Chart: Category Distribution ── */}
            <div className="bg-[#0a0a0f] p-6 rounded-[24px] border border-white/[0.04] shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                <h3 className="text-xl font-bold text-white mb-6 relative z-10 tracking-tight">Expense by Category</h3>
                <div className="h-72 w-full relative z-10">
                    {categoryBreakdown.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart margin={{ top: 0, right: 0, bottom: 20, left: 0 }}>
                                <ChartGradients />
                                <Pie
                                    data={categoryBreakdown}
                                    cx="50%"
                                    cy="45%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={4}
                                    dataKey="amount"
                                    nameKey="category"
                                    stroke="transparent"
                                    cornerRadius={6}
                                >
                                    {categoryBreakdown.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={`url(#grad-${index % COLORS.length})`}
                                            style={{ outline: 'none' }}
                                        />
                                    ))}
                                </Pie>
                                <RechartsTooltip content={<CustomPieTooltip />} />
                                <Legend
                                    content={({ payload }) => (
                                        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
                                            {payload.map((entry, index) => (
                                                <div key={`legend-${index}`} className="flex items-center gap-1.5">
                                                    <div className="w-2.5 h-2.5 rounded-sm" style={{ background: entry.color }} />
                                                    <span className="text-xs font-medium text-zinc-400">{entry.value}</span>
                                                </div>
                                            ))}
                                        </div>
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
            <div className="bg-[#0a0a0f] p-6 rounded-[24px] border border-white/[0.04] shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                <h3 className="text-xl font-bold text-white mb-6 relative z-10 tracking-tight">Top Subcategories</h3>
                <div className="h-72 w-full relative z-10">
                    {subcategoryBreakdown.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={subcategoryBreakdown.slice(0, 7)}
                                layout="vertical"
                                margin={{ top: 0, right: 20, bottom: 0, left: 30 }}
                                barSize={24}
                            >
                                <ChartGradients />
                                <CartesianGrid
                                    strokeDasharray="4 4"
                                    stroke="rgba(255,255,255,0.02)"
                                    horizontal={true}
                                    vertical={false}
                                />
                                <XAxis
                                    type="number"
                                    stroke="transparent"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={formatINR}
                                    tick={{ fill: '#71717a', dy: 10 }}
                                />
                                <YAxis
                                    type="category"
                                    dataKey="subcategory"
                                    stroke="transparent"
                                    fontSize={11}
                                    fontWeight={600}
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: '#a1a1aa', dx: -15 }}
                                    width={90}
                                />
                                <RechartsTooltip
                                    content={<CustomBarTooltip />}
                                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                />
                                <Bar dataKey="amount" name="Amount" radius={[0, 12, 12, 0]}>
                                    {subcategoryBreakdown.slice(0, 7).map((_, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={`url(#grad-${index % COLORS.length})`}
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
