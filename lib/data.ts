export const spendingCategories = [
  // EXPENSE
  {
    type: "expense",
    name: "Makanan",
    amount: "$785.00",
    percent: 28,
    fill: "#60a5fa",
  },
  {
    type: "expense",
    name: "Transportasi",
    amount: "$540.00",
    percent: 19,
    fill: "#f97316",
  },
  {
    type: "expense",
    name: "Belanja",
    amount: "$360.00",
    percent: 13,
    fill: "#facc15",
  },
  {
    type: "expense",
    name: "Tagihan",
    amount: "$270.00",
    percent: 10,
    fill: "#a78bfa",
  },
  {
    type: "expense",
    name: "Hiburan",
    amount: "$180.00",
    percent: 6,
    fill: "#34d399",
  },
  {
    type: "expense",
    name: "Kesehatan",
    amount: "$145.00",
    percent: 5,
    fill: "#fb7185",
  },
  {
    type: "expense",
    name: "Travel",
    amount: "$310.00",
    percent: 11,
    fill: "#2dd4bf",
  },
  {
    type: "expense",
    name: "Lainnya",
    amount: "$115.00",
    percent: 8,
    fill: "#94a3b8",
  },

  // INCOME
  {
    type: "income",
    name: "Gaji",
    amount: "$4,200.00",
    percent: 58,
    fill: "#3b82f6",
  },
  {
    type: "income",
    name: "Freelance",
    amount: "$1,650.00",
    percent: 23,
    fill: "#10b981",
  },
  {
    type: "income",
    name: "Investasi",
    amount: "$620.00",
    percent: 9,
    fill: "#f59e0b",
  },
  {
    type: "income",
    name: "Bisnis",
    amount: "$480.00",
    percent: 7,
    fill: "#8b5cf6",
  },
  {
    type: "income",
    name: "Lainnya",
    amount: "$250.00",
    percent: 3,
    fill: "#64748b",
  },
]

export const spendingTrendData = [
  { day: "1 May", expense: 300, income: 0 },
  { day: "6 May", expense: 450, income: 400 },
  { day: "11 May", expense: 600, income: 500 },
  { day: "16 May", expense: 500, income: 600 },
  { day: "21 May", expense: 750, income: 700 },
  { day: "26 May", expense: 900, income: 800 },
  { day: "31 May", expense: 1100, income: 850 },
]

export const categories = [
  { name: "Food & Dining", percent: 33, color: "#ef4444", icon: "utensils" },
  { name: "Transportation", percent: 24, color: "#f97316", icon: "car" },
  { name: "Shopping", percent: 16, color: "#facc15", icon: "shopping-bag" },
  { name: "Bills & Utilities", percent: 12, color: "#3b82f6", icon: "zap" },
  { name: "Entertainment", percent: 8, color: "#a855f7", icon: "tv" },
  { name: "Others", percent: 69, color: "#94a3b8", icon: "more-horizontal" },
]

export const transactionsItem = [
  {
    id: 1,
    name: "Netflix",
    category: "Entertainment",
    amount: -120000,
    date: "Hari ini, 10:23",
  },
  {
    id: 2,
    name: "Gojek",
    category: "Transportasi",
    amount: -45000,
    date: "Hari ini, 08:12",
  },
  {
    id: 3,
    name: "Gaji Bulanan",
    category: "Pemasukan",
    amount: 8500000,
    date: "Kemarin",
  },
  {
    id: 4,
    name: "ChatGPT Plus",
    category: "Langganan",
    amount: -320000,
    date: "Kemarin",
  },
]
