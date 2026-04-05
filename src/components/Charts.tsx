import type { Transaction } from "../types";
import { useTheme } from "../context/ThemeContext";
import {
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ChartsProps {
  transactions: Transaction[];
}

export function Charts({ transactions }: ChartsProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const axisTick = { fontSize: 12, fill: isDark ? "#94a3b8" : "#64748b" };
  const tooltipStyle = {
    backgroundColor: isDark ? "#1e293b" : "#ffffff",
    border: isDark ? "1px solid #475569" : "1px solid #e2e8f0",
    borderRadius: "8px",
    color: isDark ? "#f1f5f9" : "#0f172a",
  };
  const lineStroke = isDark ? "#e2e8f0" : "#0f172a";

  const monthlyData = buildMonthlyBalanceTrend(transactions);

  const expenseByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce<Record<string, number>>((acc, t) => {
      acc[t.category] = (acc[t.category] ?? 0) + t.amount;
      return acc;
    }, {});

  const pieData = Object.entries(expenseByCategory).map(([name, value]) => ({ name, value }));
  const pieColors = ["#0ea5e9", "#8b5cf6", "#f43f5e", "#10b981", "#f59e0b", "#6366f1", "#14b8a6"];

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:shadow-slate-900/50">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Balance Trend (Last 12 Months)</h3>
        <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">Line chart of running monthly balance</p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <XAxis dataKey="month" tick={axisTick} stroke={isDark ? "#475569" : "#cbd5e1"} />
              <YAxis tick={axisTick} stroke={isDark ? "#475569" : "#cbd5e1"} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="balance" stroke={lineStroke} strokeWidth={2.5} dot={{ r: 3, fill: lineStroke }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:shadow-slate-900/50">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Spending by Category</h3>
        <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">Pie chart of expense distribution</p>
        <div className="h-72">
          {pieData.length === 0 ? (
            <p className="text-sm text-slate-400 dark:text-slate-500">No expense data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={2}>
                  {pieData.map((entry, index) => (
                    <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ color: isDark ? "#cbd5e1" : "#475569" }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </article>
    </section>
  );
}

function buildMonthlyBalanceTrend(transactions: Transaction[]) {
  const monthMap = new Map<string, number>();

  for (const txn of transactions) {
    const monthKey = txn.date.slice(0, 7);
    const signedAmount = txn.type === "income" ? txn.amount : -txn.amount;
    monthMap.set(monthKey, (monthMap.get(monthKey) ?? 0) + signedAmount);
  }

  return [...monthMap.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, value]) => ({
      month: key.slice(2).replace("-", "/"),
      balance: value,
    }));
}
