#!/usr/bin/env python3
"""
Shopee Auto Rate - Direct Automation
直接在已打开的浏览器中运行自动化脚本
"""

import time
import os

# 读取JavaScript自动化脚本
script_path = os.path.join(os.path.dirname(__file__), 'shopee_auto_rate_simple.js')
with open(script_path, 'r', encoding='utf-8') as f:
    js_code = f.read()

print("=" * 60)
print("Shopee Auto Rate Automation")
print("自动评分工具")
print("=" * 60)
print()
print("📋 Instructions / 使用说明:")
print()
print("1. 请确保您已经登录到 Shopee 卖家中心")
print("   Make sure you're logged in to Shopee Seller Portal")
print()
print("2. 打开浏览器开发者工具 (按 F12 或 Cmd+Option+I)")
print("   Open browser DevTools (Press F12 or Cmd+Option+I)")
print()
print("3. 点击 'Console' 标签")
print("   Click on the 'Console' tab")
print()
print("4. 复制下面的代码并粘贴到 Console 中:")
print("   Copy the code below and paste into Console:")
print()
print("-" * 60)
print(js_code)
print("-" * 60)
print()
print("5. 在 Console 中输入以下命令开始自动化:")
print("   Type this command in Console to start:")
print()
print("   shopeeAutoRater.start()")
print()
print("6. 如需停止，输入:")
print("   To stop, type:")
print()
print("   shopeeAutoRater.stop()")
print()
print("=" * 60)
print()

# 提供选项：自动复制到剪贴板
try:
    import pyperclip
    copy = input("是否自动复制脚本到剪贴板? (y/n): ")
    if copy.lower() == 'y':
        pyperclip.copy(js_code)
        print("✓ 脚本已复制到剪贴板！直接粘贴到浏览器 Console 即可。")
except ImportError:
    print("提示: 安装 pyperclip 可以自动复制到剪贴板")
    print("pip install pyperclip")

print()
print("Press Enter to exit...")
input()
