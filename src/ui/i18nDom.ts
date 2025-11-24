import { getLocale, locales, setLocale, t } from "@/i18n";

type I18nDomOptions = {
  languageSelect: HTMLSelectElement | null;
  onLocaleChange?: () => void;
};

export const initI18nDom = ({ languageSelect, onLocaleChange }: I18nDomOptions) => {
  const applyText = (): void => {
    document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((node) => {
      const key = node.dataset.i18n ?? "";
      node.textContent = t(key);
    });
  };

  const populateLanguages = (): void => {
    if (!languageSelect) return;
    languageSelect.innerHTML = locales
      .map(
        (locale) =>
          `<option value="${locale.code}" ${locale.code === getLocale() ? "selected" : ""}>${locale.label}</option>`
      )
      .join("");
  };

  populateLanguages();
  applyText();

  languageSelect?.addEventListener("change", (event) => {
    const value = (event.target as HTMLSelectElement).value as typeof locales[number]["code"];
    setLocale(value);
    applyText();
    onLocaleChange?.();
  });

  return { applyText };
};
