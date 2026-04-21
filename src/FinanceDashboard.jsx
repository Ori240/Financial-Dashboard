import { useState, useEffect, useRef } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar
} from "recharts";
//Data----
const CATEGORIES = ["Food", "Transport", "Housing", "Entertainment", "Health", "Shopping", "Salary", "Freelance", "Investment"];
const CAT_COLORS = {
  Food: "#f97316", Transport: "#06b6d4", Housing: "#8b5cf6",
  Entertainment: "#ec4899", Health: "#10b981", Shopping: "#f59e0b",
  Salary: "#22c55e", Freelance: "#3b82f6", Investment: "#a855f7"
};

const INITIAL_TRANSACTIONS = [
  { id: 1, date: "2025-01-03", description: "Monthly Salary", category: "Salary", amount: 5500, type: "income" },
  { id: 2, date: "2025-01-05", description: "Grocery Store", category: "Food", amount: 120, type: "expense" },
  { id: 3, date: "2025-01-07", description: "Netflix Subscription", category: "Entertainment", amount: 15, type: "expense" },
  { id: 4, date: "2025-01-10", description: "Freelance Project", category: "Freelance", amount: 1200, type: "income" },
  { id: 5, date: "2025-01-12", description: "Electricity Bill", category: "Housing", amount: 95, type: "expense" },
  { id: 6, date: "2025-01-15", description: "Uber Rides", category: "Transport", amount: 45, type: "expense" },
  { id: 7, date: "2025-01-18", description: "Gym Membership", category: "Health", amount: 50, type: "expense" },
  { id: 8, date: "2025-01-20", description: "Online Shopping", category: "Shopping", amount: 230, type: "expense" },
  { id: 9, date: "2025-01-22", description: "Stock Dividend", category: "Investment", amount: 340, type: "income" },
  { id: 10, date: "2025-02-03", description: "Monthly Salary", category: "Salary", amount: 5500, type: "income" },
  { id: 11, date: "2025-02-06", description: "Restaurant", category: "Food", amount: 85, type: "expense" },
  { id: 12, date: "2025-02-10", description: "Freelance Project", category: "Freelance", amount: 800, type: "income" },
  { id: 13, date: "2025-02-14", description: "Valentine Dinner", category: "Entertainment", amount: 175, type: "expense" },
  { id: 14, date: "2025-02-18", description: "Internet Bill", category: "Housing", amount: 60, type: "expense" },
  { id: 15, date: "2025-02-22", description: "Pharmacy", category: "Health", amount: 35, type: "expense" },
  { id: 16, date: "2025-03-03", description: "Monthly Salary", category: "Salary", amount: 5500, type: "income" },
  { id: 17, date: "2025-03-07", description: "Grocery Store", category: "Food", amount: 140, type: "expense" },
  { id: 18, date: "2025-03-10", description: "Bonus Payment", category: "Salary", amount: 1000, type: "income" },
  { id: 19, date: "2025-03-15", description: "New Shoes", category: "Shopping", amount: 189, type: "expense" },
  { id: 20, date: "2025-03-20", description: "Concert Tickets", category: "Entertainment", amount: 120, type: "expense" },
];

const TREND_DATA = [
  { month: "Sep", balance: 8200, income: 6000, expenses: 1800 },
  { month: "Oct", balance: 10400, income: 6700, expenses: 2400 },
  { month: "Nov", balance: 9800, income: 5500, expenses: 2100 },
  { month: "Dec", balance: 12100, income: 7200, expenses: 1900 },
  { month: "Jan", balance: 18760, income: 7040, expenses: 1640 },
  { month: "Feb", balance: 24740, income: 6300, expenses: 1155 },
  { month: "Mar", balance: 30472, income: 6500, expenses: 449 },
];

const MONTHLY_COMPARE = [
  { month: "Jan", income: 7040, expenses: 1640 },
  { month: "Feb", income: 6300, expenses: 1155 },
  { month: "Mar", income: 6500, expenses: 449 },
];

// ─── helper ─────────────────────────────────────────────────────────────────
function fmt(n) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(n);
}
function fmtDate(d) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function generateId() { return Date.now() + Math.random(); }

// ─── ICONS ───────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 18, color }) => {
  const s = { width: size, height: size, display: "inline-block", color };
  const icons = {
    dashboard: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    transactions: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></svg>,
    insights: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    balance: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
    income: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    expense: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>,
    add: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
    edit: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    delete: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
    search: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    filter: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
    sort: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
    moon: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
    sun: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
    close: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    menu: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
    warning: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    check: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
    user: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    sparkle: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/><path d="M19 3l.75 2.25L22 6l-2.25.75L19 9l-.75-2.25L16 6l2.25-.75z"/><path d="M5 17l.75 2.25L8 20l-2.25.75L5 23l-.75-2.25L2 20l2.25-.75z"/></svg>,
    arrow_up: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>,
    arrow_down: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>,
    empty: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    wallet: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 3H8L4 7h16z"/><circle cx="16" cy="13" r="1.5"/></svg>,
  };
  return icons[name] || null;
};

