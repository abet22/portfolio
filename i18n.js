const i18n = {
  current: 'en',

  set(locale) {
    this.current = 'en';
    document.documentElement.lang = 'en';
  },

  // UI string lookup — English only
  t(key) {
    const map = { en: window.LOCALE_EN };
    return map.en[key] ?? key;
  },

  // Translatable content field — English only
  tc(obj) {
    if (!obj || typeof obj === 'string') return obj ?? '';
    return obj.en ?? '';
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

window.i18n = i18n;
