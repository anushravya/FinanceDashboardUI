import { useState } from "react";
import { useFinance } from "../context/FinanceContext";
import type { Transaction, TransactionType } from "../types";

interface TransactionsTableProps {
  transactions: Transaction[];
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  const { role, deleteTransaction, updateTransaction } = useFinance();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    date: "",
    category: "",
    type: "expense" as TransactionType,
    note: "",
    amount: "",
  });

  const startEdit = (txn: Transaction) => {
    setEditingId(txn.id);
    setEditForm({
      date: txn.date,
      category: txn.category,
      type: txn.type,
      note: txn.note,
      amount: String(txn.amount),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({
      date: "",
      category: "",
      type: "expense",
      note: "",
      amount: "",
    });
  };

  const saveEdit = () => {
    if (!editingId) return;
    const amount = Number(editForm.amount);
    if (
      !editForm.date ||
      !editForm.category.trim() ||
      !editForm.note.trim() ||
      Number.isNaN(amount) ||
      amount <= 0
    ) {
      return;
    }
    updateTransaction(editingId, {
      date: editForm.date,
      category: editForm.category.trim(),
      type: editForm.type,
      note: editForm.note.trim(),
      amount,
    });
    cancelEdit();
  };

  if (transactions.length === 0) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
        No matching transactions found.
      </section>
    );
  }

  return (
    <section className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:shadow-slate-900/50">
      <table className="min-w-full text-left text-sm text-slate-800 dark:text-slate-200">
        <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800/80 dark:text-slate-300">
          <tr>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Note</th>
            <th className="px-4 py-3 text-right font-medium">Amount</th>
            {role === "admin" ? <th className="px-4 py-3 text-right font-medium">Actions</th> : null}
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn) => {
            const isEditing = role === "admin" && editingId === txn.id;
            return (
              <tr key={txn.id} className="border-t border-slate-100 dark:border-slate-700">
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                  {isEditing ? (
                    <input
                      type="date"
                      value={editForm.date}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, date: e.target.value }))}
                      className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-800"
                    />
                  ) : (
                    txn.date
                  )}
                </td>
                <td className="px-4 py-3">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.category}
                      onChange={(e) =>
                        setEditForm((prev) => ({ ...prev, category: e.target.value }))
                      }
                      className="w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-800"
                    />
                  ) : (
                    txn.category
                  )}
                </td>
                <td className="px-4 py-3">
                  {isEditing ? (
                    <select
                      value={editForm.type}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          type: e.target.value as TransactionType,
                        }))
                      }
                      className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-800"
                    >
                      <option value="income">income</option>
                      <option value="expense">expense</option>
                    </select>
                  ) : (
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        txn.type === "income"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                          : "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400"
                      }`}
                    >
                      {txn.type}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.note}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, note: e.target.value }))}
                      className="w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-800"
                    />
                  ) : (
                    txn.note
                  )}
                </td>
                <td
                  className={`px-4 py-3 text-right font-medium ${
                    txn.type === "income"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {isEditing ? (
                    <input
                      type="number"
                      min="1"
                      value={editForm.amount}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, amount: e.target.value }))}
                      className="w-24 rounded-md border border-slate-200 bg-white px-2 py-1 text-right text-xs text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                    />
                  ) : (
                    `${txn.type === "income" ? "+" : "-"}$${txn.amount.toLocaleString("en-US")}`
                  )}
                </td>
                {role === "admin" ? (
                  <td className="px-4 py-3 text-right">
                    {isEditing ? (
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={saveEdit}
                          className="rounded-md bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-950/70"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="rounded-md bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(txn)}
                          className="rounded-md bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 transition hover:bg-sky-100 dark:bg-sky-950/40 dark:text-sky-300 dark:hover:bg-sky-950/70"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteTransaction(txn.id)}
                          className="rounded-md bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700 transition hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-950/70"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                ) : null}
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
