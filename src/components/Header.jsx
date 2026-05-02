function Header() {
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <header className="hero">
      <h1>Expense Tracker</h1>
      <p>Track spending, spot trends, and stay on budget.</p>
      <span className="metric-pill">Today: {today}</span>
    </header>
  );
}

export default Header;
