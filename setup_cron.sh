#!/bin/bash

# Shopee Auto Rate - Cron定时任务设置
# 每天自动运行评价脚本

set -e

PROJECT_DIR="/opt/shopee-auto-rate"
PYTHON_VENV="$PROJECT_DIR/venv/bin/python3"
SCRIPT_PATH="$PROJECT_DIR/vps_automation.py"

echo "=================================================="
echo "  Shopee Auto Rate - 定时任务设置"
echo "=================================================="
echo ""

# 检查项目目录是否存在
if [ ! -d "$PROJECT_DIR" ]; then
    echo "❌ 项目目录不存在: $PROJECT_DIR"
    echo "   请先运行 deploy.sh"
    exit 1
fi

# 创建cron任务脚本
CRON_SCRIPT="$PROJECT_DIR/run_daily.sh"
echo "📝 创建定时任务脚本: $CRON_SCRIPT"

cat > $CRON_SCRIPT << 'EOF'
#!/bin/bash

# 设置环境变量
export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
export DISPLAY=:0

# 项目目录
PROJECT_DIR="/opt/shopee-auto-rate"
cd $PROJECT_DIR

# 激活虚拟环境
source venv/bin/activate

# 加载环境变量
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# 记录开始时间
echo "========================================" >> logs/cron.log
echo "开始时间: $(date)" >> logs/cron.log

# 运行脚本
python3 vps_automation.py >> logs/cron.log 2>&1

# 记录结束时间
echo "结束时间: $(date)" >> logs/cron.log
echo "========================================" >> logs/cron.log
echo "" >> logs/cron.log
EOF

# 设置执行权限
chmod +x $CRON_SCRIPT

echo "✅ 定时任务脚本已创建"
echo ""

# 显示可选的cron时间配置
echo "=================================================="
echo "  选择运行时间："
echo "=================================================="
echo ""
echo "1. 每天凌晨2点运行"
echo "   0 2 * * * $CRON_SCRIPT"
echo ""
echo "2. 每天上午9点运行"
echo "   0 9 * * * $CRON_SCRIPT"
echo ""
echo "3. 每12小时运行一次（2AM和2PM）"
echo "   0 2,14 * * * $CRON_SCRIPT"
echo ""
echo "4. 每周一凌晨3点运行"
echo "   0 3 * * 1 $CRON_SCRIPT"
echo ""
echo "5. 每天凌晨1点运行（推荐 - 避开高峰期）"
echo "   0 1 * * * $CRON_SCRIPT"
echo ""
echo "=================================================="
echo ""

# 询问用户选择
read -p "选择运行时间 (1-5) [默认: 5]: " choice
choice=${choice:-5}

case $choice in
    1) CRON_TIME="0 2 * * *" ;;
    2) CRON_TIME="0 9 * * *" ;;
    3) CRON_TIME="0 2,14 * * *" ;;
    4) CRON_TIME="0 3 * * 1" ;;
    5) CRON_TIME="0 1 * * *" ;;
    *) 
        echo "❌ 无效选择，使用默认时间（每天凌晨1点）"
        CRON_TIME="0 1 * * *"
        ;;
esac

# 添加到crontab
echo "📅 添加定时任务到crontab..."
(crontab -l 2>/dev/null | grep -v "$CRON_SCRIPT"; echo "$CRON_TIME $CRON_SCRIPT") | crontab -

echo ""
echo "✅ 定时任务已设置！"
echo ""
echo "=================================================="
echo "  定时任务信息"
echo "=================================================="
echo ""
echo "⏰ 运行时间: $CRON_TIME"
echo "📁 脚本路径: $CRON_SCRIPT"
echo "📝 日志位置: $PROJECT_DIR/logs/"
echo ""
echo "=================================================="
echo "  常用命令"
echo "=================================================="
echo ""
echo "查看定时任务："
echo "  crontab -l"
echo ""
echo "查看日志："
echo "  tail -f $PROJECT_DIR/logs/cron.log"
echo "  tail -f $PROJECT_DIR/logs/automation_*.log"
echo ""
echo "手动运行测试："
echo "  $CRON_SCRIPT"
echo ""
echo "删除定时任务："
echo "  crontab -e  # 然后删除对应行"
echo ""
echo "=================================================="
