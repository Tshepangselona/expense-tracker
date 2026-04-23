# Expense Tracker

A modern React expense tracker with category insights and a database-backed API.

## Features

- Add expenses with title, amount, category, and date
- Filter by category and search by title
- See live totals based on active filters
- View spending breakdown with a pie chart
- Data is persisted in a SQLite database via an Express API

## Scripts

In the project directory, run:

- `npm start` - start both API (`:4000`) and frontend (`:3000`)
- `npm run api` - start only the Express API server
- `npm test` - run tests in watch mode
- `npm run build` - create a production build

## Tech Stack

- React
- Recharts
- Express
- SQLite
- Create React App

## Next Ideas

- Add monthly budget and over-budget alerts
- Add export/import as CSV
- Add recurring expense templates
