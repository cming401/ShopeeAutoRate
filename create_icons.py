from PIL import Image, ImageDraw, ImageFont
import os

# Create icons directory if it doesn't exist
os.makedirs('/Users/edwardwong/Desktop/Titan Hub/WorkSpace/ShopeeAutoRate/chrome-extension/assets/icons', exist_ok=True)

# Shopee orange color
color = '#ee4d2d'

# Create 16x16 icon
img16 = Image.new('RGB', (16, 16), color)
draw16 = ImageDraw.Draw(img16)
draw16.ellipse([2, 2, 13, 13], fill='white')
img16.save('/Users/edwardwong/Desktop/Titan Hub/WorkSpace/ShopeeAutoRate/chrome-extension/assets/icons/icon16.png')

# Create 48x48 icon
img48 = Image.new('RGB', (48, 48), color)
draw48 = ImageDraw.Draw(img48)
draw48.ellipse([8, 8, 40, 40], fill='white')
draw48.ellipse([12, 20, 20, 28], fill=color)
draw48.ellipse([28, 20, 36, 28], fill=color)
img48.save('/Users/edwardwong/Desktop/Titan Hub/WorkSpace/ShopeeAutoRate/chrome-extension/assets/icons/icon48.png')

# Create 128x128 icon
img128 = Image.new('RGB', (128, 128), color)
draw128 = ImageDraw.Draw(img128)
draw128.ellipse([20, 20, 108, 108], fill='white')
draw128.ellipse([30, 50, 50, 70], fill=color)
draw128.ellipse([78, 50, 98, 70], fill=color)
draw128.arc([40, 60, 88, 90], 0, 180, fill=color, width=5)
img128.save('/Users/edwardwong/Desktop/Titan Hub/WorkSpace/ShopeeAutoRate/chrome-extension/assets/icons/icon128.png')

print('Icons created successfully!')
