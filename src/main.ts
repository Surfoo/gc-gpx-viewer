import "ol/ol.css";
import "./style.css";

import type Feature from "ol/Feature";
import type { Coordinate } from "ol/coordinate";
import Point from "ol/geom/Point";

import { t } from "./i18n";
import { gpxToFeatures } from "@/gpx/parser";
import { baseLayers, createMap, vectorSource } from "@/map";
import { setupGeolocation } from "@/map/geolocation";
import { createInfoOverlay } from "@/map/overlays";
import { initPanelToggle } from "@/ui/panel";
import { initState } from "@/ui/state";
import { initI18nDom } from "@/ui/i18nDom";
import type { CacheFeature } from "@/types";

const statusBar = document.querySelector<HTMLDivElement>("#status");
const statsCount = document.querySelector<HTMLSpanElement>("#cache-count");
const baseLayerSelect = document.querySelector<HTMLSelectElement>("#base-layer");
const layout = document.querySelector<HTMLElement>(".layout");
const urlInput = document.querySelector<HTMLInputElement>("#gpx-url");
const loadUrlButton = document.querySelector<HTMLButtonElement>("#load-url");
const fileInput = document.querySelector<HTMLInputElement>("#gpx-file");
const clearButton = document.querySelector<HTMLButtonElement>("#clear-map");
const focusButton = document.querySelector<HTMLButtonElement>("#fit-data");
const geolocateButton = document.querySelector<HTMLButtonElement>("#locate-me");
const geolocateMapButton = document.querySelector<HTMLButtonElement>("#locate-map-btn");
const togglePanelButton = document.querySelector<HTMLButtonElement>("#toggle-panel");
const togglePanelFloatingButton = document.querySelector<HTMLButtonElement>("#toggle-panel-floating");
const importBody = document.querySelector<HTMLElement>("#import-body");
const languageSelect = document.querySelector<HTMLSelectElement>("#language");
const themeToggle = document.querySelector<HTMLButtonElement>("#theme-toggle");
const customLocateControl = document.querySelector<HTMLElement>(".ol-custom-control");

const { setStatus, updateStats } = initState(statusBar, statsCount, vectorSource);

const infoOverlay = createInfoOverlay();
const map = createMap("map", infoOverlay.overlay);
const geolocation = setupGeolocation(map, (message, isError) => setStatus(message, isError));

const mapTarget = map.getTargetElement();
if (mapTarget && customLocateControl && !mapTarget.contains(customLocateControl)) {
  mapTarget.appendChild(customLocateControl);
}

const syncMapSize = (): void => {
  setTimeout(() => map.updateSize(), 100);
};

type Theme = "light" | "dark";
const THEME_KEY = "gpxviewer.theme";

const getPreferredTheme = (): Theme => {
  const stored = localStorage.getItem(THEME_KEY) as Theme | null;
  if (stored === "light" || stored === "dark") return stored;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
};

const applyTheme = (theme: Theme): void => {
  document.body.dataset.theme = theme;
  localStorage.setItem(THEME_KEY, theme);
  if (themeToggle) {
    themeToggle.innerHTML = `<i class="ri-contrast-2-${theme === "dark" ? "fill" : "line"}" aria-hidden="true"></i>`;
    themeToggle.setAttribute("aria-label", t(theme === "dark" ? "theme.light" : "theme.dark"));
  }
};

applyTheme(getPreferredTheme());

initI18nDom({
  languageSelect,
  onLocaleChange: () => {
    setStatus(t("status.ready"));
    applyTheme((document.body.dataset.theme as Theme) ?? "light");
  }
});

initPanelToggle({
  layout,
  body: importBody,
  toggle: togglePanelButton,
  floatingToggle: togglePanelFloatingButton,
  onChange: syncMapSize
});

const addFeaturesToMap = (features: Feature<Point>[], sourceLabel: string): void => {
  features.forEach((feature) => {
    vectorSource.addFeature(feature);
  });
  updateStats();
  const extent = vectorSource.getExtent();
  if (extent && vectorSource.getFeatures().length > 0) {
    map.getView().fit(extent, { padding: [32, 32, 32, 32], duration: 300, maxZoom: 15 });
  }
  setStatus(t("status.loaded", { source: sourceLabel, count: features.length }));
};

const loadGpxText = (gpxText: string, sourceLabel: string): void => {
  const features = gpxToFeatures(gpxText, sourceLabel);
  if (!features.length) {
    setStatus(t("status.empty"), true);
    return;
  }
  addFeaturesToMap(features, sourceLabel);
};

fileInput?.addEventListener("change", async (event) => {
  const files = (event.target as HTMLInputElement).files;
  if (!files || files.length === 0) return;
  infoOverlay.hide();
  for (const file of files) {
    const text = await file.text();
    try {
      loadGpxText(text, file.name);
    } catch (error) {
      setStatus(t("status.parseError", { source: file.name, error: (error as Error).message }), true);
    }
  }
});

loadUrlButton?.addEventListener("click", async () => {
  const url = urlInput?.value.trim();
  if (!url) {
    setStatus(t("status.urlRequired"), true);
    return;
  }
  infoOverlay.hide();
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Réponse HTTP ${response.status}`);
    }
    const text = await response.text();
    loadGpxText(text, url);
  } catch (error) {
    setStatus(t("status.urlError", { error: (error as Error).message }), true);
  }
});

clearButton?.addEventListener("click", () => {
  vectorSource.clear();
  infoOverlay.hide();
  updateStats();
  setStatus(t("status.cleared"));
});

focusButton?.addEventListener("click", () => {
  const extent = vectorSource.getExtent();
  if (!extent || vectorSource.getFeatures().length === 0) {
    setStatus(t("status.noExtent"), true);
    return;
  }
  infoOverlay.hide();
  map.getView().fit(extent, { padding: [32, 32, 32, 32], duration: 300, maxZoom: 15 });
});

baseLayerSelect?.addEventListener("change", (event) => {
  const value = (event.target as HTMLSelectElement).value;
  baseLayers.forEach(({ id, layer }) => {
    layer.setVisible(id === value);
  });
});

geolocateButton?.addEventListener("click", () => {
  infoOverlay.hide();
  geolocation.locate();
});

geolocateMapButton?.addEventListener("click", () => {
  infoOverlay.hide();
  geolocation.locate();
});

themeToggle?.addEventListener("click", () => {
  const current = (document.body.dataset.theme as Theme) ?? "light";
  const next: Theme = current === "light" ? "dark" : "light";
  applyTheme(next);
});

map.on("singleclick", (event) => {
  let foundFeature: CacheFeature | null = null;
  map.forEachFeatureAtPixel(event.pixel, (feature) => {
    foundFeature = feature as CacheFeature;
    return true;
  });
  if (foundFeature) {
    infoOverlay.render(foundFeature, event.coordinate as Coordinate);
  } else {
    infoOverlay.hide();
  }
});

const layerOptions = baseLayers
  .map(
    (layer) =>
      `<option value="${layer.id}" ${layer.layer.getVisible() ? "selected" : ""}>${layer.title}</option>`
  )
  .join("");
if (baseLayerSelect) {
  baseLayerSelect.innerHTML = layerOptions;
}

updateStats();
setStatus(t("status.ready"));
syncMapSize();
setTimeout(syncMapSize, 100);
