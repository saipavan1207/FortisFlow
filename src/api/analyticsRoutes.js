import express from 'express';
import { Pool } from 'pg';

const router = express.Router();

// Initialize PostgreSQL connection pool
// Note: Read these values from environment variables in production
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

/**
 * Middleware to extract user_id from the authenticated request.
 * Assuming authentication middleware is already in place.
 */
const requireAuth = (req, res, next) => {
    // req.user = { id: 'uuid-here' }; // Example of populated user object
    if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};

/**
 * 1. GET /analytics/category-expense
 * Return total expense grouped by category for the current month.
 */
router.get('/analytics/category-expense', requireAuth, async (req, res) => {
    const userId = req.user.id;
    
    // Configurable time frame (default to current month)
    const startDate = req.query.startDate || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
    const endDate = req.query.endDate || new Date().toISOString();

    const query = `
        SELECT 
            category, 
            SUM(amount) as total_amount
        FROM 
            transactions
        WHERE 
            user_id = $1 
            AND type = 'debit'
            AND transaction_date >= $2
            AND transaction_date <= $3
        GROUP BY 
            category
        ORDER BY 
            total_amount DESC;
    `;

    try {
        const { rows } = await pool.query(query, [userId, startDate, endDate]);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching category expenses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * 2. GET /analytics/monthly-trend
 * Return monthly spending totals for the last 6 months.
 */
router.get('/analytics/monthly-trend', requireAuth, async (req, res) => {
    const userId = req.user.id;

    const query = `
        SELECT 
            TO_CHAR(transaction_date, 'YYYY-MM') as month_year,
            SUM(CASE WHEN type = 'debit' THEN amount ELSE 0 END) as total_expense,
            SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END) as total_income
        FROM 
            transactions
        WHERE 
            user_id = $1
            AND transaction_date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '5 months')
        GROUP BY 
            TO_CHAR(transaction_date, 'YYYY-MM')
        ORDER BY 
            month_year ASC;
    `;

    try {
        const { rows } = await pool.query(query, [userId]);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching monthly trends:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * 3. GET /analytics/top-merchants
 * Return top 5 merchants by spending volume over the last 30 days.
 */
router.get('/analytics/top-merchants', requireAuth, async (req, res) => {
    const userId = req.user.id;

    const query = `
        SELECT 
            merchant, 
            SUM(amount) as total_spent,
            COUNT(*) as transaction_count
        FROM 
            transactions
        WHERE 
            user_id = $1 
            AND type = 'debit'
            AND transaction_date >= CURRENT_DATE - INTERVAL '30 days'
        GROUP BY 
            merchant
        ORDER BY 
            total_spent DESC
        LIMIT 5;
    `;

    try {
        const { rows } = await pool.query(query, [userId]);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching top merchants:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * 4. GET /analytics/recent-transactions
 * Return last 10 transactions.
 */
router.get('/analytics/recent-transactions', requireAuth, async (req, res) => {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 10;

    const query = `
        SELECT 
            id, amount, type, merchant, category, account_source, transaction_date
        FROM 
            transactions
        WHERE 
            user_id = $1
        ORDER BY 
            transaction_date DESC, created_at DESC
        LIMIT $2;
    `;

    try {
        const { rows } = await pool.query(query, [userId, limit]);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching recent transactions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * 5. GET /analytics/income-expense
 * Return total income, total expense, and savings for the current month.
 */
router.get('/analytics/income-expense', requireAuth, async (req, res) => {
    const userId = req.user.id;
    
    // Default to current month
    const startDate = req.query.startDate || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
    const endDate = req.query.endDate || new Date().toISOString();

    const query = `
        WITH monthly_stats AS (
            SELECT 
                SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END) as total_income,
                SUM(CASE WHEN type = 'debit' THEN amount ELSE 0 END) as total_expense
            FROM 
                transactions
            WHERE 
                user_id = $1
                AND transaction_date >= $2
                AND transaction_date <= $3
        )
        SELECT 
            COALESCE(total_income, 0) as total_income,
            COALESCE(total_expense, 0) as total_expense,
            COALESCE(total_income, 0) - COALESCE(total_expense, 0) as net_savings
        FROM 
            monthly_stats;
    `;

    try {
        const { rows } = await pool.query(query, [userId, startDate, endDate]);
        // rows[0] will always exist due to the aggregate functions, but values might be null if no records
        res.json(rows[0] || { total_income: 0, total_expense: 0, net_savings: 0 });
    } catch (error) {
        console.error('Error fetching income vs expense stats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
