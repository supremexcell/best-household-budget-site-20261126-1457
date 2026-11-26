// DompetKeluarga — data.js
// Sample household data for the demo family, plus the reference figures the
// guide page quotes. All amounts are rupiah per month unless noted.
// Reference figures verified 27 Nov 2026 against BPS / Pemprov DKI Jakarta:
//   UMP DKI Jakarta 2025 Rp 5.396.761 (Keputusan Gubernur 829/2024)
//   UMP DKI Jakarta 2026 Rp 5.729.761 -> Rp 5.729.876, +6,17%
//   Susenas Maret 2025: pengeluaran per kapita DKI Jakarta Rp 2.962.412/bln
//   Survei Biaya Hidup BPS 2022: konsumsi rumah tangga Jakarta ±Rp 14,88 jt/bln
//   Sakernas BPS Feb 2025: rata-rata gaji nasional Rp 3.094.818/bln

export const HOUSEHOLD = {
  name: 'Keluarga Rahma',
  city: 'Jakarta Timur',
  members: 4,
  note: 'Ayah, Ibu, dan dua anak — data contoh bulan November 2026. Ubah angka apa pun; semua halaman ikut menghitung ulang.',
};

export const INCOME = [
  { id: 'gaji-ayah', label: 'Gaji Ayah (karyawan swasta)', amount: 8000000 },
  { id: 'gaji-ibu', label: 'Gaji Ibu (guru honorer + les privat)', amount: 4500000 },
];

// Budget plan: three 50/30/20 groups. "planned" is the monthly target,
// "spent" is what the family actually spent so far this month.
export const BUDGET_GROUPS = [
  {
    id: 'kebutuhan',
    label: 'Kebutuhan',
    targetPct: 50,
    hint: 'Hal yang wajib dibayar tiap bulan',
    categories: [
      { id: 'sewa', label: 'Sewa rumah', planned: 3000000, spent: 3000000 },
      { id: 'makanan', label: 'Belanja bahan makanan', planned: 2800000, spent: 2435000 },
      { id: 'transport', label: 'Transportasi', planned: 1500000, spent: 1280000 },
      { id: 'listrik-air', label: 'Listrik & air', planned: 600000, spent: 584000 },
      { id: 'internet', label: 'Internet & pulsa', planned: 350000, spent: 350000 },
      { id: 'kesehatan', label: 'Kesehatan & obat', planned: 400000, spent: 215000 },
    ],
  },
  {
    id: 'keinginan',
    label: 'Keinginan',
    targetPct: 30,
    hint: 'Boleh, asal tetap dalam batas',
    categories: [
      { id: 'makan-luar', label: 'Makan di luar', planned: 800000, spent: 612000 },
      { id: 'hiburan', label: 'Hiburan & streaming', planned: 300000, spent: 289000 },
      { id: 'pakaian', label: 'Pakaian & keperluan pribadi', planned: 500000, spent: 340000 },
    ],
  },
  {
    id: 'tabungan',
    label: 'Tabungan & investasi',
    targetPct: 20,
    hint: 'Dibayar dulu sebelum belanja',
    categories: [
      { id: 'dana-darurat', label: 'Dana darurat', planned: 1500000, spent: 1500000 },
      { id: 'pendidikan', label: 'Pendidikan anak', planned: 500000, spent: 500000 },
    ],
  },
];

