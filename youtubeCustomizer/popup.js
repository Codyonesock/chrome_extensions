const slider = document.getElementById("rowSlider");
const valueLabel = document.getElementById("rowValue");
const hideShortsCheckbox = document.getElementById("hideShorts");

// Get stored settings
chrome.storage.sync.get(["rowsPerRow", "hideShorts"], (data) => {
  const rowsPerRow = data.rowsPerRow || 4;
  slider.value = rowsPerRow;
  valueLabel.textContent = rowsPerRow;

  hideShortsCheckbox.checked = data.hideShorts || false;
  toggleShorts(hideShortsCheckbox.checked);
});

let debounceTimeout;

// Slider input for updating items per row
slider.addEventListener("input", () => {
  const value = slider.value;
  valueLabel.textContent = value;

  // Update YouTube grid layout in the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0].id;

    chrome.scripting.executeScript({
      target: { tabId },
      func: (val) => {
        // Set custom CSS property for grid items per row
        const contentsDiv = document.querySelector("#contents.style-scope.ytd-rich-grid-renderer");
        if (contentsDiv) {
          contentsDiv.style.setProperty("--ytd-rich-grid-items-per-row", val, "important");
        }
      },
      args: [value]
    });
  });

  // Debounce to make YT stop yelling at me for too many writes :(
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    chrome.storage.sync.set({ rowsPerRow: value });
  }, 500);
});

// Listener to toggle shorts
hideShortsCheckbox.addEventListener("change", () => {
  const shouldHide = hideShortsCheckbox.checked;
  chrome.storage.sync.set({ hideShorts: shouldHide });
  toggleShorts(shouldHide);
});

/**
 * Will toggle YT shorts
 */
function toggleShorts(shouldHide) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0].id;

    chrome.scripting.executeScript({
      target: { tabId },
      func: (hide) => {
        const shorts = document.querySelectorAll("#dismissible.style-scope.ytd-rich-shelf-renderer");
        shorts.forEach((short) => {
          short.style.display = hide ? "none" : "";
        });
      },
      args: [shouldHide]
    });
  });
}