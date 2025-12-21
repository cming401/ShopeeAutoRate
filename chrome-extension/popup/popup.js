// Popup UI controller
let isRunning = false;

// DOM elements
const quickStartBtn = document.getElementById('quick-start-btn');
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
  console.log('Quick Start button clicked!');
  
  const settings = {
    comment: commentInput.value,
    fastMode: fastModeCheck.checked,
    maxPages: parseInt(maxPagesInput.value)
  };
  
  // Send to service worker - it will handle everything even after popup closes
  chrome.runtime.sendMessage({
    type: 'quickStart',
    settings: settings
  });
  
  addLog('🚀 Starting... Check the Shopee tab!', 'info');
  statusEl.textContent = 'Starting...';
  quickStartBtn.style.display = 'none';
  stopBtn.style.display = 'inline-block';
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

// Stop automation - send to ALL Shopee tabs
stopBtn.addEventListener('click', async () => {
  try {
    const tabs = await chrome.tabs.query({ url: 'https://seller.shopee.com.my/*' });
    
    for (const tab of tabs) {
      chrome.tabs.sendMessage(tab.id, { action: 'stop' });
    }
    
    isRunning = false;
    quickStartBtn.style.display = 'inline-block';
    stopBtn.style.display = 'none';
    statusEl.textContent = 'Stopped';
    addLog('⏹ Automation stopped', 'info');

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
    quickStartBtn.style.display = 'inline-block';
    stopBtn.style.display = 'none';
    statusEl.textContent = 'Error';
  } else if (message.type === 'complete') {
    addLog(message.message, 'success');
    isRunning = false;
    quickStartBtn.style.display = 'inline-block';
    stopBtn.style.display = 'none';
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