// Transactions for November 2026 (newest first). The October set powers the
// month switcher on the overview page.
export const TRANSACTIONS = {
  '2026-11': [
    { id: 't01', date: '2026-11-26', category: 'makanan', desc: 'Belanja mingguan pasar & supermarket', amount: 486000 },
    { id: 't02', date: '2026-11-25', category: 'transport', desc: 'Bensin motor + tol', amount: 175000 },
    { id: 't03', date: '2026-11-24', category: 'makan-luar', desc: 'Makan malam keluarga', amount: 214000 },
    { id: 't04', date: '2026-11-22', category: 'makanan', desc: 'Belanja mingguan pasar & supermarket', amount: 512000 },
    { id: 't05', date: '2026-11-21', category: 'hiburan', desc: 'Langganan streaming + bioskop', amount: 189000 },
    { id: 't06', date: '2026-11-19', category: 'transport', desc: 'Bensin motor', amount: 120000 },
    { id: 't07', date: '2026-11-18', category: 'makanan', desc: 'Belanja mingguan pasar & supermarket', amount: 468000 },
    { id: 't08', date: '2026-11-15', category: 'pakaian', desc: 'Seragam sekolah anak', amount: 340000 },
    { id: 't09', date: '2026-11-14', category: 'makanan', desc: 'Belanja mingguan pasar & supermarket', amount: 455000 },
    { id: 't10', date: '2026-11-12', category: 'listrik-air', desc: 'Tagihan listrik PLN', amount: 412000 },
    { id: 't11', date: '2026-11-10', category: 'kesehatan', desc: 'Obat & vitamin anak', amount: 215000 },
    { id: 't12', date: '2026-11-08', category: 'makan-luar', desc: 'Jajan akhir pekan', amount: 168000 },
    { id: 't13', date: '2026-11-06', category: 'makanan', desc: 'Belanja mingguan pasar & supermarket', amount: 514000 },
    { id: 't14', date: '2026-11-05', category: 'internet', desc: 'Internet rumah', amount: 350000 },
    { id: 't15', date: '2026-11-03', category: 'makan-luar', desc: 'Makan siang keluarga', amount: 230000 },
    { id: 't17', date: '2026-11-23', category: 'transport', desc: 'Bensin motor', amount: 450000 },
    { id: 't18', date: '2026-11-20', category: 'transport', desc: 'Tol & parkir', amount: 380000 },
    { id: 't19', date: '2026-11-16', category: 'transport', desc: 'Ojek online', amount: 155000 },
    { id: 't20', date: '2026-11-12', category: 'listrik-air', desc: 'Tagihan air PAM', amount: 172000 },
    { id: 't21', date: '2026-11-09', category: 'hiburan', desc: 'Langganan musik', amount: 100000 },
    { id: 't16', date: '2026-11-01', category: 'sewa', desc: 'Sewa rumah November', amount: 3000000 },
  ],
  '2026-10': [
    { id: 'o01', date: '2026-10-28', category: 'makanan', desc: 'Belanja mingguan pasar & supermarket', amount: 498000 },
    { id: 'o02', date: '2026-10-25', category: 'transport', desc: 'Bensin motor + tol', amount: 162000 },
    { id: 'o03', date: '2026-10-22', category: 'makan-luar', desc: 'Makan malam keluarga', amount: 198000 },
    { id: 'o04', date: '2026-10-18', category: 'makanan', desc: 'Belanja mingguan pasar & supermarket', amount: 521000 },
    { id: 'o05', date: '2026-10-12', category: 'listrik-air', desc: 'Tagihan listrik PLN', amount: 398000 },
    { id: 'o06', date: '2026-10-05', category: 'internet', desc: 'Internet rumah', amount: 350000 },
    { id: 'o07', date: '2026-10-01', category: 'sewa', desc: 'Sewa rumah Oktober', amount: 3000000 },
  ],
};

export const MONTHS = [
  { id: '2026-11', label: 'November 2026' },
  { id: '2026-10', label: 'Oktober 2026' },
];

export const SAVINGS_GOALS = [
  { id: 'g-darurat', name: 'Dana darurat', target: 30000000, saved: 18450000, note: 'Target 6x pengeluaran pokok bulanan' },
  { id: 'g-liburan', name: 'Liburan keluarga ke Yogyakarta', target: 8000000, saved: 3200000, note: 'Berangkat Juni 2027' },
  { id: 'g-rumah', name: 'DP rumah', target: 50000000, saved: 12000000, note: 'Ditabung Rp 1,5 jt per bulan' },
];

