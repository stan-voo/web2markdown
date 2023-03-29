function copyTextToClipboard(text) {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  } else {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = 0;
    document.body.appendChild(textarea);
    textarea.select();
    const result = document.execCommand('copy');
    document.body.removeChild(textarea);
    return result ? Promise.resolve() : Promise.reject(new Error('Failed to copy text using document.execCommand'));
  }
}

function copySelectedTextAsMarkdown() {
  const selectedText = window.getSelection().toString().replace(/[\r\n]+/g, ' ');
  const pageUrl = window.location.href;
  const pageTitle = document.title;

  chrome.storage.sync.get('format', (data) => {
    const format = data.format || '> [selected text] | [src]([current page URL])';
    let markdown;

    if (selectedText.length > 0) {
      markdown = format
        .replace('[selected text]', selectedText)
        .replace('[current page URL]', pageUrl);
    } else {
      markdown = `[${pageTitle}](${pageUrl})`;
    }

    copyTextToClipboard(markdown).then(
      () => {
        console.log('Markdown copied to clipboard:', markdown);
      },
      (err) => {
        console.error('Failed to copy text:', err);
      }
    );
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'copyMarkdown') {
    copySelectedTextAsMarkdown();
    sendResponse({ status: 'success' });
  }
});
