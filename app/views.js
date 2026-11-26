// DompetKeluarga — views.js
// Six hash-routed pages. Every control does what it says: inputs recalculate
// live, forms add real rows, toggles persist. All figures come from data.js.
import {
  HOUSEHOLD, INCOME, BUDGET_GROUPS, MONTHS, REFERENCE_FIGURES, TIPS,
  formatRupiah, formatShort, formatDate, categoryLabel, totalIncome,
} from './data.js';
import { donutChart, barRows, progressBar, palette } from './charts.js';

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function monthTransactions(state) {
  return state.transactions[state.month] || [];
}

function spentByGroup(state) {
  const byGroup = {};
  for (const g of BUDGET_GROUPS) byGroup[g.id] = 0;
  for (const tx of monthTransactions(state)) {
    for (const g of BUDGET_GROUPS) {
      if (g.categories.some((c) => c.id === tx.category)) byGroup[g.id] += tx.amount;
    }
  }
  return byGroup;
}

// ---------------------------------------------------------------- overview
export const overview = {
  render(state) {
    const tx = monthTransactions(state);
    const spent = tx.reduce((s, t) => s + t.amount, 0);
    const income = totalIncome();
    const remaining = income - spent;
    const rate = Math.round((remaining / income) * 100);
    const byGroup = spentByGroup(state);
    const segments = BUDGET_GROUPS.map((g, i) => ({
      label: g.label, value: byGroup[g.id], color: palette(i),
    })).filter((s) => s.value > 0);
    const monthLabel = (MONTHS.find((m) => m.id === state.month) || MONTHS[0]).label;
    const recent = [...tx].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 6);
    const goalsTotal = state.goals.reduce((s, g) => s + g.saved, 0);
    const goalsTarget = state.goals.reduce((s, g) => s + g.target, 0);
    return `
    <h1>Ringkasan ${esc(monthLabel)}</h1>
    <p class="lede">${esc(HOUSEHOLD.name)} · ${esc(HOUSEHOLD.city)} · ${HOUSEHOLD.members} anggota keluarga. Semua angka di halaman ini dihitung dari catatan pengeluaran dan anggaran di bawah.</p>
    <div class="toolbar">
      <div class="field"><label for="month-select">Bulan</label>
      <select id="month-select">${MONTHS.map((m) => `<option value="${m.id}" ${m.id === state.month ? 'selected' : ''}>${m.label}</option>`).join('')}</select></div>
    </div>
    <div class="grid cols-3">
      <div class="card"><div class="kicker">Pemasukan</div><div class="big" id="stat-income">${formatRupiah(income)}</div>
        <div class="sub">${INCOME.map((x) => esc(x.label) + ' ' + formatShort(x.amount)).join(' + ')}</div></div>
      <div class="card"><div class="kicker">Pengeluaran tercatat</div><div class="big" id="stat-spent">${formatRupiah(spent)}</div>
        <div class="sub">${tx.length} transaksi di bulan ini</div></div>
      <div class="card"><div class="kicker">Sisa untuk ditabung</div><div class="big ${remaining >= 0 ? 'good' : 'bad'}" id="stat-remaining">${formatRupiah(remaining)}</div>
        <div class="sub">Tingkat tabungan ${rate}% dari pemasukan</div></div>
    </div>
    <div class="grid cols-2 mt">
      <div class="card"><h2>Ke mana uang pergi</h2>
        <div style="display:flex;gap:18px;align-items:center;flex-wrap:wrap">
          ${donutChart(segments)}
          <div class="legend">${segments.map((s) => `<div class="row"><span class="dot" style="background:${s.color}"></span>${esc(s.label)}<span class="amt">${formatShort(s.value)}</span></div>`).join('')}</div>
        </div></div>
      <div class="card"><h2>Tabungan keluarga</h2>
        <div class="big">${formatShort(goalsTotal)} <small>dari ${formatShort(goalsTarget)}</small></div>
        <div class="sub">Total terkumpul di ${state.goals.length} tujuan tabungan</div>
        ${state.goals.map((g, i) => `<div class="bar-row"><div class="bar-head"><span>${esc(g.name)}</span><span>${Math.round((g.saved / g.target) * 100)}%</span></div>${progressBar((g.saved / g.target) * 100, palette(i))}<div class="bar-foot"><span>${formatShort(g.saved)}</span><span>target ${formatShort(g.target)}</span></div></div>`).join('')}
        <p class="mt"><a href="#/tabungan">Kelola tujuan tabungan →</a></p></div>
    </div>
    <div class="card mt"><h2>Pengeluaran terbaru</h2>
      <table><thead><tr><th>Tanggal</th><th>Deskripsi</th><th class="hide-m">Kategori</th><th class="num">Jumlah</th></tr></thead>
      <tbody>${recent.map((t) => { const c = categoryLabel(t.category); return `<tr><td>${formatDate(t.date)}</td><td>${esc(t.desc)}</td><td class="hide-m">${esc(c.label)}</td><td class="num">${formatRupiah(t.amount)}</td></tr>`; }).join('')}</tbody></table>
      <p class="mt"><a href="#/pengeluaran">Lihat semua pengeluaran →</a></p></div>`;
  },
  mount(state, { rerender, save }) {
    document.getElementById('month-select').addEventListener('change', (e) => {
      state.month = e.target.value;
      save(state);
      rerender();
    });
  },
};

