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
  
  // Handle Quick Start from popup
  if (message.type === 'quickStart') {
    console.log('Quick Start requested with settings:', message.settings);
    handleQuickStart(message.settings);
    sendResponse({ received: true });
    return true;
  }
  
  // Keep service worker alive
  sendResponse({ received: true });
  return true;
});

// Quick Start handler - runs in background, survives popup close
async function handleQuickStart(settings) {
  const shopeeUrl = 'https://seller.shopee.com.my/portal/sale/order?type=completed';
  
  try {
    // Check for existing Shopee tab
    const tabs = await chrome.tabs.query({ url: 'https://seller.shopee.com.my/*' });
    
    let targetTab;
    if (tabs.length > 0) {
      targetTab = tabs[0];
      await chrome.tabs.update(targetTab.id, { active: true });
      await chrome.tabs.reload(targetTab.id);
      console.log('Reloading existing tab:', targetTab.id);
    } else {
      targetTab = await chrome.tabs.create({ url: shopeeUrl, active: true });
      console.log('Created new tab:', targetTab.id);
    }
    
    // Wait for page to fully load using onUpdated listener
    chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
      if (tabId === targetTab.id && changeInfo.status === 'complete') {
        console.log('Page loaded, waiting 2 more seconds for scripts...');
        
        // Remove listener to avoid duplicates
        chrome.tabs.onUpdated.removeListener(listener);
        
        // Wait a bit more for content scripts to initialize
        setTimeout(() => {
          console.log('Sending start message to tab:', tabId);
          chrome.tabs.sendMessage(tabId, {
            action: 'start',
            settings: settings
          }).then(() => {
            console.log('Start message sent successfully');
          }).catch((error) => {
            console.error('Error sending start message:', error);
          });
        }, 2000);
      }
    });
    
  } catch (error) {
    console.error('Quick Start error:', error);
  }
}

// Content scripts are automatically injected via manifest.json
// No need to manually inject here to avoid duplicate loading

console.log('Service worker initialized successfully');
