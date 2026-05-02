import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { currency } from "../utils";

function ExpenseChart({ chartData, categoryColors }) {
  return (
    <article className="card chart-card">
      <h2>By Category</h2>
      <p className="muted-text">Spending distribution for current results</p>
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
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry) => (
                <Cell
                  key={`cell-${entry.name}`}
                  fill={categoryColors[entry.name] || "#9ca3af"}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => currency.format(value)} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </article>
  );
}

export default ExpenseChart;
