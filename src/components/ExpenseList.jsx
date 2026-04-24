import { currency, formatDate } from "../utils";

function ExpenseList({
  totalAmount,
  search,
  onSearchChange,
  filterCategory,
  onFilterChange,
  categories,
  expenses,
  onRemove,
  isLoading,
  error,
}) {
  return (
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
          onChange={(event) => onSearchChange(event.target.value)}
        />
        <select value={filterCategory} onChange={(event) => onFilterChange(event.target.value)}>
          <option value="All">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      {error ? <p className="error-banner">{error}</p> : null}
      <ul className="expense-list">
        {isLoading ? (
          <li className="empty">Loading expenses...</li>
        ) : expenses.length === 0 ? (
          <li className="empty">No expenses yet.</li>
        ) : (
          expenses.map((item) => (
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
                  onClick={() => onRemove(item.id)}
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
  );
}

export default ExpenseList;
