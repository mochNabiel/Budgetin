export const stats = [
  {
    label: "Income",
    value: "$8,250.00",
    change: "+12.5%",
    changeType: "positive" as const,
    icon: "income",
  },
  {
    label: "Expenses",
    value: "$2,250.00",
    change: "-8.1%",
    changeType: "negative" as const,
    icon: "expenses",
  },
]

export const spendingCategories = [
  // EXPENSE
  {
    type: "expense",
    name: "Food & Dining",
    amount: "$785.00",
    percent: 28,
    fill: "#60a5fa",
  },
  {
    type: "expense",
    name: "Transportation",
    amount: "$540.00",
    percent: 19,
    fill: "#f97316",
  },
  {
    type: "expense",
    name: "Shopping",
    amount: "$360.00",
    percent: 13,
    fill: "#facc15",
  },
  {
    type: "expense",
    name: "Bills & Utilities",
    amount: "$270.00",
    percent: 10,
    fill: "#a78bfa",
  },
  {
    type: "expense",
    name: "Entertainment",
    amount: "$180.00",
    percent: 6,
    fill: "#34d399",
  },
  {
    type: "expense",
    name: "Healthcare",
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
    name: "Others",
    amount: "$115.00",
    percent: 8,
    fill: "#94a3b8",
  },

  // INCOME
  {
    type: "income",
    name: "Salary",
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
    name: "Investments",
    amount: "$620.00",
    percent: 9,
    fill: "#f59e0b",
  },
  {
    type: "income",
    name: "Business",
    amount: "$480.00",
    percent: 7,
    fill: "#8b5cf6",
  },
  {
    type: "income",
    name: "Others",
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

export const recentTransactions = [
  {
    id: 1,
    name: "Google Workspace",
    subtitle: "Work Subscription",
    category: "Bills & Utilities",
    amount: "-$30.00",
    type: "expense" as const,
    time: "Today, 14:35",
    icon: "google",
  },
  {
    id: 2,
    name: "Netflix",
    subtitle: "Entertainment",
    category: "Entertainment",
    amount: "-$20.00",
    type: "expense" as const,
    time: "Today, 10:23",
    icon: "netflix",
  },
  {
    id: 3,
    name: "Salary from PT Nextin",
    subtitle: "May Salary",
    category: "Income",
    amount: "+$8,250.00",
    type: "income" as const,
    time: "Yesterday, 09:00",
    icon: "salary",
  },
  {
    id: 4,
    name: "ChatGPT Plus",
    subtitle: "AI Subscription",
    category: "Bills & Utilities",
    amount: "-$40.00",
    type: "expense" as const,
    time: "Yesterday, 17:35",
    icon: "chatgpt",
  },
  {
    id: 5,
    name: "GoJek",
    subtitle: "Transportation",
    category: "Transportation",
    amount: "-$15.00",
    type: "expense" as const,
    time: "Yesterday, 08:15",
    icon: "gojek",
  },
]

export const budgetGoals = [
  {
    id: 1,
    name: "New Laptop",
    current: 650,
    target: 1500,
    dueIn: "45 days",
    icon: "laptop",
    color: "#ef4444",
  },
  {
    id: 2,
    name: "Japan Trip",
    current: 2750,
    target: 5000,
    dueIn: "120 days",
    icon: "plane",
    color: "#ef4444",
  },
  {
    id: 3,
    name: "Emergency Fund",
    current: 1250,
    target: 3000,
    dueIn: null,
    icon: "shield",
    color: "#ef4444",
  },
]

export const categories = [
  { name: "Food & Dining", percent: 33, color: "#ef4444", icon: "utensils" },
  { name: "Transportation", percent: 24, color: "#f97316", icon: "car" },
  { name: "Shopping", percent: 16, color: "#facc15", icon: "shopping-bag" },
  { name: "Bills & Utilities", percent: 12, color: "#3b82f6", icon: "zap" },
  { name: "Entertainment", percent: 8, color: "#a855f7", icon: "tv" },
  { name: "Others", percent: 69, color: "#94a3b8", icon: "more-horizontal" },
]

export const navItems = [
  { label: "Overview", icon: "layout-dashboard", active: true },
  { label: "Transactions", icon: "receipt" },
  { label: "Categories", icon: "grid-2x2" },
  { label: "Goals", icon: "target" },
  { label: "Insights", icon: "bar-chart-2" },
  { label: "AI Assistant", icon: "bot" },
  { label: "Reports", icon: "file-bar-chart" },
  { label: "Subscriptions", icon: "repeat" },
  { label: "Settings", icon: "settings" },
]
