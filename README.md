# Shopee Auto Rate - Chrome Extension

<div align="center">

🚀 **Automatically rate all your Shopee buyers with 5 stars in one click!**

[![Download Extension](https://img.shields.io/badge/Download-Extension%20v1.0.0-brightgreen?style=for-the-badge)](https://github.com/yourusername/ShopeeAutoRate/releases/download/v1.0.0/shopee-auto-rate-extension.zip)
[![English](https://img.shields.io/badge/lang-English-blue?style=flat-square)](README.md)
[![中文](https://img.shields.io/badge/lang-中文-red?style=flat-square)](README_CN.md)

</div>

A simple and powerful Chrome extension that helps Shopee sellers save time by automatically rating completed orders.

---

## ✨ Features

- 🎯 **One-Click Start** - Automatically opens Shopee page and starts rating
- ⭐ **5-Star Ratings** - Rates all buyers with 5 stars automatically
- 💬 **Custom Comments** - Add your personalized thank you message
- ⚡ **Fast Mode** - Process orders in ~3.2 seconds each
- 📊 **Progress Tracking** - Real-time stats and activity log
- 🔄 **Multi-Page Support** - Automatically processes all pages
- 💾 **Save Settings** - Your preferences are remembered
- ⏸ **Pause/Resume**

**Option A: Download Release** (Recommended)
1. Click the green **Download Extension** button above
2. Extract the ZIP file

**Option B: Clone Repository**
```bash
git clone https://github.com/yourusername/ShopeeAutoRate.git
```
Download or clone this repository:
```bash
git clone https://github.com/yourusername/ShopeeAutoRate.git
```

Or download as ZIP and extract it.

### Step 2: Install in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **"Developer mode"** (toggle in top right corner)
3. Click **"Load unpacked"**
4. Select the `chrome-extension` folder from the downloaded files
5. Done! The extension icon will appear in your Chrome toolbar

![Installation Demo](https://via.placeholder.com/800x400?text=Installation+Screenshot)

---

## 🎮 How to Use

### Quick Start (Recommended)

1. **Click the extension icon** in Chrome toolbar
2. **Click "🚀 Open Page & Auto Start"** button
3. That's it! The extension will:
   - Open Shopee Seller Order page automatically
   - Wait for the page to load
   - Start rating all orders with 5 stars

Sit back and relax while it works! ☕

### Manual Start (Alternative)

1. Navigate to [Shopee Seller Order Page](https://seller.shopee.com.my/portal/sale/order?type=completed)
2. Make sure you're logged in
3. Click the extension icon
4. (Optional) Adjust settings:
   - **Comment**: Your thank you message
   - **Fast Mode**: Toggle for speed (default: ON)
   - **Max Pages**: Set limit or leave as 0 for all pages
5. Click **"▶ Start Auto Rating"**

### Monitor Progress

Watch the extension popup for:
- **Status**: Current state (Running/Stopped/Completed)
- **Processed**: Number of orders rated
- **Current Page**: Page being processed
- **Activity Log**: Real-time actions

### Stop or Pause

Click **"⏸ Stop"** button anytime to pause. You can resume later.

---

## ⚙️ Settings

| Setting | Description | Default |
|---------|-------------|---------|
| **Comment** | Thank you message for buyers | "Thank you for your supporting." |
| **Fast Mode** | Speed up processing | ✅ Enabled (3.2s per order) |
| **Max Pages** | Limit pages to process (0 = all) | 0 (process all) |

---

## 📊 Performance

- **Fast Mode**: ~3.2 seconds per order
- **Normal Mode**: ~8.5 seconds per order
- **Example**: 100 orders ≈ 5-15 minutes

---

## 🔧 Troubleshooting

### Extension not working?
- Refresh the Shopee page after installing
- Make sure you're on the correct page: `/portal/sale/order?type=completed`
- Check that you're logged in to Shopee Seller account

### "Not on Shopee" message?
- Navigate to Shopee Seller Order page first
- URL must include: `seller.shopee.com.my`

### Extension icon not visible?
- Click the puzzle icon (🧩) in Chrome toolbar
- Pin "Shopee Auto Rate" for easy access

### Need more help?
- Open browser console (Press F12) to see detailed logs
- Check for any error messages

---

## ⚠️ Important Notes

- This extension only works on **Shopee Malaysia** (`seller.shopee.com.my`)
- Make sure you're logged in to your Shopee Seller account
- The extension only rates orders on the "Completed" tab
- Keep the browser tab open while processing

---

## 🤝 Support

If you find this extension helpful, please give it a ⭐ star!

---

## 📄 License

MIT License - Feel free to use and modify for your needs.

---

**Made with ❤️ for Shopee Sellers**
5. Done! Extension icon will appear in toolbar

#### Usage:
1. Navigate to Shopee Seller Order page
2. Click the extension icon
3. Configure settings (optional)
4. Click "▶ Start Auto Rating"
5. Monitor progress in real-time

**📖 Full Guide:** See [chrome-extension/INSTALL.md](chrome-extension/INSTALL.md)

---

### Method 2: Browser Console Script

This method works directly in your browser without installing anything.

### Steps:

1. **Log in to Shopee Seller Portal**
   - Go to: https://seller.shopee.com.my/portal/sale/order?type=completed
   - Make sure you're logged in with your account

2. **Open Browser DevTools**
   - Press `F12` or `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)
   - Click on the "Console" tab

3. **Load the Script**
   - Open the file `shopee_auto_rate_simple.js`
   - Copy all the code
   - Paste it into the browser console
   - Press `Enter`

4. **Start the Automation**
   ```javascript
   shopeeAutoRater.start()
   ```

5. **Stop if Needed**
5. **Stop if Needed**
   ```javascript
   shopeeAutoRater.stop()
   ```

---

### Method 3: VPS Automation (For Scheduled Tasks)

Deploy on a VPS with automated scheduling.

**📖 Complete Guide:** See [VPS_DEPLOYMENT.md](VPS_DEPLOYMENT.md)

**Quick Deploy:**
```bash
chmod +x deploy.sh
./deploy.sh
./setup_cron.sh
```

---

## 📊 How It Works

### What the Script Does:

1. Finds all "Rate" buttons on the current page
2. For each order:
   - Clicks the Rate button
   - Selects 5 stars
   - Enters the comment: "Thank you for your supporting."
   - Submits the rating
3. Moves to the next page automatically
4. Continues until all 183 pages are processed or no more orders to rate

### Important Notes:

- ⚠️ Keep the browser window active while the script is running
- ⚠️ Don't close the DevTools console
- ⚠️ The script will show progress in the console
- ⚠️ You can stop at any time by running `shopeeAutoRater.stop()`

## 🐍 Alternative Method: Python Script

If you prefer using Python with Selenium:

### Prerequisites:

```bash
# Install required packages
pip install selenium

# Install Chrome/ChromeDriver
# Make sure Chrome and ChromeDriver versions match
```

### Steps:

1. **Start Chrome with Remote Debugging**

   On Mac:
   ```bash
   /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222
   ```

   On Windows:
   ```bash
   "C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222
   ```

2. **Log in to Shopee**
   - In the Chrome window that opened, go to Shopee Seller Portal
   - Log in with your credentials
   - Navigate to Completed Orders page

3. **Run the Python Script**
   ```bash
   python auto_rate.py
   ```

4. **Monitor Progress**
   - The script will show progress in the terminal
   - Press `Ctrl+C` to stop if needed

## 🎯 How It Works

The automation follows this workflow:

```
1. Navigate to Completed Orders page
2. Find all "Rate" buttons on current page
3. For each order:
   ├─ Click Rate button
   ├─ Wait for modal to open
   ├─ Select 5-star rating
   ├─ Fill in comment
   ├─ Click Submit
   └─ Wait for submission
4. Click "Next Page" button
5. Repeat steps 2-4 until no more pages
6. Show completion summary
```

## ⚙️ Customization

### Change the Comment Text:

**In shopee_auto_rate_simple.js:**
```javascript
// Find this line and change the text
this.comment = "Thank you for your supporting.";  // <- Change this
```

**In auto_rate.py:**
```python
# Find this line in the __init__ method
self.comment = "Thank you for your supporting."  # <- Change this
```

### Adjust Timing/Speed:

If the script is going too fast and missing some orders, you can increase the delay times:

**In shopee_auto_rate_simple.js:**
```javascript
async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Increase these values:
await this.sleep(2000);  // Change 2000 to 3000 or 4000 for slower execution
```

## 📊 Progress Tracking

The scripts will show progress like this:

```
==========================================================
Processing Page 1
==========================================================
Found 40 orders to rate on page 1

Processing order 1/40...
  ✓ Selected 5 stars
  ✓ Added comment: "Thank you for your supporting."
  ✓ Submitted rating
  ✓ Successfully rated order #1

Processing order 2/40...
...

→ Moving to next page...

==========================================================
Processing Page 2
==========================================================
...

==========================================================
Automation Complete!
Total orders rated: 7282
==========================================================
```

## ⚠️ Troubleshooting

### Script Not Working?

1. **Make sure you're on the correct page**
   - URL should be: `https://seller.shopee.com.my/portal/sale/order?type=completed`

2. **Check if you're logged in**
   - The page should show your orders
   - You should see "Rate" buttons

3. **Try refreshing the page**
   - Sometimes Shopee's dynamic content needs a refresh
   - Reload and try again

4. **Rate buttons not being clicked?**
   - The page structure might have changed
   - Try manually clicking one Rate button to see what modal appears
   - Contact support for script updates

### Script Stops Unexpectedly?

1. **Check your internet connection**
2. **Make sure the browser window stays active**
3. **Shopee might have rate limits** - wait a few minutes and try again

### Modal Not Appearing?

- Some orders might not be rateable yet
- Check if there are any Shopee notifications or popups blocking the modal
- Try closing any open popups manually first

## 🔒 Security & Privacy

- ✅ All scripts run locally in your browser or VPS
- ✅ No data is sent to external servers
- ✅ Your login credentials are never accessed by third parties
- ✅ Open source - you can review all the code
- ✅ Chrome Extension follows Manifest V3 security standards

## 📊 Performance Benchmarks

| Method | Speed per Order | Total Time (7,284 orders) |
|--------|----------------|---------------------------|
| Chrome Extension (Fast) | 3.2s | ~6.5 hours |
| Browser Console (Fast) | 3.2s | ~6.5 hours |
| VPS Automation (Fast) | 3.2s | ~6.5 hours |
| Normal Mode | 8.5s | ~17 hours |

## 📂 Project Structure

```
ShopeeAutoRate/
├── chrome-extension/          # Chrome Extension MV3
│   ├── manifest.json         # Extension configuration
│   ├── popup/                # Extension UI
│   ├── background/           # Service worker
│   ├── content/              # Content scripts
│   ├── lib/                  # Core automation logic
│   ├── assets/icons/         # Extension icons
│   └── INSTALL.md           # Installation guide
├── shopee_auto_rate_simple.js # Browser console script
├── vps_automation.py          # VPS automation
├── deploy.sh                  # VPS deployment
├── setup_cron.sh             # Cron job setup
├── Dockerfile                # Docker container
├── VPS_DEPLOYMENT.md         # VPS guide
└── README.md                 # This file
```

## 📝 Account Information

- **Email:** titanhubmy@gmail.com
- **Total Orders:** 7,284 orders
- **Total Pages:** 183 pages

## 🤝 Support

If you encounter any issues:

1. **Chrome Extension Issues:**
   - See [chrome-extension/INSTALL.md](chrome-extension/INSTALL.md)
   - Check browser console (F12) for errors
   - Reload the extension and Shopee page

2. **Browser Console Issues:**
   - Check the Troubleshooting section
   - Make sure browser window stays active
   - Try refreshing the page

3. **VPS Deployment Issues:**
   - See [VPS_DEPLOYMENT.md](VPS_DEPLOYMENT.md)
   - Check logs in `logs/` directory
   - Verify Python and Playwright installation

## 🌟 Why This Project?

This automation tool was created to help Shopee sellers efficiently manage large volumes of completed orders. Instead of manually rating thousands of buyers one by one, this tool automates the process while maintaining consistent 5-star ratings and thank you messages.

**Benefits:**
- ⏱️ Save hours of manual work
- ✅ Consistent rating quality
- 📊 Progress tracking
- 🔄 Multi-platform deployment options
- 🎯 User-friendly interfaces

## 📜 License

This project is for personal use. Please use responsibly and in accordance with Shopee's Terms of Service.

---

**Version:** 1.0.0  
**Last Updated:** 2024  
**Repository:** https://github.com/cming401/ShopeeAutoRate (Private)

## ⚖️ Legal & Terms

- This tool is for personal use only
- Make sure automated actions comply with Shopee's Terms of Service
- Use at your own risk
- The author is not responsible for any account issues that may arise

## 📌 Tips

1. **Run during off-peak hours** to reduce load on Shopee's servers
2. **Monitor the first few ratings** to ensure everything works correctly
3. **Take breaks** if processing many orders - don't run 24/7
4. **Keep backups** of your order data

---

**Made with ❤️ for Shopee Sellers**

Last Updated: December 21, 2025
