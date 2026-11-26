// DompetKeluarga — main.js
// Hash router + state. State lives in localStorage under one key so the site
// works fully offline; "Reset data contoh" restores the shipped defaults.
import { BUDGET_GROUPS, TRANSACTIONS, SAVINGS_GOALS, BILLS } from './data.js';
import * as views from './views.js';

const STORE_KEY = 'dompetkeluarga-v1';
const ROUTES = ['overview', 'anggaran', 'pengeluaran', 'tabungan', 'tagihan', 'panduan'];

function defaultState() {
  const budgets = {};
  for (const g of BUDGET_GROUPS) for (const c of g.categories) budgets[c.id] = c.planned;
  return {
    budgets,
    transactions: JSON.parse(JSON.stringify(TRANSACTIONS)),
    goals: JSON.parse(JSON.stringify(SAVINGS_GOALS)),
    bills: JSON.parse(JSON.stringify(BILLS)),
    month: '2026-11',
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return defaultState();
    const saved = JSON.parse(raw);
    const base = defaultState();
    return {
      budgets: { ...base.budgets, ...(saved.budgets || {}) },
      transactions: { ...base.transactions, ...(saved.transactions || {}) },
      goals: Array.isArray(saved.goals) ? saved.goals : base.goals,
      bills: Array.isArray(saved.bills) ? saved.bills : base.bills,
      month: saved.month || '2026-11',
    };
  } catch {
    return defaultState();
  }
}

export function saveState(state) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch { /* storage penuh / privat: tetap jalan */ }
}

export function resetState() {
  try { localStorage.removeItem(STORE_KEY); } catch { /* abaikan */ }
  return defaultState();
}

function routeFromHash() {
  const hash = (location.hash || '#/overview').replace(/^#\/?/, '');
  const [route] = hash.split('/');
  return ROUTES.includes(route) ? route : 'overview';
}

function render() {
  const route = routeFromHash();
  const state = loadState();
  document.querySelectorAll('#main-nav a').forEach((a) => {
    a.classList.toggle('active', a.dataset.route === route);
  });
  const view = views[route] || views.overview;
  const app = document.getElementById('app');
  app.innerHTML = view.render(state);
  if (view.mount) view.mount(state, { rerender: render, save: saveState, reset: resetState });
  // Only jump to the top when the route itself changed. Same-page updates
  // (adding a transaction, marking a bill paid) keep the scroll position,
  // so the user stays where they were working.
  if (route !== render.lastRoute) {
    window.scrollTo(0, 0);
    render.lastRoute = route;
  }
}

window.addEventListener('hashchange', render);
render();
