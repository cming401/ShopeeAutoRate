// Service Worker for Chrome Extension MV3
// Handles background tasks and extension lifecycle

console.log('Shopee Auto Rate service worker loaded');

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Extension installed');
    
    // Set default settings
    chrome.storage.sync.set({
      comment: 'Thank you for your supporting.',
      fastMode: true,
      maxPages: 0
    });
  } else if (details.reason === 'update') {
    console.log('Extension updated to version', chrome.runtime.getManifest().version);
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

// Handle tab updates to check if user is on Shopee seller page
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('seller.shopee.com.my')) {
    console.log('Shopee Seller page detected:', tab.url);
    
    // Inject content script if not already injected
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['lib/shopee-rater.js', 'content/content-script.js']
    }).catch(err => {
      console.log('Content script already injected or injection failed:', err.message);
    });
  }
});

// Keep service worker alive with periodic ping
chrome.alarms.create('keepAlive', { periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'keepAlive') {
    console.log('Service worker keepAlive ping');
  }
});
