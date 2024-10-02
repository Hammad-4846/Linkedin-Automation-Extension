export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });

  // Listener for when the active tab changes
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Check if the tab is completed loading and matches the URL pattern
    if (changeInfo.status === 'complete' && tab.url && tab.url.includes('https://www.linkedin.com/mynetwork/grow')) {
      // Inject the content script if it's not already injected
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['content.js'],
      }, () => {
        console.log('Content script injected.');
      });
    }
  });
});
