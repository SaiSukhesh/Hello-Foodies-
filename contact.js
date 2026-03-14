/* ══════════════════════════════════════════
   contact.js  –  Hello Foodies Contact Page
   ══════════════════════════════════════════ */

/* ── TICKER ─────────────────────────────────────────── */
(function buildTicker() {
  const items = [
    '🍛 Chicken Biryani – ₹450', '🍕 Cheese Pizza – ₹220', '🍔 Chilli Chicken – ₹150',
    '🥞 Masala Dosa – ₹120', '🍚 Idli – ₹80', '🍗 Butter Chicken – ₹320',
    '🧀 Paneer Masala – ₹260', '🍟 French Fries – ₹100', '🌶️ Mutton Biryani – ₹520',
    '🥗 Veg Biryani – ₹350', '🍄 Mushroom Curry – ₹300', '🫓 Puri – ₹90'
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

/* ── DARK MODE TOGGLE ────────────────────────────────── */
const html   = document.documentElement;
const btnLbl = document.getElementById('btnLabel');
document.getElementById('themeBtn')?.addEventListener('click', () => {
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  btnLbl.textContent = isDark ? 'Light Mode' : 'Dark Mode';
});

/* ── CHARACTER COUNTER ───────────────────────────────── */
const msgEl    = document.getElementById('cMessage');
const charEl   = document.getElementById('charCount');
const MAX_CHARS = 500;

msgEl?.addEventListener('input', () => {
  const len = msgEl.value.length;
  charEl.textContent = `${len} / ${MAX_CHARS}`;
  if (len > MAX_CHARS) {
    msgEl.value = msgEl.value.substring(0, MAX_CHARS);
    charEl.textContent = `${MAX_CHARS} / ${MAX_CHARS}`;
  }
  charEl.style.color = len >= MAX_CHARS ? '#e74c3c' : 'var(--muted)';
});

/* ── VALIDATION HELPERS ──────────────────────────────── */
function setValid(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('is-invalid');
  el.classList.add('is-valid');
  const err = document.getElementById(id + 'Err');
  if (err) err.classList.remove('show');
}
function setInvalid(id, msg) {
  const el = document.getElementById(id);
  if (!el) return false;
  el.classList.remove('is-valid');
  el.classList.add('is-invalid');
  const err = document.getElementById(id + 'Err');
  if (err) { err.textContent = msg; err.classList.add('show'); }
  return false;
}

/* ── INDIVIDUAL VALIDATORS ───────────────────────────── */
function validateName() {
  const v = document.getElementById('cName').value.trim();
  if (!v)          return setInvalid('cName', '⚠️ Name is required.');
  if (v.length < 2) return setInvalid('cName', '⚠️ Name must be at least 2 characters.');
  if (!/^[a-zA-Z\s]+$/.test(v)) return setInvalid('cName', '⚠️ Name should only contain letters.');
  setValid('cName'); return true;
}

function validateEmail() {
  const v = document.getElementById('cEmail').value.trim();
  if (!v) return setInvalid('cEmail', '⚠️ Email is required.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return setInvalid('cEmail', '⚠️ Please enter a valid email address.');
  setValid('cEmail'); return true;
}

function validatePhone() {
  const v = document.getElementById('cPhone').value.trim();
  if (!v) { setValid('cPhone'); return true; } // optional field
  if (!/^[6-9]\d{9}$/.test(v)) return setInvalid('cPhone', '⚠️ Enter a valid 10-digit Indian mobile number.');
  setValid('cPhone'); return true;
}

function validateSubject() {
  const v = document.getElementById('cSubject').value;
  if (!v) return setInvalid('cSubject', '⚠️ Please select a subject.');
  setValid('cSubject'); return true;
}

function validateMessage() {
  const v = document.getElementById('cMessage').value.trim();
  if (!v)           return setInvalid('cMessage', '⚠️ Message cannot be empty.');
  if (v.length < 10) return setInvalid('cMessage', '⚠️ Message must be at least 10 characters.');
  setValid('cMessage'); return true;
}

/* ── LIVE VALIDATION ON BLUR ─────────────────────────── */
document.getElementById('cName')?.addEventListener('blur',    validateName);
document.getElementById('cEmail')?.addEventListener('blur',   validateEmail);
document.getElementById('cPhone')?.addEventListener('blur',   validatePhone);
document.getElementById('cSubject')?.addEventListener('change', validateSubject);
document.getElementById('cMessage')?.addEventListener('blur', validateMessage);

/* ── FORM SUBMIT ─────────────────────────────────────── */
document.getElementById('contactForm')?.addEventListener('submit', function(e) {
  e.preventDefault();

  const n = validateName();
  const em = validateEmail();
  const ph = validatePhone();
  const s  = validateSubject();
  const m  = validateMessage();

  if (!n || !em || !ph || !s || !m) return;

  const name = document.getElementById('cName').value.trim();
  showToast(`✅ Thanks ${name}! Your message has been sent. We'll get back to you within 2 hours. 💬`);

  // reset
  this.reset();
  document.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
    el.classList.remove('is-valid', 'is-invalid');
  });
  document.querySelectorAll('.err-msg').forEach(e => e.classList.remove('show'));
  if (charEl) { charEl.textContent = '0 / 500'; charEl.style.color = 'var(--muted)'; }
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