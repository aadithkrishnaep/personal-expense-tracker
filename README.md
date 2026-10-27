# Personal Expense Tracker (MERN Stack)

> **Exit Examination: Full Stack Development (MERN)**  
> **Final Assessment - A1, B1, C1, D1**  
> Candidate: **Aadith Krishna**

A full-stack web application designed to help users record, track, and manage their daily personal expenses efficiently. Built using the **MERN Stack** (MongoDB Atlas, Express.js, React.js, Node.js) following RESTful architecture and clean coding standards.

---

## 🚀 Key Features

1. **Add Expense**:
   - Comprehensive form with inputs for **Title**, **Amount**, **Category** (*Food*, *Travel*, *Bills*, *Shopping*, *Other*), and **Date**.
   - Strict validation preventing empty fields or invalid/negative values.
   - Saves records to **MongoDB Atlas** via RESTful API.
   - Instant visual feedback with success and error toast notifications.

2. **View Expenses**:
   - Real-time display of all saved expenses in a clean, responsive table (with mobile card adaptations).
   - Shows Title, Category badge with icons, Formatted Date, and Amount in currency (`₹`).
   - Automatically refreshes after any Create, Read, Update, or Delete operation without manual page reloads.
   - Built-in live search and category filter.

3. **Edit Expense**:
   - Dedicated **Edit** action on every record.
   - Pre-fills the form with existing expense data.
   - Updates the record in MongoDB Atlas and refreshes the screen seamlessly.
   - Option to cancel edit mode at any time.

4. **Delete Expense**:
   - Dedicated **Delete** action on each record.
   - Confirmation dialog before deletion to prevent accidental loss of data.
   - Removes record from the database and updates UI immediately.

5. **Live Financial Summary**:
   - Prominently displays **Total Amount Spent** at the top of the application.
   - Displays **Total Number of Transactions** and **Highest Single Expense**.
   - Displays real-time spending breakdowns for each category.
   - Dynamically recalculates whenever an expense is added, edited, or deleted.

6. **Modern, Responsive UI/UX**:
   - Beautiful, clean interface built with Bootstrap 5 and modern responsive CSS.
   - Intuitive layout optimized for both mobile and desktop screens.

---

## 📁 Repository Structure

```text
personal-expense-tracker/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB Atlas connection setup & resiliency
│   ├── controllers/
│   │   └── expenseController.js  # CRUD controller logic & validation
│   ├── models/
│   │   └── Expense.js            # Mongoose Schema & Model definition
│   ├── routes/
│   │   └── expenseRoutes.js      # RESTful route definitions
│   ├── .env                      # Environment variables (included as required)
│   ├── .env.example              # Example environment configuration
│   ├── package.json              # Backend dependencies and scripts
│   └── server.js                 # Express server entry point & middleware
├── frontend/
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation header with date and status
│   │   │   ├── SummaryCards.jsx  # Total Amount Spent & category breakdown
│   │   │   ├── ExpenseForm.jsx   # Add & Edit expense form with validation
│   │   │   ├── ExpenseList.jsx   # Filterable expenses table and action buttons
│   │   │   └── ConfirmModal.jsx  # Delete confirmation dialog
│   │   ├── services/
│   │   │   └── api.js            # Frontend API client
│   │   ├── App.jsx               # Main application container & state logic
│   │   ├── index.css             # Custom styles and responsive rules
│   │   └── main.jsx              # React DOM entry point
│   ├── index.html                # HTML template
│   ├── vite.config.js            # Vite build and proxy config
│   └── package.json              # Frontend dependencies and scripts
├── .gitignore                    # Git ignore file (preserves backend/.env)
├── package.json                  # Root runner scripts
└── README.md                     # Project documentation
```

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite 6, Bootstrap 5, Bootstrap Icons
- **Backend**: Node.js, Express.js, CORS, Morgan, Dotenv
- **Database**: MongoDB Atlas with Mongoose ODM
- **Architecture**: RESTful APIs (JSON)

---

## 📡 REST API Endpoints

| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/expenses` | Retrieve all expenses & summary total | None |
| **GET** | `/api/expenses/:id` | Retrieve single expense by ID | None |
| **POST** | `/api/expenses` | Create a new expense | `{ title, amount, category, date }` |
| **PUT** | `/api/expenses/:id` | Update an existing expense | `{ title, amount, category, date }` |
| **DELETE** | `/api/expenses/:id` | Delete an expense by ID | None |
| **GET** | `/api/health` | Health check endpoint | None |

---

## ⚙️ Installation & Running the Project

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### 1. Clone the Repository
```bash
git clone https://github.com/aadithkrishnaep/personal-expense-tracker.git
cd personal-expense-tracker
```

### 2. Backend Setup
```bash
cd backend
npm install
npm start
```
*The backend server will start on `http://localhost:5001` (or fallback port if 5001 is occupied).*

#### Environment Variables (`backend/.env`):
```env
PORT=5001
MONGODB_URI=mongodb+srv://userone:userone123@cluster0.mongodb.net/ExpenseTrackerDB?retryWrites=true&w=majority
NODE_ENV=development
```
*(As specified in the assessment guidelines, a dummy/test MongoDB Atlas URI is provided directly in `backend/.env` so evaluators can run the project immediately without configuration).*

### 3. Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
*The React client will run on `http://localhost:3000` (or the next available port) and proxies API requests automatically to the backend.*

---

## ☁️ Deployment on Render

This project is fully configured for zero-friction deployment on [Render](https://render.com).

### Option 1: Render Blueprint (Automatic via `render.yaml`)
1. Log in to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** -> **Blueprint**.
3. Connect your repository `personal-expense-tracker`.
4. Render will read `render.yaml` and configure the Web Service automatically!
5. Click **Apply**.

### Option 2: Manual Web Service Setup on Render
1. In Render Dashboard, click **New +** -> **Web Service**.
2. Connect your GitHub repository `personal-expense-tracker`.
3. Fill in the deployment details:
   - **Name**: `personal-expense-tracker`
   - **Environment**: `Node`
   - **Region**: Any (e.g. Oregon or Frankfurt)
   - **Branch**: `main`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
4. Under **Environment Variables**, add:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: `mongodb+srv://userone:userone123@cluster0.mongodb.net/ExpenseTrackerDB?retryWrites=true&w=majority`
5. Click **Create Web Service**.
Your full-stack application will be live at `https://<service-name>.onrender.com`!

---

## 📋 Evaluation Checklist Verification

- [x] **Repository Structure**: Contains `frontend/` and `backend/` folders in root.
- [x] **Environment Variables**: `.env` file included with database URI and port.
- [x] **Dependencies**: `package.json` files fully define all dependencies for frontend and backend.
- [x] **MongoDB Atlas**: Connects using Mongoose with resilient fallback handling.
- [x] **CRUD Operations**: Add, View, Edit, and Delete all function end-to-end.
- [x] **Live Summary**: Total Amount Spent updates automatically on every action without page refresh.
- [x] **Data Validation**: Client and server-side validation rejecting empty or negative amounts.
- [x] **Delete Confirmation**: Prompt/modal confirms before permanently deleting an expense.
- [x] **Responsive UI/UX**: Clean, attractive interface styled for both mobile and desktop screens.
