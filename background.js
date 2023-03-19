function showAlert(tabId, message) {
    chrome.tabs.executeScript(tabId, {
      code: `alert("${message}");`,
    });
  }
  
  function injectContentScriptAndSendMessage(tabId) {
    chrome.scripting.executeScript(
      {
        target: { tabId },
        files: ["contentScript.js"],
      },
      () => {
        if (chrome.runtime.lastError) {
          console.error('Error:', chrome.runtime.lastError.message);
          showAlert(
            tabId,
            'An error occurred while injecting the content script. Please refresh the page and try again.'
          );
        } else {
          chrome.tabs.sendMessage(
            tabId,
            { action: 'copyMarkdown' },
            (response) => {
              if (chrome.runtime.lastError) {
                console.error('Error:', chrome.runtime.lastError.message);
                showAlert(
                  tabId,
                  'An error occurred. Please refresh the page and try again.'
                );
              } else {
                console.log('Message sent to content script');
              }
            }
          );
        }
      }
    );
  }
  
  chrome.action.onClicked.addListener(async (tab) => {
    try {
      injectContentScriptAndSendMessage(tab.id);
    } catch (error) {
      console.error(error);
    }
  });
  