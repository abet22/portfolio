const i18n = {
  current: 'en',

  set(locale) {
    this.current = locale;
    document.documentElement.lang = locale;
    try { localStorage.setItem('portfolio_locale', locale); } catch (_) {}
  },

  // UI string lookup — falls back to English
  t(key) {
    const map = { en: window.LOCALE_EN, es: window.LOCALE_ES, ca: window.LOCALE_CA };
    return map[this.current]?.[key] ?? map.en[key] ?? key;
  },

  // Translatable content field — { en, es, ca } object → current locale string
  tc(obj) {
    if (!obj || typeof obj === 'string') return obj ?? '';
    return obj[this.current] ?? obj.en ?? '';
  },

  // Format a { month, year } / null date pair into a locale-aware range string
  formatDateRange(from, to) {
    const months = this.t('date.months');
    const present = this.t('date.present');
    const f = from ? `${months[from.month - 1]} ${from.year}` : '';
    const t = to   ? `${months[to.month - 1]} ${to.year}`   : present;
    return f ? `${f} — ${t}` : t;
  },

  // Format education year range
  formatYearRange(from, to, ongoing) {
    if (ongoing) return `${from} — ${to} (${this.t('edu.ongoing')})`;
    return `${from} — ${to}`;
  },
};

// Restore persisted locale
try {
  const saved = localStorage.getItem('portfolio_locale');
  if (saved && ['en', 'es', 'ca'].includes(saved)) i18n.current = saved;
} catch (_) {}

window.i18n = i18n;
