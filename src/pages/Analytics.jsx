import React, { useState, useRef, useEffect } from 'react';
import { Download, Sparkles, AlertCircle } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { motion } from 'framer-motion';

import AnalyticsFilters from '../components/analytics/AnalyticsFilters';
import AnalyticsKPIs from '../components/analytics/AnalyticsKPIs';
import AnalyticsCharts from '../components/analytics/AnalyticsCharts';
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
    const { data, insight, loading, error, hasData } = useAnalyticsData(filters);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

    const handleDownloadReport = async () => {
        if (!reportRef.current) return;
        
        setIsGeneratingPDF(true);
        try {
            // Give time for any loading states to clear just in case
            await new Promise(resolve => setTimeout(resolve, 300));
            
            const canvas = await html2canvas(reportRef.current, {
                scale: 2,
                backgroundColor: '#0c0c0e', // match background
                useCORS: true,
                logging: false,
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`FortisFlow_Analytics_Report_${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (err) {
            console.error("Error generating PDF:", err);
            alert("Failed to generate PDF report.");
        } finally {
            setIsGeneratingPDF(false);
        }
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
                    disabled={isGeneratingPDF || loading}
                    className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl border border-white/10 transition-colors disabled:opacity-50"
                >
                    <Download className="w-4 h-4" />
                    <span className="text-sm font-semibold">{isGeneratingPDF ? 'Generating...' : 'Download Report'}</span>
                </button>
            </div>

            <AnalyticsFilters filters={filters} setFilters={setFilters} />

            {/* AI Insight Box */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-5 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-2xl border border-blue-500/20 flex gap-4 items-start relative overflow-hidden"
            >
                <div className="p-2.5 bg-blue-500/20 rounded-xl shrink-0 z-10">
                    <Sparkles className="w-5 h-5 text-blue-400" />
                </div>
                <div className="z-10 relative">
                    <h4 className="text-sm font-semibold text-blue-300 mb-1">AI Financial Insight</h4>
                    <p className="text-zinc-300 text-sm leading-relaxed">
                        {loading ? "Analyzing your financial data..." : insight}
                    </p>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full -mr-20 -mt-20"></div>
            </motion.div>

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
                        <AnalyticsKPIs kpis={data.kpis} />
                        <AnalyticsCharts 
                            timeSeries={data.timeSeries}
                            categoryBreakdown={data.categoryBreakdown}
                            subcategoryBreakdown={data.subcategoryBreakdown}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default Analytics;
