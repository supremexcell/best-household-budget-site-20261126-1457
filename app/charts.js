// DompetKeluarga — charts.js
// Hand-rolled SVG charts, no libraries, no network. Two shapes:
// a donut for "where the money went" and horizontal bars for budget use.

const PALETTE = ['#2563eb', '#16a34a', '#d97706', '#dc2626', '#7c3aed', '#0891b2', '#db2777', '#65a30d'];

export function palette(i) {
  return PALETTE[i % PALETTE.length];
}

// Donut chart: segments is [{label, value, color}]. Returns an SVG string.
export function donutChart(segments, size = 220) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 14;
  const inner = r - 34;
  let offset = -Math.PI / 2;
  let paths = '';
  segments.forEach((seg) => {
    if (seg.value <= 0) return;
    const frac = seg.value / total;
    const a0 = offset;
    const a1 = offset + frac * Math.PI * 2;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const xi1 = cx + inner * Math.cos(a1);
    const yi1 = cy + inner * Math.sin(a1);
    const xi0 = cx + inner * Math.cos(a0);
    const yi0 = cy + inner * Math.sin(a0);
    paths += `<path d="M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} L ${xi1.toFixed(1)} ${yi1.toFixed(1)} A ${inner} ${inner} 0 ${large} 0 ${xi0.toFixed(1)} ${yi0.toFixed(1)} Z" fill="${seg.color}"><title>${seg.label}</title></path>`;
    offset = a1;
  });
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="Diagram lingkaran pengeluaran">${paths}<text x="${cx}" y="${cy - 4}" text-anchor="middle" class="donut-center-num">${segTotalLabel(total)}</text><text x="${cx}" y="${cy + 18}" text-anchor="middle" class="donut-center-cap">terpakai bulan ini</text></svg>`;
}

function segTotalLabel(total) {
  if (total >= 1000000) return 'Rp ' + (total / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + ' jt';
  return 'Rp ' + Math.round(total / 1000) + ' rb';
}

// Horizontal bar rows: items is [{label, value, max, color, note}].
export function barRows(items) {
  return items.map((it) => {
    const pct = Math.min(100, Math.round((it.value / (it.max || 1)) * 100));
    const over = it.value > it.max;
    return `<div class="bar-row">
      <div class="bar-head"><span>${it.label}</span><span class="bar-note">${it.note || ''}</span></div>
      <div class="bar-track"><div class="bar-fill ${over ? 'over' : ''}" style="width:${pct}%;background:${it.color}"></div></div>
      <div class="bar-foot"><span>${it.valueLabel}</span><span>dari ${it.maxLabel}</span></div>
    </div>`;
  }).join('');
}

// Small inline progress bar (0-100) used by savings goals.
export function progressBar(pct, color) {
  const p = Math.max(0, Math.min(100, Math.round(pct)));
  return `<div class="bar-track slim"><div class="bar-fill" style="width:${p}%;background:${color}"></div></div>`;
}
