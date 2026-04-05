import { useState } from "react";
import { useFinance } from "../context/FinanceContext";

const fieldClass =
  "rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-sky-400/30 focus:ring-2 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:ring-sky-500/30";

export function TransactionForm() {
  const { addTransaction } = useFinance();
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    amount: "",
    category: "",
    note: "",
    type: "expense" as "income" | "expense",
  });

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const amount = Number(form.amount);
    if (!form.category || !form.note || Number.isNaN(amount) || amount <= 0) {
      return;
    }

    addTransaction({
      date: form.date,
      amount,
      category: form.category,
      note: form.note,
      type: form.type,
    });

    setForm((prev) => ({ ...prev, amount: "", category: "", note: "" }));
  };

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 md:grid-cols-5 dark:shadow-slate-900/50"
    >
      <input
        type="date"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
        className={`${fieldClass} [color-scheme:light] dark:[color-scheme:dark]`}
      />
      <input
        type="text"
        placeholder="Category"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
        className={`${fieldClass} placeholder:text-slate-400 dark:placeholder:text-slate-500`}
      />
      <input
        type="number"
        min="1"
        placeholder="Amount"
        value={form.amount}
        onChange={(e) => setForm({ ...form, amount: e.target.value })}
        className={`${fieldClass} placeholder:text-slate-400 dark:placeholder:text-slate-500`}
      />
      <select
        value={form.type}
        onChange={(e) => setForm({ ...form, type: e.target.value as "income" | "expense" })}
        className={fieldClass}
      >
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>
      <button
        className="rounded-lg bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-700 dark:bg-sky-600 dark:hover:bg-sky-500"
        type="submit"
      >
        Add Transaction
      </button>
      <input
        type="text"
        placeholder="Note"
        value={form.note}
        onChange={(e) => setForm({ ...form, note: e.target.value })}
        className={`${fieldClass} placeholder:text-slate-400 dark:placeholder:text-slate-500 md:col-span-5`}
      />
    </form>
  );
}
