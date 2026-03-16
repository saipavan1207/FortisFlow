/**
 * SMS Transaction Parser
 * Extracts transaction data from Indian bank SMS messages.
 */
import { categorizeMerchant } from './categorizeMerchant';

// Common Indian bank SMS patterns
const DEBIT_PATTERNS = [
    // "Rs. 450 debited from A/C XXXX via UPI to Swiggy on 12 Mar"
    /(?:rs\.?|inr|₹)\s*([\d,]+\.?\d*)\s*(?:has been |is |was )?(?:debited|spent|withdrawn|paid)/i,
    // "You've spent Rs 123 at Merchant"
    /(?:spent|paid|debited)\s*(?:rs\.?|inr|₹)\s*([\d,]+\.?\d*)/i,
    // "Transaction of Rs 500 done"
    /(?:transaction|txn|purchase)\s*(?:of\s*)?(?:rs\.?|inr|₹)\s*([\d,]+\.?\d*)/i,
    // "HDFC: Rs 1,200.00 debited"
    /(?:rs\.?|inr|₹)\s*([\d,]+\.?\d*).*?(?:debited|withdrawn|spent)/i,
];

const CREDIT_PATTERNS = [
    /(?:rs\.?|inr|₹)\s*([\d,]+\.?\d*)\s*(?:has been |is |was )?(?:credited|received|deposited)/i,
    /(?:credited|received|deposited)\s*(?:rs\.?|inr|₹)\s*([\d,]+\.?\d*)/i,
    /(?:rs\.?|inr|₹)\s*([\d,]+\.?\d*).*?(?:credited|received)/i,
];

const MERCHANT_PATTERNS = [
    /(?:to|at|via\s+upi\s+to|towards|for)\s+([A-Za-z][A-Za-z0-9\s&'./-]{1,40}?)(?:\s+on|\s+ref|\s+avl|\s*\.|\s*$)/i,
    /(?:from|by)\s+([A-Za-z][A-Za-z0-9\s&'./-]{1,40}?)(?:\s+on|\s+ref|\s*\.|\s*$)/i,
    /VPA\s+([a-zA-Z0-9._@-]+)/i,
];

const DATE_PATTERNS = [
    /(\d{1,2}[\s/-](?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s/-]?\d{0,4})/i,
    /(\d{1,2}[\s/-]\d{1,2}[\s/-]\d{2,4})/,
    /on\s+(\d{1,2}[\s/-]\d{1,2}[\s/-]\d{2,4})/i,
];

const MONTH_MAP = {
    jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
    jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12'
};

function parseAmount(str) {
    if (!str) return 0;
    return parseFloat(str.replace(/,/g, '')) || 0;
}

function parseDate(sms) {
    for (const pattern of DATE_PATTERNS) {
        const match = sms.match(pattern);
        if (match) {
            let dateStr = match[1].trim();

            // Try "12 Mar 2024" or "12-Mar-24" format
            const namedMonth = dateStr.match(/(\d{1,2})[\s/-](\w{3})\w*[\s/-]?(\d{0,4})/i);
            if (namedMonth) {
                const day = namedMonth[1].padStart(2, '0');
                const monthKey = namedMonth[2].toLowerCase().slice(0, 3);
                const month = MONTH_MAP[monthKey] || '01';
                let year = namedMonth[3] || new Date().getFullYear().toString();
                if (year.length === 2) year = '20' + year;
                if (!year || year.length < 4) year = new Date().getFullYear().toString();
                return `${year}-${month}-${day}`;
            }

            // Try numeric dd/mm/yyyy
            const numDate = dateStr.match(/(\d{1,2})[\s/-](\d{1,2})[\s/-](\d{2,4})/);
            if (numDate) {
                const day = numDate[1].padStart(2, '0');
                const month = numDate[2].padStart(2, '0');
                let year = numDate[3];
                if (year.length === 2) year = '20' + year;
                return `${year}-${month}-${day}`;
            }
        }
    }
    return new Date().toISOString().split('T')[0]; // fallback to today
}

function extractMerchant(sms) {
    for (const pattern of MERCHANT_PATTERNS) {
        const match = sms.match(pattern);
        if (match) {
            let merchant = match[1].trim();
            // Clean up common suffixes
            merchant = merchant.replace(/\s*(ref|avl|bal|upi|a\/c|ac\b).*/i, '').trim();
            if (merchant.length > 2) return merchant;
        }
    }
    return 'Unknown';
}

/**
 * Parse a single SMS message into a transaction object.
 */
function parseSingleSms(sms) {
    if (!sms || sms.trim().length < 10) return null;

    let amount = 0;
    let type = 'expense';

    // Check credit patterns first
    for (const pattern of CREDIT_PATTERNS) {
        const match = sms.match(pattern);
        if (match) {
            amount = parseAmount(match[1]);
            type = 'income';
            break;
        }
    }

    // If no credit match, check debit
    if (amount === 0) {
        for (const pattern of DEBIT_PATTERNS) {
            const match = sms.match(pattern);
            if (match) {
                amount = parseAmount(match[1]);
                type = 'expense';
                break;
            }
        }
    }

    if (amount === 0) return null; // Not a transaction SMS

    const merchant = extractMerchant(sms);
    const date = parseDate(sms);
    let category;
    try {
        category = categorizeMerchant(merchant);
    } catch {
        category = 'Other';
    }

    return {
        id: crypto.randomUUID(),
        amount,
        type,
        merchant,
        date,
        category,
        originalSms: sms.trim(),
    };
}

/**
 * Parse multiple SMS messages (separated by newlines).
 * Returns an array of parsed transaction objects.
 */
export function parseSmsMessages(rawText) {
    if (!rawText || !rawText.trim()) return [];

    // Split by double newlines or by lines that look like separate messages
    const messages = rawText
        .split(/\n\s*\n|\n(?=[A-Z]{2,}[-:])|(?<=\.)\s*\n/)
        .map(m => m.trim())
        .filter(m => m.length > 10);

    const transactions = [];
    for (const msg of messages) {
        const parsed = parseSingleSms(msg);
        if (parsed) {
            transactions.push(parsed);
        }
    }
    return transactions;
}

export default parseSmsMessages;
