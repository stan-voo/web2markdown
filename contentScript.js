function copySelectedTextAsMarkdown() {
  const selectedText = window.getSelection().toString().replace(/[\r\n]+/g, " ");
  const pageUrl = window.location.href;

  chrome.storage.sync.get("format", (data) => {
    const format = data.format || "> [selected text]) | [src]([current page URL])";
    const markdown = format.replace("[selected text]", selectedText).replace("[current page URL]", pageUrl);

    navigator.clipboard.writeText(markdown).then(
      () => {
        console.log("Markdown copied to clipboard:", markdown);
      },
      (err) => {
        console.error("Failed to copy text:", err);
      }
    );
  });
}
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'copyMarkdown') {
      copySelectedTextAsMarkdown();
      sendResponse({ status: 'success' }); // Add this line
    }
  });
  
