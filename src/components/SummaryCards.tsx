interface SummaryCardsProps {
  balance: number;
  income: number;
  expenses: number;
}

export function SummaryCards({ balance, income, expenses }: SummaryCardsProps) {
  const items = [
    {
      label: "Total Balance",
      value: balance,
      accent: "text-sky-600 dark:text-sky-400",
    },
    {
      label: "Income",
      value: income,
      accent: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Expenses",
      value: expenses,
      accent: "text-rose-600 dark:text-rose-400",
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <article
          key={item.label}
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:shadow-slate-900/50"
        >
          <p className="text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
          <p className={`mt-1 text-2xl font-semibold ${item.accent}`}>
            ${item.value.toLocaleString("en-US")}
          </p>
        </article>
      ))}
    </section>
  );
}
