import { Circle as CircleStyle, Fill, Icon, Stroke, Style } from "ol/style";
import type { CacheFeature } from "@/types";

const typeToIconId: Record<string, string> = {
  "traditional cache": "2",
  traditional: "2",
  "multi-cache": "3",
  multi: "3",
  "virtual cache": "4",
  virtual: "4",
  "letterbox hybrid": "5",
  letterbox: "5",
  "event cache": "6",
  event: "6",
  "lost and found event caches": "6",
  "unknown cache": "8",
  "mystery cache": "8",
  mystery: "8",
  "project ape cache": "9",
  "project a.p.e.": "9",
  "webcam cache": "11",
  "locationless (reverse) cache": "12",
  "cache in trash out event": "13",
  earthcache: "137",
  "mega-event cache": "453",
  "mega-event": "453",
  "gps adventures exhibit": "1304",
  "wherigo cache": "1858",
  wherigo: "1858",
  "community celebration event": "3653",
  "geocaching hq": "3773",
  "groundspeak hq": "3773",
  "geocaching hq celebration": "3774",
  "groundspeak lost and found celebration": "3774",
  "geocaching hq block party": "4738",
  "groundspeak block party": "4738",
  "giga-event cache": "7005",
  "giga-event": "7005",
};

const defaultIconId = "8"; // mystery/unknown
const styleCache = new Map<string, Style | Style[]>();

const iconSrcForType = (cacheType: string): string => {
  const normalized = cacheType.trim().toLowerCase();
  const matched = typeToIconId[normalized] ?? defaultIconId;
  return `/icons/mapicons/${matched}.png`;
};

export const getFeatureStyle = (feature: CacheFeature): Style | Style[] => {
  const type = feature.get<string>("type") ?? "Unknown Cache";
  const found = feature.get<boolean>("found") ?? false;
  const iconSrc = iconSrcForType(type);
  const key = `${iconSrc}-${found ? "found" : "fresh"}`;
  const existing = styleCache.get(key);
  if (existing) return existing;

  const iconStyle = new Style({
    image: new Icon({
      src: iconSrc,
      anchor: [0.5, 1],
      scale: 1,
    }),
  });

  if (!found) {
    styleCache.set(key, iconStyle);
    return iconStyle;
  }

  const ringStyle = new Style({
    image: new CircleStyle({
      radius: 14,
      stroke: new Stroke({ color: "rgba(16, 185, 129, 0.9)", width: 3 }),
      fill: new Fill({ color: "rgba(16, 185, 129, 0.12)" }),
    }),
  });

  const styleArray: Style[] = [ringStyle, iconStyle];
  styleCache.set(key, styleArray);
  return styleArray;
};