export const BILLS = [
  { id: 'b-internet', name: 'Internet rumah', amount: 350000, due: 5, paid: true },
  { id: 'b-listrik', name: 'Listrik PLN', amount: 450000, due: 10, paid: true },
  { id: 'b-bpjs', name: 'BPJS Kesehatan (4 jiwa)', amount: 280000, due: 10, paid: false },
  { id: 'b-air', name: 'Air PAM', amount: 180000, due: 12, paid: false },
  { id: 'b-motor', name: 'Cicilan motor', amount: 850000, due: 15, paid: false },
  { id: 'b-rt', name: 'Iuran RT & kebersihan', amount: 50000, due: 1, paid: true },
];

export const REFERENCE_FIGURES = [
  { label: 'UMP DKI Jakarta 2025', value: 'Rp 5.396.761', source: 'Keputusan Gubernur DKI Jakarta 829/2024' },
  { label: 'UMP DKI Jakarta 2026', value: 'Rp 5.729.876', source: 'Keputusan Gubernur DKI Jakarta 1142/2025, naik 6,17%' },
  { label: 'Pengeluaran per kapita DKI Jakarta', value: 'Rp 2.962.412 / bln', source: 'BPS, Susenas Maret 2025 (makanan Rp 1.153.404, bukan makanan Rp 1.809.008)' },
  { label: 'Konsumsi rumah tangga Jakarta', value: '± Rp 14,88 jt / bln', source: 'BPS, Survei Biaya Hidup 2022 — tertinggi nasional' },
  { label: 'Rata-rata gaji nasional', value: 'Rp 3.094.818 / bln', source: 'BPS, Sakernas Februari 2025' },
  { label: 'Kebutuhan Hidup Layak Jakarta 2025', value: 'Rp 5.898.511 / bln', source: 'Kementerian Ketenagakerjaan' },
];

export const TIPS = [
  { title: 'Bayar tabungan dulu', body: 'Sisihkan dana darurat dan tabungan di awal gajian, sebelum belanja. Yang tersisa itulah yang boleh dipakai.' },
  { title: 'Catat setiap pengeluaran', body: 'Kebocoran anggaran hampir selalu dari pengeluaran kecil yang tidak tercatat: jajan, ongkir, langganan lupa.' },
  { title: 'Satu rekening, satu fungsi', body: 'Pisahkan rekening belanja harian, tagihan, dan tabungan supaya saldo tabungan tidak ikut terpakai.' },
  { title: 'Review tiap akhir bulan', body: 'Bandingkan rencana dan realisasi di halaman Anggaran. Kategori yang selalu jebol berarti anggarannya yang salah, bukan orangnya.' },
  { title: 'Dana darurat 3–6 bulan', body: 'Untuk keluarga satu penghasilan, targetkan 6 bulan pengeluaran pokok. Mulai dari Rp 500 ribu per bulan pun tetap jalan.' },
  { title: 'Langganan yang tidak dipakai, stop', body: 'Cek langganan streaming dan aplikasi tiap tiga bulan. Satu langganan Rp 150 ribu yang tidak ditonton sama dengan Rp 1,8 juta setahun.' },
];

export function formatRupiah(n) {
  return 'Rp ' + Math.round(n).toLocaleString('id-ID');
}

export function formatShort(n) {
  if (n >= 1000000) return 'Rp ' + (n / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + ' jt';
  if (n >= 1000) return 'Rp ' + Math.round(n / 1000) + ' rb';
  return formatRupiah(n);
}

export function formatDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function categoryLabel(id) {
  for (const g of BUDGET_GROUPS) {
    const c = g.categories.find((x) => x.id === id);
    if (c) return { label: c.label, group: g.label };
  }
  return { label: id, group: '' };
}

export function totalIncome() {
  return INCOME.reduce((s, x) => s + x.amount, 0);
}

export function groupTotals(group) {
  const planned = group.categories.reduce((s, c) => s + c.planned, 0);
  const spent = group.categories.reduce((s, c) => s + c.spent, 0);
  return { planned, spent };
}

export function budgetTotals() {
  let planned = 0;
  let spent = 0;
  for (const g of BUDGET_GROUPS) {
    const t = groupTotals(g);
    planned += t.planned;
    spent += t.spent;
  }
  return { planned, spent, remaining: totalIncome() - spent };
}
