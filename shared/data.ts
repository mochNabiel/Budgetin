export const spendingCategories = [
  // EXPENSE
  {
    type: "expense",
    name: "Makanan",
    amount: "$785.00",
    percent: 28,
    fill: "#5B8DEF",
  },
  {
    type: "expense",
    name: "Transportasi",
    amount: "$540.00",
    percent: 19,
    fill: "#7C6CF2",
  },
  {
    type: "expense",
    name: "Belanja",
    amount: "$360.00",
    percent: 13,
    fill: "#38BDF8",
  },
  {
    type: "expense",
    name: "Tagihan",
    amount: "$270.00",
    percent: 10,
    fill: "#6366F1",
  },
  {
    type: "expense",
    name: "Hiburan",
    amount: "$180.00",
    percent: 6,
    fill: "#14B8A6",
  },
  {
    type: "expense",
    name: "Kesehatan",
    amount: "$145.00",
    percent: 5,
    fill: "#F43F5E",
  },
  {
    type: "expense",
    name: "Travel",
    amount: "$310.00",
    percent: 11,
    fill: "#0EA5E9",
  },
  {
    type: "expense",
    name: "Lainnya",
    amount: "$115.00",
    percent: 8,
    fill: "#94A3B8",
  },

  // INCOME
  {
    type: "income",
    name: "Gaji",
    amount: "$4,200.00",
    percent: 58,
    fill: "#2563EB",
  },
  {
    type: "income",
    name: "Freelance",
    amount: "$1,650.00",
    percent: 23,
    fill: "#06B6D4",
  },
  {
    type: "income",
    name: "Investasi",
    amount: "$620.00",
    percent: 9,
    fill: "#8B5CF6",
  },
  {
    type: "income",
    name: "Bisnis",
    amount: "$480.00",
    percent: 7,
    fill: "#EC4899",
  },
  {
    type: "income",
    name: "Lainnya",
    amount: "$250.00",
    percent: 3,
    fill: "#64748B",
  },
]

export const spendingTrendData = [
  { day: "1 Mei", expense: 300, income: 0 },
  { day: "6 Mei", expense: 450, income: 400 },
  { day: "11 Mei", expense: 600, income: 500 },
  { day: "16 Mei", expense: 500, income: 600 },
  { day: "21 Mei", expense: 750, income: 700 },
  { day: "26 Mei", expense: 900, income: 800 },
  { day: "31 Mei", expense: 1100, income: 850 },
]

export const transactionsItem = [
  {
    id: 1,
    name: "Netflix",
    amount: 120000,
    date: "2026-07-17T10:23:00.000Z",
    category: {
      type: "expense",
      name: "Entertainment",
      icon: "🎬",
      color: "#FDA4AF",
    },
  },
  {
    id: 2,
    name: "Gojek",
    amount: 45000,
    date: "2026-07-17T08:12:00.000Z",
    category: {
      type: "expense",
      name: "Transportation",
      icon: "🛵",
      color: "#7DD3FC",
    },
  },
  {
    id: 3,
    name: "Monthly Salary",
    amount: 8500000,
    date: "2026-07-16T09:00:00.000Z",
    category: {
      type: "income",
      name: "Salary",
      icon: "💼",
      color: "#86EFAC",
    },
  },
  {
    id: 4,
    name: "Lunch at Cafe",
    amount: 75000,
    date: "2026-07-15T12:45:00.000Z",
    category: {
      type: "expense",
      name: "Food & Drink",
      icon: "🍜",
      color: "#FDBA74",
    },
  },
  {
    id: 5,
    name: "Electricity Bill",
    amount: 425000,
    date: "2026-07-14T07:30:00.000Z",
    category: {
      type: "expense",
      name: "Utilities",
      icon: "💡",
      color: "#BEF264",
    },
  },
  {
    id: 6,
    name: "Freelance Website Project Payment Gateway",
    amount: 2500000,
    date: "2026-07-13T15:20:00.000Z",
    category: {
      type: "income",
      name: "Freelance",
      icon: "💻",
      color: "#67E8F9",
    },
  },
  {
    id: 7,
    name: "Online Course",
    amount: 350000,
    date: "2026-07-12T20:10:00.000Z",
    category: {
      type: "expense",
      name: "Education",
      icon: "📚",
      color: "#C4B5FD",
    },
  },
  {
    id: 8,
    name: "Supermarket Shopping",
    amount: 285000,
    date: "2026-07-11T17:40:00.000Z",
    category: {
      type: "expense",
      name: "Groceries",
      icon: "🛒",
      color: "#FCD34D",
    },
  },
]

