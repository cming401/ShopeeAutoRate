# Shopee Auto Rate - VPS部署指南

## 📋 目录

1. [系统要求](#系统要求)
2. [快速部署](#快速部署)
3. [配置说明](#配置说明)
4. [定时任务设置](#定时任务设置)
5. [Docker部署](#docker部署)
6. [故障排查](#故障排查)

---

## 🖥️ 系统要求

- **操作系统**: Ubuntu 20.04+ / Debian 10+ / CentOS 8+
- **内存**: 至少 1GB RAM (推荐 2GB+)
- **存储**: 至少 2GB 可用空间
- **Python**: 3.8+
- **网络**: 稳定的互联网连接

---

## 🚀 快速部署

### 方法1: 自动部署脚本（推荐）

```bash
# 1. 连接到VPS
ssh root@your-server-ip

# 2. 下载项目文件
mkdir -p /opt/shopee-auto-rate
cd /opt/shopee-auto-rate

# 3. 上传文件到服务器
# 在本地电脑运行：
scp vps_automation.py deploy.sh setup_cron.sh requirements.txt .env.example root@your-server:/opt/shopee-auto-rate/

# 4. 运行部署脚本
cd /opt/shopee-auto-rate
chmod +x deploy.sh
sudo bash deploy.sh

# 5. 配置环境变量
cp .env.example .env
nano .env  # 编辑配置文件，填入您的账号密码

# 6. 测试运行
source venv/bin/activate
python3 vps_automation.py

# 7. 设置定时任务
chmod +x setup_cron.sh
sudo bash setup_cron.sh
```

### 方法2: 手动部署

```bash
# 1. 更新系统
sudo apt-get update
sudo apt-get upgrade -y

# 2. 安装Python和依赖
sudo apt-get install -y python3 python3-pip python3-venv

# 3. 安装Playwright系统依赖
sudo apt-get install -y \
    libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 \
    libcups2 libdrm2 libdbus-1-3 libxkbcommon0 \
    libxcomposite1 libxdamage1 libxfixes3 libxrandr2 \
    libgbm1 libpango-1.0-0 libcairo2 libasound2 \
    libatspi2.0-0 libxshmfence1

# 4. 创建项目目录
mkdir -p /opt/shopee-auto-rate
cd /opt/shopee-auto-rate

# 5. 创建虚拟环境
python3 -m venv venv
source venv/bin/activate

# 6. 安装Python包
pip install playwright python-dotenv
playwright install chromium

# 7. 上传脚本文件
# （使用scp或其他方式上传 vps_automation.py）

# 8. 配置环境变量
cat > .env << EOF
SHOPEE_EMAIL=your-email@example.com
SHOPEE_PASSWORD=your-password
HEADLESS=true
EOF

# 9. 测试运行
python3 vps_automation.py
```

---

## ⚙️ 配置说明

### 环境变量文件 (.env)

```bash
# 登录凭证
SHOPEE_EMAIL=titanhubmy@gmail.com
SHOPEE_PASSWORD=Mingyin1991

# 浏览器模式
HEADLESS=true  # true=无头模式(VPS), false=显示浏览器

# 执行限制
MAX_PAGES=  # 留空处理所有页面，或设置数字限制

# 日志级别
LOG_LEVEL=INFO  # DEBUG, INFO, WARNING, ERROR
```

### 命令行参数

```bash
# 基本运行
python3 vps_automation.py

# 使用环境变量
SHOPEE_EMAIL=xxx@gmail.com SHOPEE_PASSWORD=xxx python3 vps_automation.py

# 只处理前10页（测试用）
MAX_PAGES=10 python3 vps_automation.py

# 显示浏览器（调试用）
HEADLESS=false python3 vps_automation.py
```

---

## ⏰ 定时任务设置

### 使用自动脚本（推荐）

```bash
cd /opt/shopee-auto-rate
sudo bash setup_cron.sh
```

### 手动设置Cron

```bash
# 1. 编辑crontab
crontab -e

# 2. 添加定时任务（选择一个）

# 每天凌晨1点运行（推荐）
0 1 * * * cd /opt/shopee-auto-rate && source venv/bin/activate && python3 vps_automation.py >> logs/cron.log 2>&1

# 每天凌晨2点运行
0 2 * * * cd /opt/shopee-auto-rate && source venv/bin/activate && python3 vps_automation.py >> logs/cron.log 2>&1

# 每12小时运行一次
0 */12 * * * cd /opt/shopee-auto-rate && source venv/bin/activate && python3 vps_automation.py >> logs/cron.log 2>&1

# 每周一凌晨3点运行
0 3 * * 1 cd /opt/shopee-auto-rate && source venv/bin/activate && python3 vps_automation.py >> logs/cron.log 2>&1
```

### Cron时间格式说明

```
*  *  *  *  *
│  │  │  │  │
│  │  │  │  └─ 星期 (0-7, 0和7都是周日)
│  │  │  └──── 月份 (1-12)
│  │  └─────── 日期 (1-31)
│  └────────── 小时 (0-23)
└───────────── 分钟 (0-59)
```

### 查看和管理Cron任务

```bash
# 查看当前定时任务
crontab -l

# 编辑定时任务
crontab -e

# 删除所有定时任务
crontab -r

# 查看cron日志
tail -f /opt/shopee-auto-rate/logs/cron.log

# 查看自动化日志
tail -f /opt/shopee-auto-rate/logs/automation_*.log

# 手动测试运行
cd /opt/shopee-auto-rate
source venv/bin/activate
python3 vps_automation.py
```

---

## 🐳 Docker部署（可选）

### 构建和运行

```bash
# 1. 构建镜像
docker build -t shopee-auto-rate .

# 2. 运行容器（一次性）
docker run --rm \
  -e SHOPEE_EMAIL=your-email@example.com \
  -e SHOPEE_PASSWORD=your-password \
  -v $(pwd)/logs:/app/logs \
  shopee-auto-rate

# 3. 使用Docker Compose
docker-compose up -d

# 4. 查看日志
docker-compose logs -f

# 5. 停止容器
docker-compose down
```

### Docker定时任务

在宿主机的crontab中添加：

```bash
# 每天凌晨2点运行Docker容器
0 2 * * * docker run --rm -e SHOPEE_EMAIL=xxx -e SHOPEE_PASSWORD=xxx -v /opt/shopee-auto-rate/logs:/app/logs shopee-auto-rate >> /opt/shopee-auto-rate/logs/docker-cron.log 2>&1
```

---

## 🔍 故障排查

### 常见问题

#### 1. 登录失败

**问题**: 脚本无法登录Shopee

**解决方案**:
```bash
# 检查账号密码是否正确
cat .env

# 尝试非无头模式查看登录过程
HEADLESS=false python3 vps_automation.py

# 检查是否需要验证码
# 如果需要验证码，考虑：
# - 预先在浏览器登录并保存cookies
# - 使用2FA应用而非短信验证
```

#### 2. Playwright安装失败

**问题**: 浏览器下载失败

**解决方案**:
```bash
# 手动安装Playwright浏览器
source venv/bin/activate
playwright install chromium

# 如果网络问题，使用镜像
export PLAYWRIGHT_DOWNLOAD_HOST=https://playwright.azureedge.net
playwright install chromium

# 安装系统依赖
sudo playwright install-deps chromium
```

#### 3. 内存不足

**问题**: VPS内存不足导致崩溃

**解决方案**:
```bash
# 增加swap空间
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# 永久启用
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# 限制处理页数（分批处理）
MAX_PAGES=50 python3 vps_automation.py
```

#### 4. Cron任务不执行

**问题**: 定时任务没有运行

**解决方案**:
```bash
# 检查cron服务状态
sudo systemctl status cron

# 启动cron服务
sudo systemctl start cron
sudo systemctl enable cron

# 查看cron日志
sudo tail -f /var/log/syslog | grep CRON

# 检查脚本权限
ls -la /opt/shopee-auto-rate/run_daily.sh

# 手动测试脚本
bash /opt/shopee-auto-rate/run_daily.sh
```

#### 5. 页面加载超时

**问题**: 网页加载超时

**解决方案**:
```bash
# 增加超时时间（修改vps_automation.py）
# 将 timeout=10000 改为 timeout=30000

# 检查网络连接
ping shopee.com.my

# 使用VPN或代理
# 在.env中添加代理配置
```

### 日志分析

```bash
# 查看最新日志
tail -100 /opt/shopee-auto-rate/logs/automation_$(date +%Y%m%d).log

# 查看错误日志
grep "ERROR" /opt/shopee-auto-rate/logs/automation_*.log

# 实时监控日志
tail -f /opt/shopee-auto-rate/logs/automation_*.log

# 统计成功率
grep "✅ 订单" /opt/shopee-auto-rate/logs/automation_*.log | wc -l
```

### 性能监控

```bash
# 查看系统资源使用
htop

# 查看磁盘空间
df -h

# 查看内存使用
free -h

# 查看进程
ps aux | grep python3

# 清理日志（保留最近7天）
find /opt/shopee-auto-rate/logs -name "*.log" -mtime +7 -delete
```

---

## 📊 监控和通知

### 添加邮件通知（可选）

在 `run_daily.sh` 中添加：

```bash
#!/bin/bash

# ... 现有代码 ...

# 运行脚本并捕获输出
OUTPUT=$(python3 vps_automation.py 2>&1)
EXIT_CODE=$?

# 如果失败，发送邮件通知
if [ $EXIT_CODE -ne 0 ]; then
    echo "$OUTPUT" | mail -s "Shopee自动评价失败" your-email@example.com
fi
```

### 添加Telegram通知（可选）

```python
# 在 vps_automation.py 中添加
import requests

def send_telegram_message(message):
    bot_token = "YOUR_BOT_TOKEN"
    chat_id = "YOUR_CHAT_ID"
    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    
    requests.post(url, json={
        "chat_id": chat_id,
        "text": message
    })

# 在完成后调用
send_telegram_message(f"✅ 自动评价完成: {stats['total_rated']} 订单")
```

---

## 🔒 安全建议

1. **不要将敏感信息提交到Git**
   ```bash
   # 确保.env在.gitignore中
   echo ".env" >> .gitignore
   ```

2. **使用环境变量而非硬编码**
   - 始终使用 `.env` 文件存储密码
   - 不要在代码中硬编码凭证

3. **定期更新依赖**
   ```bash
   pip install --upgrade playwright python-dotenv
   ```

4. **限制服务器访问**
   ```bash
   # 配置防火墙
   sudo ufw enable
   sudo ufw allow ssh
   ```

---

## 📞 支持

如有问题，请查看：
- 日志文件: `/opt/shopee-auto-rate/logs/`
- GitHub Issues: [项目链接]
- 联系方式: [您的联系方式]

---

## 📝 更新日志

### v1.0.0 (2024-12-21)
- ✅ 初始VPS部署版本
- ✅ 支持无头浏览器
- ✅ 自动登录功能
- ✅ Cron定时任务
- ✅ Docker支持
- ✅ 详细日志记录
