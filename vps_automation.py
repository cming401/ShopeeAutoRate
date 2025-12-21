#!/usr/bin/env python3
"""
Shopee Auto Rate - VPS Headless Automation
VPS无头浏览器自动化评价脚本
支持定时任务自动运行
"""

import asyncio
import logging
import os
import sys
from datetime import datetime
from pathlib import Path
from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeout

# 配置日志
LOG_DIR = Path(__file__).parent / 'logs'
LOG_DIR.mkdir(exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.FileHandler(LOG_DIR / f'automation_{datetime.now().strftime("%Y%m%d")}.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)


class ShopeeVPSAutoRater:
    """VPS无头浏览器自动评价工具"""
    
    def __init__(self, email: str, password: str, headless: bool = True):
        self.email = email
        self.password = password
        self.headless = headless
        self.browser = None
        self.context = None
        self.page = None
        self.stats = {
            'total_rated': 0,
            'pages_processed': 0,
            'start_time': None,
            'errors': []
        }
    
    async def init_browser(self):
        """初始化浏览器"""
        logger.info("🚀 启动浏览器...")
        playwright = await async_playwright().start()
        
        self.browser = await playwright.chromium.launch(
            headless=self.headless,
            args=[
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-blink-features=AutomationControlled'
            ]
        )
        
        self.context = await self.browser.new_context(
            viewport={'width': 1920, 'height': 1080},
            user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        )
        
        self.page = await self.context.new_page()
        logger.info("✅ 浏览器已启动")
    
    async def login(self):
        """自动登录Shopee卖家中心"""
        logger.info("🔐 开始登录流程...")
        
        try:
            # 访问登录页面
            await self.page.goto('https://seller.shopee.com.my/portal/sale/order?type=completed', 
                                wait_until='networkidle')
            
            # 检查是否已经登录
            if 'login' not in self.page.url:
                logger.info("✅ 已经登录，跳过登录步骤")
                return True
            
            # 等待登录表单加载
            await self.page.wait_for_selector('input[type="text"], input[placeholder*="Email"], input[placeholder*="Phone"]', 
                                             timeout=10000)
            
            logger.info(f"📧 输入邮箱: {self.email}")
            # 填写邮箱
            await self.page.fill('input[type="text"], input[placeholder*="Email"], input[placeholder*="Phone"]', 
                                self.email)
            await asyncio.sleep(0.5)
            
            logger.info("🔑 输入密码...")
            # 填写密码
            await self.page.fill('input[type="password"]', self.password)
            await asyncio.sleep(0.5)
            
            # 点击登录按钮
            logger.info("👆 点击登录按钮...")
            await self.page.click('button:has-text("LOG IN"), button:has-text("Login")')
            
            # 等待登录完成（等待URL变化或特定元素出现）
            try:
                await self.page.wait_for_url('**/portal/**', timeout=30000)
                logger.info("✅ 登录成功！")
                
                # 等待页面完全加载
                await asyncio.sleep(3)
                return True
                
            except PlaywrightTimeout:
                # 可能需要处理验证码或2FA
                logger.warning("⚠️ 登录超时，可能需要验证码或2FA")
                
                # 检查是否有验证码
                if await self.page.query_selector('input[placeholder*="verification"], input[placeholder*="code"]'):
                    logger.error("❌ 需要验证码，无法自动登录")
                    return False
                
                # 检查是否实际已经登录
                if 'portal' in self.page.url:
                    logger.info("✅ 登录成功（URL已变化）")
                    return True
                
                logger.error("❌ 登录失败")
                return False
                
        except Exception as e:
            logger.error(f"❌ 登录过程出错: {str(e)}")
            return False
    
    async def navigate_to_orders(self):
        """导航到已完成订单页面"""
        logger.info("📑 导航到订单页面...")
        
        try:
            await self.page.goto('https://seller.shopee.com.my/portal/sale/order?type=completed',
                                wait_until='networkidle')
            await asyncio.sleep(2)
            logger.info("✅ 已到达订单页面")
            return True
        except Exception as e:
            logger.error(f"❌ 导航失败: {str(e)}")
            return False
    
    async def select_five_stars(self):
        """选择5星评分"""
        try:
            # 等待星星元素出现
            await self.page.wait_for_selector('.eds-rate-star', timeout=5000)
            
            # 获取第5颗星
            stars = await self.page.query_selector_all('.eds-rate-star')
            if len(stars) < 5:
                logger.error("❌ 找不到足够的星星元素")
                return False
            
            fifth_star = stars[4]
            
            # 获取星星位置
            box = await fifth_star.bounding_box()
            if not box:
                logger.error("❌ 无法获取星星位置")
                return False
            
            x = box['x'] + box['width'] / 2
            y = box['y'] + box['height'] / 2
            
            # 完整的鼠标事件序列
            await self.page.mouse.move(x, y)
            await asyncio.sleep(0.03)
            await self.page.mouse.down()
            await asyncio.sleep(0.05)
            await self.page.mouse.up()
            await asyncio.sleep(0.2)
            
            # 验证是否成功选择5星
            rate_value = await self.page.get_attribute('.eds-rate', 'data-current-value')
            if rate_value == '5':
                logger.info("✅ 成功选择5星")
                return True
            
            logger.warning("⚠️ 5星选择可能失败，继续...")
            return True
            
        except Exception as e:
            logger.error(f"❌ 选择星星失败: {str(e)}")
            return False
    
    async def fill_comment(self, comment: str = "Thank you for your supporting."):
        """填写评论"""
        try:
            # 等待评论框出现
            await self.page.wait_for_selector('.eds-modal textarea', timeout=5000)
            
            # 填写评论
            await self.page.fill('.eds-modal textarea', comment)
            await asyncio.sleep(0.3)
            
            logger.info("✅ 评论已填写")
            return True
            
        except Exception as e:
            logger.error(f"❌ 填写评论失败: {str(e)}")
            return False
    
    async def submit_rating(self):
        """提交评价"""
        try:
            # 查找并点击Rate按钮（不是Rate Buyer）
            modal_buttons = await self.page.query_selector_all('.eds-modal button')
            
            for button in modal_buttons:
                text = await button.text_content()
                if text and text.strip() == 'Rate':
                    await button.click()
                    logger.info("✅ 评价已提交")
                    await asyncio.sleep(1.5)
                    return True
            
            logger.error("❌ 找不到提交按钮")
            return False
            
        except Exception as e:
            logger.error(f"❌ 提交失败: {str(e)}")
            return False
    
    async def process_single_order(self, rate_button):
        """处理单个订单"""
        try:
            # 滚动到按钮位置
            await rate_button.scroll_into_view_if_needed()
            await asyncio.sleep(0.3)
            
            # 点击Rate按钮
            await rate_button.click()
            await asyncio.sleep(0.8)
            
            # 检查模态框是否打开
            modal = await self.page.query_selector('.eds-modal')
            if not modal:
                logger.error("❌ 评价窗口未打开")
                return False
            
            # 选择5星
            if not await self.select_five_stars():
                return False
            
            # 填写评论
            if not await self.fill_comment():
                return False
            
            # 提交
            if not await self.submit_rating():
                return False
            
            self.stats['total_rated'] += 1
            return True
            
        except Exception as e:
            logger.error(f"❌ 处理订单失败: {str(e)}")
            self.stats['errors'].append(str(e))
            return False
    
    async def process_current_page(self):
        """处理当前页面的所有订单"""
        logger.info(f"📄 处理第 {self.stats['pages_processed'] + 1} 页...")
        
        try:
            # 等待页面加载
            await asyncio.sleep(2)
            
            # 查找所有Rate按钮
            rate_buttons = await self.page.query_selector_all('button:has-text("Rate")')
            
            # 过滤掉"Rate Buyer"按钮
            actual_rate_buttons = []
            for btn in rate_buttons:
                text = await btn.text_content()
                if text and text.strip() == 'Rate':
                    actual_rate_buttons.append(btn)
            
            if not actual_rate_buttons:
                logger.info("✅ 本页没有待评价订单")
                return True
            
            logger.info(f"📝 找到 {len(actual_rate_buttons)} 个待评价订单")
            
            # 处理每个订单
            for i in range(len(actual_rate_buttons)):
                logger.info(f"处理订单 {i + 1}/{len(actual_rate_buttons)}...")
                
                # 重新查找按钮（避免stale element）
                current_buttons = await self.page.query_selector_all('button:has-text("Rate")')
                valid_buttons = []
                for btn in current_buttons:
                    text = await btn.text_content()
                    if text and text.strip() == 'Rate':
                        valid_buttons.append(btn)
                
                if not valid_buttons:
                    logger.info("✅ 所有订单已处理完毕")
                    break
                
                # 处理第一个按钮
                success = await self.process_single_order(valid_buttons[0])
                
                if success:
                    logger.info(f"✅ 订单 {i + 1} 处理成功")
                else:
                    logger.warning(f"⚠️ 订单 {i + 1} 处理失败，继续下一个")
                
                await asyncio.sleep(0.8)
            
            self.stats['pages_processed'] += 1
            return True
            
        except Exception as e:
            logger.error(f"❌ 处理页面失败: {str(e)}")
            return False
    
    async def go_to_next_page(self):
        """跳转到下一页"""
        try:
            # 查找下一页按钮
            next_button = await self.page.query_selector('.eds-pager__button-next:not([disabled])')
            
            if not next_button:
                logger.info("✅ 已到达最后一页")
                return False
            
            # 点击下一页
            await next_button.click()
            logger.info("➡️ 跳转到下一页...")
            await asyncio.sleep(3)
            
            return True
            
        except Exception as e:
            logger.error(f"❌ 翻页失败: {str(e)}")
            return False
    
    async def run(self, max_pages: int = None):
        """运行自动化流程"""
        self.stats['start_time'] = datetime.now()
        
        try:
            # 初始化浏览器
            await self.init_browser()
            
            # 登录
            if not await self.login():
                logger.error("❌ 登录失败，终止执行")
                return False
            
            # 导航到订单页面
            if not await self.navigate_to_orders():
                logger.error("❌ 无法访问订单页面，终止执行")
                return False
            
            # 处理所有页面
            page_count = 0
            while True:
                if max_pages and page_count >= max_pages:
                    logger.info(f"✅ 已达到最大页数限制 ({max_pages})，停止处理")
                    break
                
                # 处理当前页
                await self.process_current_page()
                page_count += 1
                
                # 尝试跳转下一页
                if not await self.go_to_next_page():
                    break
                
                # 每10页输出进度
                if page_count % 10 == 0:
                    elapsed = (datetime.now() - self.stats['start_time']).total_seconds() / 60
                    logger.info(f"📊 进度报告: {page_count} 页, {self.stats['total_rated']} 订单, {elapsed:.1f} 分钟")
            
            # 输出最终统计
            total_time = (datetime.now() - self.stats['start_time']).total_seconds() / 60
            logger.info("\n" + "=" * 60)
            logger.info("✅ 自动化完成！")
            logger.info("=" * 60)
            logger.info(f"📊 总页数: {self.stats['pages_processed']}")
            logger.info(f"📊 评价订单数: {self.stats['total_rated']}")
            logger.info(f"⏱️ 总耗时: {total_time:.2f} 分钟")
            logger.info(f"⚠️ 错误数: {len(self.stats['errors'])}")
            logger.info("=" * 60 + "\n")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ 自动化执行失败: {str(e)}")
            return False
        
        finally:
            # 关闭浏览器
            if self.browser:
                await self.browser.close()
                logger.info("🔚 浏览器已关闭")


async def main():
    """主函数"""
    # 从环境变量读取配置
    email = os.getenv('SHOPEE_EMAIL', 'titanhubmy@gmail.com')
    password = os.getenv('SHOPEE_PASSWORD', 'Mingyin1991')
    headless = os.getenv('HEADLESS', 'true').lower() == 'true'
    max_pages = os.getenv('MAX_PAGES')
    
    if max_pages:
        max_pages = int(max_pages)
    
    logger.info("=" * 60)
    logger.info("🤖 Shopee VPS 自动评价工具")
    logger.info("=" * 60)
    logger.info(f"📧 账号: {email}")
    logger.info(f"🖥️ 无头模式: {headless}")
    logger.info(f"📄 最大页数: {max_pages or '无限制'}")
    logger.info("=" * 60 + "\n")
    
    # 创建自动化实例
    rater = ShopeeVPSAutoRater(email=email, password=password, headless=headless)
    
    # 运行自动化
    success = await rater.run(max_pages=max_pages)
    
    # 返回退出码
    sys.exit(0 if success else 1)


if __name__ == '__main__':
    asyncio.run(main())
