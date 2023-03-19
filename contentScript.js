function copySelectedTextAsMarkdown() {
    const selectedText = window.getSelection().toString();
    const cleanedSelectedText = selectedText.replace(/[\r\n]+/g, ' ');
    const pageTitle = document.title;
    const pageUrl = window.location.href;
    const markdown = `> ${cleanedSelectedText} | [src](${pageUrl})`;
  
    // Copy the markdown to the clipboard
    navigator.clipboard.writeText(markdown).then(
      () => {
        console.log('Markdown copied to clipboard:', markdown);
      },
      (err) => {
        console.error('Failed to copy text:', err);
      }
    );
  }    
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'copyMarkdown') {
      copySelectedTextAsMarkdown();
      sendResponse({ status: 'success' }); // Add this line
    }
  });
  