// ---------------------------------------------------------------- anggaran
export const anggaran = {
  render(state) {
    const income = totalIncome();
    let plannedTotal = 0;
    let spentTotal = 0;
    const groupsHtml = BUDGET_GROUPS.map((g) => {
      const planned = g.categories.reduce((s, c) => s + (state.budgets[c.id] ?? c.planned), 0);
      const spent = g.categories.reduce((s, c) => s + c.spent, 0);
      plannedTotal += planned;
      // The savings group is money moved aside, not spending, so it stays
      // out of the "realisasi" total: that total must equal the ledger on
      // the Pengeluaran page (Rp 9.105.000 for November).
      if (g.id !== 'tabungan') spentTotal += spent;
      const actualPct = Math.round((planned / income) * 100);
      return `<div class="card"><h2>${esc(g.label)} <span class="pill ${actualPct <= g.targetPct ? 'green' : 'amber'}">rencana ${actualPct}% · target ${g.targetPct}%</span></h2>
      <p class="muted small">${esc(g.hint)}</p>
      <table><thead><tr><th>Kategori</th><th class="num">Rencana / bln</th><th class="num">Realisasi</th><th class="num">Sisa</th></tr></thead><tbody>
      ${g.categories.map((c) => {
        const p = state.budgets[c.id] ?? c.planned;
        const left = p - c.spent;
        return `<tr><td>${esc(c.label)}</td>
          <td class="num"><input type="number" min="0" step="50000" value="${p}" data-budget="${c.id}" aria-label="Rencana ${esc(c.label)}"></td>
          <td class="num">${formatRupiah(c.spent)}</td>
          <td class="num ${left < 0 ? 'bad' : 'good'}">${formatRupiah(left)}</td></tr>`;
      }).join('')}</tbody></table>
      <div class="bar-row"><div class="bar-head"><span>Total ${esc(g.label.toLowerCase())}</span><span>${formatShort(spent)} dari ${formatShort(planned)}</span></div>
      ${progressBar((spent / planned) * 100, spent > planned ? '#dc2626' : '#2563eb')}</div></div>`;
    }).join('');
    const remaining = income - plannedTotal;
    return `
    <h1>Anggaran bulanan</h1>
    <p class="lede">Atur rencana belanja keluarga. Ubah angka rencana di kolom — total, sisa, dan perbandingan 50/30/20 dihitung ulang langsung. Realisasi adalah pengeluaran yang sudah tercatat bulan ini.</p>
    <div class="grid cols-3">
      <div class="card"><div class="kicker">Pemasukan</div><div class="big">${formatRupiah(income)}</div><div class="sub">Tetap tiap bulan</div></div>
      <div class="card"><div class="kicker">Total rencana</div><div class="big" id="total-planned">${formatRupiah(plannedTotal)}</div><div class="sub">Realisasi sejauh ini ${formatRupiah(spentTotal)}</div></div>
      <div class="card"><div class="kicker">Sisa dari rencana</div><div class="big ${remaining >= 0 ? 'good' : 'bad'}" id="total-remaining">${formatRupiah(remaining)}</div><div class="sub">${remaining >= 0 ? 'Anggaran masih dalam pemasukan' : 'Rencana melebihi pemasukan — kurangi salah satu pos'}</div></div>
    </div>
    <h2>Perbandingan 50 / 30 / 20</h2>
    <div class="card">${barRows(BUDGET_GROUPS.map((g, i) => {
      const planned = g.categories.reduce((s, c) => s + (state.budgets[c.id] ?? c.planned), 0);
      return { label: `${g.label} — rencana`, value: planned, max: income, color: palette(i), note: `${Math.round((planned / income) * 100)}% dari pemasukan · target ${g.targetPct}%`, valueLabel: formatShort(planned), maxLabel: formatShort(income) };
    }))}</div>
    <div class="grid cols-1 mt">${groupsHtml}</div>
    <div class="toolbar"><button class="ghost" id="reset-budget">Kembalikan ke rencana awal</button></div>
    <div class="callout"><b>Kenapa kebutuhan keluarga ini 69%?</b> Di Jakarta, sewa dan bahan makanan saja sudah besar: rata-rata konsumsi rumah tangga Jakarta ±Rp 14,88 juta/bulan (BPS, Survei Biaya Hidup 2022). Aturan 50/30/20 adalah kompas, bukan vonis — yang penting tiap rupiah punya tujuan sebelum bulan berjalan.</div>`;
  },
  mount(state, { rerender, save, reset }) {
    document.querySelectorAll('input[data-budget]').forEach((input) => {
      input.addEventListener('input', () => {
        const v = Math.max(0, Number(input.value) || 0);
        state.budgets[input.dataset.budget] = v;
        save(state);
        // Live totals without a full re-render so the typing focus stays.
        let plannedTotal = 0;
        for (const g of BUDGET_GROUPS) for (const c of g.categories) plannedTotal += state.budgets[c.id] ?? c.planned;
        document.getElementById('total-planned').textContent = formatRupiah(plannedTotal);
        const rem = totalIncome() - plannedTotal;
        const remEl = document.getElementById('total-remaining');
        remEl.textContent = formatRupiah(rem);
        remEl.className = 'big ' + (rem >= 0 ? 'good' : 'bad');
      });
    });
    document.getElementById('reset-budget').addEventListener('click', () => {
      const fresh = reset();
      save(fresh);
      rerender();
    });
  },
};

