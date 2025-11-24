import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import XYZ from "ol/source/XYZ";
import type { BaseLayer } from "@/types";

export const createBaseLayers = (): BaseLayer[] => [
  {
    id: "osm-standard",
    title: "OSM Standard",
    layer: new TileLayer({
      source: new OSM(),
      visible: true
    })
  },
  {
    id: "osm-hot",
    title: "OSM Humanitarian",
    layer: new TileLayer({
      source: new XYZ({
        url: "https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
        attributions: "© OpenStreetMap contributors, Humanitarian style"
      }),
      visible: false
    })
  },
  {
    id: "carto-voyager",
    title: "Carto Voyager",
    layer: new TileLayer({
      source: new XYZ({
        url: "https://cartodb-basemaps-{a-d}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png",
        attributions: "© OpenStreetMap contributors, © CARTO"
      }),
      visible: false
    })
  },
  {
    id: "cyc-losm",
    title: "CyclOSM",
    layer: new TileLayer({
      source: new XYZ({
        url: "https://{a-c}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
        attributions:
          '© OpenStreetMap contributors, CyclOSM (data reuse under ODbL), style CC-BY-SA'
      }),
      visible: false
    })
  },
  {
    id: "stamen-terrain",
    title: "Stamen Terrain Lite",
    layer: new TileLayer({
      source: new XYZ({
        url: "https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg",
        attributions:
          'Map tiles by Stamen Design (CC BY 4.0), Data © OpenStreetMap contributors (ODbL)'
      }),
      visible: false
    })
  }
];
