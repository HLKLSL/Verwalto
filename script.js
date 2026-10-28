const menu = document.querySelector('.menu-button');
const nav = document.querySelector('.nav');
menu.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
}));

const translations = window.verwaltoTranslations || {};
const languageSelect = document.querySelector('#language-select');
const originalText = new Map([...document.querySelectorAll('[data-t]')].map(el => [el, el.innerHTML]));
const originalPlaceholders = new Map([...document.querySelectorAll('[data-t-placeholder]')].map(el => [el, el.getAttribute('placeholder')]));
const originalAria = new Map([...document.querySelectorAll('[data-t-aria]')].map(el => [el, el.getAttribute('aria-label')]));
const languageNames = { de: 'Sprache auswählen', en: 'Select language', fr: 'Choisir la langue', es: 'Elegir idioma', zh: '选择语言' };
const mottos = {
  de: ['Mit Klarheit verwalten.', 'Deine Daten. Dein Zuhause.', 'Ordnung, die weiterdenkt.'],
  en: ['Manage with clarity.', 'Your data. At home with you.', 'A better kind of order.'],
  fr: ['Gérer en toute clarté.', 'Vos données. Chez vous.', 'L’ordre qui voit plus loin.'],
  es: ['Gestiona con claridad.', 'Tus datos. En casa contigo.', 'Orden que mira hacia delante.'],
  zh: ['清晰管理。', '你的数据，就在你身边。', '让秩序更进一步。']
};
let currentLanguage = 'de';
function setLanguage(language) {
  currentLanguage = translations[language] ? language : 'de';
  const words = translations[currentLanguage] || {};
  document.documentElement.lang = currentLanguage === 'zh' ? 'zh-CN' : currentLanguage;
  document.querySelectorAll('[data-t]').forEach(el => {
    const key = el.dataset.t;
    el.innerHTML = currentLanguage === 'de' ? originalText.get(el) : (words[key] || originalText.get(el));
  });
  document.querySelectorAll('[data-t-placeholder]').forEach(el => {
    const key = el.dataset.tPlaceholder;
    el.setAttribute('placeholder', currentLanguage === 'de' ? originalPlaceholders.get(el) : (words[key] || originalPlaceholders.get(el)));
  });
  document.querySelectorAll('[data-t-aria]').forEach(el => {
    const key = el.dataset.tAria;
    el.setAttribute('aria-label', currentLanguage === 'de' ? originalAria.get(el) : (words[key] || originalAria.get(el)));
  });
  languageSelect.setAttribute('aria-label', languageNames[currentLanguage]);
  document.title = currentLanguage === 'de' ? 'Verwalto — Verwaltung. Einfach klar.' : `Verwalto — ${words.heroTitle?.replace(/<[^>]+>/g, ' ') || 'Property management'}`;
  if (mottoText) showMotto(mottoIndex, true);
  try { localStorage.setItem('verwalto-language', currentLanguage); } catch {}
}

const mottoText = document.querySelector('#motto-text');
const mottoDots = [...document.querySelectorAll('.motto-dots i')];
let mottoIndex = 0;
function showMotto(index, immediate = false) {
  if (!mottoText) return;
  const lines = mottos[currentLanguage] || mottos.de;
  const update = () => {
    mottoText.textContent = lines[index % lines.length];
    mottoDots.forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === index % lines.length));
    mottoText.classList.remove('switching');
  };
  if (immediate) { update(); return; }
  mottoText.classList.add('switching');
  window.setTimeout(update, 300);
}
languageSelect.addEventListener('change', () => setLanguage(languageSelect.value));
try {
  const saved = localStorage.getItem('verwalto-language');
  if (saved && translations[saved]) languageSelect.value = saved;
} catch {}
setLanguage(languageSelect.value);
window.setInterval(() => {
  mottoIndex = (mottoIndex + 1) % 3;
  showMotto(mottoIndex);
}, 4200);

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  }), { threshold: 0.13, rootMargin: '0px 0px -35px 0px' });
  revealItems.forEach(item => observer.observe(item));
} else revealItems.forEach(item => item.classList.add('visible'));
const progress = document.querySelector('.scroll-progress');
let scheduled = false;
window.addEventListener('scroll', () => {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${total > 0 ? window.scrollY / total * 100 : 0}%`;
    scheduled = false;
  });
}, { passive: true });
const stage = document.querySelector('[data-parallax]');
if (stage && window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  stage.addEventListener('pointermove', event => {
    const bounds = stage.getBoundingClientRect();
    stage.style.setProperty('--px', `${((event.clientX - bounds.left) / bounds.width - .5) * 9}px`);
    stage.style.setProperty('--py', `${((event.clientY - bounds.top) / bounds.height - .5) * 8}px`);
  });
  stage.addEventListener('pointerleave', () => {
    stage.style.setProperty('--px', '0px');
    stage.style.setProperty('--py', '0px');
  });
}
document.querySelector('#year').textContent = new Date().getFullYear();
document.querySelector('.signup-form').addEventListener('submit', event => {
  event.preventDefault();
  const messages = {
    de: 'Danke für dein Interesse! Die Vormerkung wird vorbereitet. Ein Versand ist noch nicht angebunden.',
    en: 'Thanks for your interest! Sign-up is being prepared; email delivery is not connected yet.',
    fr: 'Merci pour votre intérêt ! L’inscription se prépare ; l’envoi d’e-mails n’est pas encore connecté.',
    es: '¡Gracias por tu interés! Estamos preparando el registro; el envío de correo aún no está conectado.',
    zh: '感谢关注！登记功能正在准备中，邮件发送尚未接入。'
  };
  document.querySelector('.form-message').textContent = messages[currentLanguage];
});
