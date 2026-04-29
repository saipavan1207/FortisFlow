import { supabase } from '../lib/supabase';

export const fetchAnalyticsData = async ({ userId, startDate, endDate, timeGroup = 'month', categoryFilter = null }) => {
    try {
        const { data, error } = await supabase.rpc('get_analytics_data', {
            p_user_id: userId,
            p_start_date: startDate,
            p_end_date: endDate,
            p_time_group: timeGroup,
            p_category_filter: categoryFilter
        });

        if (error) {
            console.error('Error fetching analytics data from RPC:', error);
            throw error;
        }

        return data;
    } catch (err) {
        console.error('Unexpected error in fetchAnalyticsData:', err);
        throw err;
    }
};
