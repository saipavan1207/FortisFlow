import React, { useState, useRef, useEffect } from 'react';
import { Download, Sparkles, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

import AnalyticsFilters from '../components/analytics/AnalyticsFilters';
import AnalyticsKPIs from '../components/analytics/AnalyticsKPIs';
import AnalyticsCharts from '../components/analytics/AnalyticsCharts';
import DownloadReportModal from '../components/analytics/DownloadReportModal';
import { useAnalyticsData } from '../hooks/useAnalyticsData';

const Analytics = () => {
    // Default filter state
    const [filters, setFilters] = useState({
        timeGroup: 'month',
        startDate: new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString().split('T')[0], // Last 6 months
        endDate: new Date().toISOString().split('T')[0],
        categoryFilter: null
    });

    const reportRef = useRef(null);
    const { data, loading, error, hasData, transactions } = useAnalyticsData(filters);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) setUserId(user.id);
        };
        fetchUser();
    }, []);

    const handleDownloadReport = () => {
        if (!transactions || transactions.length === 0) {
            alert("No data to export");
            return;
        }
        setIsModalOpen(true);
    };



    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Financial Analytics</h1>
                    <p className="text-zinc-400 mt-1">Deep dive into your spending habits and income trends.</p>
                </div>
                
                <button 
                    onClick={handleDownloadReport}
                    className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl border border-white/10 transition-colors disabled:opacity-50"
                >
                    <Download className="w-4 h-4" />
                    <span className="text-sm font-semibold">Download Report</span>
                </button>
            </div>

            <AnalyticsFilters filters={filters} setFilters={setFilters} />



            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">{error}</span>
                </div>
            )}

            {/* Container to be captured for PDF */}
            <div ref={reportRef} className="relative rounded-3xl" style={{ backgroundColor: '#0c0c0e' }}>
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                        <p className="text-zinc-400 font-medium">Crunching the numbers...</p>
                    </div>
                ) : !hasData ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
                            <Sparkles className="w-8 h-8 text-zinc-600" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No transactions yet</h3>
                        <p className="text-zinc-500 max-w-sm">
                            Add some transactions or adjust your date filters to see your financial analytics and insights.
                        </p>
                    </div>
                ) : (
                    <>
                        <AnalyticsKPIs kpis={data.kpis} categoryFilter={filters.categoryFilter} />
                        <AnalyticsCharts 
                            timeSeries={data.timeSeries}
                            categoryBreakdown={data.categoryBreakdown}
                            subcategoryBreakdown={data.subcategoryBreakdown}
                        />
                    </>
                )}
            </div>

            <DownloadReportModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                userId={userId}
            />
        </div>
    );
};

export default Analytics;
