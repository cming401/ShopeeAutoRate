// Service Worker for Chrome Extension MV3
// Handles background tasks and extension lifecycle

console.log('Shopee Auto Rate service worker loaded');

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed/updated:', details.reason);
  
  if (details.reason === 'install') {
    // Set default settings
    chrome.storage.sync.set({
      comment: 'Thank you for your supporting.',
      fastMode: true,
      maxPages: 0
    });
  }
});

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Service worker received message:', message);
  
  if (message.type === 'log') {
    console.log(`[Content Script] ${message.message}`);
  }
  
  // Keep service worker alive
  sendResponse({ received: true });
  return true;
});

// Content scripts are automatically injected via manifest.json
// No need to manually inject here to avoid duplicate loading

console.log('Service worker initialized successfully');