// -------------------------------------------------------------- pengeluaran
export const pengeluaran = {
  render(state) {
    const tx = [...monthTransactions(state)].sort((a, b) => (a.date < b.date ? 1 : -1));
    const total = tx.reduce((s, t) => s + t.amount, 0);
    const monthLabel = (MONTHS.find((m) => m.id === state.month) || MONTHS[0]).label;
    const options = BUDGET_GROUPS.flatMap((g) => g.categories.map((c) => `<option value="${c.id}">${esc(g.label)} — ${esc(c.label)}</option>`)).join('');
    return `
    <h1>Pengeluaran — ${esc(monthLabel)}</h1>
    <p class="lede">Catat setiap rupiah yang keluar. Transaksi baru langsung masuk ke total bulan ini dan ke diagram di halaman Ringkasan.</p>
    <div class="card"><h2>Tambah pengeluaran</h2>
      <form id="tx-form"><div class="form-row cols-4">
        <div><label for="tx-date">Tanggal</label><input type="date" id="tx-date" value="2026-11-27" required></div>
        <div><label for="tx-category">Kategori</label><select id="tx-category">${options}</select></div>
        <div><label for="tx-desc">Deskripsi</label><input type="text" id="tx-desc" placeholder="cth. Belanja sayur di pasar" maxlength="80" required></div>
        <div><label for="tx-amount">Jumlah (Rp)</label><input type="number" id="tx-amount" min="1000" step="1000" placeholder="50000" required></div>
      </div>
      <div class="toolbar"><button type="submit">Tambah pengeluaran</button></div></form></div>
    <div class="toolbar">
      <div class="field"><label for="tx-filter">Saring kategori</label>
      <select id="tx-filter"><option value="">Semua kategori</option>${options}</select></div>
      <div class="field"><label>&nbsp;</label><button class="ghost" id="reset-data">Reset data contoh</button></div>
      <span class="muted" id="tx-total"><b>Total ${esc(monthLabel)}: ${formatRupiah(total)}</b> · ${tx.length} transaksi</span>
    </div>
    <div class="card"><table id="tx-table"><thead><tr><th>Tanggal</th><th>Deskripsi</th><th class="hide-m">Kategori</th><th class="num">Jumlah</th><th></th></tr></thead>
    <tbody>${tx.map((t) => { const c = categoryLabel(t.category); return `<tr data-cat="${t.category}"><td>${formatDate(t.date)}</td><td>${esc(t.desc)}</td><td class="hide-m">${esc(c.label)}</td><td class="num">${formatRupiah(t.amount)}</td><td><button class="ghost small" data-del="${t.id}">Hapus</button></td></tr>`; }).join('')}</tbody></table></div>`;
  },
  mount(state, { rerender, save, reset }) {
    document.getElementById('tx-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const tx = {
        id: 'u' + Date.now().toString(36),
        date: document.getElementById('tx-date').value,
        category: document.getElementById('tx-category').value,
        desc: document.getElementById('tx-desc').value.trim(),
        amount: Math.max(0, Number(document.getElementById('tx-amount').value) || 0),
      };
      if (!tx.desc || tx.amount <= 0 || !tx.date) return;
      state.transactions[state.month] = state.transactions[state.month] || [];
      state.transactions[state.month].unshift(tx);
      save(state);
      rerender();
    });
    document.getElementById('tx-filter').addEventListener('change', (e) => {
      const f = e.target.value;
      document.querySelectorAll('#tx-table tbody tr').forEach((tr) => {
        tr.hidden = !!f && tr.dataset.cat !== f;
      });
    });
    document.querySelectorAll('button[data-del]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.transactions[state.month] = state.transactions[state.month].filter((t) => t.id !== btn.dataset.del);
        save(state);
        rerender();
      });
    });
    document.getElementById('reset-data').addEventListener('click', () => {
      const fresh = reset();
      save(fresh);
      rerender();
    });
  },
};

