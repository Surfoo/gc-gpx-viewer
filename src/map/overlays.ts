import Overlay from "ol/Overlay";
import type { Coordinate } from "ol/coordinate";
import { t } from "@/i18n";
import type { CacheFeature } from "@/types";

const escapeHtml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

export const createInfoOverlay = (): {
  overlay: Overlay;
  hide: () => void;
  render: (feature: CacheFeature, coordinate: Coordinate) => void;
} => {
  const popup = document.querySelector<HTMLDivElement>("#popup");
  const popupCloser = document.querySelector<HTMLAnchorElement>("#popup-closer");
  const infoContent = document.querySelector<HTMLDivElement>("#info-content");
  const overlayElement = popup ?? document.createElement("div");

  const overlay = new Overlay({
    element: overlayElement,
    positioning: "bottom-center",
    offset: [0, -12],
    autoPan: { animation: { duration: 200 } }
  });

  const hide = (): void => {
    overlay.setPosition(undefined);
    popupCloser?.blur();
  };

  const render = (feature: CacheFeature, coordinate: Coordinate): void => {
    if (!popup || !infoContent) return;
    const code = feature.get<string>("code");
    const name = feature.get<string>("name");
    const type = feature.get<string>("type");
    const owner = feature.get<string>("owner");
    const difficulty = feature.get<string>("difficulty");
    const terrain = feature.get<string>("terrain");
    const container = feature.get<string>("container");
    const found = feature.get<boolean>("found");
    const description = feature.get<string>("description");
    const sourceLabel = feature.get<string>("sourceLabel");
    const date = feature.get<string | undefined>("date");

    infoContent.innerHTML = `
      <div class="pill-row">
        <span class="pill">${escapeHtml(type ?? "Geocache")}</span>
        <span class="pill">${escapeHtml(container ?? "Unknown")}</span>
      </div>
      <dl class="meta">
        <div><dt>${t("info.code")}</dt><dd>${escapeHtml(code ?? "—")}</dd></div>
        <div><dt>${t("info.owner")}</dt><dd>${escapeHtml(owner ?? "—")}</dd></div>
        <div><dt>${t("info.dt")}</dt><dd>${escapeHtml(difficulty ?? "?")} / ${escapeHtml(terrain ?? "?")}</dd></div>
        <div><dt>${t("info.loadedFrom")}</dt><dd>${escapeHtml(sourceLabel ?? "—")}</dd></div>
        <div><dt>${t("info.date")}</dt><dd>${escapeHtml(date ?? "—")}</dd></div>
      </dl>
    `;
    popup.classList.remove("hidden");
    overlay.setPosition(coordinate);
  };

  popupCloser?.addEventListener("click", (event) => {
    event.preventDefault();
    hide();
  });

  return { overlay, hide, render };
};
