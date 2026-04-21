import { useEffect, useMemo, useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import "./App.css";

const STORAGE_KEY = "expense-tracker-items";

const CATEGORY_COLORS = {
  Food: "#ef4444",
  Transport: "#3b82f6",
  Bills: "#f59e0b",
  Shopping: "#22c55e",
  Health: "#8b5cf6",
  Entertainment: "#ec4899",
  Other: "#6b7280",
};

const CATEGORIES = Object.keys(CATEGORY_COLORS);

const currency = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
});

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
}

function App() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Food",
    date: new Date().toISOString().slice(0, 10),
  });
  const [filterCategory, setFilterCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setExpenses(parsed);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((item) =>
        filterCategory === "All" ? true : item.category === filterCategory
      )
      .filter((item) =>
        item.title.toLowerCase().includes(search.trim().toLowerCase())
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [expenses, filterCategory, search]);

  const totalAmount = useMemo(
    () => filteredExpenses.reduce((sum, item) => sum + Number(item.amount), 0),
    [filteredExpenses]
  );

  const chartData = useMemo(() => {
    const totals = filteredExpenses.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + Number(item.amount);
      return acc;
    }, {});

    return Object.entries(totals).map(([name, value]) => ({ name, value }));
  }, [filteredExpenses]);

  function handleInputChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const amount = Number(form.amount);

    if (!form.title.trim() || !form.date || Number.isNaN(amount) || amount <= 0) {
      return;
    }

    const newExpense = {
      id: Date.now(),
      title: form.title.trim(),
      amount,
      category: form.category,
      date: form.date,
    };

    setExpenses((prev) => [...prev, newExpense]);
    setForm((prev) => ({ ...prev, title: "", amount: "" }));
  }

  function removeExpense(id) {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <main className="app">
      <header className="hero">
        <h1>Expense Tracker</h1>
        <p>Track spending, spot trends, and stay on budget.</p>
      </header>

      <section className="card">
        <h2>Add Expense</h2>
        <form className="expense-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Expense name"
            value={form.title}
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            name="amount"
            min="0.01"
            step="0.01"
            placeholder="Amount"
            value={form.amount}
            onChange={handleInputChange}
            required
          />
          <select name="category" value={form.category} onChange={handleInputChange}>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleInputChange}
            required
          />
          <button type="submit">Add</button>
        </form>
      </section>

      <section className="grid">
        <article className="card">
          <div className="row">
            <h2>Overview</h2>
            <strong>{currency.format(totalAmount)}</strong>
          </div>
          <div className="controls">
            <input
              type="search"
              placeholder="Search by title"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <select
              value={filterCategory}
              onChange={(event) => setFilterCategory(event.target.value)}
            >
              <option value="All">All categories</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <ul className="expense-list">
            {filteredExpenses.length === 0 ? (
              <li className="empty">No expenses yet.</li>
            ) : (
              filteredExpenses.map((item) => (
                <li key={item.id}>
                  <div>
                    <p>{item.title}</p>
                    <small>
                      {item.category} • {formatDate(item.date)}
                    </small>
                  </div>
                  <div className="amount-group">
                    <strong>{currency.format(item.amount)}</strong>
                    <button
                      type="button"
                      className="danger"
                      onClick={() => removeExpense(item.id)}
                      aria-label={`Delete ${item.title}`}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </article>

        <article className="card chart-card">
          <h2>By Category</h2>
          {chartData.length === 0 ? (
            <p className="empty">Add expenses to see chart insights.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={105}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {chartData.map((entry) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={CATEGORY_COLORS[entry.name] || "#9ca3af"}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => currency.format(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </article>
      </section>
    </main>
  );
}

export default App;
