/* ══════════════════════════════════════════
   order.js  –  Hello Foodies Order Page
   ══════════════════════════════════════════ */

/* ── MENU DATA (mirrors menu.html) ─────────────────── */
const MENU = [
  { name: 'Chicken Biryani',     price: 450, cat: 'Biryani',   emoji: '🍛' },
  { name: 'Mutton Biryani',      price: 520, cat: 'Biryani',   emoji: '🍛' },
  { name: 'Veg Biryani',         price: 350, cat: 'Biryani',   emoji: '🥗' },
  { name: 'Masala Dosa',         price: 120, cat: 'Tiffins',   emoji: '🥞' },
  { name: 'Idli',                price:  80, cat: 'Tiffins',   emoji: '🍚' },
  { name: 'Puri',                price:  90, cat: 'Tiffins',   emoji: '🫓' },
  { name: 'Butter Chicken',      price: 320, cat: 'Curries',   emoji: '🍗' },
  { name: 'Paneer Butter Masala',price: 260, cat: 'Curries',   emoji: '🧀' },
  { name: 'Mushroom Curry',      price: 300, cat: 'Curries',   emoji: '🍄' },
  { name: 'Chilli Chicken',      price: 150, cat: 'Fast Food', emoji: '🌶️' },
  { name: 'Cheese Pizza',        price: 220, cat: 'Fast Food', emoji: '🍕' },
  { name: 'French Fries',        price: 100, cat: 'Fast Food', emoji: '🍟' },
];

const DELIVERY_FEE = 0;   // free delivery (shown in summary)
const DELIVERY_MIN = 299; // free above this

/* ── TICKER ─────────────────────────────────────────── */
(function buildTicker() {
  const items = [
    '🍛 Chicken Biryani – ₹450','🍕 Cheese Pizza – ₹220','🍔 Chilli Chicken – ₹150',
    '🥞 Masala Dosa – ₹120','🍚 Idli – ₹80','🍗 Butter Chicken – ₹320',
    '🧀 Paneer Masala – ₹260','🍟 French Fries – ₹100','🌶️ Mutton Biryani – ₹520',
    '🥗 Veg Biryani – ₹350','🍄 Mushroom Curry – ₹300','🫓 Puri – ₹90'
  ];
  const tk = document.getElementById('ticker');
  if (!tk) return;
  [...items, ...items].forEach(x => {
    const s = document.createElement('span');
    s.className = 'ticker-item';
    s.textContent = x + '   ✦   ';
    tk.appendChild(s);
  });
})();

/* ── POPULATE FOOD SELECT ────────────────────────────── */
(function buildSelect() {
  const sel = document.getElementById('foodItem');
  if (!sel) return;

  // group by category
  const cats = {};
  MENU.forEach(item => {
    if (!cats[item.cat]) cats[item.cat] = [];
    cats[item.cat].push(item);
  });

  Object.entries(cats).forEach(([cat, items]) => {
    const og = document.createElement('optgroup');
    og.label = cat;
    items.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item.price;
      opt.dataset.name = item.name;
      opt.textContent = `${item.emoji} ${item.name}  –  ₹${item.price}`;
      og.appendChild(opt);
    });
    sel.appendChild(og);
  });
})();

/* ── QUICK PEEK (clickable to auto-select) ───────────── */
(function buildQuickPeek() {
  const wrap = document.getElementById('quickPeek');
  if (!wrap) return;
  const popular = MENU.slice(0, 6);
  popular.forEach(item => {
    const div = document.createElement('div');
    div.className = 'peek-item';
    div.innerHTML = `<span class="peek-name">${item.emoji} ${item.name}</span><span class="peek-price">₹${item.price}</span>`;
    div.addEventListener('click', () => {
      const sel = document.getElementById('foodItem');
      // find matching option
      [...sel.options].forEach(o => {
        if (o.dataset.name === item.name) sel.value = o.value;
      });
      updateSummary();
      sel.classList.add('is-valid');
      // scroll to form
      document.getElementById('orderForm').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    wrap.appendChild(div);
  });
})();

/* ── PAYMENT TABS ────────────────────────────────────── */
document.querySelectorAll('.pay-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.pay-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('payMethod').value = tab.dataset.method;
  });
});

/* ── QUANTITY STEPPER ────────────────────────────────── */
document.getElementById('qtyMinus')?.addEventListener('click', () => {
  const inp = document.getElementById('quantity');
  const v = parseInt(inp.value) || 1;
  if (v > 1) { inp.value = v - 1; updateSummary(); }
});
document.getElementById('qtyPlus')?.addEventListener('click', () => {
  const inp = document.getElementById('quantity');
  const v = parseInt(inp.value) || 1;
  if (v < 20) { inp.value = v + 1; updateSummary(); }
});
document.getElementById('quantity')?.addEventListener('input', updateSummary);
document.getElementById('foodItem')?.addEventListener('change', updateSummary);

