import { createContext, useContext, useMemo, useState } from "react";
import { seedTransactions } from "../data/transactions";
import type { Transaction, TransactionType, UserRole } from "../types";

interface NewTransactionInput {
  date: string;
  amount: number;
  category: string;
  type: TransactionType;
  note: string;
}

type SortBy = "date_desc" | "date_asc" | "amount_desc" | "amount_asc";

interface FiltersState {
  search: string;
  type: "all" | TransactionType;
  sortBy: SortBy;
}

interface FinanceContextValue {
  role: UserRole;
  setRole: (role: UserRole) => void;
  filters: FiltersState;
  updateFilters: (updates: Partial<FiltersState>) => void;
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  addTransaction: (input: NewTransactionInput) => void;
  deleteTransaction: (id: string) => void;
  updateTransaction: (id: string, updates: NewTransactionInput) => void;
}

const FinanceContext = createContext<FinanceContextValue | undefined>(undefined);

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>("viewer");
  const [filters, setFilters] = useState<FiltersState>({
    search: "",
    type: "all",
    sortBy: "date_desc",
  });
  const [transactions, setTransactions] = useState<Transaction[]>(seedTransactions);

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((txn) => (filters.type === "all" ? true : txn.type === filters.type))
      .filter((txn) => {
        const q = filters.search.toLowerCase().trim();
        if (!q) return true;
        return (
          txn.category.toLowerCase().includes(q) ||
          txn.note.toLowerCase().includes(q) ||
          txn.date.includes(q)
        );
      })
      .sort((a, b) => {
        if (filters.sortBy === "date_desc") return new Date(b.date).getTime() - new Date(a.date).getTime();
        if (filters.sortBy === "date_asc") return new Date(a.date).getTime() - new Date(b.date).getTime();
        if (filters.sortBy === "amount_desc") return b.amount - a.amount;
        return a.amount - b.amount;
      });
  }, [transactions, filters]);

  const addTransaction = (input: NewTransactionInput) => {
    const next: Transaction = {
      id: crypto.randomUUID(),
      ...input,
    };
    setTransactions((prev) => [next, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((txn) => txn.id !== id));
  };

  const updateTransaction = (id: string, updates: NewTransactionInput) => {
    setTransactions((prev) =>
      prev.map((txn) => (txn.id === id ? { ...txn, ...updates } : txn)),
    );
  };

  const updateFilters = (updates: Partial<FiltersState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const value = {
    role,
    setRole,
    filters,
    updateFilters,
    transactions,
    filteredTransactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) {
    throw new Error("useFinance must be used within FinanceProvider");
  }
  return ctx;
}
