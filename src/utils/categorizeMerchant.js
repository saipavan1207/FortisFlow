// Merchant categorization utility

/**
 * Merchant categorization system with fuzzy matching and keyword mapping.
 * Used for categorizing transactions from SMS parsing or statement imports.
 */

// 1. Merchant Keyword Mapping Table
const merchantKeywords = {
  // Food & Dining
  Food: [
    'zomato', 'swiggy', 'mcdonalds', 'kfc', 'dominos', 'pizzahut', 'starbucks', 
    'burger king', 'subway', 'barbeque nation', 'cafe', 'restaurant', 'bakery', 
    'eats', 'dinner', 'lunch', 'breakfast', 'pizza', 'kitchen', 'diner', 'bistro'
  ],
  
  // Shopping & Retail
  Shopping: [
    'amazon', 'flipkart', 'myntra', 'ajio', 'nykaa', 'meesho', 'reliancesmart', 
    'dmart', 'bigbasket', 'blinkit', 'zepto', 'instamart', 'zara', 'h&m', 'shoppersstop',
    'lifestyle', 'pantaloons', 'max', 'reliance trends', 'supermarket', 'mart', 'store',
    'plaza', 'mall', 'boutique', 'apparel', 'clothing', 'shoes', 'electronics', 'grocery'
  ],
  
  // Transportation & Commute
  Transport: [
    'uber', 'ola', 'rapido', 'namma yatri', 'irctc', 'makemytrip', 'redbus', 'goibibo',
    'yatra', 'cleartrip', 'ixigo', 'flight', 'indigo', 'air india', 'spicejet', 'vistara',
    'petrol', 'diesel', 'fuel', 'hpcl', 'bpcl', 'ioc', 'shell', 'cng', 'toll', 'fastag',
    'metro', 'bus', 'train', 'parking', 'cab', 'taxi', 'ride'
  ],
  
  // Utilities & Bills
  Bills: [
    'bescom', 'tss', 'mcgm', 'water bill', 'electricity', 'power', 'torrent', 'adani',
    'tata power', 'jio', 'airtel', 'vi', 'vodafone', 'idea', 'bsnl', 'recharge', 'postpaid',
    'prepaid', 'broadband', 'act fibernet', 'hathway', 'excitel', 'gas', 'igl', 'mgl',
    'cylinder', 'insurance', 'premium', 'lic', 'emi', 'loan', 'tax'
  ],
  
  // Subscriptions & Memberships
  Subscriptions: [
    'netflix', 'amazon prime', 'hotstar', 'disney+', 'spotify', 'apple music', 'youtube premium',
    'sonyliv', 'zee5', 'jiocinema', 'adobe', 'microsoft', 'google storage', 'icloud', 'canva',
    'linkedin', 'gym', 'cult.fit', 'club', 'membership', 'subscription'
  ],
  
  // Entertainment & Leisure
  Entertainment: [
    'bookmyshow', 'pvr', 'inox', 'cinepolis', 'paytm movies', 'ticket', 'concert', 'event',
    'gaming', 'steam', 'playstation', 'xbox', 'nintendo', 'epic games', 'pubg', 'bgmi',
    'amusement', 'park', 'bowling', 'arcade', 'pub', 'bar', 'club', 'lounge'
  ],
  
  // Healthcare & Pharmacy
  Health: [
    'apollo', 'pharmeas', '1mg', 'netmeds', 'medplus', 'hospital', 'clinic', 'doctor',
    'dental', 'pharmacy', 'medical', 'diagnostics', 'pathology', 'lab', 'health', 'care',
    'medicine', 'drugs', 'surgery'
  ],
  
  // Travel & Accommodation
  Travel: [
    'oyo', 'airbnb', 'agoda', 'booking.com', 'hotel', 'resort', 'inn', 'stay', 'vacation',
    'holiday', 'tour', 'travel', 'trip', 'luggage', 'visa', 'passport'
  ]
};

