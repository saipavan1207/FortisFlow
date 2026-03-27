export function detectBank(smsText) {
    if (!smsText) return 'Other';
    const text = smsText.toLowerCase();
    
    if (text.includes('hdfc')) return 'HDFC';
    if (text.includes('sbi')) return 'SBI';
    if (text.includes('icici')) return 'ICICI';
    if (text.includes('axis')) return 'Axis';
    if (text.includes('kotak')) return 'Kotak';
    if (text.includes('upi')) return 'UPI';
    
    return 'Other';
}
