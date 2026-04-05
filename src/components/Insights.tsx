import type { Transaction } from "../types";

interface InsightsProps {
  transactions: Transaction[];
}

export function Insights({ transactions }: InsightsProps) {
  const latestMonth = getLatestMonth(transactions);
  const previousMonth = getPreviousMonth(latestMonth);

  const currentMonthExpenses = getMonthExpense(transactions, latestMonth);
  const previousMonthExpenses = getMonthExpense(transactions, previousMonth);

  const expenseByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce<Record<string, number>>((acc, txn) => {
      acc[txn.category] = (acc[txn.category] ?? 0) + txn.amount;
      return acc;
    }, {});

  const topCategory = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1])[0] ?? null;
  const delta = currentMonthExpenses - previousMonthExpenses;
  const trendLabel =
    delta > 0 ? `up by $${delta}` : delta < 0 ? `down by $${Math.abs(delta)}` : "unchanged";

  const cards = [
    {
      title: "Highest Spending Category",
      value: topCategory ? `${topCategory[0]} ($${topCategory[1]})` : "N/A",
      note: "Category with the largest total expense in available data.",
    },
    {
      title: "Total Expenses This Month",
      value: `$${currentMonthExpenses}`,
      note: `Total expense recorded in ${latestMonth}.`,
    },
    {
      title: "Month-over-Month Comparison",
      value: trendLabel,
      note: `Compared with ${previousMonth} (${previousMonthExpenses}).`,
    },
  ];

  return (
    <section>
      <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">Insights</h3>
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <article
            key={card.title}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:shadow-slate-900/50"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{card.title}</p>
            <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">{card.value}</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{card.note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function getLatestMonth(transactions: Transaction[]) {
  if (transactions.length === 0) return "N/A";
  return [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    .date.slice(0, 7);
}

function getPreviousMonth(month: string) {
  if (month === "N/A") return "N/A";
  const [year, monthIndex] = month.split("-").map(Number);
  const date = new Date(year, monthIndex - 2, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function getMonthExpense(transactions: Transaction[], month: string) {
  if (month === "N/A") return 0;
  return transactions
    .filter((txn) => txn.type === "expense" && txn.date.startsWith(month))
    .reduce((sum, txn) => sum + txn.amount, 0);
}
