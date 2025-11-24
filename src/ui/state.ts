import type VectorSource from "ol/source/Vector";
import type { SetStatusFn } from "@/types";

export const initState = (
  statusElement: HTMLElement | null,
  countElement: HTMLElement | null,
  vectorSource: VectorSource,
): { setStatus: SetStatusFn; updateStats: () => void } => {
  const setStatus: SetStatusFn = (message, isError = false) => {
    if (!statusElement) return;
    statusElement.textContent = message;
    statusElement.dataset.state = isError ? "error" : "info";
  };

  const updateStats = (): void => {
    if (!countElement) return;
    countElement.textContent = `${vectorSource.getFeatures().length}`;
  };

  return { setStatus, updateStats };
};