// ─── STYLES ──────────────────────────────────────────────────────────────────
const STYLE = document.createElement("style");
STYLE.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #f5f4f0;
    --surface: #ffffff;
    --surface2: #f0efeb;
    --border: #e5e3dc;
    --text: #1a1915;
    --text2: #6b6860;
    --text3: #9c9a96;
    --accent: #2563eb;
    --accent-light: #dbeafe;
    --green: #059669;
    --green-light: #d1fae5;
    --red: #dc2626;
    --red-light: #fee2e2;
    --amber: #d97706;
    --amber-light: #fef3c7;
    --purple: #7c3aed;
    --purple-light: #ede9fe;
    --sidebar-w: 240px;
    --radius: 14px;
    --shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06);
    --shadow-lg: 0 8px 32px rgba(0,0,0,0.12);
  }

  [data-dark="true"] {
    --bg: #0d0d0f;
    --surface: #17171a;
    --surface2: #1f1f24;
    --border: #2a2a30;
    --text: #f0eff0;
    --text2: #9b9aa0;
    --text3: #5c5b62;
    --accent: #3b82f6;
    --accent-light: #1e3a5f;
    --green: #10b981;
    --green-light: #064e3b;
    --red: #ef4444;
    --red-light: #450a0a;
    --amber: #f59e0b;
    --amber-light: #451a03;
    --purple: #a78bfa;
    --purple-light: #2e1065;
  }

  body, #root { font-family: 'Sora', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; }

  .app { display: flex; min-height: 100vh; }

  /* SIDEBAR */
  .sidebar {
    width: var(--sidebar-w); background: var(--surface); border-right: 1px solid var(--border);
    display: flex; flex-direction: column; padding: 24px 16px;
    position: fixed; top: 0; left: 0; height: 100vh; z-index: 100;
    transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
  }
  .sidebar.hidden { transform: translateX(calc(-1 * var(--sidebar-w))); }
  .sidebar-logo { display: flex; align-items: center; gap: 10px; padding: 4px 8px; margin-bottom: 32px; }
  .sidebar-logo-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: linear-gradient(135deg, var(--accent), #7c3aed);
    display: flex; align-items: center; justify-content: center; color: white;
  }
  .sidebar-logo-text { font-size: 17px; font-weight: 700; letter-spacing: -0.4px; }
  .sidebar-logo-sub { font-size: 10px; color: var(--text3); font-weight: 400; letter-spacing: 0.5px; text-transform: uppercase; }
  .nav-label { font-size: 10px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: var(--text3); padding: 0 8px; margin-bottom: 8px; }
  .nav-item {
    display: flex; align-items: center; gap: 12px; padding: 11px 12px; border-radius: 10px;
    cursor: pointer; transition: all 0.15s; color: var(--text2); font-size: 14px; font-weight: 500;
    border: 1px solid transparent; margin-bottom: 3px;
  }
  .nav-item:hover { background: var(--surface2); color: var(--text); }
  .nav-item.active { background: var(--accent-light); color: var(--accent); border-color: transparent; }
  .sidebar-bottom { margin-top: auto; padding-top: 16px; border-top: 1px solid var(--border); }

  /* TOPBAR */
  .topbar {
    position: fixed; top: 0; left: var(--sidebar-w); right: 0; height: 64px;
    background: var(--surface); border-bottom: 1px solid var(--border);
    display: flex; align-items: center; padding: 0 28px; z-index: 90; gap: 12px;
    transition: left 0.3s cubic-bezier(0.4,0,0.2,1);
  }
  .topbar.full { left: 0; }
  .topbar-title { font-size: 18px; font-weight: 700; letter-spacing: -0.3px; flex: 1; }
  .topbar-actions { display: flex; align-items: center; gap: 10px; }
  .icon-btn {
    width: 38px; height: 38px; border-radius: 10px; border: 1px solid var(--border);
    background: var(--surface); cursor: pointer; display: flex; align-items: center;
    justify-content: center; color: var(--text2); transition: all 0.15s;
  }
  .icon-btn:hover { background: var(--surface2); color: var(--text); }

  /* MAIN */
  .main { margin-left: var(--sidebar-w); padding-top: 64px; flex: 1; transition: margin-left 0.3s cubic-bezier(0.4,0,0.2,1); }
  .main.full { margin-left: 0; }
  .page { padding: 28px; max-width: 1280px; animation: fadeUp 0.4s ease; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

  /* ROLE SWITCHER */
  .role-badge {
    display: flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 999px;
    font-size: 12px; font-weight: 600; cursor: pointer; border: 1.5px solid var(--border);
    background: var(--surface); transition: all 0.15s; white-space: nowrap;
  }
  .role-badge:hover { border-color: var(--accent); color: var(--accent); }
  .role-dot { width: 7px; height: 7px; border-radius: 50%; }
  .role-dot.admin { background: var(--accent); }
  .role-dot.viewer { background: var(--text3); }

  /* CARDS */
  .card {
    background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
    box-shadow: var(--shadow); padding: 24px; transition: box-shadow 0.2s;
  }
  .card:hover { box-shadow: var(--shadow-lg); }
  .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
  .summary-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
    box-shadow: var(--shadow); padding: 22px; display: flex; flex-direction: column; gap: 8px;
    transition: all 0.2s; position: relative; overflow: hidden;
  }
  .summary-card::after {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
  }
  .summary-card.balance::after { background: linear-gradient(90deg, var(--accent), #7c3aed); }
  .summary-card.income::after { background: var(--green); }
  .summary-card.expense::after { background: var(--red); }
  .summary-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); }
  .card-label { font-size: 12px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; color: var(--text3); }
  .card-icon { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 4px; }
  .card-value { font-size: 28px; font-weight: 800; letter-spacing: -1px; font-variant-numeric: tabular-nums; }
  .card-change { display: flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 500; }
  .card-change.up { color: var(--green); }
  .card-change.down { color: var(--red); }

  /* CHARTS GRID */
  .charts-grid { display: grid; grid-template-columns: 1fr 380px; gap: 16px; margin-bottom: 24px; }
  .chart-title { font-size: 15px; font-weight: 700; margin-bottom: 4px; }
  .chart-subtitle { font-size: 12px; color: var(--text3); margin-bottom: 20px; }

  /* TRANSACTIONS */
  .txn-controls { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
  .search-box {
    display: flex; align-items: center; gap: 10px; background: var(--surface);
    border: 1px solid var(--border); border-radius: 10px; padding: 9px 14px; flex: 1; min-width: 200px;
    transition: border-color 0.15s;
  }
  .search-box:focus-within { border-color: var(--accent); }
  .search-box input { border: none; outline: none; background: transparent; font-family: inherit; font-size: 14px; color: var(--text); width: 100%; }
  .search-box input::placeholder { color: var(--text3); }
  .select-control {
    appearance: none; background: var(--surface); border: 1px solid var(--border);
    border-radius: 10px; padding: 9px 36px 9px 14px; font-family: inherit; font-size: 13px;
    color: var(--text); cursor: pointer; outline: none; transition: border-color 0.15s;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b6860' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 12px center;
  }
  .select-control:focus { border-color: var(--accent); }
  .btn {
    display: inline-flex; align-items: center; gap: 7px; padding: 9px 18px; border-radius: 10px;
    font-family: inherit; font-size: 13px; font-weight: 600; cursor: pointer; border: none;
    transition: all 0.15s; white-space: nowrap;
  }
  .btn-primary { background: var(--accent); color: white; }
  .btn-primary:hover { filter: brightness(1.1); transform: translateY(-1px); }
  .btn-danger { background: var(--red-light); color: var(--red); border: 1px solid transparent; }
  .btn-danger:hover { background: var(--red); color: white; }
  .btn-ghost { background: transparent; color: var(--text2); border: 1px solid var(--border); }
  .btn-ghost:hover { background: var(--surface2); color: var(--text); }

  /* TXN TABLE */
  .txn-list { display: flex; flex-direction: column; gap: 8px; }
  .txn-item {
    display: flex; align-items: center; gap: 16px; padding: 14px 18px;
    background: var(--surface); border: 1px solid var(--border); border-radius: 12px;
    transition: all 0.15s; cursor: default;
  }
  .txn-item:hover { border-color: var(--accent); transform: translateX(2px); }
  .txn-cat-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
  .txn-info { flex: 1; min-width: 0; }
  .txn-desc { font-size: 14px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .txn-meta { font-size: 12px; color: var(--text3); display: flex; gap: 10px; margin-top: 2px; }
  .tag { display: inline-flex; padding: 3px 9px; border-radius: 999px; font-size: 11px; font-weight: 600; }
  .tag-income { background: var(--green-light); color: var(--green); }
  .tag-expense { background: var(--red-light); color: var(--red); }
  .txn-amount { font-size: 15px; font-weight: 700; font-variant-numeric: tabular-nums; font-family: 'JetBrains Mono', monospace; }
  .txn-amount.income { color: var(--green); }
  .txn-amount.expense { color: var(--red); }
  .txn-actions { display: flex; gap: 6px; }

  /* INSIGHTS */
  .insights-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
  .insight-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow); padding: 24px; }
  .insight-title { font-size: 14px; font-weight: 700; margin-bottom: 4px; display: flex; align-items: center; gap: 8px; }
  .insight-sub { font-size: 12px; color: var(--text3); margin-bottom: 20px; }
  .cat-bar { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
  .cat-bar-label { font-size: 13px; font-weight: 500; width: 100px; flex-shrink: 0; }
  .cat-bar-track { flex: 1; height: 8px; background: var(--surface2); border-radius: 999px; overflow: hidden; }
  .cat-bar-fill { height: 100%; border-radius: 999px; transition: width 1s ease; }
  .cat-bar-val { font-size: 12px; font-weight: 600; font-family: 'JetBrains Mono', monospace; color: var(--text2); width: 60px; text-align: right; flex-shrink: 0; }
  .obs-item { display: flex; gap: 12px; padding: 12px; border-radius: 10px; background: var(--surface2); margin-bottom: 10px; }
  .obs-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .obs-text { font-size: 13px; line-height: 1.5; }
  .obs-text strong { display: block; font-weight: 600; margin-bottom: 2px; }

  /* MODAL */
  .overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 200;
    display: flex; align-items: center; justify-content: center; padding: 20px;
    backdrop-filter: blur(4px); animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal {
    background: var(--surface); border-radius: 18px; box-shadow: var(--shadow-lg);
    width: 100%; max-width: 480px; overflow: hidden; animation: slideUp 0.3s cubic-bezier(0.4,0,0.2,1);
    border: 1px solid var(--border);
  }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.97); } to { opacity: 1; transform: none; } }
  .modal-header { display: flex; align-items: center; justify-content: space-between; padding: 22px 24px; border-bottom: 1px solid var(--border); }
  .modal-title { font-size: 17px; font-weight: 700; }
  .modal-body { padding: 24px; display: flex; flex-direction: column; gap: 18px; }
  .modal-footer { display: flex; gap: 10px; justify-content: flex-end; padding: 16px 24px; border-top: 1px solid var(--border); }
  .form-group { display: flex; flex-direction: column; gap: 7px; }
  .form-label { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text2); }
  .form-input {
    background: var(--surface2); border: 1.5px solid var(--border); border-radius: 10px;
    padding: 10px 14px; font-family: inherit; font-size: 14px; color: var(--text);
    outline: none; transition: border-color 0.15s; width: 100%;
  }
  .form-input:focus { border-color: var(--accent); }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .type-toggle { display: flex; gap: 8px; }
  .type-btn {
    flex: 1; padding: 10px; border-radius: 10px; border: 1.5px solid var(--border);
    font-family: inherit; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s;
    background: var(--surface2); color: var(--text2);
  }
  .type-btn.active.income { background: var(--green-light); color: var(--green); border-color: var(--green); }
  .type-btn.active.expense { background: var(--red-light); color: var(--red); border-color: var(--red); }

  /* TOASTS */
  .toast-container { position: fixed; bottom: 24px; right: 24px; z-index: 500; display: flex; flex-direction: column; gap: 8px; }
  .toast {
    display: flex; align-items: center; gap: 12px; padding: 14px 18px; background: var(--surface);
    border: 1px solid var(--border); border-radius: 12px; box-shadow: var(--shadow-lg);
    font-size: 13px; font-weight: 500; min-width: 280px; max-width: 380px;
    animation: toastIn 0.3s cubic-bezier(0.4,0,0.2,1);
  }
  @keyframes toastIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: none; } }
  .toast.success { border-left: 3px solid var(--green); }
  .toast.error { border-left: 3px solid var(--red); }
  .toast.info { border-left: 3px solid var(--accent); }
  .toast-icon { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .toast.success .toast-icon { background: var(--green-light); color: var(--green); }
  .toast.error .toast-icon { background: var(--red-light); color: var(--red); }
  .toast.info .toast-icon { background: var(--accent-light); color: var(--accent); }

  /* SKELETON */
  .skeleton {
    background: linear-gradient(90deg, var(--surface2) 25%, var(--border) 50%, var(--surface2) 75%);
    background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 8px;
  }
  @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

  /* EMPTY STATE */
  .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px; gap: 16px; text-align: center; }
  .empty-icon { width: 80px; height: 80px; border-radius: 20px; background: var(--surface2); display: flex; align-items: center; justify-content: center; }
  .empty-title { font-size: 18px; font-weight: 700; }
  .empty-desc { font-size: 14px; color: var(--text3); max-width: 280px; line-height: 1.6; }

  /* PAGINATION */
  .pagination { display: flex; align-items: center; justify-content: space-between; margin-top: 20px; flex-wrap: wrap; gap: 12px; }
  .page-info { font-size: 13px; color: var(--text3); }
  .page-btns { display: flex; gap: 6px; }
  .page-btn {
    width: 34px; height: 34px; border-radius: 8px; border: 1px solid var(--border);
    background: var(--surface); cursor: pointer; font-family: inherit; font-size: 13px;
    color: var(--text2); transition: all 0.15s; display: flex; align-items: center; justify-content: center;
  }
  .page-btn:hover { background: var(--surface2); color: var(--text); }
  .page-btn.active { background: var(--accent); color: white; border-color: var(--accent); }
  .page-btn:disabled { opacity: 0.3; cursor: not-allowed; }

  /* RESPONSIVE */
  @media (max-width: 1024px) {
    .charts-grid { grid-template-columns: 1fr; }
    .insights-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 768px) {
    :root { --sidebar-w: 240px; }
    .summary-grid { grid-template-columns: 1fr; }
    .sidebar { transform: translateX(calc(-1 * var(--sidebar-w))); }
    .sidebar.mobile-open { transform: translateX(0); }
    .topbar { left: 0 !important; }
    .main { margin-left: 0 !important; }
    .page { padding: 16px; }
    .card-value { font-size: 22px; }
    .form-row { grid-template-columns: 1fr; }
  }

  /* SCROLLBAR */
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 999px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--text3); }

  /* CUSTOM TOOLTIP */
  .custom-tooltip { background: var(--surface) !important; border: 1px solid var(--border) !important; border-radius: 10px !important; box-shadow: var(--shadow-lg) !important; padding: 10px 14px !important; font-family: 'Sora', sans-serif !important; }
  .custom-tooltip .label { font-size: 12px; font-weight: 700; color: var(--text3); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
  .custom-tooltip .value { font-size: 14px; font-weight: 600; color: var(--text); }
`;
document.head.appendChild(STYLE);

// ─── TOAST SYSTEM ─────────────────────────────────────────────────────────────
function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          <div className="toast-icon">
            <Icon name={t.type === "success" ? "check" : t.type === "error" ? "warning" : "sparkle"} size={14} />
          </div>
          <span style={{ flex: 1 }}>{t.message}</span>
          <div style={{ cursor: "pointer", color: "var(--text3)" }} onClick={() => removeToast(t.id)}>
            <Icon name="close" size={14} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── CUSTOM TOOLTIP ───────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 14px", boxShadow: "var(--shadow-lg)", fontFamily: "'Sora', sans-serif" }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize: 13, fontWeight: 600, color: p.color, marginBottom: 2 }}>
          {p.name}: {fmt(p.value)}
        </div>
      ))}
    </div>
  );
}

// ─── MODAL ────────────────────────────────────────────────────────────────────
function TxnModal({ txn, onClose, onSave }) {
  const [form, setForm] = useState(txn || {
    description: "", category: "Food", amount: "", type: "expense",
    date: new Date().toISOString().split("T")[0]
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const handleSave = () => {
    if (!form.description || !form.amount || !form.date) return;
    onSave({ ...form, amount: parseFloat(form.amount), id: form.id || generateId() });
  };

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{txn ? "Edit Transaction" : "Add Transaction"}</div>
          <div className="icon-btn" onClick={onClose}><Icon name="close" size={16} /></div>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <div className="form-label">Transaction Type</div>
            <div className="type-toggle">
              {["income", "expense"].map(t => (
                <button key={t} className={`type-btn ${form.type === t ? "active " + t : ""}`} onClick={() => set("type", t)}>
                  <Icon name={t === "income" ? "income" : "expense"} size={14} /> {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <div className="form-label">Description</div>
            <input className="form-input" placeholder="e.g. Coffee, Netflix…" value={form.description} onChange={e => set("description", e.target.value)} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <div className="form-label">Amount (USD)</div>
              <input className="form-input" type="number" placeholder="0.00" value={form.amount} onChange={e => set("amount", e.target.value)} />
            </div>
            <div className="form-group">
              <div className="form-label">Date</div>
              <input className="form-input" type="date" value={form.date} onChange={e => set("date", e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <div className="form-label">Category</div>
            <select className="form-input select-control" value={form.category} onChange={e => set("category", e.target.value)}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>{txn ? "Save Changes" : "Add Transaction"}</button>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────
function DashboardPage({ transactions, isAdmin, onAddClick }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1000); return () => clearTimeout(t); }, []);

  const totalIncome = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const catMap = {};
  transactions.filter(t => t.type === "expense").forEach(t => { catMap[t.category] = (catMap[t.category] || 0) + t.amount; });
  const pieData = Object.entries(catMap).map(([name, value]) => ({ name, value }));

  const SummaryCard = ({ type, label, value, icon, change }) => {
    const colors = { balance: { icon: "var(--accent)", bg: "var(--accent-light)", text: "var(--accent)" }, income: { icon: "var(--green)", bg: "var(--green-light)", text: "var(--green)" }, expense: { icon: "var(--red)", bg: "var(--red-light)", text: "var(--red)" } };
    const c = colors[type];
    if (loading) return <div className={`summary-card ${type}`}><div className="skeleton" style={{ height: 120, borderRadius: 10 }} /></div>;
    return (
      <div className={`summary-card ${type}`}>
        <div className="card-icon" style={{ background: c.bg, color: c.icon }}><Icon name={icon} size={20} /></div>
        <div className="card-label">{label}</div>
        <div className="card-value">{fmt(value)}</div>
        <div className={`card-change ${change > 0 ? "up" : "down"}`}>
          <Icon name={change > 0 ? "arrow_up" : "arrow_down"} size={13} />
          <span>{Math.abs(change)}% from last month</span>
        </div>
      </div>
    );
  };

  return (
    <div className="page">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.5px" }}>Financial Overview</div>
          <div style={{ fontSize: 13, color: "var(--text3)", marginTop: 3 }}>Welcome back! Here's your latest snapshot.</div>
        </div>
        {isAdmin && <button className="btn btn-primary" onClick={onAddClick}><Icon name="add" size={16} /> Add Transaction</button>}
      </div>

      <div className="summary-grid">
        <SummaryCard type="balance" label="Total Balance" value={balance} icon="wallet" change={12.4} />
        <SummaryCard type="income" label="Total Income" value={totalIncome} icon="income" change={8.2} />
        <SummaryCard type="expense" label="Total Expenses" value={totalExpense} icon="expense" change={-3.1} />
      </div>

      <div className="charts-grid">
        <div className="card">
          <div className="chart-title">Balance Trend</div>
          <div className="chart-subtitle">Portfolio growth over the last 7 months</div>
          {loading ? <div className="skeleton" style={{ height: 240, borderRadius: 10 }} /> : (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={TREND_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fontFamily: "Sora", fill: "var(--text3)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fontFamily: "JetBrains Mono", fill: "var(--text3)" }} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="balance" name="Balance" stroke="var(--accent)" strokeWidth={3} dot={{ r: 4, fill: "var(--accent)", strokeWidth: 0 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="income" name="Income" stroke="var(--green)" strokeWidth={2} strokeDasharray="4 2" dot={false} />
                <Line type="monotone" dataKey="expenses" name="Expenses" stroke="var(--red)" strokeWidth={2} strokeDasharray="4 2" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card">
          <div className="chart-title">Spending Breakdown</div>
          <div className="chart-subtitle">Expenses by category</div>
          {loading ? <div className="skeleton" style={{ height: 240, borderRadius: 10 }} /> : pieData.length === 0 ? (
            <div className="empty-state" style={{ padding: 40 }}>
              <div style={{ fontSize: 13, color: "var(--text3)" }}>No expense data yet</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="45%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                  {pieData.map((entry, i) => <Cell key={i} fill={CAT_COLORS[entry.name] || "#888"} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, fontFamily: "Sora" }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div>
            <div className="chart-title">Recent Transactions</div>
            <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>Last 5 activities</div>
          </div>
        </div>
        {transactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><Icon name="empty" size={36} color="var(--text3)" /></div>
            <div className="empty-title">No transactions yet</div>
            <div className="empty-desc">Start tracking your finances by adding your first transaction.</div>
          </div>
        ) : (
          <div className="txn-list">
            {[...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5).map(t => (
              <div key={t.id} className="txn-item">
                <div className="txn-cat-dot" style={{ background: CAT_COLORS[t.category] || "#888" }} />
                <div className="txn-info">
                  <div className="txn-desc">{t.description}</div>
                  <div className="txn-meta"><span>{fmtDate(t.date)}</span><span>{t.category}</span></div>
                </div>
                <div className={`txn-amount ${t.type}`}>{t.type === "income" ? "+" : "-"}{fmt(t.amount)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── TRANSACTIONS PAGE ────────────────────────────────────────────────────────
function TransactionsPage({ transactions, setTransactions, isAdmin, showToast }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null);
  const PER_PAGE = 8;

  const filtered = transactions
    .filter(t => (filter === "all" || t.type === filter) && (t.description.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase())))
    .sort((a, b) => {
      const m = sortDir === "asc" ? 1 : -1;
      return sortBy === "date" ? m * (new Date(a.date) - new Date(b.date)) : m * (a.amount - b.amount);
    });

  const pages = Math.ceil(filtered.length / PER_PAGE);
  const shown = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleDelete = (id) => {
    setTransactions(p => p.filter(t => t.id !== id));
    showToast("Transaction deleted", "error");
  };
  const handleSave = (txn) => {
    if (txn.id && transactions.find(t => t.id === txn.id)) {
      setTransactions(p => p.map(t => t.id === txn.id ? txn : t));
      showToast("Transaction updated", "success");
    } else {
      setTransactions(p => [txn, ...p]);
      showToast("Transaction added", "success");
    }
    setModal(null);
  };

  const toggleSort = (k) => { if (sortBy === k) setSortDir(p => p === "asc" ? "desc" : "asc"); else { setSortBy(k); setSortDir("desc"); } };

  return (
    <div className="page">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.5px" }}>Transactions</div>
          <div style={{ fontSize: 13, color: "var(--text3)", marginTop: 3 }}>{filtered.length} records found</div>
        </div>
        {isAdmin && <button className="btn btn-primary" onClick={() => setModal({})}><Icon name="add" size={16} /> New Transaction</button>}
      </div>

      <div className="card">
        <div className="txn-controls">
          <div className="search-box">
            <Icon name="search" size={16} color="var(--text3)" />
            <input placeholder="Search transactions…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <select className="select-control" value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }}>
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <button className="btn btn-ghost" onClick={() => toggleSort("date")} style={{ gap: 6 }}>
            <Icon name="sort" size={14} /> Date {sortBy === "date" && (sortDir === "asc" ? "↑" : "↓")}
          </button>
          <button className="btn btn-ghost" onClick={() => toggleSort("amount")} style={{ gap: 6 }}>
            <Icon name="filter" size={14} /> Amount {sortBy === "amount" && (sortDir === "asc" ? "↑" : "↓")}
          </button>
        </div>

        {shown.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><Icon name="search" size={36} color="var(--text3)" /></div>
            <div className="empty-title">No results found</div>
            <div className="empty-desc">Try adjusting your search or filter criteria.</div>
          </div>
        ) : (
          <>
            <div className="txn-list">
              {shown.map(t => (
                <div key={t.id} className="txn-item">
                  <div className="txn-cat-dot" style={{ background: CAT_COLORS[t.category] || "#888" }} />
                  <div className="txn-info">
                    <div className="txn-desc">{t.description}</div>
                    <div className="txn-meta"><span>{fmtDate(t.date)}</span></div>
                  </div>
                  <span className={`tag tag-${t.type}`}>{t.type}</span>
                  <span style={{ fontSize: 12, color: "var(--text3)", minWidth: 80, textAlign: "center" }}>{t.category}</span>
                  <div className={`txn-amount ${t.type}`}>{t.type === "income" ? "+" : "-"}{fmt(t.amount)}</div>
                  {isAdmin && (
                    <div className="txn-actions">
                      <div className="icon-btn" onClick={() => setModal(t)}><Icon name="edit" size={14} /></div>
                      <div className="icon-btn" style={{ borderColor: "var(--red-light)", color: "var(--red)" }} onClick={() => handleDelete(t.id)}><Icon name="delete" size={14} /></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="pagination">
              <div className="page-info">Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}</div>
              <div className="page-btns">
                <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
                {Array.from({ length: pages }, (_, i) => (
                  <button key={i + 1} className={`page-btn ${page === i + 1 ? "active" : ""}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
                ))}
                <button className="page-btn" disabled={page === pages} onClick={() => setPage(p => p + 1)}>›</button>
              </div>
            </div>
          </>
        )}
      </div>

      {modal !== null && <TxnModal txn={modal.id ? modal : null} onClose={() => setModal(null)} onSave={handleSave} />}
    </div>
  );
}

