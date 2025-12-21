/**
 * Shopee Auto Rate Script
 * 
 * This script automatically rates all buyers with 5 stars
 * Run this in the browser console on the Shopee Seller Portal
 */

// Prevent duplicate loading
if (typeof window.ShopeeAutoRaterLoaded === 'undefined') {
    window.ShopeeAutoRaterLoaded = true;

class ShopeeAutoRater {
    constructor(fastMode = true) {
        this.comment = "Thank you for your supporting.";
        this.ratedCount = 0;
        this.currentPage = 1;
        this.isRunning = false;
        this.fastMode = fastMode; // 快速模式：减少等待时间
        
        // 延迟配置（毫秒）
        this.delays = fastMode ? {
            scroll: 200,        // 滚动等待：500ms -> 200ms
            modalOpen: 800,     // 模态框打开：2000ms -> 800ms
            starSelect: 300,    // 选星等待：500ms -> 300ms
            comment: 200,       // 填写评论：500ms -> 200ms
            submit: 1000,       // 提交等待：2000ms -> 1000ms
            betweenOrders: 500, // 订单之间：1500ms -> 500ms
            pageNav: 1000,      // 翻页前：2000ms -> 1000ms
            pageLoad: 2000,     // 页面加载：3000ms -> 2000ms
            rateInit: 300       // 评分初始化：1000ms -> 300ms
        } : {
            scroll: 500,
            modalOpen: 2000,
            starSelect: 500,
            comment: 500,
            submit: 2000,
            betweenOrders: 1500,
            pageNav: 2000,
            pageLoad: 3000,
            rateInit: 1000
        };
    }

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    log(message, type = 'info') {
        const prefix = {
            'info': 'ℹ',
            'success': '✓',
            'error': '✗',
            'warning': '⚠'
        }[type] || 'ℹ';
        console.log(`${prefix} ${message}`);
    }

    async findRateButtons() {
        const buttons = document.querySelectorAll('button');
        const rateButtons = Array.from(buttons).filter(btn => 
            btn.textContent.trim() === 'Rate'
        );
        this.log(`Found ${rateButtons.length} orders to rate on page ${this.currentPage}`);
        return rateButtons;
    }

    async clickRateButton(button) {
        try {
            button.scrollIntoView({ behavior: this.fastMode ? 'auto' : 'smooth', block: 'center' });
            await this.sleep(this.delays.scroll);
            button.click();
            await this.sleep(this.delays.modalOpen);
            return true;
        } catch (error) {
            this.log(`Error clicking rate button: ${error.message}`, 'error');
            return false;
        }
    }

    async selectFiveStars() {
        try {
            this.log('Looking for star rating elements...', 'info');
            
            // VERIFIED WORKING METHOD (tested 2024-12-26)
            // Shopee uses Vue.js EDS (Element Design System) rating component
            // Must dispatch COMPLETE mouse event sequence to trigger Vue's event handlers
            
            const stars = document.querySelectorAll('.eds-rate-star');
            
            if (stars.length < 5) {
                this.log('✗ Could not find 5 stars (expected .eds-rate-star elements)', 'error');
                return false;
            }
            
            this.log(`Found ${stars.length} stars (.eds-rate-star)`, 'info');
            
            const fifthStar = stars[4]; // 5th star (index 4)
            const rect = fifthStar.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            
            // Dispatch complete mouse event sequence
            // This mimics real user mouse behavior and triggers Vue's event handlers
            const eventTypes = ['mouseover', 'mouseenter', 'mousemove', 'mousedown', 'mouseup', 'click'];
            
            for (const eventType of eventTypes) {
                const event = new MouseEvent(eventType, {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    clientX: x,
                    clientY: y
                });
                fifthStar.dispatchEvent(event);
            }
            
            // Wait for Vue to update component state
            await this.sleep(this.delays.starSelect);
            
            // Verify selection was successful
            const rateContainer = document.querySelector('.eds-rate');
            const dataValue = rateContainer ? rateContainer.getAttribute('data-current-value') : null;
            
            if (dataValue === '5') {
                this.log('✓ Selected 5 stars (verified: data-current-value = 5)', 'success');
                return true;
            } else {
                this.log(`✗ Rating selection failed (got data-current-value = ${dataValue})`, 'error');
                return false;
            }
            
        } catch (error) {
            this.log(`Error selecting stars: ${error.message}`, 'error');
            return false;
        }
    }

    async fillComment() {
        try {
            const textareas = document.querySelectorAll('textarea');
            const textInputs = document.querySelectorAll('input[type="text"]');
            
            const commentField = textareas.length > 0 ? textareas[textareas.length - 1] : 
                                 textInputs.length > 0 ? textInputs[textInputs.length - 1] : null;

            if (commentField) {
                commentField.value = this.comment;
                // Trigger input event
                commentField.dispatchEvent(new Event('input', { bubbles: true }));
                commentField.dispatchEvent(new Event('change', { bubbles: true }));
                this.log(`Added comment: "${this.comment}"`, 'success');
                await this.sleep(this.delays.comment);
                return true;
            }

            this.log('Could not find comment field', 'warning');
            return false;
        } catch (error) {
            this.log(`Error filling comment: ${error.message}`, 'error');
            return false;
        }
    }

    async submitRating() {
        try {
            this.log('Looking for submit button...', 'info');
            await this.sleep(this.delays.comment);
            
            const buttons = document.querySelectorAll('button');
            this.log(`Found ${buttons.length} buttons in total`, 'info');
            
            // Log all button texts for debugging
            const buttonTexts = Array.from(buttons).map(btn => btn.textContent.trim()).filter(text => text);
            this.log(`Button texts: ${buttonTexts.join(', ')}`, 'info');
            
            // Find the "Rate" button inside the modal (not "Rate Buyer" which is the modal title)
            // This button is enabled only after selecting a rating
            const submitButton = Array.from(buttons).find(btn => {
                const text = btn.textContent.trim();
                const isRateButton = text === 'Rate' || text.toLowerCase() === 'rate';
                const isNotRateBuyer = !text.includes('Buyer');
                const isNotDisabled = !btn.disabled;
                const isInModal = btn.closest('.eds-modal') !== null;
                
                return isRateButton && isNotRateBuyer && isNotDisabled && isInModal;
            });

            if (submitButton) {
                this.log(`Found submit button with text: "${submitButton.textContent.trim()}"`, 'success');
                submitButton.click();
                this.log('Clicked submit button', 'success');
                await this.sleep(this.delays.submit);
                return true;
            }
            
            // Fallback: Try other common submit button texts
            const fallbackButton = Array.from(buttons).find(btn => {
                const text = btn.textContent.trim().toLowerCase();
                return (text === 'submit' || 
                       text === 'confirm' || 
                       text === 'send' || 
                       text === 'submit rating' ||
                       text === '提交' ||
                       text === '确认') && !btn.disabled;
            });

            if (fallbackButton) {
                this.log(`Found fallback submit button with text: "${fallbackButton.textContent.trim()}"`, 'success');
                fallbackButton.click();
                await this.sleep(this.delays.submit);
                return true;
            }

            // Last resort: Try by class
            const primaryBtn = document.querySelector('.eds-modal button[class*="primary"], .eds-modal button[class*="submit"], .eds-modal button[type="submit"]');
            if (primaryBtn && !primaryBtn.disabled) {
                this.log('Found submit button by class', 'success');
                primaryBtn.click();
                await this.sleep(this.delays.submit);
                return true;
            }

            this.log('Could not find submit button', 'warning');
            return false;
        } catch (error) {
            this.log(`Error submitting: ${error.message}`, 'error');
            return false;
        }
    }

    async closeModal() {
        try {
            // Try to close modal by clicking close button or pressing ESC
            const closeButtons = document.querySelectorAll('button[class*="close"], button[aria-label*="close"]');
            if (closeButtons.length > 0) {
                closeButtons[0].click();
                await this.sleep(1000);
            }
        } catch (error) {
            // Ignore errors when closing modal
        }
    }

    async rateOrder() {
        try {
            await this.sleep(this.delays.rateInit);

            // Step 1: Select 5 stars
            await this.selectFiveStars();
            
            // Step 2: Fill comment
            await this.fillComment();
            
            // Step 3: Submit
            const submitted = await this.submitRating();
            
            if (submitted) {
                this.ratedCount++;
                this.log(`Successfully rated order #${this.ratedCount}`, 'success');
                return true;
            }
            
            return false;
        } catch (error) {
            this.log(`Error rating order: ${error.message}`, 'error');
            return false;
        }
    }

    async goToNextPage() {
        try {
            await this.sleep(this.delays.pageNav);
            
            // Find next button - Shopee uses EDS pager component
            // Try multiple strategies to find the next button
            let nextButton = null;
            
            // Strategy 1: Find by EDS pager class (most reliable)
            nextButton = document.querySelector('.eds-pager__button-next:not([disabled])');
            
            // Strategy 2: Find by button text or aria-label
            if (!nextButton) {
                const buttons = document.querySelectorAll('button');
                nextButton = Array.from(buttons).find(btn => {
                    const ariaLabel = btn.getAttribute('aria-label');
                    const text = btn.textContent.trim();
                    return (ariaLabel && ariaLabel.toLowerCase().includes('next')) ||
                           text === '>' || text === '›' || text === '»' ||
                           text.toLowerCase() === 'next';
                });
            }
            
            // Strategy 3: Find button with 'next' or 'arrow' in class name
            if (!nextButton) {
                const buttons = document.querySelectorAll('button[class*="next"], button[class*="arrow"]');
                nextButton = Array.from(buttons).find(btn => !btn.disabled);
            }

            if (nextButton && !nextButton.disabled) {
                this.log(`Moving to page ${this.currentPage + 1}...`, 'info');
                nextButton.scrollIntoView({ behavior: this.fastMode ? 'auto' : 'smooth', block: 'center' });
                await this.sleep(200);
                nextButton.click();
                await this.sleep(this.delays.pageLoad);
                this.currentPage++;
                this.log(`✓ Now on page ${this.currentPage}`, 'success');
                return true;
            }

            this.log('No more pages - reached the end', 'success');
            return false;
        } catch (error) {
            this.log(`Error navigating to next page: ${error.message}`, 'error');
            return false;
        }
    }

    async processCurrentPage() {
        const rateButtons = await this.findRateButtons();
        
        if (rateButtons.length === 0) {
            this.log('No orders to rate on this page', 'warning');
            return true; // Continue to next page even if no orders
        }

        for (let i = 0; i < rateButtons.length; i++) {
            if (!this.isRunning) {
                this.log('Automation stopped by user', 'warning');
                return false;
            }

            this.log(`\nProcessing order ${i + 1}/${rateButtons.length}...`);
            
            const button = rateButtons[i];
            
            // Click rate button
            if (!await this.clickRateButton(button)) {
                this.log('Skipping this order', 'warning');
                continue;
            }

            // Rate the order
            const success = await this.rateOrder();
            
            if (!success) {
                await this.closeModal();
            }

            // Small delay between orders
            await this.sleep(this.delays.betweenOrders);
        }

        return true;
    }

    async start() {
        console.clear();
        console.log('='.repeat(60));
        console.log('Shopee Auto Rate Automation');
        console.log(`Mode: ${this.fastMode ? '⚡ FAST MODE (快速模式)' : '🐢 NORMAL MODE (普通模式)'}`);
        console.log('='.repeat(60));
        console.log('');
        
        this.isRunning = true;
        const startTime = Date.now();
        this.log('Starting automation...');
        if (this.fastMode) {
            this.log('⚡ Fast mode enabled - reduced wait times', 'info');
        }
        this.log('Press Ctrl+C in console or close browser to stop');
        console.log('-'.repeat(60));
        
        try {
            while (this.isRunning) {
                console.log('');
                console.log('='.repeat(60));
                this.log(`Processing Page ${this.currentPage}`);
                console.log('='.repeat(60));
                
                const processed = await this.processCurrentPage();
                
                if (!processed) {
                    this.log('Error processing page, stopping...', 'error');
                    break;
                }
                
                // Try to go to next page
                this.log(`Finished page ${this.currentPage}, checking for next page...`, 'info');
                const hasNextPage = await this.goToNextPage();
                
                if (!hasNextPage) {
                    this.log('No more pages to process', 'success');
                    break;
                }
            }
            
            console.log('');
            console.log('='.repeat(60));
            this.log(`Automation Complete!`);
            this.log(`Total orders rated: ${this.ratedCount}`);
            const elapsed = Math.round((Date.now() - startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            this.log(`Time taken: ${minutes}m ${seconds}s`);
            if (this.ratedCount > 0) {
                const avgTime = (elapsed / this.ratedCount).toFixed(1);
                this.log(`Average: ${avgTime}s per order`);
            }
            console.log('='.repeat(60));
            
        } catch (error) {
            this.log(`Unexpected error: ${error.message}`, 'error');
            this.log(`Total orders rated so far: ${this.ratedCount}`);
        }
    }

    stop() {
        this.isRunning = false;
        this.log('Stopping automation...', 'warning');
    }

    // Debug function to test single order
    async testSingleOrder() {
        console.clear();
        this.log('Testing single order rating...', 'info');
        this.log('Please click a Rate button manually, then this will try to rate it.', 'info');
        
        await this.sleep(3000);
        
        this.log('Step 1: Selecting 5 stars...', 'info');
        await this.selectFiveStars();
        
        await this.sleep(1000);
        
        this.log('Step 2: Filling comment...', 'info');
        await this.fillComment();
        
        await this.sleep(1000);
        
        this.log('Step 3: Looking for submit button...', 'info');
        await this.submitRating();
        
        this.log('Test complete! Check if rating was successful.', 'info');
    }

    // Test pagination function
    async testPagination() {
        console.clear();
        this.log('Testing pagination...', 'info');
        this.log(`Current page: ${this.currentPage}`, 'info');
        
        const hasNext = await this.goToNextPage();
        
        if (hasNext) {
            this.log(`✓ Successfully moved to page ${this.currentPage}`, 'success');
            this.log('Checking for Rate buttons on new page...', 'info');
            await this.sleep(1000);
            const buttons = await this.findRateButtons();
            this.log(`Found ${buttons.length} orders to rate`, buttons.length > 0 ? 'success' : 'warning');
        } else {
            this.log('✗ Could not find next page button', 'error');
        }
    }
}

// Create global instance (默认快速模式)
if (typeof window.shopeeAutoRater === 'undefined') {
    window.shopeeAutoRater = new ShopeeAutoRater(true);

    // Usage instructions
    console.log('');
    console.log('⚡ Shopee Auto Rate Script Loaded! (Fast Mode Enabled)');
    console.log('');
    console.log('Commands:');
    console.log('  shopeeAutoRater.start()              - Start automation (fast mode)');
    console.log('  shopeeAutoRater.stop()               - Stop automation');
    console.log('  shopeeAutoRater.testSingleOrder()    - Test single order');
    console.log('  shopeeAutoRater.testPagination()     - Test next page button');
    console.log('');
    console.log('Advanced:');
    console.log('  new ShopeeAutoRater(true).start()    - Fast mode (default, ~3s/order)');
    console.log('  new ShopeeAutoRater(false).start()   - Normal mode (~8s/order)');
    console.log('');
}

} // End of duplicate prevention check
