import { locales, translations, type Locale } from "./translations";

const STORAGE_KEY = "gpxviewer.locale";

const detectLocale = (): Locale => {
  const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
  if (saved && translations[saved]) return saved;
  const browser = (navigator.language || "").slice(0, 2).toLowerCase();
  const match = locales.find((l) => l.code === browser);
  return match?.code ?? "en";
};

let currentLocale: Locale = detectLocale();

export const getLocale = (): Locale => currentLocale;

export const setLocale = (locale: Locale): void => {
  if (!translations[locale]) return;
  currentLocale = locale;
  localStorage.setItem(STORAGE_KEY, locale);
};

type Params = Record<string, string | number>;

export const t = (key: string, params: Params = {}): string => {
  const dict = translations[currentLocale] || translations.en;
  const template = dict[key] ?? key;
  return Object.keys(params).reduce(
    (acc, k) => acc.replaceAll(`{${k}}`, String(params[k])),
    template
  );
};

export { locales };
