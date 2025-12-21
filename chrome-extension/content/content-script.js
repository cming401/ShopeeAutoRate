// Content script for Shopee Auto Rate Extension
// Runs on Shopee Seller Order pages and communicates with popup

console.log('Shopee Auto Rate content script loaded');

let autoRater = null;
let isRunning = false;

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

  if (message.action === 'start') {
    if (isRunning) {
      sendResponse({ success: false, error: 'Already running' });
      return true;
    }

    // Check if we're on the correct page
    if (!window.location.href.includes('seller.shopee.com.my/portal/sale/order')) {
      sendResponse({ success: false, error: 'Not on Shopee Seller Order page' });
      return true;
    }

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
  isRunning = true;
  logToBackground('Starting automation with settings: ' + JSON.stringify(settings));

  try {
    // Check if ShopeeAutoRater class is available
    if (typeof ShopeeAutoRater === 'undefined') {
      throw new Error('ShopeeAutoRater class not loaded. Please refresh the page.');
    }

    // Create auto rater instance
    autoRater = new ShopeeAutoRater(settings.fastMode);
    
    // Override comment if provided
    if (settings.comment) {
      autoRater.comment = settings.comment;
    }

    // Set max pages
    const maxPages = settings.maxPages || 0;

    // Start the automation
    sendToPopup('progress', {
      processed: 0,
      currentPage: 1,
      message: 'Starting automation...'
    });

    // Run the automation with progress reporting
    await runWithProgress(autoRater, maxPages);

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
  if (autoRater) {
    autoRater.shouldStop = true;
    logToBackground('Stop requested');
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

    // Check if there's a next page
    const hasNext = await rater.hasNextPage();
    if (!hasNext) {
      logToBackground('No more pages available');
      break;
    }

    // Go to next page
    sendToPopup('progress', {
      processed: rater.totalProcessed,
      currentPage: rater.currentPage,
      message: 'Moving to next page...'
    });

    await rater.goToNextPage();
    
    // Wait for page to load
    await rater.sleep(3000);
  }

  // Final summary
  const summary = rater.getSummary();
  logToBackground('Final summary: ' + JSON.stringify(summary));
}

// Initialize
logToBackground('Content script initialized on: ' + window.location.href);

// Check if ShopeeAutoRater is available
if (typeof ShopeeAutoRater !== 'undefined') {
  logToBackground('ShopeeAutoRater class detected');
} else {
  console.warn('ShopeeAutoRater class not found. Make sure shopee-rater.js is loaded first.');
}
