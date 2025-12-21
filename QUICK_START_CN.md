# 🚀 Shopee Auto Rate - 快速开始指南

## 选择您的部署方式

### 🌟 方案1: Chrome浏览器扩展 (最推荐)

**优点:**
- ✅ 最简单 - 只需一键安装
- ✅ 图形界面 - 实时进度显示
- ✅ 可随时暂停/恢复
- ✅ 设置自动保存

**安装步骤:**
1. 打开Chrome浏览器，输入 `chrome://extensions/`
2. 开启右上角"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择文件夹: `chrome-extension`
5. 完成！扩展图标会出现在工具栏

**使用步骤:**
1. 登录虾皮卖家中心: https://seller.shopee.com.my/portal/sale/order?type=completed
2. 点击工具栏的扩展图标
3. 点击"▶ Start Auto Rating"按钮
4. 实时查看进度和日志

**详细说明:** 查看 [chrome-extension/INSTALL.md](chrome-extension/INSTALL.md)

---

### 💻 方案2: 浏览器控制台脚本 (开发者推荐)

**优点:**
- ✅ 零安装 - 直接使用
- ✅ 快速执行
- ✅ 适合一次性任务

**使用步骤:**
1. 登录虾皮卖家中心
2. 按 `F12` 打开开发者工具
3. 切换到"Console"标签
4. 复制 `shopee_auto_rate_simple.js` 全部代码
5. 粘贴到控制台并按回车
6. 输入命令启动:
   ```javascript
   shopeeAutoRater.start()
   ```
7. 如需停止:
   ```javascript
   shopeeAutoRater.stop()
   ```

---

### 🖥️ 方案3: VPS定时自动化 (高级用户)

**优点:**
- ✅ 全自动 - 无需人工干预
- ✅ 定时任务 - 每天自动运行
- ✅ 后台运行 - 无需保持浏览器打开
- ✅ Docker支持

**使用步骤:**
1. 上传项目文件到VPS
2. 运行部署脚本:
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```
3. 配置定时任务:
   ```bash
   ./setup_cron.sh
   ```
4. 选择运行时间 (每天凌晨2点、每6小时等)

**详细说明:** 查看 [VPS_DEPLOYMENT.md](VPS_DEPLOYMENT.md)

---

## 📊 性能对比

| 部署方式 | 安装难度 | 单订单速度 | 7,284订单总时长 | 推荐度 |
|---------|---------|-----------|---------------|-------|
| Chrome扩展 | ⭐ 简单 | 3.2秒 | ~6.5小时 | ⭐⭐⭐⭐⭐ |
| 浏览器脚本 | ⭐ 简单 | 3.2秒 | ~6.5小时 | ⭐⭐⭐⭐ |
| VPS自动化 | ⭐⭐⭐ 中等 | 3.2秒 | ~6.5小时 | ⭐⭐⭐⭐⭐ |

---

## 🎯 快速决策树

**问: 我应该选哪个方案?**

```
你是开发者吗?
├─ 否 → 使用 Chrome扩展 (最简单)
└─ 是
    └─ 需要定时自动运行吗?
        ├─ 是 → 使用 VPS自动化
        └─ 否 → 使用 浏览器脚本 (最快)
```

---

## ⚙️ 功能设置

### 修改评论内容

**Chrome扩展:**
- 在弹窗界面的"Comment"输入框直接修改

**浏览器脚本:**
```javascript
// 启动时设置
const rater = new ShopeeAutoRater(true);
rater.comment = "您的自定义评论";
rater.start();
```

**VPS自动化:**
在 `.env` 文件中修改:
```bash
COMMENT="您的自定义评论"
```

### 速度模式

**快速模式** (默认): 3.2秒/订单
- Chrome扩展: 勾选"Fast Mode"
- 浏览器脚本: `new ShopeeAutoRater(true)`
- VPS: `.env` 文件中 `FAST_MODE=true`

**普通模式**: 8.5秒/订单 (更稳定)
- Chrome扩展: 取消勾选"Fast Mode"
- 浏览器脚本: `new ShopeeAutoRater(false)`
- VPS: `.env` 文件中 `FAST_MODE=false`

### 限制页数

**Chrome扩展:**
- "Max Pages"输入框输入页数 (0 = 全部)

**浏览器脚本:**
```javascript
rater.maxPages = 10; // 只处理前10页
```

**VPS自动化:**
`.env` 文件:
```bash
MAX_PAGES=10
```

---

## 🔍 常见问题

### Q1: 扩展显示"Not on Shopee"?
**A:** 请先打开虾皮卖家订单页面: https://seller.shopee.com.my/portal/sale/order?type=completed

### Q2: 自动化中途停止了?
**A:** 可能原因:
- 网络连接中断 → 检查网络
- 达到设置的最大页数 → 检查Max Pages设置
- 虾皮页面改版 → 联系支持更新脚本

### Q3: 能否修改为4星或其他星级?
**A:** 可以修改代码:
```javascript
// 在 selectFiveStars() 方法中
const starIndex = 4; // 改为 3 = 4星, 2 = 3星
```

### Q4: 可以批量处理不同的评论吗?
**A:** 目前版本使用统一评论。如需不同评论，请联系开发自定义版本。

### Q5: VPS需要什么配置?
**A:** 最低配置:
- CPU: 1核
- 内存: 1GB
- 存储: 10GB
- 系统: Ubuntu 20.04+

---

## 📞 技术支持

- **GitHub仓库:** https://github.com/cming401/ShopeeAutoRate
- **问题报告:** 在GitHub Issues提交
- **更新通知:** Watch仓库获取最新版本

---

## ⚠️ 重要提示

1. **首次使用建议:**
   - 先设置 Max Pages = 1，测试1页
   - 确认无误后再处理全部订单

2. **使用期间:**
   - 保持浏览器标签页激活状态
   - 不要关闭浏览器
   - 确保网络稳定

3. **安全建议:**
   - 不要在公共电脑使用
   - 定期更改虾皮密码
   - 查看活动日志确认操作正常

---

## 📈 项目统计

- **总订单数:** 7,284 订单
- **总页数:** 183 页
- **预计时间 (快速模式):** 6.5 小时
- **预计时间 (普通模式):** 17 小时

---

**版本:** 1.0.0  
**最后更新:** 2024  
**语言:** JavaScript + Python  
**支持平台:** Windows, macOS, Linux

---

## 🎉 开始使用

选择上面三个方案中的任意一个，立即开始自动化评价之旅！

推荐新手从 **Chrome扩展** 开始，体验最流畅！ 🌟
