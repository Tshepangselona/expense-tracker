function ExpenseForm({ form, categories, onInputChange, onSubmit, isSaving }) {
  return (
    <section className="card">
      <h2>Add Expense</h2>
      <form className="expense-form" onSubmit={onSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Expense name"
          value={form.title}
          onChange={onInputChange}
          required
        />
        <input
          type="number"
          name="amount"
          min="0.01"
          step="0.01"
          placeholder="Amount"
          value={form.amount}
          onChange={onInputChange}
          required
        />
        <select name="category" value={form.category} onChange={onInputChange}>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={onInputChange}
          required
        />
        <button type="submit" className="btn-primary" disabled={isSaving}>
          {isSaving ? "Saving..." : "Add"}
        </button>
      </form>
    </section>
  );
}

export default ExpenseForm;