// ----------------------------------------------------------------- tabungan
export const tabungan = {
  render(state) {
    const totalSaved = state.goals.reduce((s, g) => s + g.saved, 0);
    const totalTarget = state.goals.reduce((s, g) => s + g.target, 0);
    return `
    <h1>Tujuan tabungan</h1>
    <p class="lede">Setiap tujuan punya target dan progres sendiri. Tambah setoran kapan pun — progres dan total keluarga ikut bergerak.</p>
    <div class="card"><div class="kicker">Total terkumpul</div><div class="big">${formatRupiah(totalSaved)} <small>dari ${formatRupiah(totalTarget)}</small></div>
    <div class="sub">${Math.round((totalSaved / totalTarget) * 100)}% dari semua target tercapai</div></div>
    <div class="grid cols-2 mt">
    ${state.goals.map((g, i) => { const pct = Math.round((g.saved / g.target) * 100); return `
      <div class="card" data-goal="${g.id}">
        <div class="goal-head"><h3>${esc(g.name)}</h3><span class="pill ${pct >= 100 ? 'green' : 'grey'}">${pct}%</span></div>
        <p class="muted small">${esc(g.note)}</p>
        ${progressBar(pct, palette(i))}
        <p class="goal-amt"><b>${formatRupiah(g.saved)}</b> dari ${formatRupiah(g.target)} · kurang ${formatRupiah(Math.max(0, g.target - g.saved))}</p>
        <div class="toolbar"><div class="field"><label for="add-${g.id}">Tambah setoran (Rp)</label>
        <input type="number" class="contrib-amount" id="add-${g.id}" min="10000" step="10000" placeholder="100000"></div>
        <button class="contrib-add" data-goal-add="${g.id}">Tambah</button></div>
      </div>`; }).join('')}
    </div>
    <div class="card mt"><h2>Buat tujuan baru</h2>
      <form id="goal-form"><div class="form-row cols-3">
        <div><label for="goal-name">Nama tujuan</label><input type="text" id="goal-name" placeholder="cth. Umroh 2028" maxlength="60" required></div>
        <div><label for="goal-target">Target (Rp)</label><input type="number" id="goal-target" min="100000" step="50000" placeholder="10000000" required></div>
        <div><label for="goal-saved">Sudah terkumpul (Rp)</label><input type="number" id="goal-saved" min="0" step="50000" value="0"></div>
      </div>
      <div class="toolbar"><button type="submit">Buat tujuan</button></div></form></div>`;
  },
  mount(state, { rerender, save }) {
    document.querySelectorAll('button[data-goal-add]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.goalAdd;
        const input = document.getElementById('add-' + id);
        const amount = Math.max(0, Number(input.value) || 0);
        if (amount <= 0) return;
        const goal = state.goals.find((g) => g.id === id);
        if (goal) goal.saved += amount;
        save(state);
        rerender();
      });
    });
    document.getElementById('goal-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('goal-name').value.trim();
      const target = Math.max(0, Number(document.getElementById('goal-target').value) || 0);
      const saved = Math.max(0, Number(document.getElementById('goal-saved').value) || 0);
      if (!name || target <= 0) return;
      state.goals.push({ id: 'g' + Date.now().toString(36), name, target, saved, note: 'Tujuan baru' });
      save(state);
      rerender();
    });
  },
};

