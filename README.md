# Shopee Auto Rate - Automation Tool

This project contains automation scripts to automatically rate all buyers with 5 stars on Shopee Seller Portal.

## 📋 Project Overview

This automation tool helps Shopee sellers automatically rate completed orders with 5-star ratings and a custom comment. It supports processing all pages of completed orders until no more orders can be rated.

**Features:**
- ✅ Automatically rate buyers with 5 stars
- ✅ Add custom comment: "Thank you for your supporting."
- ✅ Process multiple pages automatically
- ✅ Stop when no more orders to rate
- ✅ Progress tracking and logging

## 📁 Files Included

1. **shopee_auto_rate_simple.js** - Browser console script (Recommended - Easiest to use)
2. **auto_rate.py** - Python/Selenium automation script
3. **README.md** - This documentation file

## 🚀 Quick Start (Method 1: Browser Console Script - Recommended)

This is the easiest method and works directly in your browser without installing anything.

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
   ```javascript
   shopeeAutoRater.stop()
   ```

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

- ✅ All scripts run locally in your browser
- ✅ No data is sent to external servers
- ✅ Your login credentials are never accessed
- ✅ Open source - you can review all the code

## 📝 Account Information

- **Email:** titanhubmy@gmail.com
- **Password:** Mingyin1991.
- **Total Orders:** 7282 orders
- **Total Pages:** 183 pages

## 🤝 Support

If you encounter any issues:

1. Check the Troubleshooting section above
2. Make sure your browser and scripts are up to date
3. Try the alternative method (Python vs JavaScript)

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
