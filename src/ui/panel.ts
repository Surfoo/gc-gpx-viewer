type PanelOptions = {
  layout: HTMLElement | null;
  body: HTMLElement | null;
  toggle: HTMLButtonElement | null;
  floatingToggle: HTMLButtonElement | null;
  onChange?: () => void;
};

export const initPanelToggle = ({
  layout,
  body,
  toggle,
  floatingToggle,
  onChange
}: PanelOptions) => {
  const setPanelState = (collapsed: boolean): void => {
    if (!layout || !toggle) return;
    layout.dataset.panel = collapsed ? "collapsed" : "expanded";
    document.body.dataset.panel = collapsed ? "collapsed" : "expanded";

    const icon = collapsed ? "unfold" : "fold";
    const label = collapsed ? "Afficher le panneau d'import" : "Masquer le panneau d'import";

    toggle.innerHTML = `<i class="ri-sidebar-${icon}-line" aria-hidden="true"></i>`;
    toggle.setAttribute("aria-expanded", String(!collapsed));
    toggle.setAttribute("aria-label", label);

    if (floatingToggle) {
      floatingToggle.innerHTML = `<i class="ri-sidebar-${icon}-line" aria-hidden="true"></i>`;
      floatingToggle.setAttribute("aria-expanded", String(!collapsed));
      floatingToggle.setAttribute("aria-label", label);
    }

    onChange?.();
  };

  const handleToggle = (): void => {
    const collapsed = layout?.dataset.panel === "collapsed";
    setPanelState(!collapsed);
  };

  toggle?.addEventListener("click", handleToggle);
  floatingToggle?.addEventListener("click", handleToggle);

  setPanelState(false);

  return { setPanelState };
};
