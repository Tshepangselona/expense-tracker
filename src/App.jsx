import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { createExpense, deleteExpense, fetchExpenses } from "./api/expenses";
import ExpenseChart from "./components/ExpenseChart";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import Header from "./components/Header";
import { CATEGORIES, CATEGORY_COLORS } from "./constants";

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
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadExpenses() {
      try {
        const data = await fetchExpenses();
        setExpenses(Array.isArray(data) ? data : []);
        setError("");
      } catch (loadError) {
        setError(loadError.message || "Could not load expenses.");
      } finally {
        setIsLoading(false);
      }
    }

    loadExpenses();
  }, []);

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

  async function handleSubmit(event) {
    event.preventDefault();
    const amount = Number(form.amount);

    if (!form.title.trim() || !form.date || Number.isNaN(amount) || amount <= 0) {
      return;
    }

    try {
      setIsSaving(true);
      setError("");
      const createdExpense = await createExpense({
        title: form.title.trim(),
        amount,
        category: form.category,
        date: form.date,
      });
      setExpenses((prev) => [...prev, createdExpense]);
      setForm((prev) => ({ ...prev, title: "", amount: "" }));
    } catch (saveError) {
      setError(saveError.message || "Could not save expense.");
    } finally {
      setIsSaving(false);
    }
  }

  async function removeExpense(id) {
    try {
      setError("");
      await deleteExpense(id);
      setExpenses((prev) => prev.filter((item) => item.id !== id));
    } catch (removeError) {
      setError(removeError.message || "Could not delete expense.");
    }
  }

  return (
    <main className="app">
      <Header />
      <ExpenseForm
        form={form}
        categories={CATEGORIES}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        isSaving={isSaving}
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
          isLoading={isLoading}
          error={error}
        />
        <ExpenseChart chartData={chartData} categoryColors={CATEGORY_COLORS} />
      </section>
    </main>
  );
}

export default App;
