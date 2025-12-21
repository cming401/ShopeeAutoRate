// Popup UI controller
let isRunning = false;

// DOM elements
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
    statusEl.textContent = 'Error';
  } else if (message.type === 'complete') {
    addLog(message.message, 'success');
    isRunning = false;
    startBtn.disabled = false;
    stopBtn.disabled = true;
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
