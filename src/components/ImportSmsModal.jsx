import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, MessageSquare, ChevronRight, Loader2,
    CheckCircle2, ArrowUpRight, ArrowDownLeft,
    Building2, Sparkles, AlertCircle, TrendingUp,
    TrendingDown, BarChart3
} from 'lucide-react';
import { parseSmsMessages } from '../lib/smsParser';
import { bulkAddTransactions } from '../services/transactions';

const BANKS = [
    { id: 'HDFC', label: 'HDFC Bank' },
    { id: 'ICICI', label: 'ICICI Bank' },
    { id: 'SBI', label: 'SBI' },
    { id: 'Axis', label: 'Axis Bank' },
    { id: 'Kotak', label: 'Kotak Mahindra' },
    { id: 'UPI', label: 'UPI' },
    { id: 'Other', label: 'Other' },
];

const CATEGORIES = [
    'Food', 'Shopping', 'Transport', 'Bills',
    'Subscriptions', 'Entertainment', 'Health', 'Travel', 'Other'
];

const EXAMPLE_SMS = `Rs. 45,000.00 credited to A/C XXXX1234 by NEFT from SALARY on 01 Oct 25. Avl Bal Rs. 55,000.00

Rs. 220.00 debited from A/C XXXX1234 via UPI to SWIGGY on 02 Oct 25. Avl Bal Rs. 54,780.00
Rs. 480.00 debited from A/C XXXX1234 via UPI to DOMINOS on 03 Oct 25. Avl Bal Rs. 54,300.00
Rs. 650.00 debited from A/C XXXX1234 via UPI to ZOMATO on 04 Oct 25. Avl Bal Rs. 53,650.00
Rs. 320.00 debited from A/C XXXX1234 via UPI to BURGER KING on 05 Oct 25. Avl Bal Rs. 53,330.00
Rs. 540.00 debited from A/C XXXX1234 via UPI to SWIGGY on 06 Oct 25. Avl Bal Rs. 52,790.00
Rs. 780.00 debited from A/C XXXX1234 via UPI to DOMINOS on 07 Oct 25. Avl Bal Rs. 52,010.00
Rs. 450.00 debited from A/C XXXX1234 via UPI to ZOMATO on 08 Oct 25. Avl Bal Rs. 51,560.00
Rs. 690.00 debited from A/C XXXX1234 via UPI to SWIGGY on 09 Oct 25. Avl Bal Rs. 50,870.00
Rs. 520.00 debited from A/C XXXX1234 via UPI to BURGER KING on 10 Oct 25. Avl Bal Rs. 50,350.00
Rs. 880.00 debited from A/C XXXX1234 via UPI to DOMINOS on 11 Oct 25. Avl Bal Rs. 49,470.00
Rs. 120.00 debited from A/C XXXX1234 via UPI to UBER on 02 Oct 25. Avl Bal Rs. 49,350.00
Rs. 240.00 debited from A/C XXXX1234 via UPI to OLA on 03 Oct 25. Avl Bal Rs. 49,110.00
Rs. 180.00 debited from A/C XXXX1234 via UPI to UBER on 04 Oct 25. Avl Bal Rs. 48,930.00
Rs. 300.00 debited from A/C XXXX1234 via UPI to OLA on 06 Oct 25. Avl Bal Rs. 48,630.00
Rs. 210.00 debited from A/C XXXX1234 via UPI to UBER on 07 Oct 25. Avl Bal Rs. 48,420.00
Rs. 350.00 debited from A/C XXXX1234 via UPI to OLA on 09 Oct 25. Avl Bal Rs. 48,070.00
Rs. 190.00 debited from A/C XXXX1234 via UPI to UBER on 11 Oct 25. Avl Bal Rs. 47,880.00
Rs. 400.00 debited from A/C XXXX1234 via UPI to OLA on 13 Oct 25. Avl Bal Rs. 47,480.00
Rs. 220.00 debited from A/C XXXX1234 via UPI to UBER on 15 Oct 25. Avl Bal Rs. 47,260.00
Rs. 330.00 debited from A/C XXXX1234 via UPI to OLA on 18 Oct 25. Avl Bal Rs. 46,930.00
Rs. 1,200.00 spent on HDFC Card ending 5678 at AMAZON on 05 Oct 25.
Rs. 2,300.00 spent on HDFC Card ending 5678 at FLIPKART on 10 Oct 25.
Rs. 850.00 spent on HDFC Card ending 5678 at MYNTRA on 14 Oct 25.

Rs. 45,000.00 credited to A/C XXXX1234 by NEFT from SALARY on 01 Nov 25. Avl Bal Rs. 60,000.00

Rs. 700.00 debited from A/C XXXX1234 via UPI to SWIGGY on 02 Nov 25. Avl Bal Rs. 59,300.00
Rs. 950.00 debited from A/C XXXX1234 via UPI to DOMINOS on 03 Nov 25. Avl Bal Rs. 58,350.00
Rs. 1,200.00 debited from A/C XXXX1234 via UPI to ZOMATO on 04 Nov 25. Avl Bal Rs. 57,150.00
Rs. 650.00 debited from A/C XXXX1234 via UPI to BURGER KING on 05 Nov 25. Avl Bal Rs. 56,500.00
Rs. 1,100.00 debited from A/C XXXX1234 via UPI to SWIGGY on 06 Nov 25. Avl Bal Rs. 55,400.00
Rs. 900.00 debited from A/C XXXX1234 via UPI to DOMINOS on 07 Nov 25. Avl Bal Rs. 54,500.00
Rs. 1,300.00 debited from A/C XXXX1234 via UPI to ZOMATO on 08 Nov 25. Avl Bal Rs. 53,200.00
Rs. 850.00 debited from A/C XXXX1234 via UPI to SWIGGY on 09 Nov 25. Avl Bal Rs. 52,350.00
Rs. 750.00 debited from A/C XXXX1234 via UPI to BURGER KING on 10 Nov 25. Avl Bal Rs. 51,600.00
Rs. 1,400.00 debited from A/C XXXX1234 via UPI to DOMINOS on 11 Nov 25. Avl Bal Rs. 50,200.00
Rs. 220.00 debited from A/C XXXX1234 via UPI to OLA on 02 Nov 25. Avl Bal Rs. 49,980.00
Rs. 350.00 debited from A/C XXXX1234 via UPI to UBER on 03 Nov 25. Avl Bal Rs. 49,630.00
Rs. 420.00 debited from A/C XXXX1234 via UPI to OLA on 04 Nov 25. Avl Bal Rs. 49,210.00
Rs. 280.00 debited from A/C XXXX1234 via UPI to UBER on 05 Nov 25. Avl Bal Rs. 48,930.00
Rs. 500.00 debited from A/C XXXX1234 via UPI to OLA on 06 Nov 25. Avl Bal Rs. 48,430.00
Rs. 310.00 debited from A/C XXXX1234 via UPI to UBER on 07 Nov 25. Avl Bal Rs. 48,120.00
Rs. 450.00 debited from A/C XXXX1234 via UPI to OLA on 08 Nov 25. Avl Bal Rs. 47,670.00
Rs. 390.00 debited from A/C XXXX1234 via UPI to UBER on 09 Nov 25. Avl Bal Rs. 47,280.00
Rs. 600.00 debited from A/C XXXX1234 via UPI to OLA on 10 Nov 25. Avl Bal Rs. 46,680.00
Rs. 250.00 debited from A/C XXXX1234 via UPI to UBER on 11 Nov 25. Avl Bal Rs. 46,430.00
Rs. 4,500.00 spent on HDFC Card ending 5678 at AMAZON on 12 Nov 25.
Rs. 3,800.00 spent on HDFC Card ending 5678 at FLIPKART on 14 Nov 25.
Rs. 2,200.00 spent on HDFC Card ending 5678 at MYNTRA on 16 Nov 25.
Rs. 5,000.00 spent on HDFC Card ending 5678 at RELIANCE DIGITAL on 18 Nov 25.

Rs. 45,000.00 credited to A/C XXXX1234 by NEFT from SALARY on 01 Dec 25. Avl Bal Rs. 62,000.00

Rs. 300.00 debited from A/C XXXX1234 via UPI to SWIGGY on 02 Dec 25. Avl Bal Rs. 61,700.00
Rs. 720.00 debited from A/C XXXX1234 via UPI to DOMINOS on 03 Dec 25. Avl Bal Rs. 60,980.00
Rs. 980.00 debited from A/C XXXX1234 via UPI to ZOMATO on 04 Dec 25. Avl Bal Rs. 60,000.00
Rs. 450.00 debited from A/C XXXX1234 via UPI to BURGER KING on 05 Dec 25. Avl Bal Rs. 59,550.00
Rs. 650.00 debited from A/C XXXX1234 via UPI to SWIGGY on 06 Dec 25. Avl Bal Rs. 58,900.00
Rs. 880.00 debited from A/C XXXX1234 via UPI to DOMINOS on 07 Dec 25. Avl Bal Rs. 58,020.00
Rs. 520.00 debited from A/C XXXX1234 via UPI to ZOMATO on 08 Dec 25. Avl Bal Rs. 57,500.00
Rs. 760.00 debited from A/C XXXX1234 via UPI to SWIGGY on 09 Dec 25. Avl Bal Rs. 56,740.00
Rs. 410.00 debited from A/C XXXX1234 via UPI to BURGER KING on 10 Dec 25. Avl Bal Rs. 56,330.00
Rs. 990.00 debited from A/C XXXX1234 via UPI to DOMINOS on 11 Dec 25. Avl Bal Rs. 55,340.00

Rs. 150.00 debited from A/C XXXX1234 via UPI to UBER on 02 Dec 25. Avl Bal Rs. 55,190.00
Rs. 260.00 debited from A/C XXXX1234 via UPI to OLA on 03 Dec 25. Avl Bal Rs. 54,930.00
Rs. 200.00 debited from A/C XXXX1234 via UPI to UBER on 04 Dec 25. Avl Bal Rs. 54,730.00
Rs. 310.00 debited from A/C XXXX1234 via UPI to OLA on 06 Dec 25. Avl Bal Rs. 54,420.00
Rs. 230.00 debited from A/C XXXX1234 via UPI to UBER on 07 Dec 25. Avl Bal Rs. 54,190.00
Rs. 370.00 debited from A/C XXXX1234 via UPI to OLA on 08 Dec 25. Avl Bal Rs. 53,820.00
Rs. 210.00 debited from A/C XXXX1234 via UPI to UBER on 10 Dec 25. Avl Bal Rs. 53,610.00
Rs. 420.00 debited from A/C XXXX1234 via UPI to OLA on 12 Dec 25. Avl Bal Rs. 53,190.00
Rs. 240.00 debited from A/C XXXX1234 via UPI to UBER on 14 Dec 25. Avl Bal Rs. 52,950.00
Rs. 360.00 debited from A/C XXXX1234 via UPI to OLA on 16 Dec 25. Avl Bal Rs. 52,590.00

Rs. 1,100.00 spent on HDFC Card ending 5678 at AMAZON on 05 Dec 25.
Rs. 2,400.00 spent on HDFC Card ending 5678 at FLIPKART on 10 Dec 25.
Rs. 900.00 spent on HDFC Card ending 5678 at MYNTRA on 15 Dec 25.
Rs. 1,300.00 spent on HDFC Card ending 5678 at BIGBASKET on 20 Dec 25.

Rs. 45,000.00 credited to A/C XXXX1234 by NEFT from SALARY on 01 Jan 26. Avl Bal Rs. 65,000.00

Rs. 260.00 debited from A/C XXXX1234 via UPI to SWIGGY on 02 Jan 26. Avl Bal Rs. 64,740.00
Rs. 520.00 debited from A/C XXXX1234 via UPI to DOMINOS on 03 Jan 26. Avl Bal Rs. 64,220.00
Rs. 700.00 debited from A/C XXXX1234 via UPI to ZOMATO on 04 Jan 26. Avl Bal Rs. 63,520.00
Rs. 350.00 debited from A/C XXXX1234 via UPI to BURGER KING on 05 Jan 26. Avl Bal Rs. 63,170.00
Rs. 620.00 debited from A/C XXXX1234 via UPI to SWIGGY on 06 Jan 26. Avl Bal Rs. 62,550.00
Rs. 910.00 debited from A/C XXXX1234 via UPI to DOMINOS on 07 Jan 26. Avl Bal Rs. 61,640.00
Rs. 480.00 debited from A/C XXXX1234 via UPI to ZOMATO on 08 Jan 26. Avl Bal Rs. 61,160.00
Rs. 760.00 debited from A/C XXXX1234 via UPI to SWIGGY on 09 Jan 26. Avl Bal Rs. 60,400.00
Rs. 430.00 debited from A/C XXXX1234 via UPI to BURGER KING on 10 Jan 26. Avl Bal Rs. 59,970.00
Rs. 880.00 debited from A/C XXXX1234 via UPI to DOMINOS on 11 Jan 26. Avl Bal Rs. 59,090.00

Rs. 140.00 debited from A/C XXXX1234 via UPI to UBER on 02 Jan 26. Avl Bal Rs. 58,950.00
Rs. 280.00 debited from A/C XXXX1234 via UPI to OLA on 03 Jan 26. Avl Bal Rs. 58,670.00
Rs. 210.00 debited from A/C XXXX1234 via UPI to UBER on 04 Jan 26. Avl Bal Rs. 58,460.00
Rs. 320.00 debited from A/C XXXX1234 via UPI to OLA on 06 Jan 26. Avl Bal Rs. 58,140.00
Rs. 240.00 debited from A/C XXXX1234 via UPI to UBER on 07 Jan 26. Avl Bal Rs. 57,900.00
Rs. 390.00 debited from A/C XXXX1234 via UPI to OLA on 08 Jan 26. Avl Bal Rs. 57,510.00
Rs. 220.00 debited from A/C XXXX1234 via UPI to UBER on 10 Jan 26. Avl Bal Rs. 57,290.00
Rs. 410.00 debited from A/C XXXX1234 via UPI to OLA on 12 Jan 26. Avl Bal Rs. 56,880.00
Rs. 260.00 debited from A/C XXXX1234 via UPI to UBER on 14 Jan 26. Avl Bal Rs. 56,620.00
Rs. 370.00 debited from A/C XXXX1234 via UPI to OLA on 16 Jan 26. Avl Bal Rs. 56,250.00

Rs. 1,500.00 spent on HDFC Card ending 5678 at AMAZON on 05 Jan 26.
Rs. 2,600.00 spent on HDFC Card ending 5678 at FLIPKART on 10 Jan 26.
Rs. 950.00 spent on HDFC Card ending 5678 at MYNTRA on 15 Jan 26.

Rs. 45,000.00 credited to A/C XXXX1234 by NEFT from SALARY on 01 Feb 26. Avl Bal Rs. 68,000.00

Rs. 500.00 debited from A/C XXXX1234 via UPI to SWIGGY on 02 Feb 26. Avl Bal Rs. 67,500.00
Rs. 950.00 debited from A/C XXXX1234 via UPI to DOMINOS on 03 Feb 26. Avl Bal Rs. 66,550.00
Rs. 1,200.00 debited from A/C XXXX1234 via UPI to ZOMATO on 04 Feb 26. Avl Bal Rs. 65,350.00
Rs. 650.00 debited from A/C XXXX1234 via UPI to BURGER KING on 05 Feb 26. Avl Bal Rs. 64,700.00
Rs. 1,300.00 debited from A/C XXXX1234 via UPI to SWIGGY on 06 Feb 26. Avl Bal Rs. 63,400.00
Rs. 1,100.00 debited from A/C XXXX1234 via UPI to DOMINOS on 07 Feb 26. Avl Bal Rs. 62,300.00
Rs. 900.00 debited from A/C XXXX1234 via UPI to ZOMATO on 08 Feb 26. Avl Bal Rs. 61,400.00
Rs. 1,400.00 debited from A/C XXXX1234 via UPI to SWIGGY on 09 Feb 26. Avl Bal Rs. 60,000.00
Rs. 850.00 debited from A/C XXXX1234 via UPI to BURGER KING on 10 Feb 26. Avl Bal Rs. 59,150.00
Rs. 1,200.00 debited from A/C XXXX1234 via UPI to DOMINOS on 11 Feb 26. Avl Bal Rs. 57,950.00

Rs. 200.00 debited from A/C XXXX1234 via UPI to UBER on 02 Feb 26. Avl Bal Rs. 57,750.00
Rs. 320.00 debited from A/C XXXX1234 via UPI to OLA on 03 Feb 26. Avl Bal Rs. 57,430.00
Rs. 280.00 debited from A/C XXXX1234 via UPI to UBER on 04 Feb 26. Avl Bal Rs. 57,150.00
Rs. 450.00 debited from A/C XXXX1234 via UPI to OLA on 05 Feb 26. Avl Bal Rs. 56,700.00
Rs. 310.00 debited from A/C XXXX1234 via UPI to UBER on 06 Feb 26. Avl Bal Rs. 56,390.00
Rs. 500.00 debited from A/C XXXX1234 via UPI to OLA on 07 Feb 26. Avl Bal Rs. 55,890.00
Rs. 270.00 debited from A/C XXXX1234 via UPI to UBER on 08 Feb 26. Avl Bal Rs. 55,620.00
Rs. 480.00 debited from A/C XXXX1234 via UPI to OLA on 09 Feb 26. Avl Bal Rs. 55,140.00
Rs. 350.00 debited from A/C XXXX1234 via UPI to UBER on 10 Feb 26. Avl Bal Rs. 54,790.00
Rs. 520.00 debited from A/C XXXX1234 via UPI to OLA on 11 Feb 26. Avl Bal Rs. 54,270.00

Rs. 3,000.00 spent on HDFC Card ending 5678 at MAKEMYTRIP on 18 Feb 26.
Rs. 4,500.00 spent on HDFC Card ending 5678 at APPLE STORE on 24 Feb 26.

Rs. 45,000.00 credited to A/C XXXX1234 by NEFT from SALARY on 01 Mar 26. Avl Bal Rs. 70,000.00

Rs. 450.00 debited from A/C XXXX1234 via UPI to SWIGGY on 02 Mar 26. Avl Bal Rs. 69,550.00
Rs. 780.00 debited from A/C XXXX1234 via UPI to DOMINOS on 03 Mar 26. Avl Bal Rs. 68,770.00
Rs. 950.00 debited from A/C XXXX1234 via UPI to ZOMATO on 04 Mar 26. Avl Bal Rs. 67,820.00
Rs. 500.00 debited from A/C XXXX1234 via UPI to BURGER KING on 05 Mar 26. Avl Bal Rs. 67,320.00
Rs. 700.00 debited from A/C XXXX1234 via UPI to SWIGGY on 06 Mar 26. Avl Bal Rs. 66,620.00
Rs. 980.00 debited from A/C XXXX1234 via UPI to DOMINOS on 07 Mar 26. Avl Bal Rs. 65,640.00
Rs. 650.00 debited from A/C XXXX1234 via UPI to ZOMATO on 08 Mar 26. Avl Bal Rs. 64,990.00
Rs. 820.00 debited from A/C XXXX1234 via UPI to SWIGGY on 09 Mar 26. Avl Bal Rs. 64,170.00
Rs. 540.00 debited from A/C XXXX1234 via UPI to BURGER KING on 10 Mar 26. Avl Bal Rs. 63,630.00
Rs. 1,050.00 debited from A/C XXXX1234 via UPI to DOMINOS on 11 Mar 26. Avl Bal Rs. 62,580.00

Rs. 220.00 debited from A/C XXXX1234 via UPI to UBER on 02 Mar 26. Avl Bal Rs. 62,360.00
Rs. 340.00 debited from A/C XXXX1234 via UPI to OLA on 03 Mar 26. Avl Bal Rs. 62,020.00
Rs. 280.00 debited from A/C XXXX1234 via UPI to UBER on 04 Mar 26. Avl Bal Rs. 61,740.00
Rs. 450.00 debited from A/C XXXX1234 via UPI to OLA on 05 Mar 26. Avl Bal Rs. 61,290.00
Rs. 300.00 debited from A/C XXXX1234 via UPI to UBER on 06 Mar 26. Avl Bal Rs. 60,990.00
Rs. 500.00 debited from A/C XXXX1234 via UPI to OLA on 07 Mar 26. Avl Bal Rs. 60,490.00
Rs. 260.00 debited from A/C XXXX1234 via UPI to UBER on 08 Mar 26. Avl Bal Rs. 60,230.00
Rs. 480.00 debited from A/C XXXX1234 via UPI to OLA on 09 Mar 26. Avl Bal Rs. 59,750.00
Rs. 350.00 debited from A/C XXXX1234 via UPI to UBER on 10 Mar 26. Avl Bal Rs. 59,400.00
Rs. 520.00 debited from A/C XXXX1234 via UPI to OLA on 11 Mar 26. Avl Bal Rs. 58,880.00

Rs. 5,000.00 spent on HDFC Card ending 5678 at AMAZON on 15 Mar 26.
Rs. 8,000.00 spent on HDFC Card ending 5678 at INDIGO AIRLINES on 20 Mar 26.

Rs. 45,000.00 credited to A/C XXXX1234 by NEFT from SALARY on 01 Apr 26. Avl Bal Rs. 72,000.00

Rs. 300.00 debited from A/C XXXX1234 via UPI to SWIGGY on 02 Apr 26. Avl Bal Rs. 71,700.00
Rs. 550.00 debited from A/C XXXX1234 via UPI to DOMINOS on 03 Apr 26. Avl Bal Rs. 71,150.00
Rs. 700.00 debited from A/C XXXX1234 via UPI to ZOMATO on 04 Apr 26. Avl Bal Rs. 70,450.00
Rs. 350.00 debited from A/C XXXX1234 via UPI to BURGER KING on 05 Apr 26. Avl Bal Rs. 70,100.00
Rs. 600.00 debited from A/C XXXX1234 via UPI to SWIGGY on 06 Apr 26. Avl Bal Rs. 69,500.00
Rs. 800.00 debited from A/C XXXX1234 via UPI to DOMINOS on 07 Apr 26. Avl Bal Rs. 68,700.00
Rs. 500.00 debited from A/C XXXX1234 via UPI to ZOMATO on 08 Apr 26. Avl Bal Rs. 68,200.00
Rs. 750.00 debited from A/C XXXX1234 via UPI to SWIGGY on 09 Apr 26. Avl Bal Rs. 67,450.00
Rs. 420.00 debited from A/C XXXX1234 via UPI to BURGER KING on 10 Apr 26. Avl Bal Rs. 67,030.00
Rs. 880.00 debited from A/C XXXX1234 via UPI to DOMINOS on 11 Apr 26. Avl Bal Rs. 66,150.00

Rs. 200.00 debited from A/C XXXX1234 via UPI to UBER on 02 Apr 26. Avl Bal Rs. 65,950.00
Rs. 300.00 debited from A/C XXXX1234 via UPI to OLA on 03 Apr 26. Avl Bal Rs. 65,650.00
Rs. 250.00 debited from A/C XXXX1234 via UPI to UBER on 04 Apr 26. Avl Bal Rs. 65,400.00
Rs. 350.00 debited from A/C XXXX1234 via UPI to OLA on 05 Apr 26. Avl Bal Rs. 65,050.00
Rs. 270.00 debited from A/C XXXX1234 via UPI to UBER on 06 Apr 26. Avl Bal Rs. 64,780.00
Rs. 400.00 debited from A/C XXXX1234 via UPI to OLA on 07 Apr 26. Avl Bal Rs. 64,380.00
Rs. 230.00 debited from A/C XXXX1234 via UPI to UBER on 08 Apr 26. Avl Bal Rs. 64,150.00
Rs. 420.00 debited from A/C XXXX1234 via UPI to OLA on 09 Apr 26. Avl Bal Rs. 63,730.00
Rs. 300.00 debited from A/C XXXX1234 via UPI to UBER on 10 Apr 26. Avl Bal Rs. 63,430.00
Rs. 450.00 debited from A/C XXXX1234 via UPI to OLA on 11 Apr 26. Avl Bal Rs. 62,980.00

Rs. 2,200.00 spent on HDFC Card ending 5678 at FLIPKART on 14 Apr 26.
Rs. 1,800.00 spent on HDFC Card ending 5678 at AMAZON on 18 Apr 26.

Rs. 45,000.00 credited to A/C XXXX1234 by NEFT from SALARY on 01 May 26. Avl Bal Rs. 75,000.00

Rs. 500.00 debited from A/C XXXX1234 via UPI to SWIGGY on 02 May 26. Avl Bal Rs. 74,500.00
Rs. 850.00 debited from A/C XXXX1234 via UPI to DOMINOS on 03 May 26. Avl Bal Rs. 73,650.00
Rs. 1,200.00 debited from A/C XXXX1234 via UPI to ZOMATO on 04 May 26. Avl Bal Rs. 72,450.00
Rs. 650.00 debited from A/C XXXX1234 via UPI to BURGER KING on 05 May 26. Avl Bal Rs. 71,800.00
Rs. 1,300.00 debited from A/C XXXX1234 via UPI to SWIGGY on 06 May 26. Avl Bal Rs. 70,500.00
Rs. 1,100.00 debited from A/C XXXX1234 via UPI to DOMINOS on 07 May 26. Avl Bal Rs. 69,400.00
Rs. 900.00 debited from A/C XXXX1234 via UPI to ZOMATO on 08 May 26. Avl Bal Rs. 68,500.00
Rs. 1,400.00 debited from A/C XXXX1234 via UPI to SWIGGY on 09 May 26. Avl Bal Rs. 67,100.00
Rs. 750.00 debited from A/C XXXX1234 via UPI to BURGER KING on 10 May 26. Avl Bal Rs. 66,350.00
Rs. 1,200.00 debited from A/C XXXX1234 via UPI to DOMINOS on 11 May 26. Avl Bal Rs. 65,150.00

Rs. 220.00 debited from A/C XXXX1234 via UPI to UBER on 02 May 26. Avl Bal Rs. 64,930.00
Rs. 340.00 debited from A/C XXXX1234 via UPI to OLA on 03 May 26. Avl Bal Rs. 64,590.00
Rs. 280.00 debited from A/C XXXX1234 via UPI to UBER on 04 May 26. Avl Bal Rs. 64,310.00
Rs. 450.00 debited from A/C XXXX1234 via UPI to OLA on 05 May 26. Avl Bal Rs. 63,860.00
Rs. 300.00 debited from A/C XXXX1234 via UPI to UBER on 06 May 26. Avl Bal Rs. 63,560.00
Rs. 500.00 debited from A/C XXXX1234 via UPI to OLA on 07 May 26. Avl Bal Rs. 63,060.00
Rs. 260.00 debited from A/C XXXX1234 via UPI to UBER on 08 May 26. Avl Bal Rs. 62,800.00
Rs. 480.00 debited from A/C XXXX1234 via UPI to OLA on 09 May 26. Avl Bal Rs. 62,320.00
Rs. 350.00 debited from A/C XXXX1234 via UPI to UBER on 10 May 26. Avl Bal Rs. 61,970.00
Rs. 520.00 debited from A/C XXXX1234 via UPI to OLA on 11 May 26. Avl Bal Rs. 61,450.00

Rs. 3,500.00 spent on HDFC Card ending 5678 at FLIPKART on 18 May 26.
Rs. 2,800.00 spent on HDFC Card ending 5678 at MYNTRA on 22 May 26.`;

