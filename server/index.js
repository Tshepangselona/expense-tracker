const cors = require("cors");
const express = require("express");
const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 4000;
const DB_DIR = path.join(__dirname, "data");
const DB_PATH = path.join(DB_DIR, "expenses.db");

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const db = new sqlite3.Database(DB_PATH);

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(error) {
      if (error) {
        reject(error);
        return;
      }
      resolve(this);
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (error, row) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (error, rows) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(rows);
    });
  });
}

async function initializeDatabase() {
  await run(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      amount REAL NOT NULL,
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
}

app.use(cors());
app.use(express.json());

app.get("/api/health", (request, response) => {
  response.json({ ok: true });
});

app.get("/api/expenses", async (request, response) => {
  try {
    const rows = await all(
      "SELECT id, title, amount, category, date, created_at as createdAt FROM expenses ORDER BY date DESC, id DESC"
    );
    response.json(rows);
  } catch (error) {
    response.status(500).json({ message: "Failed to fetch expenses." });
  }
});

app.post("/api/expenses", async (request, response) => {
  const { title, amount, category, date } = request.body || {};
  const parsedAmount = Number(amount);

  if (!title || !date || Number.isNaN(parsedAmount) || parsedAmount <= 0 || !category) {
    response.status(400).json({ message: "Invalid expense payload." });
    return;
  }

  try {
    const result = await run(
      "INSERT INTO expenses (title, amount, category, date) VALUES (?, ?, ?, ?)",
      [String(title).trim(), parsedAmount, String(category).trim(), String(date)]
    );
    const inserted = await get(
      "SELECT id, title, amount, category, date, created_at as createdAt FROM expenses WHERE id = ?",
      [result.lastID]
    );
    response.status(201).json(inserted);
  } catch (error) {
    response.status(500).json({ message: "Failed to create expense." });
  }
});

app.delete("/api/expenses/:id", async (request, response) => {
  try {
    const result = await run("DELETE FROM expenses WHERE id = ?", [request.params.id]);
    if (result.changes === 0) {
      response.status(404).json({ message: "Expense not found." });
      return;
    }
    response.status(204).send();
  } catch (error) {
    response.status(500).json({ message: "Failed to delete expense." });
  }
});

initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  });

