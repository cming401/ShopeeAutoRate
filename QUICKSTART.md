# VPS部署快速指南

## 🚀 一键部署到VPS

### 步骤1: 连接到VPS服务器

```bash
ssh root@your-vps-ip
```

### 步骤2: 上传文件

在**本地电脑**运行（替换your-vps-ip）：

```bash
# 打包所有文件
cd "/Users/edwardwong/Desktop/Titan Hub/WorkSpace/ShopeeAutoRate"

# 上传到VPS
scp vps_automation.py \
    deploy.sh \
    setup_cron.sh \
    requirements.txt \
    .env.example \
    root@your-vps-ip:/root/
```

### 步骤3: 在VPS上执行部署

```bash
# 1. 运行自动部署脚本
sudo bash deploy.sh

# 2. 配置环境变量
cd /opt/shopee-auto-rate
cp .env.example .env
nano .env  # 编辑配置文件

# 必须修改的配置：
SHOPEE_EMAIL=titanhubmy@gmail.com
SHOPEE_PASSWORD=Mingyin1991
HEADLESS=true

# 3. 测试运行
source venv/bin/activate
python3 vps_automation.py

# 4. 设置定时任务（每天自动运行）
sudo bash setup_cron.sh
```

---

## ⏰ 定时任务选项

运行 `setup_cron.sh` 时，选择以下运行时间：

1. **每天凌晨2点** - `0 2 * * *` （推荐）
2. **每天上午9点** - `0 9 * * *`
3. **每12小时一次** - `0 2,14 * * *`
4. **每周一凌晨3点** - `0 3 * * 1`
5. **每天凌晨1点** - `0 1 * * *`

---

## 📝 查看运行日志

```bash
# 查看实时日志
tail -f /opt/shopee-auto-rate/logs/automation_*.log

# 查看cron日志
tail -f /opt/shopee-auto-rate/logs/cron.log

# 手动运行测试
cd /opt/shopee-auto-rate
source venv/bin/activate
python3 vps_automation.py
```

---

## 🔧 常用命令

```bash
# 查看定时任务列表
crontab -l

# 编辑定时任务
crontab -e

# 立即手动运行
/opt/shopee-auto-rate/run_daily.sh

# 查看系统资源
htop

# 停止正在运行的脚本
pkill -f vps_automation.py
```

---

## ✅ 验证部署成功

1. 日志文件存在：`/opt/shopee-auto-rate/logs/`
2. 定时任务已添加：`crontab -l` 能看到任务
3. 测试运行成功：运行脚本无报错
4. 浏览器安装成功：Playwright Chromium已安装

---

## 🐳 Docker快速部署（可选）

如果您偏好Docker：

```bash
# 1. 安装Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 2. 构建镜像
cd /opt/shopee-auto-rate
docker build -t shopee-auto-rate .

# 3. 运行
docker run --rm \
  -e SHOPEE_EMAIL=titanhubmy@gmail.com \
  -e SHOPEE_PASSWORD=Mingyin1991 \
  -v $(pwd)/logs:/app/logs \
  shopee-auto-rate

# 4. 设置定时运行（添加到crontab）
0 2 * * * docker run --rm -e SHOPEE_EMAIL=xxx -e SHOPEE_PASSWORD=xxx -v /opt/shopee-auto-rate/logs:/app/logs shopee-auto-rate
```

---

## 💡 推荐配置

### VPS配置建议
- **内存**: 2GB+
- **CPU**: 1核+
- **存储**: 10GB+
- **系统**: Ubuntu 20.04 LTS

### 运行时间建议
- **凌晨1-3点**: 流量低峰期，速度快
- **每天运行**: 确保及时评价所有订单
- **周末运行**: 如果订单量不大

---

## 🆘 遇到问题？

1. **查看详细部署文档**: `VPS_DEPLOYMENT.md`
2. **查看日志**: `/opt/shopee-auto-rate/logs/`
3. **测试网络**: `ping shopee.com.my`
4. **检查进程**: `ps aux | grep python`
5. **重启cron**: `sudo systemctl restart cron`

---

**部署完成后，脚本将每天自动运行，无需手动操作！** 🎉
