#!/bin/bash

# Shopee Auto Rate - VPS 部署脚本
# 用于Ubuntu/Debian系统

set -e

echo "=================================================="
echo "  Shopee Auto Rate - VPS 部署"
echo "=================================================="
echo ""

# 检查root权限
if [ "$EUID" -ne 0 ]; then 
    echo "⚠️  请使用root权限运行此脚本"
    echo "   sudo bash deploy.sh"
    exit 1
fi

# 1. 更新系统
echo "📦 更新系统包..."
apt-get update
apt-get upgrade -y

# 2. 安装Python3和pip
echo "🐍 安装Python3..."
apt-get install -y python3 python3-pip python3-venv

# 3. 安装Playwright依赖
echo "🎭 安装Playwright系统依赖..."
apt-get install -y \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libdbus-1-3 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libpango-1.0-0 \
    libcairo2 \
    libasound2 \
    libatspi2.0-0 \
    libxshmfence1

# 4. 创建项目目录
PROJECT_DIR="/opt/shopee-auto-rate"
echo "📁 创建项目目录: $PROJECT_DIR"
mkdir -p $PROJECT_DIR
cd $PROJECT_DIR

# 5. 创建Python虚拟环境
echo "🔧 创建Python虚拟环境..."
python3 -m venv venv
source venv/bin/activate

# 6. 安装Python依赖
echo "📚 安装Python依赖..."
pip install --upgrade pip
pip install playwright python-dotenv

# 7. 安装Playwright浏览器
echo "🌐 安装Playwright Chromium浏览器..."
playwright install chromium

# 8. 创建日志目录
echo "📝 创建日志目录..."
mkdir -p logs

# 9. 设置权限
echo "🔐 设置文件权限..."
chmod +x vps_automation.py

echo ""
echo "✅ 部署完成！"
echo ""
echo "=================================================="
echo "  下一步操作："
echo "=================================================="
echo ""
echo "1. 上传脚本文件到服务器:"
echo "   scp vps_automation.py root@your-server:$PROJECT_DIR/"
echo ""
echo "2. 配置环境变量:"
echo "   cd $PROJECT_DIR"
echo "   cp .env.example .env"
echo "   nano .env  # 编辑配置文件"
echo ""
echo "3. 测试运行:"
echo "   source venv/bin/activate"
echo "   python3 vps_automation.py"
echo ""
echo "4. 设置定时任务（见 setup_cron.sh）"
echo ""
echo "=================================================="