// ─── INSIGHTS PAGE ────────────────────────────────────────────────────────────
function InsightsPage({ transactions }) {
  const expenseByCategory = {};
  transactions.filter(t => t.type === "expense").forEach(t => { expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount; });
  const sortedCats = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1]);
  const maxSpend = sortedCats[0]?.[1] || 1;
  const topCat = sortedCats[0]?.[0] || "N/A";
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const totalIncome = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome * 100).toFixed(1) : 0;

  return (
    <div className="page">
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.5px" }}>Financial Insights</div>
        <div style={{ fontSize: 13, color: "var(--text3)", marginTop: 3 }}>Smart observations from your financial data</div>
      </div>

      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 20 }}>
        {[
          { label: "Savings Rate", value: `${savingsRate}%`, color: "var(--green)", bg: "var(--green-light)", desc: "of income saved" },
          { label: "Top Spending", value: topCat, color: "var(--red)", bg: "var(--red-light)", desc: `${fmt(maxSpend)} total` },
          { label: "Avg. Expense", value: fmt(totalExpense / Math.max(transactions.filter(t => t.type === "expense").length, 1)), color: "var(--amber)", bg: "var(--amber-light)", desc: "per transaction" },
        ].map((k, i) => (
          <div key={i} className="card" style={{ borderLeft: `3px solid ${k.color}` }}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text3)", marginBottom: 8 }}>{k.label}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: k.color, letterSpacing: "-0.5px" }}>{k.value}</div>
            <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 4 }}>{k.desc}</div>
          </div>
        ))}
      </div>

      <div className="insights-grid">
       
        <div className="insight-card">
          <div className="insight-title"><Icon name="expense" size={16} color="var(--red)" /> Spending by Category</div>
          <div className="insight-sub">Ranked by total amount</div>
          {sortedCats.length === 0 ? (
            <div style={{ fontSize: 13, color: "var(--text3)", padding: "20px 0" }}>No expense data available</div>
          ) : sortedCats.slice(0, 6).map(([cat, amount]) => (
            <div key={cat} className="cat-bar">
              <div className="cat-bar-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: CAT_COLORS[cat] || "#888", flexShrink: 0 }} />
                {cat}
              </div>
              <div className="cat-bar-track">
                <div className="cat-bar-fill" style={{ width: `${(amount / maxSpend) * 100}%`, background: CAT_COLORS[cat] || "#888" }} />
              </div>
              <div className="cat-bar-val">{fmt(amount)}</div>
            </div>
          ))}
        </div>

        
        <div className="insight-card">
          <div className="insight-title"><Icon name="insights" size={16} color="var(--accent)" /> Monthly Comparison</div>
          <div className="insight-sub">Income vs expenses last 3 months</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MONTHLY_COMPARE} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fontFamily: "Sora", fill: "var(--text3)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fontFamily: "JetBrains Mono", fill: "var(--text3)" }} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="income" name="Income" fill="var(--green)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="var(--red)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        
        <div className="insight-card" style={{ gridColumn: "1 / -1" }}>
          <div className="insight-title"><Icon name="sparkle" size={16} color="var(--amber)" /> Smart Observations</div>
          <div className="insight-sub">AI-powered analysis of your financial patterns</div>
          <div>
            {[
              {
                icon: "income", color: "var(--green)", bg: "var(--green-light)",
                title: "Strong savings rate",
                text: `You're saving ${savingsRate}% of your income — that's excellent! Financial experts recommend at least 20%.`
              },
              {
                icon: "warning", color: "var(--amber)", bg: "var(--amber-light)",
                title: `High spend on ${topCat}`,
                text: `${topCat} is your biggest expense at ${fmt(maxSpend)}. Consider reviewing if there are optimization opportunities.`
              },
              {
                icon: "insights", color: "var(--accent)", bg: "var(--accent-light)",
                title: "Positive balance trend",
                text: `Your balance grew by 23% over the last quarter. Keep maintaining discipline with consistent income sources.`
              },
              {
                icon: "sparkle", color: "var(--purple)", bg: "var(--purple-light)",
                title: "Diversified income",
                text: `You have multiple income sources (salary, freelance, investments) which provides great financial resilience.`
              },
            ].map((o, i) => (
              <div key={i} className="obs-item">
                <div className="obs-icon" style={{ background: o.bg, color: o.color }}><Icon name={o.icon} size={16} /></div>
                <div className="obs-text"><strong>{o.title}</strong>{o.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [role, setRole] = useState("admin");
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => { document.documentElement.setAttribute("data-dark", dark); }, [dark]);

  const showToast = (message, type = "info") => {
    const id = generateId();
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  };
  const removeToast = (id) => setToasts(p => p.filter(t => t.id !== id));

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "transactions", label: "Transactions", icon: "transactions" },
    { id: "insights", label: "Insights", icon: "insights" },
  ];

  const isAdmin = role === "admin";
  const isMobile = window.innerWidth <= 768;

  const handleAddSave = (txn) => {
    setTransactions(p => [txn, ...p]);
    showToast("Transaction added successfully", "success");
    setShowAddModal(false);
  };

  const pageTitle = navItems.find(n => n.id === page)?.label || "";

  return (
    <div className="app">
      
      {mobileSidebar && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 99 }} onClick={() => setMobileSidebar(false)} />}

      
      <div className={`sidebar ${!sidebarOpen && !isMobile ? "hidden" : ""} ${mobileSidebar ? "mobile-open" : ""}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon"><Icon name="wallet" size={18} /></div>
          <div>
            <div className="sidebar-logo-text">Truvio</div>
            <div className="sidebar-logo-sub">Finance Tracker</div>
          </div>
        </div>
        
        {navItems.map(n => (
          <div key={n.id} className={`nav-item ${page === n.id ? "active" : ""}`} onClick={() => { setPage(n.id); setMobileSidebar(false); }}>
            <Icon name={n.icon} size={17} />
            {n.label}
          </div>
        ))}
        <div className="sidebar-bottom">
          <div className="nav-item" onClick={() => setDark(d => !d)}>
            <Icon name={dark ? "sun" : "moon"} size={17} />
            {dark ? "Light Mode" : "Dark Mode"}
          </div>
          <div className="nav-item">
            <Icon name="user" size={17} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Arindam Rui Das</div>
              <div style={{ fontSize: 11, color: "var(--text3)" }}>arindam@gmail.com</div>
            </div>
          </div>
        </div>
      </div>

      
      <div className={`topbar ${!sidebarOpen ? "full" : ""}`}>
        <div className="icon-btn" onClick={() => isMobile ? setMobileSidebar(p => !p) : setSidebarOpen(p => !p)}>
          <Icon name="menu" size={18} />
        </div>
        <div className="topbar-title">{pageTitle}</div>
        <div className="topbar-actions">
          

          <div className="role-badge" onClick={() => { setRole(r => r === "admin" ? "viewer" : "admin"); showToast(`Switched to ${role === "admin" ? "Viewer" : "Admin"} mode`, "info"); }}>
            <div className={`role-dot ${role}`} />
            {role === "admin" ? "Admin" : "Viewer"}
          </div>
          <div className="icon-btn" onClick={() => setDark(d => !d)}><Icon name={dark ? "sun" : "moon"} size={16} /></div>
        </div>
      </div>

      
      <div className={`main ${!sidebarOpen && !isMobile ? "full" : ""}`}>
        {page === "dashboard" && (
          <DashboardPage transactions={transactions} isAdmin={isAdmin} onAddClick={() => setShowAddModal(true)} />
        )}
        {page === "transactions" && (
          <TransactionsPage transactions={transactions} setTransactions={setTransactions} isAdmin={isAdmin} showToast={showToast} />
        )}
        {page === "insights" && (
          <InsightsPage transactions={transactions} />
        )}
      </div>

      {showAddModal && <TxnModal onClose={() => setShowAddModal(false)} onSave={handleAddSave} />}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
