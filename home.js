/* ── TICKER ── */
const tItems = [
  '🍛 Chicken Biryani – ₹199','🍕 Margherita Pizza – ₹299','🍔 Smash Burger – ₹149',
  '🥞 Masala Dosa – ₹79','🍜 Veg Noodles – ₹129','🍦 Gulab Jamun – ₹59',
  '🧁 Red Velvet – ₹89','☕ Cold Coffee – ₹99','🌮 Chicken Wrap – ₹139',
  '🥗 Caesar Salad – ₹169','🍱 Thali Special – ₹249','🧆 Falafel Bowl – ₹179'
];
const tk = document.getElementById('ticker');
[...tItems,...tItems].forEach(x => {
  const s = document.createElement('span');
  s.className = 'ticker-item';
  s.textContent = x + '   ✦   ';
  tk.appendChild(s);
});

/* ── MENU LIST ── */
const menu = [
  {e:'🍛',n:'Chicken Biryani',d:'Spice Garden',p:'₹199'},
  {e:'🍕',n:'Margherita Pizza',d:'Pizza Palace',p:'₹299'},
  {e:'🥞',n:'Masala Dosa',d:'South Delight',p:'₹79'},
  {e:'🍔',n:'Smash Burger',d:'Burger Hub',p:'₹149'},
  {e:'🧁',n:'Red Velvet Cake',d:'Sweet Heaven',p:'₹89'},
  {e:'☕',n:'Cold Coffee',d:'Cafe Corner',p:'₹99'},
];
const ml = document.getElementById('menuList');
menu.forEach(m => {
  ml.innerHTML += `
    <div class="col-12 col-md-6">
      <div class="menu-row">
        <span class="me">${m.e}</span>
        <div><div class="mn">${m.n}</div><p class="md">${m.d}</p></div>
        <span class="mp">${m.p}</span>
      </div>
    </div>`;
});

/* ── GEAR / DARK MODE TOGGLE ── */
const html   = document.documentElement;
const btnLbl = document.getElementById('btnLabel');
document.getElementById('themeBtn').addEventListener('click', () => {
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  btnLbl.textContent = isDark ? 'Light Mode' : 'Dark Mode';
});

/* ── COUNT-UP STATS (triggered when strip scrolls into view) ── */
function countUp(el) {
  const target   = parseFloat(el.dataset.target);
  const suffix   = el.dataset.suffix || '';
  const display  = el.dataset.display || null;   // e.g. "1M" override
  const decimal  = parseInt(el.dataset.decimal) || 0;
  const duration = 1800; // ms
  const steps    = 60;
  const interval = duration / steps;
  let current    = 0;
  let step       = 0;

  // Special: if display override exists (1M+), just animate visually then snap
  if (display) {
    let fake = 0;
    const fakeTarget = 999;
    const fakeStep   = fakeTarget / steps;
    const timer = setInterval(() => {
      fake += fakeStep;
      step++;
      if (step >= steps) {
        clearInterval(timer);
        el.textContent = display + suffix;
        el.classList.add('popped');
        setTimeout(() => el.classList.remove('popped'), 400);
      } else {
        el.textContent = Math.floor(fake) + 'K+';
      }
    }, interval);
    return;
  }

  const increment = target / steps;
  const timer = setInterval(() => {
    current += increment;
    step++;
    if (step >= steps) {
      clearInterval(timer);
      el.textContent = target.toFixed(decimal) + suffix;
      el.classList.add('popped');
      setTimeout(() => el.classList.remove('popped'), 400);
    } else {
      el.textContent = current.toFixed(decimal) + suffix;
    }
  }, interval);
}

// IntersectionObserver — fire once when stats strip enters viewport
const statNums   = document.querySelectorAll('.stat-num[data-target]');
let   statsAnimated = false;
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !statsAnimated) {
      statsAnimated = true;
      statNums.forEach((el, i) => setTimeout(() => countUp(el), i * 180));
    }
  });
}, { threshold: 0.4 });

const strip = document.querySelector('.stat-strip');
if (strip) observer.observe(strip);