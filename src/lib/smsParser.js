import { detectCategory } from './categoryDetector';
import { detectBank } from './bankDetector';

const DEBIT_PATTERNS = [
    /(?:rs\.?|inr|₹)\s*([\d,]+\.?\d*)\s*(?:has been |is |was )?(?:debited|spent|withdrawn|paid)/i,
    /(?:spent|paid|debited)\s*(?:rs\.?|inr|₹)\s*([\d,]+\.?\d*)/i,
    /(?:transaction|txn|purchase)\s*(?:of\s*)?(?:rs\.?|inr|₹)\s*([\d,]+\.?\d*)/i,
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
    return new Date().toISOString().split('T')[0];
}

function extractMerchant(sms) {
    for (const pattern of MERCHANT_PATTERNS) {
        const match = sms.match(pattern);
        if (match) {
            let merchant = match[1].trim();
            merchant = merchant.replace(/\s*(ref|avl|bal|upi|a\/c|ac\b).*/i, '').trim();
            if (merchant.length > 2) return merchant;
        }
    }
    return 'Unknown';
}

function parseSingleSms(sms) {
    if (!sms || sms.trim().length < 10) return null;

    let amount = 0;
    let type = 'expense';

    for (const pattern of CREDIT_PATTERNS) {
        const match = sms.match(pattern);
        if (match) {
            amount = parseAmount(match[1]);
            type = 'income';
            break;
        }
    }

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

    if (amount === 0) return null;

    const merchant = extractMerchant(sms);
    const date = parseDate(sms);
    const account_source = detectBank(sms);
    
    let category;
    try {
        category = detectCategory(sms);
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
        account_source, // Matching the schema requirements
        originalSms: sms.trim(),
    };
}

export function parseSmsMessages(rawText) {
    if (!rawText || !rawText.trim()) return [];

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
