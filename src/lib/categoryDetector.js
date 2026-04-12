const normalize = (text) =>
  text.toLowerCase().replace(/[^a-z0-9 ]/g, "");

const rules = [
  { category: "Income", match: ["credited", "salary", "neft"] },
  { category: "Housing", match: ["rent"] },
  { category: "Food", match: ["swiggy", "zomato"] },
  { category: "Shopping", match: ["amazon", "flipkart", "reliance"] },
  { category: "Transport", match: ["uber", "ola"] },
  { category: "Travel", match: ["makemytrip", "airlines", "flight"] },
  { category: "Bills", match: ["electricity", "bill"] },
  { category: "Subscriptions", match: ["netflix", "spotify"] },
  { category: "Health", match: ["hospital", "pharmacy", "medical"] },
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
