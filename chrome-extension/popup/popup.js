// Popup UI controller
let isRunning = false;

// DOM elements
const quickStartBtn = document.getElementById('quick-start-btn');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const statusEl = document.getElementById('status');
const processedEl = document.getElementById('processed');
const currentPageEl = document.getElementById('current-page');
const logsEl = document.getElementById('logs');
const commentInput = document.getElementById('comment');
const fastModeCheck = document.getElementById('fast-mode');
const maxPagesInput = document.getElementById('max-pages');

// Load saved settings
chrome.storage.sync.get({
  comment: 'Thank you for your supporting.',
  fastMode: true,
  maxPages: 0
}, (items) => {
  commentInput.value = items.comment;
  fastModeCheck.checked = items.fastMode;
  maxPagesInput.value = items.maxPages;
});

// Save settings on change
commentInput.addEventListener('change', () => {
  chrome.storage.sync.set({ comment: commentInput.value });
});

fastModeCheck.addEventListener('change', () => {
  chrome.storage.sync.set({ fastMode: fastModeCheck.checked });
});

maxPagesInput.addEventListener('change', () => {
  chrome.storage.sync.set({ maxPages: parseInt(maxPagesInput.value) });
});

// Quick start: Open Shopee page and auto start
quickStartBtn.addEventListener('click', async () => {
  try {
    const shopeeUrl = 'https://seller.shopee.com.my/portal/sale/order?type=completed';
    
    addLog('🚀 Opening Shopee Seller page...', 'info');
    statusEl.textContent = 'Opening page...';
    
    // Check if there's already a tab with Shopee seller page
    const tabs = await chrome.tabs.query({ url: 'https://seller.shopee.com.my/*' });
    
    let targetTab;
    if (tabs.length > 0) {
      // Switch to existing tab and update URL
      targetTab = tabs[0];
      await chrome.tabs.update(targetTab.id, { 
        url: shopeeUrl,
        active: true 
      });
      addLog('✅ Switched to existing Shopee tab', 'success');
    } else {
      // Create new tab
      targetTab = await chrome.tabs.create({ 
        url: shopeeUrl,
        active: true 
      });
      addLog('✅ Opened new Shopee tab', 'success');
    }
    
    // Wait for page to load
    addLog('⏳ Waiting for page to load...', 'info');
    
    // Listen for tab update (page loaded)
    chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo, tab) {
      if (tabId === targetTab.id && changeInfo.status === 'complete') {
        chrome.tabs.onUpdated.removeListener(listener);
        
        // Wait a bit more for content script to be ready
        setTimeout(async () => {
          addLog('✅ Page loaded! Starting automation...', 'success');
          
          const settings = {
            comment: commentInput.value,
            fastMode: fastModeCheck.checked,
            maxPages: parseInt(maxPagesInput.value)
          };
          
          // Send start message
          chrome.tabs.sendMessage(targetTab.id, {
            action: 'start',
            settings: settings
          }, (response) => {
            if (chrome.runtime.lastError) {
              addLog('❌ Error: ' + chrome.runtime.lastError.message, 'error');
              statusEl.textContent = 'Error';
              return;
            }
            
            if (response && response.success) {
              isRunning = true;
              startBtn.disabled = true;
              stopBtn.disabled = false;
              quickStartBtn.disabled = true;
              statusEl.textContent = 'Running...';
              addLog('🎉 Automation started successfully!', 'success');
            } else {
              addLog('⚠️ Failed to start automation', 'error');
              statusEl.textContent = 'Failed';
            }
          });
        }, 2000); // Wait 2 seconds for content script injection
      }
    });
    
  } catch (error) {
    addLog('❌ Error: ' + error.message, 'error');
    statusEl.textContent = 'Error';
  }
});

// Add log entry
function addLog(message, type = 'info') {
  const logEntry = document.createElement('div');
  logEntry.className = `log-entry ${type}`;
  const timestamp = new Date().toLocaleTimeString();
  logEntry.textContent = `[${timestamp}] ${message}`;
  logsEl.insertBefore(logEntry, logsEl.firstChild);
  
  // Keep only last 50 logs
  while (logsEl.children.length > 50) {
    logsEl.removeChild(logsEl.lastChild);
  }
}

// Start automation
startBtn.addEventListener('click', async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab.url.includes('seller.shopee.com.my')) {
      addLog('❌ Please open Shopee Seller Order page first', 'error');
      return;
    }

    const settings = {
      comment: commentInput.value,
      fastMode: fastModeCheck.checked,
      maxPages: parseInt(maxPagesInput.value)
    };

    // Send start message to content script
    chrome.tabs.sendMessage(tab.id, {
      action: 'start',
      settings: settings
    }, (response) => {
      if (chrome.runtime.lastError) {
        addLog('❌ Error: ' + chrome.runtime.lastError.message, 'error');
        return;
      }
      
      if (response && response.success) {
        isRunning = true;
        startBtn.disabled = true;
        stopBtn.disabled = false;
        statusEl.textContent = 'Running...';
        addLog('✅ Automation started', 'success');
      }
    });

  } catch (error) {
    addLog('❌ Error: ' + error.message, 'error');
  }
});

// Stop automation
stopBtn.addEventListener('click', async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    chrome.tabs.sendMessage(tab.id, {
      action: 'stop'
    }, (response) => {
      if (response && response.success) {
        isRunning = false;
        startBtn.disabled = false;
        stopBtn.disabled = true;
        quickStartBtn.disabled = false;
        statusEl.textContent = 'Stopped';
        addLog('⏸ Automation stopped', 'info');
      }
    });

  } catch (error) {
    addLog('❌ Error: ' + error.message, 'error');
  }
});

// Listen for updates from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'progress') {
    processedEl.textContent = message.processed;
    currentPageEl.textContent = message.currentPage;
    addLog(message.message, 'info');
  } else if (message.type === 'success') {
    addLog(message.message, 'success');
  } else if (message.type === 'error') {
    addLog(message.message, 'error');
    isRunning = false;
    startBtn.disabled = false;
    stopBtn.disabled = true;
    quickStartBtn.disabled = false;
    statusEl.textContent = 'Error';
  } else if (message.type === 'complete') {
    addLog(message.message, 'success');
    isRunning = false;
    startBtn.disabled = false;
    stopBtn.disabled = true;
    quickStartBtn.disabled = false;
    statusEl.textContent = 'Completed';
  }
});

// Check if content script is ready
chrome.tabs.query({ active: true, currentWindow: true }, async ([tab]) => {
  if (tab && tab.url && tab.url.includes('seller.shopee.com.my')) {
    statusEl.textContent = 'Ready';
    addLog('✅ Connected to Shopee Seller page', 'success');
  } else {
    statusEl.textContent = 'Not on Shopee';
    addLog('⚠️ Please navigate to Shopee Seller Order page', 'info');
  }
});
