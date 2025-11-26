import Geolocation from "ol/Geolocation";
import type { default as OlMap } from "ol/Map";
import Control from "ol/control/Control";
import { t } from "@/i18n";
import type { SetStatusFn } from "@/types";

class LocateControl extends Control {
  #button: HTMLButtonElement;
  #onLocate: () => void;

  constructor({ onLocate, label }: { onLocate: () => void; label: string }) {
    const button = document.createElement("button");
    button.type = "button";
    button.title = label;
    button.setAttribute("aria-label", label);
    button.textContent = "⌖";

    const element = document.createElement("div");
    element.className = "ol-control ol-custom-control ol-unselectable";
    element.appendChild(button);

    super({ element });

    this.#button = button;
    this.#onLocate = onLocate;

    this.#button.addEventListener("click", (event) => {
      event.preventDefault();
      this.#onLocate();
    });
  }

  updateLabel(label: string): void {
    this.#button.title = label;
    this.#button.setAttribute("aria-label", label);
  }
}

export const createLocateControl = (onLocate: () => void, label: string): LocateControl =>
  new LocateControl({ onLocate, label });

export const setupGeolocation = (map: OlMap, setStatus: SetStatusFn) => {
  const geolocation = new Geolocation({
    projection: map.getView().getProjection(),
    trackingOptions: { enableHighAccuracy: true },
  });

  geolocation.on("error", (error) => {
    setStatus(t("status.geolocUnavailable", { error: error.message }), true);
  });

  const locate = (): void => {
    geolocation.setTracking(true);
    geolocation.once("change:position", () => {
      const position = geolocation.getPosition();
      geolocation.setTracking(false);
      if (!position) {
        setStatus(t("status.positionError"), true);
        return;
      }
      map.getView().animate({ center: position, zoom: 14, duration: 350 });
      setStatus(t("status.centered"));
    });
  };

  return { locate };
};
