import Geolocation from "ol/Geolocation";
import type Map from "ol/Map";
import { t } from "@/i18n";
import type { SetStatusFn } from "@/types";

export const setupGeolocation = (map: Map, setStatus: SetStatusFn) => {
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
