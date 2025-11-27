import { defaults as defaultControls, FullScreen, Zoom } from "ol/control";
import VectorLayer from "ol/layer/Vector";
import OlMap from "ol/Map";
import type Overlay from "ol/Overlay";
import { fromLonLat } from "ol/proj";
import VectorSource from "ol/source/Vector";
import View from "ol/View";
import type { BaseLayer } from "@/types";
import { createBaseLayers } from "./baseLayers";
import { getFeatureStyle } from "./styles";

export const baseLayers: BaseLayer[] = createBaseLayers();
export const vectorSource = new VectorSource();
export const vectorLayer = new VectorLayer({
  source: vectorSource,
  style: getFeatureStyle,
  zIndex: 10,
});

export const createMap = (targetId: string, overlay?: Overlay): OlMap => {
  const map = new OlMap({
    target: targetId,
    layers: [...baseLayers.map((entry) => entry.layer), vectorLayer],
    controls: defaultControls({
      zoom: false,
      rotate: false,
      attribution: true,
    }).extend([
      new Zoom({
        zoomInTipLabel: "Zoom in",
        zoomOutTipLabel: "Zoom out",
      }),
      new FullScreen({
        tipLabel: "Fullscreen",
        label: "⛶",
        labelActive: "⛶",
      }),
    ]),
    view: new View({
      center: fromLonLat([2.2137, 46.2276]),
      zoom: 6,
    }),
  });

  if (overlay) {
    map.addOverlay(overlay);
  }

  return map;
};
