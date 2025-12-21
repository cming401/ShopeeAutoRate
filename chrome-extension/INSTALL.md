# Chrome Extension Installation Guide

## How to Install

1. **Open Chrome Extensions Page**
   - Open Chrome browser
   - Navigate to `chrome://extensions/`
   - Or click Menu (⋮) → Extensions → Manage Extensions

2. **Enable Developer Mode**
   - Toggle "Developer mode" switch in the top right corner

3. **Load the Extension**
   - Click "Load unpacked" button
   - Navigate to: `/Users/edwardwong/Desktop/Titan Hub/WorkSpace/ShopeeAutoRate/chrome-extension`
   - Click "Select" to load the extension

4. **Verify Installation**
   - You should see "Shopee Auto Rate" extension card
   - Extension icon will appear in Chrome toolbar

## How to Use

1. **Navigate to Shopee Seller Portal**
   - Go to: https://seller.shopee.com.my/portal/sale/order?type=completed
   - Make sure you're logged in

2. **Open Extension Popup**
   - Click the extension icon in Chrome toolbar
   - Or pin it for easy access

3. **Configure Settings** (Optional)
   - **Comment**: Default is "Thank you for your supporting."
   - **Fast Mode**: Enabled by default (3.2s per order)
   - **Max Pages**: Set to 0 to process all pages, or specify a limit

4. **Start Automation**
   - Click "▶ Start Auto Rating" button
   - Extension will automatically:
     - Select 5 stars for each order
     - Fill in your comment
     - Submit the rating
     - Move to next page when done

5. **Monitor Progress**
   - **Status**: Shows current state (Running/Stopped/Completed)
   - **Processed**: Total number of orders rated
   - **Current Page**: Which page is being processed
   - **Activity Log**: Real-time log of actions

6. **Stop Anytime**
   - Click "⏸ Stop" button to pause automation
   - You can resume later by clicking Start again

## Features

✅ **Automatic 5-Star Rating** - Rates all orders with 5 stars  
✅ **Custom Comments** - Customize your thank you message  
✅ **Fast Mode** - Process orders in 3.2 seconds each (or 8.5s in normal mode)  
✅ **Multi-Page Support** - Automatically navigates through all pages  
✅ **Progress Tracking** - Real-time stats and activity log  
✅ **Safe Stop** - Pause anytime and resume later  
✅ **Persistent Settings** - Your preferences are saved

## Performance

- **Fast Mode**: ~3.2 seconds per order
- **Normal Mode**: ~8.5 seconds per order
- **Example**: 7,284 orders = ~6.5 hours (fast) or ~17 hours (normal)

## Troubleshooting

### Extension Not Working
- Refresh the Shopee page after installing the extension
- Make sure you're on the correct page: `/portal/sale/order?type=completed`
- Check browser console (F12) for error messages

### "Not on Shopee" Message
- Navigate to Shopee Seller Order page first
- URL must include: `seller.shopee.com.my`

### Extension Icon Not Visible
- Go to `chrome://extensions/`
- Find "Shopee Auto Rate"
- Click the pin icon to show in toolbar

### Automation Stops Unexpectedly
- Check if you've reached max pages limit
- Verify internet connection is stable
- Check Activity Log for error messages

## Uninstall

1. Go to `chrome://extensions/`
2. Find "Shopee Auto Rate"
3. Click "Remove"
4. Confirm deletion

## Notes

⚠️ **Important**:
- Always test with a small number of orders first (set Max Pages to 1)
- Keep the Shopee tab active during automation
- Don't close the browser while automation is running
- Your settings are saved automatically

## Version

Current Version: **1.0.0**

## Support

For issues or questions, check the main repository:
https://github.com/cming401/ShopeeAutoRate