// ------------------------------------------------------------------ tagihan
export const tagihan = {
  render(state) {
    const unpaid = state.bills.filter((b) => !b.paid);
    const paid = state.bills.filter((b) => b.paid);
    const unpaidTotal = unpaid.reduce((s, b) => s + b.amount, 0);
    const paidTotal = paid.reduce((s, b) => s + b.amount, 0);
    return `
    <h1>Tagihan rutin</h1>
    <p class="lede">Semua tagihan bulanan keluarga dalam satu daftar, lengkap dengan tanggal jatuh tempo. Tandai lunas begitu dibayar — total di bawah ikut berubah.</p>
    <div class="grid cols-2">
      <div class="card"><div class="kicker">Belum dibayar</div><div class="big bad" id="bills-unpaid">${formatRupiah(unpaidTotal)}</div><div class="sub">${unpaid.length} tagihan menunggu</div></div>
      <div class="card"><div class="kicker">Sudah dibayar</div><div class="big good" id="bills-paid">${formatRupiah(paidTotal)}</div><div class="sub">${paid.length} tagihan lunas bulan ini</div></div>
    </div>
    <div class="card mt">
      ${state.bills.map((b) => `<div class="bill-row">
        <span class="pill ${b.paid ? 'green' : 'amber'}">${b.paid ? 'Lunas' : 'Belum lunas'}</span>
        <div><div class="bill-name">${esc(b.name)}</div><div class="bill-due">Jatuh tempo tiap tanggal ${b.due} · November 2026</div></div>
        <span class="bill-amt">${formatRupiah(b.amount)}</span>
        <button class="ghost small pay-toggle" data-bill="${b.id}">${b.paid ? 'Batalkan lunas' : 'Tandai lunas'}</button>
      </div>`).join('')}
    </div>
    <div class="callout"><b>Tips tagihan:</b> atur pengingat tiga hari sebelum jatuh tempo, dan bayar tagihan tetap (listrik, internet, BPJS) di minggu pertama setelah gajian — sebelum uangnya sempat terpakai untuk yang lain.</div>`;
  },
  mount(state, { rerender, save }) {
    document.querySelectorAll('button[data-bill]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const bill = state.bills.find((b) => b.id === btn.dataset.bill);
        if (bill) bill.paid = !bill.paid;
        save(state);
        rerender();
      });
    });
  },
};

