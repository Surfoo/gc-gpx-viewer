import "ol/ol.css";
import "./style.css";

import type { Coordinate } from "ol/coordinate";
import type Feature from "ol/Feature";
import type Point from "ol/geom/Point";
import { FullScreen, Zoom } from "ol/control";
import Overlay from "ol/Overlay";
import { gpxToFeatures } from "@/gpx/parser";
import { baseLayers, createMap, vectorSource } from "@/map";
import { createLocateControl, setupGeolocation } from "@/map/geolocation";
import { createInfoOverlay } from "@/map/overlays";
import type { CacheFeature } from "@/types";
import { initI18nDom } from "@/ui/i18nDom";
import { initPanelToggle } from "@/ui/panel";
import { initState } from "@/ui/state";
import { applyDocumentLanguage, t } from "./i18n";
import { createLabelLayer, createPerimeterLayer, updateLabels, updatePerimeters } from "./map/overlaysLayers";

const statusBar = document.querySelector<HTMLDivElement>("#status");
const statsCount = document.querySelector<HTMLSpanElement>("#cache-count");
const baseLayerSelect = document.querySelector<HTMLSelectElement>("#base-layer");
const layout = document.querySelector<HTMLElement>(".layout");
const urlInput = document.querySelector<HTMLInputElement>("#gpx-url");
const loadUrlButton = document.querySelector<HTMLButtonElement>("#load-url");
const fileInput = document.querySelector<HTMLInputElement>("#gpx-file");
const clearButton = document.querySelector<HTMLButtonElement>("#clear-map");
const focusButton = document.querySelector<HTMLButtonElement>("#fit-data");
const displayLabelsCheckbox = document.querySelector<HTMLInputElement>("#display-labels");
const displayPerimetersCheckbox =
  document.querySelector<HTMLInputElement>("#display-perimeters");
const togglePanelButton = document.querySelector<HTMLButtonElement>("#toggle-panel");
const togglePanelFloatingButton =
  document.querySelector<HTMLButtonElement>("#toggle-panel-floating");
const languageSelect = document.querySelector<HTMLSelectElement>("#language");

const { setStatus, updateStats } = initState(statusBar, statsCount, vectorSource);

const infoOverlay = createInfoOverlay();
const map = createMap("map", infoOverlay.overlay);
const geolocation = setupGeolocation(map, (message, isError) => setStatus(message, isError));
const locateControl = createLocateControl(() => {
  infoOverlay.hide();
  geolocation.locate();
}, t("btn.locate"));
map.addControl(locateControl);
const labelLayer = createLabelLayer();
const perimeterLayer = createPerimeterLayer();
map.addLayer(perimeterLayer);
map.addLayer(labelLayer);
const tooltipElement = document.createElement("div");
tooltipElement.className = "ol-tooltip hidden";
const tooltipOverlay = new Overlay({
  element: tooltipElement,
  offset: [0, -12],
  positioning: "bottom-center",
});
map.addOverlay(tooltipOverlay);

const refreshOverlayLayers = (): void => {
  const features = vectorSource.getFeatures() as CacheFeature[];
  if (displayLabelsCheckbox?.checked) {
    updateLabels(labelLayer, features);
  } else {
    labelLayer.getSource()?.clear();
  }

  if (displayPerimetersCheckbox?.checked) {
    updatePerimeters(perimeterLayer, features);
  } else {
    perimeterLayer.getSource()?.clear();
  }
};

const updateControlLabels = (): void => {
  locateControl.updateLabel(t("btn.locate"));
  map
    .getControls()
    .getArray()
    .forEach((control) => {
      if (control instanceof FullScreen) {
        const label = t("btn.fullscreen");
        control.setProperties({ tipLabel: label }, false);
        const button = control.element?.querySelector("button");
        if (button) {
          button.setAttribute("title", label);
          button.setAttribute("aria-label", label);
        }
      }
      if (control instanceof Zoom) {
        const zoomInLabel = t("btn.zoomIn");
        const zoomOutLabel = t("btn.zoomOut");
        control.setProperties(
          {
            zoomInTipLabel: zoomInLabel,
            zoomOutTipLabel: zoomOutLabel,
          },
          false,
        );
        const zoomButtons = control.element?.querySelectorAll("button");
        if (zoomButtons?.[0]) {
          zoomButtons[0].setAttribute("title", zoomInLabel);
          zoomButtons[0].setAttribute("aria-label", zoomInLabel);
        }
        if (zoomButtons?.[1]) {
          zoomButtons[1].setAttribute("title", zoomOutLabel);
          zoomButtons[1].setAttribute("aria-label", zoomOutLabel);
        }
      }
    });
};

updateControlLabels();

const syncMapSize = (): void => {
  setTimeout(() => map.updateSize(), 100);
};

initI18nDom({
  languageSelect,
  onLocaleChange: () => {
    setStatus(t("status.ready"));
    updateControlLabels();
    applyDocumentLanguage();
  },
});

initPanelToggle({
  layout,
  toggle: togglePanelButton,
  floatingToggle: togglePanelFloatingButton,
  onChange: syncMapSize,
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
  refreshOverlayLayers();
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
      setStatus(
        t("status.parseError", { source: file.name, error: (error as Error).message }),
        true,
      );
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
  refreshOverlayLayers();
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

displayLabelsCheckbox?.addEventListener("change", refreshOverlayLayers);
displayPerimetersCheckbox?.addEventListener("change", refreshOverlayLayers);

baseLayerSelect?.addEventListener("change", (event) => {
  const value = (event.target as HTMLSelectElement).value;
  baseLayers.forEach(({ id, layer }) => {
    layer.setVisible(id === value);
  });
});

map.on("singleclick", (event) => {
  let foundFeature: CacheFeature | null = null;
  map.forEachFeatureAtPixel(
    event.pixel,
    (feature) => {
      // Ignore clicks on label/perimeter layers
      if (feature.getGeometry()?.getType() === "Circle" || feature.get("label")) {
        return false;
      }
      foundFeature = feature as CacheFeature;
      return true;
    },
    { hitTolerance: 5 },
  );
  if (foundFeature) {
    infoOverlay.render(foundFeature, event.coordinate as Coordinate);
  } else {
    infoOverlay.hide();
  }
});

map.on("pointermove", (event) => {
  const mapTarget = map.getTargetElement();
  let hovered: CacheFeature | null = null;
  map.forEachFeatureAtPixel(
    event.pixel,
    (feature) => {
      if (feature.getGeometry()?.getType() === "Circle" || feature.get("label")) {
        return false;
      }
      hovered = feature as CacheFeature;
      return true;
    },
    { hitTolerance: 5 },
  );
  if (hovered) {
    const name = hovered.get<string>("name") ?? "";
    tooltipElement.textContent = name;
    tooltipElement.classList.remove("hidden");
    tooltipOverlay.setPosition(event.coordinate);
    if (mapTarget) mapTarget.style.cursor = "pointer";
  } else {
    tooltipOverlay.setPosition(undefined);
    tooltipElement.classList.add("hidden");
    if (mapTarget) mapTarget.style.cursor = "";
  }
});

const layerOptions = baseLayers
  .map(
    (layer) =>
      `<option value="${layer.id}" ${layer.layer.getVisible() ? "selected" : ""}>${layer.title}</option>`,
  )
  .join("");
if (baseLayerSelect) {
  baseLayerSelect.innerHTML = layerOptions;
}

updateStats();
setStatus(t("status.ready"));
syncMapSize();
setTimeout(syncMapSize, 100);
