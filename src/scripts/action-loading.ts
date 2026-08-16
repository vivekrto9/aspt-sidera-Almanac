export type LoadingAction = HTMLButtonElement | HTMLAnchorElement;

const IDLE_LABEL_KEY = "loadingIdleAriaLabel";
const IDLE_DISABLED_KEY = "loadingIdleDisabled";
const IDLE_TAB_INDEX_KEY = "loadingIdleTabIndex";

export const isActionLoading = (action: LoadingAction | null | undefined) =>
  action?.dataset.loading === "true";

export const setActionLoading = (
  action: LoadingAction | null | undefined,
  loading: boolean,
  loadingLabel?: string,
) => {
  if (!action) return;

  if (loading) {
    if (isActionLoading(action)) return;
    action.dataset[IDLE_LABEL_KEY] = action.getAttribute("aria-label") ?? "";
    action.dataset.loading = "true";
    action.setAttribute("aria-busy", "true");
    if (loadingLabel) action.setAttribute("aria-label", loadingLabel);

    if (action instanceof HTMLButtonElement) {
      action.dataset[IDLE_DISABLED_KEY] = String(action.disabled);
      action.disabled = true;
    } else {
      action.dataset[IDLE_TAB_INDEX_KEY] =
        action.getAttribute("tabindex") ?? "";
      action.setAttribute("aria-disabled", "true");
      action.tabIndex = -1;
    }
    return;
  }

  action.dataset.loading = "false";
  action.setAttribute("aria-busy", "false");
  const idleLabel = action.dataset[IDLE_LABEL_KEY];
  if (idleLabel) action.setAttribute("aria-label", idleLabel);
  else action.removeAttribute("aria-label");
  delete action.dataset[IDLE_LABEL_KEY];

  if (action instanceof HTMLButtonElement) {
    action.disabled = action.dataset[IDLE_DISABLED_KEY] === "true";
    delete action.dataset[IDLE_DISABLED_KEY];
  } else {
    action.removeAttribute("aria-disabled");
    const idleTabIndex = action.dataset[IDLE_TAB_INDEX_KEY];
    if (idleTabIndex) action.setAttribute("tabindex", idleTabIndex);
    else action.removeAttribute("tabindex");
    delete action.dataset[IDLE_TAB_INDEX_KEY];
  }
};
