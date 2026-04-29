const normalize = (text) =>
  text.toLowerCase().replace(/[^a-z0-9 ]/g, "");

const rules = [
  { category: "Income", match: ["credited", "salary", "neft"] },
  { category: "Housing", match: ["rent", "maintenance"] },
  { category: "Food", match: ["swiggy", "zomato", "dominos", "burger king", "kfc", "mcdonalds", "starbucks", "foodpanda", "restaurant", "cafe", "food"] },
  { category: "Groceries", match: ["bigbasket", "zepto", "blinkit", "instamart", "dmart", "grocery", "supermarket", "spencers"] },
  { category: "Shopping", match: ["amazon", "flipkart", "reliance", "myntra", "apple store", "ajio", "croma", "zara", "h&m", "retail", "store"] },
  { category: "Transport", match: ["uber", "ola", "rapido", "metro", "irctc", "redbus", "fuel", "petrol", "shell", "hpcl", "bpcl", "indian oil"] },
  { category: "Travel", match: ["makemytrip", "airlines", "flight", "indigo", "air india", "vistara", "goibibo", "agoda", "booking.com", "cleartrip", "hotel"] },
  { category: "Bills", match: ["electricity", "bill", "recharge", "airtel", "jio", "vodafone", "vi", "bsnl", "broadband", "water", "gas", "bescom", "mahavitaran"] },
  { category: "Subscriptions", match: ["netflix", "spotify", "prime", "hotstar", "youtube", "apple music"] },
  { category: "Health", match: ["hospital", "pharmacy", "medical", "apollo", "1mg", "practo", "pharmeasy", "clinic"] },
];

export const detectCategory = (sms) => {
  const text = normalize(sms);

  for (const rule of rules) {
    if (rule.match.some((k) => text.includes(k))) {
      return rule.category;
    }
  }

  return "Other";
};
