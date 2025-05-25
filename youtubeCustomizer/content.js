/**
 * Overwrite YT renderers inline styles on load
 */
function applyGridStyle() {
  chrome.storage.sync.get("rowsPerRow", (data) => {
    const value = data.rowsPerRow || 4;
    const sectionRenderers = document.querySelectorAll("ytd-rich-section-renderer");

    sectionRenderers.forEach((renderer) => {
      renderer.style.setProperty("--ytd-rich-grid-items-per-row", value, "important");
    });
  });
}

applyGridStyle();

// Set up an observer for changes
const observer = new MutationObserver(() => applyGridStyle());
observer.observe(document.body, { childList: true, subtree: true });