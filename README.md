# FinTrack Pro — Personal Expense Tracker (MERN)

> **Candidate**: Aadith Krishna  
> **Course**: Exit Examination & Final Assessment — Full Stack Development (MERN)  
> **Batch**: A1, B1, C1, D1  
> **Repository**: [https://github.com/aadithkrishnaep/personal-expense-tracker](https://github.com/aadithkrishnaep/personal-expense-tracker)

---

## 🎯 Project Overview & Architectural Vision

**FinTrack Pro** is an enterprise-patterned personal financial recording platform created with the **MERN** technology stack (MongoDB Atlas, Express.js, React.js, and Node.js). 

Instead of standard single-file scripts commonly observed in academic submissions, this solution applies a **3-tier modular architecture** consisting of:
- **Presentation Layer**: Custom React hooks (`useExpenses`), responsive Bootstrap 5 styling tokens, and Chart.js analytical dashboards.
- **Service & Domain Layer**: Dedicated validation chaining (`ExpenseValidator`) and decoupled service methods (`ExpenseService`).
- **Data Persistence Layer**: Mongoose Object-Document Mapper targeting MongoDB Atlas with custom schema aggregations and an offline fallback store.

---

## 🏗️ Architecture & Directory Topology

```text
personal-expense-tracker/
├── backend/
│   ├── config/
│   │   └── db.js                 # Atlas connection manager with dynamic reconnect listeners
│   ├── controllers/
│   │   └── expenseController.js  # REST Controller routing requests to domain services
│   ├── middleware/
│   │   └── errorHandler.js       # Centralized 404 & 500 error interception
│   ├── models/
│   │   └── Expense.js            # Mongoose schema with computeSummaryStats aggregation
│   ├── routes/
│   │   └── expenseRoutes.js      # Declarative Express routing endpoints
│   ├── services/
│   │   └── expenseService.js     # Decoupled business logic & multi-environment store
│   ├── validators/
│   │   └── expenseValidator.js   # Rule-based input sanitization & constraint checks
│   ├── .env                      # Provided Atlas credentials for evaluator execution
│   ├── .env.example              # Blueprint configuration reference
│   ├── package.json              # Server dependencies and lifecycle scripts
│   └── server.js                 # Server bootstrapping, CORS, and SPA asset pipeline
├── frontend/
│   ├── public/                   # Static icon assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── ConfirmModal.jsx      # Safe deletion confirmation modal
│   │   │   ├── ExpenseForm.jsx       # Add/Edit form with real-time field validation
│   │   │   ├── ExpenseList.jsx       # Responsive ledger with search & category filters
│   │   │   ├── MonthlyAnalytics.jsx  # Interactive Chart.js monthly trend & doughnut graphs
│   │   │   ├── Navbar.jsx            # Application header and status monitors
│   │   │   └── SummaryCards.jsx      # Live expenditure summary and metric badges
│   │   ├── hooks/
│   │   │   └── useExpenses.js        # Custom state & mutation orchestration hook
│   │   ├── services/
│   │   │   └── api.js                # API proxy and fetch abstraction
│   │   ├── utils/
│   │   │   └── formatters.js         # Currency and localized calendar formatters
│   │   ├── App.jsx                   # Composed top-level view
│   │   ├── index.css                 # Custom design tokens (--xtr-*) and styles
│   │   └── main.jsx                  # Virtual DOM bootstrapping
│   ├── index.html
│   ├── vite.config.js                # Vite build pipeline and API reverse-proxy
│   └── package.json                  # Client dependencies
├── .gitignore                        # Preserves backend/.env as per instructions
├── package.json                      # Monorepo root scripts for unified build & dev
├── render.yaml                       # Render cloud deployment blueprint
└── README.md
```

---

## ⚡ Functional Specifications & Verification

1. **Expenditure Entry & Validation**:
   - Accepts `Title`, `Amount`, `Category` (*Food*, *Travel*, *Bills*, *Shopping*, *Other*), and `Date`.
   - Comprehensive rule enforcement: strictly positive non-zero amounts, trimmed strings up to 120 chars, allowed category whitelist, and valid date parsing.
   - Immediate visual toast alerts on outcome.

2. **Ledger Table & Real-Time Sync**:
   - Auto-updating tabular display with category badge indicators and formatted dates.
   - Built-in instant textual search and categorical filtering.
   - All CRUD actions trigger an immediate state re-synchronization without full page reloads.

3. **In-Place Record Modification**:
   - Dedicated edit triggers pre-populate the active form.
   - Allows seamless updates or cancellation back to entry mode.

4. **Guarded Record Deletion**:
   - Two-phase deletion with a custom backdrop modal asking confirmation before dispatching the database removal.

5. **Dynamic Summary & Aggregate Metrics**:
   - Hero card highlighting **Total Expenditure** at the top.
   - Real-time recalculation of total entries, category-wise spending sums, and highest individual transaction.

6. **Monthly Trend Visualizations**:
   - Interactive Bar and Trend line charts depicting spending patterns over calendar months.
   - Doughnut visualization illustrating category proportion across logged entries.

---

## 🔌 API Route Catalog

| HTTP Verb | Path | Purpose | Success Code |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/expenses` | Fetch all records with computed summary totals | `200 OK` |
| **GET** | `/api/expenses/:id` | Fetch a single expense document | `200 OK` |
| **POST** | `/api/expenses` | Validate and store new expense | `201 Created` |
| **PUT** | `/api/expenses/:id` | Validate and update existing expense | `200 OK` |
| **DELETE** | `/api/expenses/:id` | Remove document from database | `200 OK` |
| **GET** | `/api/health` | Service health status | `200 OK` |

---

## 🚀 Local Setup & Testing

### Running the Full Application
```bash
# 1. Clone repository
git clone https://github.com/aadithkrishnaep/personal-expense-tracker.git
cd personal-expense-tracker

# 2. Install all dependencies
npm run install:all

# 3. Start Backend Server
npm run backend
# Listens on http://localhost:5001

# 4. In a second terminal, start Frontend Client
npm run frontend
# Vite starts on http://localhost:3000
```

Alternatively, running `npm start` from root will build and serve the production client bundle directly through Express on `http://localhost:5001`.

---

## ☁️ Render Cloud Hosting

A declarative [`render.yaml`](./render.yaml) is included in the project root:
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Environment**: Node.js Web Service
- **Environment Variables**:
  - `NODE_ENV`: `production`
  - `MONGODB_URI`: `mongodb+srv://userone:userone123@cluster0.mongodb.net/ExpenseTrackerDB?retryWrites=true&w=majority`