// Flatten to lowercase for faster lookup
const _normalizedKeywords = {};
Object.keys(merchantKeywords).forEach(category => {
  _normalizedKeywords[category] = merchantKeywords[category].map(kw => kw.toLowerCase());
});

/**
 * Normalizes a merchant name by converting to lowercase, removing punctuation, 
 * and standardizing common abbreviations.
 */
function normalizeString(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .replace(/\s+/g, ' ')   // Collapse multiple spaces
    .trim();
}

/**
 * Basic Levenshtein distance implementation for fuzzy matching.
 */
function levenshteinDistance(s1, s2) {
  if (s1.length === 0) return s2.length;
  if (s2.length === 0) return s1.length;

  const matrix = Array(s2.length + 1).fill(null).map(() => Array(s1.length + 1).fill(null));

  for (let i = 0; i <= s1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= s2.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= s2.length; j++) {
    for (let i = 1; i <= s1.length; i++) {
        const substitutionCost = s1[i - 1] === s2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
            matrix[j][i - 1] + 1, // deletion
            matrix[j - 1][i] + 1, // insertion
            matrix[j - 1][i - 1] + substitutionCost // substitution
        );
    }
  }

  return matrix[s2.length][s1.length];
}

/**
 * Calculates a fuzzy score (0-1) representing how closely two strings match.
 */
function calculateFuzzyScore(target, keyword) {
    if (target === keyword) return 1.0;
    if (target.includes(keyword)) return 0.9; // Boost exact substring matches
    
    // Split into words and check if keyword matches any word closely
    const targetWords = target.split(' ');
    let maxScore = 0;
    
    for (const word of targetWords) {
        if (word === keyword) return 0.95; // High confidence if exact word matches
        
        const distance = levenshteinDistance(word, keyword);
        const maxLength = Math.max(word.length, keyword.length);
        const score = 1 - (distance / maxLength);
        
        if (score > maxScore) maxScore = score;
    }
    
    // Also check distance against the entire string (for multi-word keywords)
    const overallDistance = levenshteinDistance(target, keyword);
    const overallMaxLength = Math.max(target.length, keyword.length);
    const overallScore = 1 - (overallDistance / overallMaxLength);
    
    return Math.max(maxScore, overallScore);
}

/**
 * Main categorization function.
 * 
 * @param {string} rawMerchantName - The merchant name extracted from SMS or bank statement
 * @returns {string} - The determined category (Food, Shopping, etc., or Other)
 */
export function categorizeMerchant(rawMerchantName) {
  if (!rawMerchantName) return 'Other';

  const normalizedTarget = normalizeString(rawMerchantName);
  
  if (normalizedTarget.length < 2) return 'Other'; // Too short to effectively categorize

  let bestMatchCategory = 'Other';
  let highestScore = 0;
  const THRESHOLD = 0.8; // Minimum score required for a match

  // 1. Classification Logic
  for (const [category, keywords] of Object.entries(_normalizedKeywords)) {
    for (const keyword of keywords) {
      const score = calculateFuzzyScore(normalizedTarget, keyword);
      
      if (score > highestScore) {
        highestScore = score;
        bestMatchCategory = category;
      }
      
      // Early exit optimization if we find a perfect or near-perfect match
      if (highestScore > 0.95) {
          return bestMatchCategory;
      }
    }
  }

  // 3. Fallback Handling
  // If no category reached the confidence threshold, default to 'Other'
  if (highestScore >= THRESHOLD) {
      return bestMatchCategory;
  }
  
  return 'Other';
}

// Example Usage / Testing
/*
console.log(categorizeMerchant('SWIGGY*ORDER 1234')); // Food (Substring match)
console.log(categorizeMerchant('AMZN PRIME MBRSHP')); // Subscriptions (Substring/Word match)
console.log(categorizeMerchant('UBBER INDIA RIDES')); // Transport (Fuzzy match - 'uber')
console.log(categorizeMerchant('APOLLO PHARMACY'));   // Health
console.log(categorizeMerchant('UNKNOWN TEXTILE CO'));// Other (Fallback)
*/
