# Shopee 自动评价 - Chrome 扩展程序

<div align="center">

🚀 **一键自动为所有 Shopee 买家评五星好评！**

[![下载扩展程序](https://img.shields.io/badge/下载-扩展程序%20v1.0.0-brightgreen?style=for-the-badge)](https://github.com/yourusername/ShopeeAutoRate/releases/download/v1.0.0/shopee-auto-rate-extension.zip)
[![English](https://img.shields.io/badge/lang-English-blue?style=flat-square)](README.md)
[![中文](https://img.shields.io/badge/lang-中文-red?style=flat-square)](README_CN.md)

</div>

这是一个简单而强大的 Chrome 扩展程序，帮助 Shopee 卖家节省时间，自动为已完成的订单评价。

---

## ✨ 功能特点

- 🎯 **一键启动** - 自动打开 Shopee 页面并开始评价
- ⭐ **五星好评** - 自动为所有买家评五星
- 💬 **自定义评论** - 添加您的个性化感谢留言
- ⚡ **快速模式** - 每个订单仅需约 3.2 秒
- 📊 **进度追踪** - 实时统计和活动日志
- 🔄 **多页支持** - 自动处理所有页面
- 💾 **保存设置** - 记住您的偏好设置
- ⏸ **暂停/继续** - 随时停止并继续

---

## 📥 安装步骤

### 第一步：下载

**方式 A：下载发行版**（推荐）
1. 点击上方绿色的 **下载扩展程序** 按钮
2. 解压 ZIP 文件

**方式 B：克隆仓库**
```bash
git clone https://github.com/yourusername/ShopeeAutoRate.git
```

### 第二步：安装到 Chrome

1. 打开 Chrome 浏览器，访问 `chrome://extensions/`
2. 开启右上角的 **"开发者模式"**
3. 点击 **"加载已解压的扩展程序"**
4. 选择下载文件中的 `chrome-extension` 文件夹
5. 完成！扩展图标将出现在 Chrome 工具栏中

![安装示范](https://via.placeholder.com/800x400?text=Installation+Screenshot)

---

## 🎮 使用方法

### 快速开始（推荐）

1. **点击 Chrome 工具栏中的扩展图标**
2. **点击 "🚀 打开页面并自动开始" 按钮**
3. 就这么简单！扩展程序将会：
   - 自动打开 Shopee 卖家订单页面
   - 等待页面加载完成
   - 自动开始为所有订单评五星

坐下来放松，让它为您工作！☕

### 手动启动（备选方式）

1. 访问 [Shopee 卖家订单页面](https://seller.shopee.com.my/portal/sale/order?type=completed)
2. 确保已登录您的卖家账号
3. 点击扩展图标
4. （可选）调整设置：
   - **评论**：您的感谢留言
   - **快速模式**：切换速度（默认：开启）
   - **最大页数**：设置限制或保持为 0 处理所有页面
5. 点击 **"▶ 开始自动评价"**

### 监控进度

在扩展弹窗中查看：
- **状态**：当前状态（运行中/已停止/已完成）
- **已处理**：已评价的订单数量
- **当前页面**：正在处理的页面
- **活动日志**：实时操作记录

### 停止或暂停

随时点击 **"⏸ 停止"** 按钮暂停。您可以稍后继续。

---

## ⚙️ 设置选项

| 设置 | 说明 | 默认值 |
|------|------|--------|
| **评论** | 给买家的感谢留言 | "Thank you for your supporting." |
| **快速模式** | 加快处理速度 | ✅ 已启用（每单 3.2 秒）|
| **最大页数** | 限制处理页数（0 = 全部）| 0（处理全部）|

---

## 📊 性能表现

- **快速模式**：每个订单约 3.2 秒
- **普通模式**：每个订单约 8.5 秒
- **示例**：100 个订单 ≈ 5-15 分钟

---

## 🔧 故障排除

### 扩展程序无法工作？
- 安装后刷新 Shopee 页面
- 确保您在正确的页面：`/portal/sale/order?type=completed`
- 检查是否已登录 Shopee 卖家账号

### 显示"未在 Shopee 页面"？
- 先访问 Shopee 卖家订单页面
- URL 必须包含：`seller.shopee.com.my`

### 扩展图标看不见？
- 点击 Chrome 工具栏的拼图图标（🧩）
- 固定"Shopee 自动评价"以便快速访问

### 需要更多帮助？
- 打开浏览器控制台（按 F12）查看详细日志
- 检查是否有任何错误消息

---

## ⚠️ 重要提示

- 此扩展程序仅适用于 **Shopee 马来西亚站**（`seller.shopee.com.my`）
- 确保已登录您的 Shopee 卖家账号
- 扩展程序仅评价"已完成"标签页中的订单
- 处理过程中请保持浏览器标签页打开

---

## 🤝 支持

如果您觉得这个扩展程序有帮助，请给它一个 ⭐ 星标！

---

## 📄 许可证

MIT 许可证 - 可自由使用和修改。

---

**用 ❤️ 为 Shopee 卖家打造**
