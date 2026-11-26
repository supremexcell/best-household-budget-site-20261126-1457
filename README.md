# DompetKeluarga — Anggaran Rumah Tangga

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/supremexcell/best-household-budget-site-20261126-1457/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/supremexcell/best-household-budget-site-20261126-1457/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

A household budget site for an Indonesian family, built for make.fun's **Make the best household budget site** bounty ($50, top 10 places). Original design, text and figures — no other site's brand, text or images. Every reference figure is real, sourced and dated.

## What it is

DompetKeluarga (“family wallet”) follows one sample household — Keluarga Rahma, Jakarta, 4 people, Rp 12.5 million a month — through the six pages a family keeping its budget needs, all reached from the nav:

- **Ringkasan** — income vs spending, savings rate, a donut of where the money went, savings snapshot, latest transactions; month switcher (November / October 2026)
- **Anggaran** — monthly budget plan by category, editable in place with live totals and a 50/30/20 comparison against income
- **Pengeluaran** — transaction ledger with add form, category filter, delete, and monthly total
- **Tabungan** — three savings goals with progress bars, add-a-contribution controls, and a new-goal form
- **Tagihan** — recurring bills with due dates and mark-as-paid toggles
- **Panduan** — 50/30/20 calculator, official reference figures, and six budgeting habits

All data persists in the browser's localStorage, so the site works fully offline and every control does what it says.

## The figures

Reference figures, all verified 27 November 2026:

| Indicator | Value | Source |
| --- | --- | --- |
| UMP DKI Jakarta 2025 | Rp 5.396.761 | Keputusan Gubernur DKI Jakarta 829/2024 |
| UMP DKI Jakarta 2026 | Rp 5.729.876 | Keputusan Gubernur DKI Jakarta 1142/2025, +6,17% |
| Pengeluaran per kapita DKI Jakarta | Rp 2.962.412 / month | BPS, Susenas Maret 2025 |
| Konsumsi rumah tangga Jakarta | ± Rp 14,88 million / month | BPS, Survei Biaya Hidup 2022 |
| Rata-rata gaji nasional | Rp 3.094.818 / month | BPS, Sakernas Februari 2025 |
| Kebutuhan Hidup Layak Jakarta 2025 | Rp 5.898.511 / month | Kementerian Ketenagakerjaan |

The sample household's own budget is a realistic example, not a claim about any real family; the full dataset lives in `app/data.js`.

## How it works

Static files under `app/` — no build step, no libraries, no network requests. Charts are hand-rolled SVG drawn from `app/data.js` by `app/charts.js`; pages render from `app/views.js` through a hash router in `app/main.js`. Open it with any static server:

```sh
node serve.ts
# then open http://localhost:8080
```

Desktop (1280px) and phone (390px) layouts included. `main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library (`vendor/makefun-frontend.ts`, unchanged from the kit).

## Layout

```text
main.ts                  # hand-in program (Node 22)
serve.ts                 # tiny static server for local testing
LICENSE                  # MIT
app/
  index.html             # shell + nav
  style.css              # blue/green theme, responsive
  main.js                # hash router + localStorage state
  data.js                # sample household + reference figures
  charts.js              # hand-rolled SVG donut / bar charts
  views.js               # one render function per page
screenshots/             # real renders: overview, budget, expenses, phone
vendor/
  makefun-frontend.ts    # kit copy, unchanged
.makefun/
  owner.json             # entry wallet claim
```
