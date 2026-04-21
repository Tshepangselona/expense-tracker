import { useEffect, useMemo, useState } from "react";
import "./App.css";
import ExpenseChart from "./components/ExpenseChart";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import Header from "./components/Header";
import { CATEGORIES, CATEGORY_COLORS, STORAGE_KEY } from "./constants";

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
      <Header />
      <ExpenseForm
        form={form}
        categories={CATEGORIES}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
      />

      <section className="grid">
        <ExpenseList
          totalAmount={totalAmount}
          search={search}
          onSearchChange={setSearch}
          filterCategory={filterCategory}
          onFilterChange={setFilterCategory}
          categories={CATEGORIES}
          expenses={filteredExpenses}
          onRemove={removeExpense}
        />
        <ExpenseChart chartData={chartData} categoryColors={CATEGORY_COLORS} />
      </section>
    </main>
  );
}

export default App;
