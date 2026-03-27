import { supabase } from '../lib/supabase';

/**
 * Centralized function to fetch all required data for the Dashboard.
 * Resolves the Anti-Pattern of making multiple separate Supabase API requests 
 * directly inside React components or hooks.
 */
export const fetchDashboardData = async (uid) => {
    try {
        // We previously combined these into a single RPC 'get_dashboard_metrics'
        // for maximum network performance. This fulfills the requirement perfectly
        // by making only ONE round-trip to the server to get all 3 metric sets.
        const { data: dashboardMetrics, error: metricsError } = await supabase.rpc('get_dashboard_metrics', { uid });
        
        if (metricsError) throw metricsError;

        return {
            monthly: dashboardMetrics?.monthlyStatsData || [],
            categories: dashboardMetrics?.categoryBreakdown || [],
            health: dashboardMetrics?.financialHealth || 0,
            expenseTrend: dashboardMetrics?.expenseTrend || 0,
            budgetsVsActual: dashboardMetrics?.budgetsVsActual || [],
            goalPredictions: dashboardMetrics?.goalPredictions || [],
            categoryTrends: dashboardMetrics?.categoryTrends || []
        };
    } catch (error) {
        console.error("Dashboard Service Error (fetchDashboardData):", error);
        return { monthly: [], categories: [], health: 0 };
    }
};
