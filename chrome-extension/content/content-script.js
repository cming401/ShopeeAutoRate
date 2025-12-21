// Content script for Shopee Auto Rate Extension
// Runs on Shopee Seller Order pages and communicates with popup

// Prevent duplicate loading
if (typeof window.ShopeeContentScriptLoaded === 'undefined') {
    window.ShopeeContentScriptLoaded = true;

console.log('Shopee Auto Rate content script loaded');

var autoRater = null;
var isRunning = false;

// Send message to popup
function sendToPopup(type, data) {
  chrome.runtime.sendMessage({ type, ...data }, (response) => {
    if (chrome.runtime.lastError) {
      console.log('Popup not available:', chrome.runtime.lastError.message);
    }
  });
}

// Send log message to background
function logToBackground(message) {
  chrome.runtime.sendMessage({
    type: 'log',
    message: message
  });
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Content script received message:', message);
  logToBackground('Received message: ' + JSON.stringify(message));

  if (message.action === 'start') {
    console.log('Start action triggered!');
    logToBackground('Start action triggered!');
    
    if (isRunning) {
      console.log('Already running, rejecting');
      sendResponse({ success: false, error: 'Already running' });
      return true;
    }

    // Check if we're on the correct page
    if (!window.location.href.includes('seller.shopee.com.my/portal/sale/order')) {
      console.log('Not on correct page');
      sendResponse({ success: false, error: 'Not on Shopee Seller Order page' });
      return true;
    }

    console.log('Starting automation with settings:', message.settings);
    // Start automation
    startAutomation(message.settings);
    sendResponse({ success: true });
    return true;

  } else if (message.action === 'stop') {
    stopAutomation();
    sendResponse({ success: true });
    return true;
  }

  sendResponse({ success: false, error: 'Unknown action' });
  return true;
});

// Start the automation process
async function startAutomation(settings) {
  console.log('=== startAutomation called ===');
  console.log('Settings:', settings);
  
  isRunning = true;
  logToBackground('Starting automation with settings: ' + JSON.stringify(settings));

  try {
    // Check if ShopeeAutoRater class is available
    console.log('Checking for ShopeeAutoRater class...');
    if (typeof ShopeeAutoRater === 'undefined') {
      throw new Error('ShopeeAutoRater class not loaded. Please refresh the page.');
    }
    console.log('ShopeeAutoRater class found!');

    // Create auto rater instance
    console.log('Creating ShopeeAutoRater instance with fastMode:', settings.fastMode);
    autoRater = new ShopeeAutoRater(settings.fastMode);
    autoRater.isRunning = true; // IMPORTANT: Set running flag!
    console.log('ShopeeAutoRater instance created, isRunning:', autoRater.isRunning);
    
    // Override comment if provided
    if (settings.comment) {
      autoRater.comment = settings.comment;
      console.log('Comment set to:', settings.comment);
    }

    // Set max pages
    const maxPages = settings.maxPages || 0;
    console.log('Max pages:', maxPages);

    // Start the automation
    console.log('Sending progress message...');
    sendToPopup('progress', {
      processed: 0,
      currentPage: 1,
      message: 'Starting automation...'
    });

    console.log('Starting runWithProgress...');
    // Run the automation with progress reporting
    await runWithProgress(autoRater, maxPages);

    console.log('Automation completed successfully');
    sendToPopup('complete', {
      message: `✅ Automation completed! Processed ${autoRater.totalProcessed} orders across ${autoRater.currentPage} pages.`
    });

    logToBackground(`Automation completed: ${autoRater.totalProcessed} orders processed`);

  } catch (error) {
    console.error('Automation error:', error);
    sendToPopup('error', {
      message: `❌ Error: ${error.message}`
    });
    logToBackground('Automation error: ' + error.message);
  } finally {
    isRunning = false;
    autoRater = null;
  }
}

// Stop the automation
function stopAutomation() {
  console.log('=== stopAutomation called ===');
  if (autoRater) {
    autoRater.isRunning = false; // This is what shopee-rater.js checks
    console.log('Set autoRater.isRunning to false');
    logToBackground('Stop requested - autoRater.isRunning set to false');
  }
  isRunning = false;
}

// Run automation with progress reporting
async function runWithProgress(rater, maxPages) {
  // Process current page
  while (!rater.shouldStop) {
    // Update progress
    sendToPopup('progress', {
      processed: rater.totalProcessed,
      currentPage: rater.currentPage,
      message: `Processing page ${rater.currentPage}...`
    });

    // Process current page
    const pageResult = await rater.processCurrentPage();
    
    sendToPopup('success', {
      message: `✅ Page ${rater.currentPage}: Rated ${pageResult.processed} orders`
    });

    // Check if we should continue
    if (maxPages > 0 && rater.currentPage >= maxPages) {
      logToBackground(`Reached max pages limit: ${maxPages}`);
      break;
    }

    // Go to next page
    sendToPopup('progress', {
      processed: rater.totalProcessed,
      currentPage: rater.currentPage,
      message: 'Moving to next page...'
    });

    const nextSuccess = await rater.goToNextPage();
    if (!nextSuccess) {
      logToBackground('No more pages available');
      break;
    }
    
    // Wait for page to load
    await rater.sleep(3000);
  }

  // Final summary
  logToBackground(`Automation finished! Total rated: ${rater.ratedCount}, Pages: ${rater.currentPage}`);
}

// Initialize
logToBackground('Content script initialized on: ' + window.location.href);

// Check if ShopeeAutoRater is available
if (typeof ShopeeAutoRater !== 'undefined') {
  logToBackground('ShopeeAutoRater class detected');
} else {
  console.warn('ShopeeAutoRater class not found. Make sure shopee-rater.js is loaded first.');
}

} // End of duplicate prevention check