// ── Stepper ──────────────────────────────────────────
const StepIndicator = ({ currentStep }) => {
    const steps = [
        { num: 1, label: 'Paste SMS' },
        { num: 2, label: 'Preview' },
    ];

    return (
        <div className="flex items-center justify-center gap-2 mb-6">
            {steps.map((step, idx) => (
                <React.Fragment key={step.num}>
                    <div className="flex items-center gap-2">
                        <div className={`
                            w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                            ${currentStep > step.num
                                ? 'bg-orange-500 text-white shadow-[0_0_12px_rgba(234,88,12,0.4)]'
                                : currentStep === step.num
                                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40 shadow-[0_0_12px_rgba(234,88,12,0.2)]'
                                    : 'bg-zinc-800/50 text-zinc-600 border border-zinc-700/50'
                            }
                        `}>
                            {currentStep > step.num ? (
                                <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : step.num}
                        </div>
                        <span className={`text-xs font-medium tracking-wide transition-colors duration-300 ${currentStep >= step.num ? 'text-zinc-300' : 'text-zinc-600'}`}>
                            {step.label}
                        </span>
                    </div>
                    {idx < steps.length - 1 && (
                        <div className={`w-8 h-[1px] transition-colors duration-300 ${currentStep > step.num ? 'bg-orange-500/50' : 'bg-zinc-800'}`} />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

// ── Summary Card ─────────────────────────────────────
const SummaryCard = ({ transactions }) => {
    const summary = useMemo(() => {
        const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
        const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
        return { income, expenses, total: transactions.length };
    }, [transactions]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-3 gap-3 mb-4"
        >
            <div className="p-3 rounded-xl bg-zinc-900/40 border border-white/[0.04]">
                <div className="flex items-center gap-1.5 mb-1">
                    <BarChart3 className="w-3 h-3 text-zinc-500" />
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Records</span>
                </div>
                <p className="text-lg font-bold text-white">{summary.total}</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/10">
                <div className="flex items-center gap-1.5 mb-1">
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                    <span className="text-[10px] font-bold text-emerald-500/70 uppercase tracking-wider">Income</span>
                </div>
                <p className="text-lg font-bold text-emerald-400">₹{summary.income.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-xl bg-rose-500/[0.04] border border-rose-500/10">
                <div className="flex items-center gap-1.5 mb-1">
                    <TrendingDown className="w-3 h-3 text-rose-500" />
                    <span className="text-[10px] font-bold text-rose-500/70 uppercase tracking-wider">Expenses</span>
                </div>
                <p className="text-lg font-bold text-rose-400">₹{summary.expenses.toLocaleString()}</p>
            </div>
        </motion.div>
    );
};

// ── Main Modal ───────────────────────────────────────
const ImportSmsModal = ({ isOpen, onClose, onSuccess }) => {
    const [step, setStep] = useState(1);
    const [smsText, setSmsText] = useState('');
    const [parsedTransactions, setParsedTransactions] = useState([]);
    const [parsing, setParsing] = useState(false);
    const [importing, setImporting] = useState(false);
    const [parseComplete, setParseComplete] = useState(false);
    const [error, setError] = useState(null);
    const [importSuccess, setImportSuccess] = useState(false);

    const resetModal = useCallback(() => {
        setStep(1);
        setSmsText('');
        setParsedTransactions([]);
        setParsing(false);
        setImporting(false);
        setParseComplete(false);
        setError(null);
        setImportSuccess(false);
    }, []);

    const handleClose = () => {
        resetModal();
        onClose();
    };

    const handleNextStep = () => {
        if (step === 1 && smsText.trim().length < 10) {
            setError('Please paste at least one SMS message.');
            return;
        }
        setError(null);
        setStep(prev => Math.min(prev + 1, 2));
    };

    const handlePrevStep = () => {
        setError(null);
        if (step === 2) {
            setParseComplete(false);
            setParsedTransactions([]);
        }
        setStep(prev => Math.max(prev - 1, 1));
    };

    const handleParse = async () => {
        setParsing(true);
        setError(null);
        setParseComplete(false);

        await new Promise(r => setTimeout(r, 600));

        try {
            const results = parseSmsMessages(smsText);
            if (results.length === 0) {
                setError('No transactions could be extracted. Please check the SMS format and try again.');
            } else {
                setParsedTransactions(results);
                setParseComplete(true);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to parse SMS messages. Please try a different format.');
        } finally {
            setParsing(false);
        }
    };

    const handleCategoryChange = (id, newCategory) => {
        setParsedTransactions(prev =>
            prev.map(t => t.id === id ? { ...t, category: newCategory } : t)
        );
    };

    const handleAccountChange = (id, newAccount) => {
        setParsedTransactions(prev =>
            prev.map(t => t.id === id ? { ...t, account_source: newAccount } : t)
        );
    };

    const handleRemoveTransaction = (id) => {
        setParsedTransactions(prev => prev.filter(t => t.id !== id));
    };

    const handleImport = async () => {
        if (parsedTransactions.length === 0) return;

        setImporting(true);
        setError(null);

        try {
            // Prepare transactions for bulk insert
            const txnsToInsert = parsedTransactions.map(txn => ({
                amount: txn.amount,
                type: txn.type,
                merchant: txn.merchant,
                category: txn.category,
                date: txn.date,
                description: `SMS Import: ${txn.originalSms?.substring(0, 100) || ''}`,
                source: txn.account_source || 'sms',
            }));

            const { error: apiError } = await bulkAddTransactions(txnsToInsert);

            if (apiError) throw apiError;

            setImportSuccess(true);
            setTimeout(() => {
                onSuccess?.();
                handleClose();
            }, 1800);
        } catch (err) {
            console.error(err);
            setError(`Import failed: ${err.message || 'Unable to save transactions. Please try again.'}`);
        } finally {
            setImporting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
                onClick={handleClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    onClick={e => e.stopPropagation()}
                    className="bg-[#0c0c0e] border border-white/[0.06] rounded-2xl w-full max-w-[660px] shadow-[0_25px_80px_rgba(0,0,0,0.7)] overflow-hidden relative"
                >
                    {/* Orange glow accent */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-orange-500/10 blur-3xl rounded-full pointer-events-none" />

                    {/* ── Header ─────────────────────────── */}
                    <div className="relative px-6 pt-6 pb-4 border-b border-white/[0.04]">
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 p-1.5 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 relative">
                                <div className="absolute inset-0 rounded-xl bg-orange-500/5 blur-sm" />
                                <MessageSquare className="w-5 h-5 text-orange-400 relative z-10" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white tracking-tight">
                                    Import Transactions from SMS
                                </h2>
                                <p className="text-xs text-zinc-500 mt-0.5">
                                    Securely import your bank transaction messages to automatically track expenses and income.
                                </p>
                            </div>
                        </div>

                        <StepIndicator currentStep={step} />
                    </div>

                    {/* ── Body ────────────────────────────── */}
                    <div className="px-6 py-5 max-h-[56vh] overflow-y-auto custom-scrollbar">
                        <AnimatePresence mode="wait">
                            {/* ━━ STEP 1: Paste SMS ━━ */}
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">
                                        Paste SMS Messages
                                    </label>
                                    <p className="text-[11px] text-zinc-600 mb-3">
                                        Paste one or multiple bank SMS messages separated by blank lines.
                                    </p>
                                    <textarea
                                        value={smsText}
                                        onChange={e => { setSmsText(e.target.value); setError(null); }}
                                        rows={7}
                                        className="w-full bg-zinc-900/50 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white font-mono leading-relaxed focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/40 outline-none transition-all placeholder:text-zinc-600 resize-none"
                                        placeholder={"Rs. 450 debited from A/C XXXX via UPI to Swiggy on 12 Mar.\n\nRs. 1200 credited to A/C XXXX by NEFT on 01 Mar."}
                                    />

                                    {/* Example format hint */}
                                    <div className="mt-3 p-3 rounded-lg bg-zinc-900/40 border border-white/[0.04]">
                                        <div className="flex items-center gap-1.5 mb-2">
                                            <Sparkles className="w-3 h-3 text-orange-400" />
                                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                                Supported Formats
                                            </span>
                                        </div>
                                        <div className="space-y-1.5">
                                            <p className="text-[11px] text-zinc-600 font-mono">
                                                • Rs. 450 debited from A/C XXXX via UPI to SWIGGY on 12 Mar 26.
                                            </p>
                                            <p className="text-[11px] text-zinc-600 font-mono">
                                                • Rs. 25,000 credited to A/C XXXX by NEFT from SALARY on 01 Mar 26.
                                            </p>
                                            <p className="text-[11px] text-zinc-600 font-mono">
                                                • Rs.150 spent on Card ending 5678 at Amazon on 10 Mar.
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setSmsText(EXAMPLE_SMS)}
                                        className="mt-2 text-[11px] text-orange-400/70 hover:text-orange-400 transition-colors cursor-pointer"
                                    >
                                        ↳ Load sample SMS for testing
                                    </button>
                                </motion.div>
                            )}

                            {/* ━━ STEP 2: Parse & Preview ━━ */}
                            {step === 2 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {/* Parse button (before extraction) */}
                                    {!parseComplete && (
                                        <div className="text-center py-6">
                                            <button
                                                type="button"
                                                onClick={handleParse}
                                                disabled={parsing}
                                                className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-b from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold text-sm rounded-xl transition-all duration-200 shadow-[0_4px_20px_rgba(234,88,12,0.3)] hover:shadow-[0_4px_28px_rgba(234,88,12,0.4)] disabled:opacity-60 disabled:cursor-not-allowed"
                                            >
                                                {parsing ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        Extracting Transactions...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Sparkles className="w-4 h-4" />
                                                        Extract Transactions
                                                    </>
                                                )}
                                            </button>
                                            <p className="text-[11px] text-zinc-600 mt-3">
                                                We&apos;ll analyze your SMS messages and extract transaction data
                                            </p>
                                        </div>
                                    )}

                                    {/* Parsed Results */}
                                    {parseComplete && parsedTransactions.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {/* Summary Card */}
                                            <SummaryCard transactions={parsedTransactions} />

                                            {/* Success badge */}
                                            <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                                <span className="text-xs font-medium text-emerald-400">
                                                    {parsedTransactions.length} transaction{parsedTransactions.length !== 1 ? 's' : ''} extracted successfully
                                                </span>
                                            </div>

                                            {/* Preview Table */}
                                            <div className="rounded-xl border border-white/[0.04] overflow-hidden">
                                                <table className="w-full text-left">
                                                    <thead>
                                                        <tr className="border-b border-white/[0.04] bg-zinc-900/30">
                                                            <th className="px-3 py-2.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Date</th>
                                                            <th className="px-3 py-2.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Merchant</th>
                                                            <th className="px-3 py-2.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Amount</th>
                                                            <th className="px-3 py-2.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Type</th>
                                                            <th className="px-3 py-2.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Account</th>
                                                            <th className="px-3 py-2.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Category</th>
                                                            <th className="px-2 py-2.5 w-6"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {parsedTransactions.map((txn, i) => (
                                                            <motion.tr
                                                                key={txn.id}
                                                                initial={{ opacity: 0, y: 6 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: i * 0.06 }}
                                                                className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors"
                                                            >
                                                                <td className="px-3 py-2.5 text-xs text-zinc-400 font-mono">
                                                                    {txn.date}
                                                                </td>
                                                                <td className="px-3 py-2.5 text-xs text-white font-medium max-w-[120px] truncate">
                                                                    {txn.merchant}
                                                                </td>
                                                                <td className={`px-3 py-2.5 text-xs font-bold ${txn.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                                    ₹{txn.amount.toLocaleString()}
                                                                </td>
                                                                <td className="px-3 py-2.5">
                                                                    <span className={`
                                                                        inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider
                                                                        ${txn.type === 'income'
                                                                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                                                        }
                                                                    `}>
                                                                        {txn.type === 'income'
                                                                            ? <ArrowDownLeft className="w-2.5 h-2.5" />
                                                                            : <ArrowUpRight className="w-2.5 h-2.5" />
                                                                        }
                                                                        {txn.type}
                                                                    </span>
                                                                </td>
                                                                <td className="px-3 py-2.5">
                                                                    <select
                                                                        value={txn.account_source || 'Other'}
                                                                        onChange={e => handleAccountChange(txn.id, e.target.value)}
                                                                        className="bg-zinc-800/50 border border-white/[0.06] rounded-md px-2 py-1 text-[11px] text-zinc-300 outline-none cursor-pointer appearance-none hover:border-white/[0.1] transition-colors"
                                                                    >
                                                                        {BANKS.map(b => (
                                                                            <option key={b.id} value={b.id} className="bg-zinc-900">{b.label}</option>
                                                                        ))}
                                                                    </select>
                                                                </td>
                                                                <td className="px-3 py-2.5">
                                                                    <select
                                                                        value={txn.category}
                                                                        onChange={e => handleCategoryChange(txn.id, e.target.value)}
                                                                        className="bg-zinc-800/50 border border-white/[0.06] rounded-md px-2 py-1 text-[11px] text-zinc-300 outline-none cursor-pointer appearance-none hover:border-white/[0.1] transition-colors"
                                                                    >
                                                                        {CATEGORIES.map(cat => (
                                                                            <option key={cat} value={cat} className="bg-zinc-900">{cat}</option>
                                                                        ))}
                                                                    </select>
                                                                </td>
                                                                <td className="px-2 py-2.5">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleRemoveTransaction(txn.id)}
                                                                        className="text-zinc-600 hover:text-rose-400 transition-colors"
                                                                    >
                                                                        <X className="w-3 h-3" />
                                                                    </button>
                                                                </td>
                                                            </motion.tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Error Alert */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 flex items-center gap-2 px-3 py-2.5 bg-rose-500/10 border border-rose-500/20 rounded-lg"
                            >
                                <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                                <span className="text-xs text-rose-400">{error}</span>
                            </motion.div>
                        )}

                        {/* Import Success Overlay */}
                        {importSuccess && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute inset-0 bg-[#0c0c0e]/95 flex flex-col items-center justify-center z-20 rounded-2xl"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                                >
                                    <CheckCircle2 className="w-14 h-14 text-emerald-400 mb-4" />
                                </motion.div>
                                <h3 className="text-lg font-bold text-white mb-1">Transactions Imported!</h3>
                                <p className="text-sm text-zinc-500">
                                    {parsedTransactions.length} transaction{parsedTransactions.length !== 1 ? 's' : ''} added successfully.
                                </p>
                                <div className="mt-3 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                    <span className="text-xs font-medium text-emerald-400">
                                        ✓ Dashboard will refresh automatically
                                    </span>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* ── Footer ──────────────────────────── */}
                    <div className="px-6 py-4 border-t border-white/[0.04] flex items-center justify-between">
                        <button
                            type="button"
                            onClick={step === 1 ? handleClose : handlePrevStep}
                            className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-200"
                        >
                            {step === 1 ? 'Cancel' : 'Back'}
                        </button>

                        <div className="flex items-center gap-2">
                            {step < 2 && (
                                <button
                                    type="button"
                                    onClick={handleNextStep}
                                    className="inline-flex items-center gap-1.5 px-5 py-2 bg-white/[0.06] hover:bg-white/[0.1] text-white text-sm font-medium rounded-lg border border-white/[0.06] hover:border-white/[0.1] transition-all duration-200"
                                >
                                    Next
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                            )}

                            {step === 2 && parseComplete && parsedTransactions.length > 0 && (
                                <button
                                    type="button"
                                    onClick={handleImport}
                                    disabled={importing}
                                    className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-b from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white text-sm font-bold rounded-lg transition-all duration-200 shadow-[0_4px_16px_rgba(234,88,12,0.3)] disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {importing ? (
                                        <>
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            Importing...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            Import {parsedTransactions.length} Transaction{parsedTransactions.length !== 1 ? 's' : ''}
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ImportSmsModal;
