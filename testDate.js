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
    "Rs.45000.00 credited to A/c XX1234 via NEFT from SALARY on 01-Jan-25. Avl Bal: Rs.52340.21",
    "Rs.12000.00 debited from A/c XX1234 via UPI to RENT OWNER on 02-Jan-25. Ref: 501234567890",
    "Rs.1345.00 debited via UPI to SWIGGY on 05-Jan-25. Ref No: 501245678901",
    "Rs.2899.00 spent on HDFC Card XX5678 at AMAZON on 08-Jan-25. Txn ID: 8899001122",
    "Rs.499.00 debited for NETFLIX subscription on 10-Jan-25.",
    "Rs.890.00 debited via UPI to UBER INDIA on 12-Jan-25.",
    "Rs.2100.00 debited for BESCOM ELECTRICITY BILL on 15-Jan-25.",
    "Rs.1650.00 debited via UPI to APOLLO PHARMACY on 18-Jan-25.",
    "Rs.45000.00 credited via NEFT SALARY on 01-Feb-25.",
    "Rs.12000.00 debited via UPI to HOUSE RENT on 02-Feb-25.",
    "Rs.2450.00 debited via UPI to ZOMATO on 06-Feb-25.",
    "Rs.5200.00 spent on ICICI Card XX8899 at FLIPKART on 10-Feb-25.",
    "Rs.199.00 debited SPOTIFY subscription on 12-Feb-25.",
    "Rs.1200.00 debited via UPI to OLA CABS on 15-Feb-25.",
    "Rs.2300.00 debited ELECTRICITY BILL on 18-Feb-25.",
    "Rs.2100.00 debited via UPI to MEDPLUS PHARMACY on 20-Feb-25.",
    "Rs.45000.00 credited SALARY on 01-Mar-25.",
    "Rs.12000.00 rent paid via UPI on 02-Mar-25.",
    "Rs.3000.00 debited via UPI to AMAZON on 05-Mar-25.",
    "Rs.2500.00 debited SWIGGY on 08-Mar-25.",
    "Rs.799.00 NETFLIX subscription on 10-Mar-25.",
    "Rs.1300.00 UBER ride on 12-Mar-25.",
    "Rs.2400.00 ELECTRICITY BILL on 15-Mar-25.",
    "Rs.1800.00 HOSPITAL payment on 18-Mar-25.",
    "Rs.45000.00 credited SALARY on 01-Apr-25.",
    "Rs.12000.00 debited RENT on 02-Apr-25.",
    "Rs.4000.00 spent at RELIANCE DIGITAL on 06-Apr-25.",
    "Rs.2800.00 ZOMATO payment on 09-Apr-25.",
    "Rs.499.00 SPOTIFY on 11-Apr-25.",
    "Rs.1200.00 OLA rides on 14-Apr-25.",
    "Rs.2500.00 ELECTRICITY BILL on 18-Apr-25.",
    "Rs.2000.00 MEDICAL STORE on 20-Apr-25.",
    "Rs.45000.00 credited SALARY on 01-May-25.",
    "Rs.12000.00 RENT paid on 02-May-25.",
    "Rs.5000.00 AMAZON shopping on 05-May-25.",
    "Rs.3000.00 SWIGGY on 08-May-25.",
    "Rs.799.00 NETFLIX on 10-May-25.",
    "Rs.1500.00 UBER on 12-May-25.",
    "Rs.2600.00 ELECTRICITY BILL on 15-May-25.",
    "Rs.2200.00 HOSPITAL on 18-May-25.",
    "Rs.45000.00 credited SALARY on 01-Jun-25.",
    "Rs.12000.00 RENT on 02-Jun-25.",
    "Rs.6000.00 MAKEMYTRIP booking on 06-Jun-25.",
    "Rs.3500.00 ZOMATO on 09-Jun-25.",
    "Rs.199.00 SPOTIFY on 11-Jun-25.",
    "Rs.1800.00 OLA rides on 14-Jun-25.",
    "Rs.2700.00 ELECTRICITY BILL on 18-Jun-25.",
    "Rs.2500.00 MEDICAL STORE on 20-Jun-25.",
    "Rs.45000.00 credited SALARY on 01-Jul-25.",
    "Rs.12000.00 RENT on 02-Jul-25.",
    "Rs.7000.00 AMAZON on 05-Jul-25.",
    "Rs.3800.00 SWIGGY on 08-Jul-25.",
    "Rs.799.00 NETFLIX on 10-Jul-25.",
    "Rs.2000.00 UBER on 12-Jul-25.",
    "Rs.2800.00 ELECTRICITY BILL on 15-Jul-25.",
    "Rs.2800.00 HOSPITAL on 18-Jul-25.",
    "Rs.45000.00 credited SALARY on 01-Aug-25.",
    "Rs.12000.00 RENT on 02-Aug-25.",
    "Rs.8000.00 FLIPKART on 05-Aug-25.",
    "Rs.4000.00 ZOMATO on 08-Aug-25.",
    "Rs.199.00 SPOTIFY on 10-Aug-25.",
    "Rs.2200.00 OLA on 12-Aug-25.",
    "Rs.2900.00 ELECTRICITY BILL on 15-Aug-25.",
    "Rs.3000.00 MEDICAL STORE on 18-Aug-25.",
    "Rs.45000.00 credited SALARY on 01-Sep-25.",
    "Rs.12000.00 RENT on 02-Sep-25.",
    "Rs.9000.00 AMAZON on 05-Sep-25.",
    "Rs.4500.00 SWIGGY on 08-Sep-25.",
    "Rs.799.00 NETFLIX on 10-Sep-25.",
    "Rs.2400.00 UBER on 12-Sep-25.",
    "Rs.3000.00 ELECTRICITY BILL on 15-Sep-25.",
    "Rs.3200.00 HOSPITAL on 18-Sep-25.",
    "Rs.45000.00 credited SALARY on 01-Oct-25.",
    "Rs.12000.00 RENT on 02-Oct-25.",
    "Rs.10000.00 AMAZON on 05-Oct-25.",
    "Rs.4800.00 SWIGGY on 08-Oct-25.",
    "Rs.799.00 NETFLIX on 10-Oct-25.",
    "Rs.2600.00 UBER on 12-Oct-25.",
    "Rs.3100.00 ELECTRICITY BILL on 15-Oct-25.",
    "Rs.3500.00 MEDICAL STORE on 18-Oct-25.",
    "Rs.45000.00 credited SALARY on 01-Nov-25.",
    "Rs.12000.00 RENT on 02-Nov-25.",
    "Rs.11000.00 FLIPKART on 05-Nov-25.",
    "Rs.5000.00 ZOMATO on 08-Nov-25.",
    "Rs.199.00 SPOTIFY on 10-Nov-25.",
    "Rs.2800.00 OLA on 12-Nov-25.",
    "Rs.3200.00 ELECTRICITY BILL on 15-Nov-25.",
    "Rs.3800.00 HOSPITAL on 18-Nov-25.",
    "Rs.45000.00 credited SALARY on 01-Dec-25.",
    "Rs.12000.00 RENT on 02-Dec-25.",
    "Rs.12000.00 AMAZON on 05-Dec-25.",
    "Rs.5500.00 SWIGGY on 08-Dec-25.",
    "Rs.799.00 NETFLIX on 10-Dec-25.",
    "Rs.3000.00 UBER on 12-Dec-25.",
    "Rs.3300.00 ELECTRICITY BILL on 15-Dec-25.",
    "Rs.4000.00 MEDICAL STORE on 18-Dec-25.",
    "Rs.50000.00 credited SALARY on 01-Jan-26.",
    "Rs.15000.00 RENT on 02-Jan-26.",
    "Rs.3200.00 SWIGGY on 05-Jan-26.",
    "Rs.7800.00 AMAZON on 08-Jan-26.",
    "Rs.499.00 NETFLIX on 10-Jan-26.",
    "Rs.1500.00 UBER on 12-Jan-26.",
    "Rs.2600.00 ELECTRICITY BILL on 15-Jan-26.",
    "Rs.2400.00 APOLLO PHARMACY on 18-Jan-26.",
    "Rs.50000.00 credited SALARY on 01-Feb-26.",
    "Rs.15000.00 RENT on 02-Feb-26.",
    "Rs.9500.00 MAKEMYTRIP on 06-Feb-26.",
    "Rs.4200.00 ZOMATO on 09-Feb-26.",
    "Rs.799.00 NETFLIX on 12-Feb-26.",
    "Rs.2800.00 HOSPITAL on 14-Feb-26.",
    "Rs.2700.00 ELECTRICITY BILL on 18-Feb-26.",
    "Rs.1800.00 UBER on 20-Feb-26.",
    "Rs.50000.00 credited SALARY on 01-Mar-26.",
    "Rs.15000.00 RENT on 02-Mar-26.",
    "Rs.12500.00 AMAZON on 05-Mar-26.",
    "Rs.4500.00 SWIGGY on 08-Mar-26.",
    "Rs.1200.00 NETFLIX + SPOTIFY on 10-Mar-26.",
    "Rs.9200.00 INDIGO AIRLINES on 15-Mar-26.",
    "Rs.3000.00 ELECTRICITY BILL on 18-Mar-26.",
    "Rs.2000.00 OLA on 20-Mar-26."
];

smss.forEach(s => console.log(parseDate(s)));
