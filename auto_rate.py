"""
Shopee Auto Rate Automation Script
This script automatically rates all buyers with 5 stars on Shopee Seller Portal
"""

import time
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from selenium.webdriver.chrome.options import Options

class ShopeeAutoRater:
    def __init__(self):
        self.driver = None
        self.wait = None
        self.rated_count = 0
        self.comment = "Thank you for your supporting."
        
    def setup_driver(self):
        """Initialize Chrome driver with debugging port"""
        chrome_options = Options()
        # Connect to existing Chrome instance
        chrome_options.debugger_address = "127.0.0.1:9222"
        
        self.driver = webdriver.Chrome(options=chrome_options)
        self.wait = WebDriverWait(self.driver, 10)
        print("✓ Connected to Chrome browser")
        
    def find_rate_buttons(self):
        """Find all 'Rate' buttons on current page"""
        try:
            # Wait a moment for page to load
            time.sleep(2)
            rate_buttons = self.driver.find_elements(By.XPATH, "//button[text()='Rate']")
            print(f"Found {len(rate_buttons)} orders to rate on this page")
            return rate_buttons
        except Exception as e:
            print(f"Error finding rate buttons: {e}")
            return []
    
    def click_rate_button(self, button):
        """Click on a rate button"""
        try:
            # Scroll into view
            self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", button)
            time.sleep(0.5)
            button.click()
            time.sleep(2)  # Wait for modal to appear
            return True
        except Exception as e:
            print(f"Error clicking rate button: {e}")
            return False
    
    def rate_order(self):
        """Rate the order with 5 stars and comment"""
        try:
            # Wait for rating modal to appear
            time.sleep(2)
            
            # Try to find and click 5-star rating
            # Method 1: Look for star icons
            try:
                stars = self.driver.find_elements(By.XPATH, "//div[contains(@class, 'star')]")
                if len(stars) >= 5:
                    stars[4].click()  # Click the 5th star
                    print("  ✓ Clicked 5 stars")
                    time.sleep(0.5)
            except:
                # Method 2: Look for rating buttons
                try:
                    rating_5 = self.wait.until(
                        EC.element_to_be_clickable((By.XPATH, "//button[@value='5'] | //div[@data-rating='5'] | //*[contains(@class, 'star-5')]"))
                    )
                    rating_5.click()
                    print("  ✓ Selected 5-star rating")
                    time.sleep(0.5)
                except:
                    print("  ⚠ Could not find 5-star rating button")
            
            # Find and fill comment textarea
            try:
                comment_box = self.wait.until(
                    EC.presence_of_element_located((By.XPATH, "//textarea | //input[@type='text']"))
                )
                comment_box.clear()
                comment_box.send_keys(self.comment)
                print(f"  ✓ Added comment: '{self.comment}'")
                time.sleep(0.5)
            except:
                print("  ⚠ Could not find comment box")
            
            # Find and click submit button
            try:
                submit_buttons = [
                    "//button[contains(text(), 'Submit')]",
                    "//button[contains(text(), 'Confirm')]",
                    "//button[contains(text(), 'Send')]",
                    "//button[contains(@class, 'submit')]",
                    "//button[contains(@class, 'confirm')]"
                ]
                
                submitted = False
                for xpath in submit_buttons:
                    try:
                        submit_btn = self.driver.find_element(By.XPATH, xpath)
                        submit_btn.click()
                        print("  ✓ Submitted rating")
                        submitted = True
                        time.sleep(2)
                        break
                    except:
                        continue
                
                if not submitted:
                    print("  ⚠ Could not find submit button")
                    return False
                    
            except Exception as e:
                print(f"  ⚠ Error submitting: {e}")
                return False
            
            self.rated_count += 1
            return True
            
        except Exception as e:
            print(f"  ✗ Error rating order: {e}")
            return False
    
    def close_modal(self):
        """Close any open modal"""
        try:
            # Try to find close button
            close_buttons = self.driver.find_elements(By.XPATH, 
                "//button[contains(@class, 'close')] | //button[contains(@aria-label, 'close')] | //button[text()='×']")
            if close_buttons:
                close_buttons[0].click()
                time.sleep(1)
        except:
            # Press ESC key
            try:
                from selenium.webdriver.common.keys import Keys
                self.driver.find_element(By.TAG_NAME, 'body').send_keys(Keys.ESCAPE)
                time.sleep(1)
            except:
                pass
    
    def go_to_next_page(self):
        """Navigate to next page of orders"""
        try:
            # Find next page button
            next_button = self.driver.find_element(By.XPATH, 
                "//button[contains(@class, 'next')] | //a[contains(@class, 'next')] | //button[contains(@aria-label, 'Next')]")
            
            # Check if button is disabled
            if 'disabled' in next_button.get_attribute('class') or next_button.get_attribute('disabled'):
                print("\n✓ Reached the last page")
                return False
            
            next_button.click()
            print("\n→ Moving to next page...")
            time.sleep(3)  # Wait for page to load
            return True
            
        except Exception as e:
            print(f"\n✗ Could not find next page button: {e}")
            return False
    
    def process_current_page(self):
        """Process all rateable orders on current page"""
        rate_buttons = self.find_rate_buttons()
        
        if not rate_buttons:
            print("No orders to rate on this page")
            return False
        
        # Process each order
        for i, button in enumerate(rate_buttons, 1):
            try:
                print(f"\nProcessing order {i}/{len(rate_buttons)}...")
                
                # Click rate button
                if not self.click_rate_button(button):
                    print("  Skipping this order")
                    continue
                
                # Rate the order
                if self.rate_order():
                    print(f"  ✓ Successfully rated order #{self.rated_count}")
                else:
                    print("  ✗ Failed to rate order")
                    self.close_modal()
                
                # Small delay between orders
                time.sleep(1)
                
            except Exception as e:
                print(f"  ✗ Error processing order: {e}")
                self.close_modal()
                continue
        
        return True
    
    def run(self):
        """Main automation loop"""
        try:
            print("=" * 60)
            print("Shopee Auto Rate Automation")
            print("=" * 60)
            print("\nInitializing...")
            
            self.setup_driver()
            
            # Navigate to completed orders page
            url = "https://seller.shopee.com.my/portal/sale/order?type=completed"
            if self.driver.current_url != url:
                print(f"\nNavigating to: {url}")
                self.driver.get(url)
                time.sleep(3)
            else:
                print("\nAlready on correct page")
            
            print("\nStarting automation...")
            print("-" * 60)
            
            page_num = 1
            while True:
                print(f"\n{'=' * 60}")
                print(f"Processing Page {page_num}")
                print('=' * 60)
                
                # Process all orders on current page
                self.process_current_page()
                
                # Try to go to next page
                if not self.go_to_next_page():
                    break
                
                page_num += 1
            
            print("\n" + "=" * 60)
            print(f"Automation Complete!")
            print(f"Total orders rated: {self.rated_count}")
            print("=" * 60)
            
        except KeyboardInterrupt:
            print("\n\n⚠ Automation stopped by user")
            print(f"Total orders rated so far: {self.rated_count}")
        except Exception as e:
            print(f"\n✗ Error during automation: {e}")
            print(f"Total orders rated so far: {self.rated_count}")
        finally:
            if input("\nDo you want to close the browser? (y/n): ").lower() == 'y':
                if self.driver:
                    self.driver.quit()

if __name__ == "__main__":
    # Note: You need to start Chrome with remote debugging enabled:
    # /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222
    
    print("\n⚠ IMPORTANT: Make sure Chrome is running with remote debugging enabled")
    print("Run this command in terminal first:")
    print("/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --remote-debugging-port=9222\n")
    
    input("Press Enter to start automation...")
    
    auto_rater = ShopeeAutoRater()
    auto_rater.run()