/* ── UPDATE ORDER SUMMARY ────────────────────────────── */
function updateSummary() {
  const sel   = document.getElementById('foodItem');
  const qty   = parseInt(document.getElementById('quantity')?.value) || 1;
  const price = parseInt(sel?.value) || 0;
  const name  = sel?.options[sel.selectedIndex]?.dataset.name || '—';

  const subtotal = price * qty;
  const delivery = subtotal > 0 && subtotal < DELIVERY_MIN ? 40 : 0;
  const total    = subtotal + delivery;

  document.getElementById('sumItem').textContent   = price > 0 ? name : '—';
  document.getElementById('sumQty').textContent    = qty;
  document.getElementById('sumPrice').textContent  = price > 0 ? `₹${price}` : '—';
  document.getElementById('sumSub').textContent    = subtotal > 0 ? `₹${subtotal}` : '—';
  document.getElementById('sumDel').textContent    = subtotal > 0 ? (delivery === 0 ? 'FREE 🎉' : `₹${delivery}`) : '—';
  document.getElementById('sumTotal').textContent  = total > 0 ? `₹${total}` : '—';
}

/* ── VALIDATION HELPERS ──────────────────────────────── */
function setValid(id) {
  const el = document.getElementById(id);
  el.classList.remove('is-invalid');
  el.classList.add('is-valid');
  const err = document.getElementById(id + 'Err');
  if (err) err.classList.remove('show');
}
function setInvalid(id, msg) {
  const el = document.getElementById(id);
  el.classList.remove('is-valid');
  el.classList.add('is-invalid');
  const err = document.getElementById(id + 'Err');
  if (err) { err.textContent = msg; err.classList.add('show'); }
  return false;
}
function clearState(id) {
  const el = document.getElementById(id);
  el.classList.remove('is-valid', 'is-invalid');
  const err = document.getElementById(id + 'Err');
  if (err) err.classList.remove('show');
}

/* ── LIVE VALIDATION ON BLUR ─────────────────────────── */
document.getElementById('custName')?.addEventListener('blur', () => validateName());
document.getElementById('phone')?.addEventListener('blur',   () => validatePhone());
document.getElementById('address')?.addEventListener('blur', () => validateAddress());
document.getElementById('foodItem')?.addEventListener('change', () => validateFood());
document.getElementById('quantity')?.addEventListener('blur', () => validateQty());

function validateName() {
  const v = document.getElementById('custName').value.trim();
  if (!v) return setInvalid('custName', '⚠️ Name is required.');
  if (v.length < 2) return setInvalid('custName', '⚠️ Name must be at least 2 characters.');
  if (!/^[a-zA-Z\s]+$/.test(v)) return setInvalid('custName', '⚠️ Name should only contain letters.');
  return setValid('custName'), true;
}
function validatePhone() {
  const v = document.getElementById('phone').value.trim();
  if (!v) return setInvalid('phone', '⚠️ Phone number is required.');
  if (!/^[6-9]\d{9}$/.test(v)) return setInvalid('phone', '⚠️ Enter a valid 10-digit Indian mobile number.');
  return setValid('phone'), true;
}
function validateAddress() {
  const v = document.getElementById('address').value.trim();
  if (!v) return setInvalid('address', '⚠️ Delivery address is required.');
  if (v.length < 10) return setInvalid('address', '⚠️ Please enter a more complete address.');
  return setValid('address'), true;
}
function validateFood() {
  const v = document.getElementById('foodItem').value;
  if (!v || v === '') return setInvalid('foodItem', '⚠️ Please select a food item.');
  return setValid('foodItem'), true;
}
function validateQty() {
  const v = parseInt(document.getElementById('quantity').value);
  if (!v || v < 1) return setInvalid('quantity', '⚠️ Quantity must be at least 1.');
  if (v > 20)      return setInvalid('quantity', '⚠️ Maximum 20 items per order.');
  return setValid('quantity'), true;
}

/* ── FORM SUBMIT ─────────────────────────────────────── */
document.getElementById('orderForm')?.addEventListener('submit', function(e) {
  e.preventDefault();

  const n  = validateName();
  const p  = validatePhone();
  const a  = validateAddress();
  const f  = validateFood();
  const q  = validateQty();

  if (!n || !p || !a || !f || !q) return;

  const name   = document.getElementById('custName').value.trim();
  const item   = document.getElementById('foodItem').options[document.getElementById('foodItem').selectedIndex].dataset.name;
  const qty    = document.getElementById('quantity').value;
  const price  = parseInt(document.getElementById('foodItem').value);
  const total  = price * parseInt(qty);
  const pay    = document.getElementById('payMethod').value || 'UPI';

  showToast(`✅ Order placed, ${name}! ${qty}× ${item} = ₹${total} via ${pay}. Delivering in ~30 min 🚀`);

  // reset form
  this.reset();
  document.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
    el.classList.remove('is-valid', 'is-invalid');
  });
  document.querySelectorAll('.err-msg').forEach(e => e.classList.remove('show'));
  document.querySelectorAll('.pay-tab').forEach(t => t.classList.remove('active'));
  document.querySelector('.pay-tab[data-method="UPI"]')?.classList.add('active');
  document.getElementById('payMethod').value = 'UPI';
  updateSummary();
});

/* ── TOAST ───────────────────────────────────────────── */
function showToast(msg) {
  const wrap = document.getElementById('toastWrap');
  const div  = document.createElement('div');
  div.className = 'toast-msg';
  div.textContent = msg;
  wrap.appendChild(div);
  setTimeout(() => div.remove(), 4200);
}

/* ── DARK MODE ───────────────────────────────────────── */
const html   = document.documentElement;
const btnLbl = document.getElementById('btnLabel');
document.getElementById('themeBtn')?.addEventListener('click', () => {
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  btnLbl.textContent = isDark ? 'Light Mode' : 'Dark Mode';
});