# Shopee Auto Rate Extension

This is the Chrome extension for automatically rating Shopee buyers.

## Installation

See the main [Installation Guide](../README.md#-installation) in the root folder.

## Quick Start

1. Install the extension (see above)
2. Click the extension icon
3. Click "🚀 Open Page & Auto Start"
4. Done!

## Files Structure

- `manifest.json` - Extension configuration
- `popup/` - Extension popup interface
- `content/` - Content scripts that run on Shopee pages
- `background/` - Background service worker
- `lib/` - Core rating logic
- `assets/` - Icons and images

## For Developers

### Key Files

- `lib/shopee-rater.js` - Main rating automation logic
- `content/content-script.js` - Handles page interaction
- `background/service-worker.js` - Manages extension state
- `popup/popup.js` - Popup UI and controls

### Permissions

- `activeTab` - Access current tab
- `storage` - Save user settings
- `scripting` - Execute scripts on Shopee pages
- `tabs` - Manage tabs
- `alarms` - Background tasks

### Host Permissions

- `https://seller.shopee.com.my/*` - Access to Shopee Seller Portal
