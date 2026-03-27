import fs from 'fs';

const DATE_PATTERNS = [
    /(\d{1,2}[\s/-](?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s/-]?\d{0,4})/i,
    /(\d{1,2}[\s/-]\d{1,2}[\s/-]\d{2,4})/,
    /on\s+(\d{1,2}[\s/-]\d{1,2}[\s/-]\d{2,4})/i,
];

const MONTH_MAP = {
    jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
    jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12'
};

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

const smss = [
    "Rs. 45,000.00 credited to A/C XXXX1234 by NEFT from SALARY on 01 Oct 23. Avl Bal Rs. 55,000.00",
    "Rs. 1,200.00 spent on HDFC Card ending 5678 at AMAZON on 05 Oct 23.",
    "Rs. 450.00 debited from A/C XXXX1234 via UPI to SWIGGY on 12 Oct 23. Avl Bal Rs. 53,350.00",
    "Rs. 45,000.00 credited to A/C XXXX1234 by NEFT from SALARY on 01 Nov 23. Avl Bal Rs. 60,000.00"
];

smss.forEach(s => console.log(parseDate(s)));
