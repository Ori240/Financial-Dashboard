# 💰 Finance Dashboard UI

> A beginner-friendly personal finance tracker built with React + Vite + Tailwind CSS + Recharts.
> Track your income, expenses, and balance — all in one clean dashboard!

![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38BDF8?style=flat-square&logo=tailwindcss)
![Recharts](https://img.shields.io/badge/Recharts-2.x-22b5bf?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## 📌 Project Overview

**Finance Dashboard UI** is a simple frontend web app that helps you visualize and manage your personal finances. It shows your total balance, income, and expenses using charts and transaction lists. There is **no backend** — all data is stored using mock data and local state.

This project is perfect for:
- Learning React and Tailwind CSS
- Building a portfolio project
- Understanding how financial dashboards work

---

 Features

- 📊 **Dashboard Overview** — See your Total Balance, Income, and Expenses at a glance
- 📈 **Charts** — Line chart for balance trends + Pie chart for spending by category
- 💳 **Transactions List** — Search, filter, and sort your transactions easily
- 🔐 **Role-Based UI** — Switch between Admin (can add/edit/delete) and Viewer (read-only)
- 🧠 **Insights Section** — View spending analysis and smart financial observations
- 🌙 **Dark Mode** — Toggle between light and dark themes
- 📱 **Responsive Design** — Works on desktop, tablet, and mobile
- 🔔 **Toast Notifications** — Get feedback when you add, edit, or delete a transaction

---

## 🛠️ Tech Stack

| Tool | Purpose |
|---|---|
| [React](https://reactjs.org/) | UI components and state management |
| [Vite](https://vitejs.dev/) | Fast development build tool |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |
| [Recharts](https://recharts.org/) | Charts and data visualization |
| [PostCSS](https://postcss.org/) | CSS processing (used with Tailwind) |

---

## 📁 Folder Structure

This is the **exact folder structure** of this project:

```
FINANCE-DASHBOARD/
│
├── node_modules/            # All installed packages (auto-generated)
│
├── public/                  # Static files (favicon, etc.)
│
├── src/                     # All your source code lives here
│   ├── assets/              # Images, icons, and static assets
│   ├── App.css              # Global styles for App component
│   ├── App.jsx              # Root component — sets up layout
│   ├── FinanceDashboard.jsx # Main dashboard component (all features)
│   ├── index.css            # Global CSS + Tailwind base imports
│   └── main.jsx             # Entry point — renders App into the DOM
│
├── .gitignore               # Files to ignore when pushing to GitHub
├── eslint.config.js         # Code linting rules
├── index.html               # HTML entry file (Vite uses this)
├── package-lock.json        # Exact version lock for all packages
├── package.json             # Project info and dependencies list
├── postcss.config.js        # PostCSS config (required for Tailwind)
├── README.md                # You are reading this file!
├── tailwind.config.js       # Tailwind CSS configuration
└── vite.config.js           # Vite build tool configuration
```

---

## ⚙️ Installation & Setup

Follow these steps one by one. Don't skip any!

### ✅ Step 1 — Make sure Node.js is installed

Open your terminal and run:

```bash
node -v
```

You should see something like `v18.x.x`.
If not, download and install Node.js from 👉 [nodejs.org](https://nodejs.org/)

---

### ✅ Step 2 — Clone this project

```bash
git clone https://github.com/your-username/finance-dashboard.git
```

Then navigate into the project folder:

```bash
cd finance-dashboard
```

---

### ✅ Step 3 — Install all packages

```bash
npm install
```

> This reads `package.json` and installs React, Vite, Tailwind, Recharts, and everything else.

---

### ✅ Step 4 — Start the development server

```bash
npm run dev
```

---

### ✅ Step 5 — Open in your browser

```
http://localhost:5173
```

🎉 Your Finance Dashboard is now live locally!

---

### 🔨 Other Useful Commands

| Command | What it does |
|---|---|
| `npm run dev` | Start the local development server |
| `npm run build` | Build the app for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Check your code for errors using ESLint |

---

## 🚀 Usage Guide

Here's how to use every feature of the dashboard:

| What you want to do | How to do it |
|---|---|
| View balance summary | Open the **Dashboard** tab in the sidebar |
| See spending charts | Scroll down on the Dashboard page |
| View all transactions | Click **Transactions** in the sidebar |
| Search a transaction | Type in the **search bar** at the top |
| Filter by type | Use the **Income / Expense dropdown** |
| Sort transactions | Click the **Date** or **Amount** sort button |
| Add a new transaction | Click **"New Transaction"** *(Admin only)* |
| Edit or Delete a row | Use the **pencil / trash icons** *(Admin only)* |
| Switch Admin or Viewer | Click the **role badge** in the top bar |
| Turn on Dark Mode | Click the **moon icon** in the topbar or sidebar |



---

## 🧠 Approach & Design Decisions

Here's the thinking behind key choices — useful for explaining in interviews!

**1. Why Vite instead of Create React App?**
Vite starts the dev server almost instantly (under 1 second), while CRA can take 15–30 seconds. Vite is now the industry standard for new React projects.

**2. Why Tailwind CSS?**
Tailwind lets you style components using utility classes directly in JSX — no switching between CSS files. It keeps styling fast, consistent, and easy to customize.

**3. Why no backend?**
Keeping it frontend-only means anyone can clone and run this project in 2 minutes — no database setup, no environment variables, no server configuration needed.

**4. Why keep everything in FinanceDashboard.jsx?**
For learning purposes, having all logic in one file makes it easy to trace the full data flow. In a real production app, this would be split into many smaller component files.

**5. Why Recharts?**
Recharts uses React components to build charts — no extra canvas or DOM manipulation. It fits naturally into the React way of thinking and is very beginner-friendly.

**6. Role-Based UI without real authentication**
A simple toggle button simulates Admin vs Viewer modes. This demonstrates conditional rendering and role-based access control patterns without needing a backend or JWT setup.

---

## 📸 Screenshots

### 🏠 Dashboard Overview
```
[ Screenshot: Summary cards showing Balance, Income, Expenses
  + Line chart for trends + Pie chart for categories ]
```

### 💳 Transactions Page
```
[ Screenshot: Search bar + Filter dropdown + Sorted transaction
  list with pagination controls ]
```

### 🧠 Insights Page
```
[ Screenshot: KPI cards + Category spending bars
  + Monthly bar chart + Smart observations ]
```

### 🌙 Dark Mode
```
[ Screenshot: Full dashboard in dark theme ]
```

### ➕ Add Transaction Modal
```
[ Screenshot: Popup form with Income/Expense toggle,
  description, amount, date, and category fields ]
```

---

## 🔮 Future Improvements

Things that could be added to make this project even better:

- [ ] Save data to `localStorage` so it persists after page refresh
- [ ] Connect a real backend using Node.js + Express + MongoDB
- [ ] Add user login and signup with JWT authentication
- [ ] Export transactions to a downloadable CSV file
- [ ] Add monthly budget goals with progress bars per category
- [ ] Add date range picker to filter charts and transactions
- [ ] Write unit and integration tests using Vitest + React Testing Library
- [ ] Deploy the project to Vercel or Netlify with a live public URL
- [ ] Add multi-currency support with conversion rates
- [ ] Build it as a PWA (Progressive Web App) for mobile installation

---

## 🤝 Contributing

Want to improve this project? Here's how — even if you're new to GitHub:

1. Click **Fork** at the top of this GitHub repo page
2. Clone your forked copy:
   ```bash
   git clone https://github.com/your-username/finance-dashboard.git
   ```
3. Create a new branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. Make your changes, then save
5. Commit your changes:
   ```bash
   git commit -m "Add: short description of your change"
   ```
6. Push to GitHub:
   ```bash
   git push origin feature/your-feature-name
   ```
7. Go to GitHub and open a **Pull Request**



## ✅ Conclusion

**Finance Dashboard UI** is a well-rounded beginner React project that demonstrates:

- ✅ Component-based architecture with React and JSX
- ✅ Fast modern tooling with Vite
- ✅ Clean responsive styling with Tailwind CSS
- ✅ Data visualization using Recharts
- ✅ React Hooks for state and side-effect management
- ✅ Role-based access control without a backend
- ✅ Dark mode, modals, toasts, and empty states

Whether you're building this to learn React or adding it to your developer portfolio, this project covers real-world frontend skills that employers look for. Fork it, customize it, and make it your own! 🚀

---

<div align="center">

Made with ❤️ by <a href="https://github.com/Ori240">Your Name</a>

<br/><br/>

<a href="https://github.com/your-username/finance-dashboard">⭐ Star this repo on GitHub</a> &nbsp;•&nbsp;
<a href="https://your-demo-link.vercel.app">🌐 View Live Demo</a> &nbsp;•&nbsp;
<a href="https://linkedin.com/in/your-profile">💼 Connect on LinkedIn</a>

</div>
