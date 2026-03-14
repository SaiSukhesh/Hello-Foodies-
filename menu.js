/* ══════════════════════════════════════════
   menu.js  –  Hello Foodies Menu Page
   ══════════════════════════════════════════ */

/* ── TICKER ─────────────────────────────────────────── */
const items = [
  '🍛 Chicken Biryani – ₹199', '🍕 Margherita Pizza – ₹299', '🍔 Smash Burger – ₹149',
  '🥞 Masala Dosa – ₹79',     '🍜 Veg Noodles – ₹129',      '🍦 Gulab Jamun – ₹59',
  '🧁 Red Velvet – ₹89',      '☕ Cold Coffee – ₹99',        '🌮 Chicken Wrap – ₹139',
  '🥗 Caesar Salad – ₹169',   '🍱 Thali Special – ₹249',    '🧆 Falafel Bowl – ₹179'
];

const tk = document.getElementById('ticker');
[...items, ...items].forEach(x => {
  const s = document.createElement('span');
  s.className = 'ticker-item';
  s.textContent = x + '   ✦   ';
  tk.appendChild(s);
});

/* ── DARK MODE TOGGLE ────────────────────────────────── */
const html   = document.documentElement;
const btnLbl = document.getElementById('btnLabel');

document.getElementById('themeBtn').addEventListener('click', () => {
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  btnLbl.textContent = isDark ? 'Light Mode' : 'Dark Mode';
});