export const defaultCategories = [
  // =========================
  // INCOME
  // =========================
  {
    id: 1,
    type: "income",
    name: "Salary",
    icon: "💼",
    color: "#7DD3FC", // Sky
  },
  {
    id: 2,
    type: "income",
    name: "Freelance",
    icon: "💻",
    color: "#86EFAC", // Mint
  },
  {
    id: 3,
    type: "income",
    name: "Business",
    icon: "🏪",
    color: "#FCD34D", // Amber
  },
  {
    id: 4,
    type: "income",
    name: "Investment",
    icon: "📈",
    color: "#FDBA74", // Peach
  },
  {
    id: 5,
    type: "income",
    name: "Bonus",
    icon: "🎁",
    color: "#C4B5FD", // Lavender
  },
  {
    id: 6,
    type: "income",
    name: "Commission",
    icon: "🤝",
    color: "#67E8F9", // Cyan
  },
  {
    id: 7,
    type: "income",
    name: "Interest",
    icon: "🏦",
    color: "#BEF264", // Lime
  },
  {
    id: 8,
    type: "income",
    name: "Refund",
    icon: "↩️",
    color: "#FDA4AF", // Pink
  },
  {
    id: 9,
    type: "income",
    name: "Allowance",
    icon: "👛",
    color: "#DDD6FE", // Periwinkle
  },
  {
    id: 10,
    type: "income",
    name: "Other Income",
    icon: "💰",
    color: "#99F6E4", // Teal
  },

  // =========================
  // EXPENSE
  // =========================
  {
    id: 11,
    type: "expense",
    name: "Food & Drink",
    icon: "🍔",
    color: "#FDBA74", // Peach
  },
  {
    id: 12,
    type: "expense",
    name: "Transportation",
    icon: "🚗",
    color: "#7DD3FC", // Sky
  },
  {
    id: 13,
    type: "expense",
    name: "Shopping",
    icon: "🛍️",
    color: "#FDA4AF", // Pink
  },
  {
    id: 14,
    type: "expense",
    name: "Bills",
    icon: "🧾",
    color: "#FCD34D", // Amber
  },
  {
    id: 15,
    type: "expense",
    name: "Internet",
    icon: "📶",
    color: "#67E8F9", // Cyan
  },
  {
    id: 16,
    type: "expense",
    name: "Phone",
    icon: "📱",
    color: "#DDD6FE", // Periwinkle
  },
  {
    id: 17,
    type: "expense",
    name: "Health",
    icon: "❤️",
    color: "#86EFAC", // Mint
  },
  {
    id: 18,
    type: "expense",
    name: "Education",
    icon: "🎓",
    color: "#C4B5FD", // Lavender
  },
  {
    id: 19,
    type: "expense",
    name: "Entertainment",
    icon: "🎬",
    color: "#99F6E4", // Teal
  },
  {
    id: 20,
    type: "expense",
    name: "Travel",
    icon: "✈️",
    color: "#7DD3FC", // Sky
  },
  {
    id: 21,
    type: "expense",
    name: "Fuel",
    icon: "⛽",
    color: "#FDBA74", // Peach
  },
  {
    id: 22,
    type: "expense",
    name: "Rent",
    icon: "🏠",
    color: "#BEF264", // Lime
  },
  {
    id: 23,
    type: "expense",
    name: "Insurance",
    icon: "🛡️",
    color: "#67E8F9", // Cyan
  },
  {
    id: 24,
    type: "expense",
    name: "Tax",
    icon: "💸",
    color: "#DDD6FE", // Periwinkle
  },
  {
    id: 25,
    type: "expense",
    name: "Gift",
    icon: "🎁",
    color: "#FDA4AF", // Pink
  },
  {
    id: 26,
    type: "expense",
    name: "Donation",
    icon: "🤲",
    color: "#99F6E4", // Teal
  },
  {
    id: 27,
    type: "expense",
    name: "Pet",
    icon: "🐾",
    color: "#BEF264", // Lime
  },
  {
    id: 28,
    type: "expense",
    name: "Beauty",
    icon: "💄",
    color: "#C4B5FD", // Lavender
  },
  {
    id: 29,
    type: "expense",
    name: "Kids",
    icon: "🧸",
    color: "#86EFAC", // Mint
  },
  {
    id: 30,
    type: "expense",
    name: "Other Expense",
    icon: "📦",
    color: "#FCD34D", // Amber
  },
]