// ------------------------------------------------------------------ panduan
export const panduan = {
  render() {
    return `
    <h1>Panduan mengatur anggaran</h1>
    <p class="lede">Aturan praktis yang dipakai situs ini, plus angka acuan resmi supaya rencana Anda berpijak pada kenyataan — bukan tebakan.</p>
    <h2>Kalkulator 50 / 30 / 20</h2>
    <div class="card">
      <p>Masukkan pemasukan bulanan keluarga, dan kalkulator membaginya: 50% kebutuhan, 30% keinginan, 20% tabungan.</p>
      <div class="toolbar"><div class="field"><label for="calc-income">Pemasukan bulanan (Rp)</label>
      <input type="number" id="calc-income" min="0" step="100000" value="12500000"></div>
      <button id="calc-run">Hitung</button></div>
      <div class="calc">
        <div class="bucket"><div class="pct" id="calc-needs">Rp 6,25 jt</div><b>Kebutuhan · 50%</b><p class="small muted">Sewa, makanan, transport, listrik, kesehatan.</p></div>
        <div class="bucket"><div class="pct" id="calc-wants">Rp 3,75 jt</div><b>Keinginan · 30%</b><p class="small muted">Makan di luar, hiburan, pakaian, hobi.</p></div>
        <div class="bucket"><div class="pct" id="calc-save">Rp 2,5 jt</div><b>Tabungan · 20%</b><p class="small muted">Dana darurat, pendidikan, investasi.</p></div>
      </div>
    </div>
    <h2>Angka acuan (data resmi)</h2>
    <div class="card"><table><thead><tr><th>Acuan</th><th class="num">Nilai</th><th>Sumber</th></tr></thead><tbody>
      ${REFERENCE_FIGURES.map((f) => `<tr><td>${esc(f.label)}</td><td class="num">${esc(f.value)}</td><td class="src">${esc(f.source)}</td></tr>`).join('')}
    </tbody></table>
    <p class="small muted mt">Angka dicek 27 November 2026. UMP berbeda tiap provinsi; cek keputusan gubernur daerah Anda untuk angka yang berlaku.</p></div>
    <h2>Enam kebiasaan yang menahan anggaran</h2>
    <div class="grid cols-2">
      ${TIPS.map((t) => `<div class="card"><h3>${esc(t.title)}</h3><p class="small">${esc(t.body)}</p></div>`).join('')}
    </div>`;
  },
  mount() {
    const run = () => {
      const income = Math.max(0, Number(document.getElementById('calc-income').value) || 0);
      document.getElementById('calc-needs').textContent = formatShort(income * 0.5);
      document.getElementById('calc-wants').textContent = formatShort(income * 0.3);
      document.getElementById('calc-save').textContent = formatShort(income * 0.2);
    };
    document.getElementById('calc-run').addEventListener('click', run);
    document.getElementById('calc-income').addEventListener('input', run);
  },
};
