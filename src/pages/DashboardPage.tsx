import { Charts } from "../components/Charts";
import { Insights } from "../components/Insights";
import { SummaryCards } from "../components/SummaryCards";
import { TransactionForm } from "../components/TransactionForm";
import { TransactionsTable } from "../components/TransactionsTable";
import { useFinance } from "../context/FinanceContext";
import { useTheme } from "../context/ThemeContext";

const fieldClass =
  "rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-sky-400/30 focus:ring-2 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:ring-sky-500/30";

export function DashboardPage() {
  const { theme, toggleTheme } = useTheme();
  const {
    role,
    setRole,
    filters,
    updateFilters,
    transactions,
    filteredTransactions,
  } = useFinance();

  const income = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expenses;

  return (
    <main className="min-h-screen bg-slate-50 p-4 text-slate-800 transition-colors sm:p-6 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-6xl space-y-5">
        <header className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:shadow-slate-900/50">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Finance Dashboard</h1>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={toggleTheme}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                aria-pressed={theme === "dark"}
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {theme === "dark" ? "Light mode" : "Dark mode"}
              </button>
              <span className="text-sm text-slate-500 dark:text-slate-400">Role</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as "viewer" | "admin")}
                className={fieldClass}
              >
                <option value="viewer">Viewer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        </header>

        <SummaryCards balance={balance} income={income} expenses={expenses} />
        <Charts transactions={transactions} />

        <section className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 md:grid-cols-3">
          <input
            type="text"
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
            placeholder="Search by category, note, or date..."
            className={`${fieldClass} placeholder:text-slate-400 dark:placeholder:text-slate-500`}
          />
          <select
            value={filters.type}
            onChange={(e) => updateFilters({ type: e.target.value as "all" | "income" | "expense" })}
            className={fieldClass}
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select
            value={filters.sortBy}
            onChange={(e) => updateFilters({ sortBy: e.target.value as "date_desc" | "date_asc" | "amount_desc" | "amount_asc" })}
            className={fieldClass}
          >
            <option value="date_desc">Newest first</option>
            <option value="date_asc">Oldest first</option>
            <option value="amount_desc">Amount high-low</option>
            <option value="amount_asc">Amount low-high</option>
          </select>
        </section>

        {role === "admin" ? <TransactionForm /> : null}
        <TransactionsTable transactions={filteredTransactions} />
        <Insights transactions={transactions} />
      </div>
    </main>
  );
}
