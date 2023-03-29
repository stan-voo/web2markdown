const defaultFormat = "> [selected text] | [src]([current page URL])";
const outputFormatElement = document.getElementById("output-format");
const saveButton = document.getElementById("save-format");
const messageElement = document.getElementById("message"); // Add this line

function showMessage(text, isError = false) {
  messageElement.textContent = text;
  messageElement.style.color = isError ? "red" : "green";
  setTimeout(() => {
    messageElement.textContent = "";
  }, 3000);
}

function saveOptions() {
  const format = outputFormatElement.value;
  chrome.storage.sync.set({ format }, () => {
    if (chrome.runtime.lastError) {
      console.error("Error:", chrome.runtime.lastError.message);
      showMessage("Failed to save output format. Please try again.", true);
    } else {
      console.log("Output format saved:", format);
      showMessage("Output format saved successfully.");
    }
  });
}

function restoreOptions() {
  chrome.storage.sync.get("format", (data) => {
    outputFormatElement.value = data.format || defaultFormat;
  });
}

document.addEventListener("DOMContentLoaded", restoreOptions);
saveButton.addEventListener("click", saveOptions);
