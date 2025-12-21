# Shopee 自动评分工具使用说明

## ✅ 已验证可用 (2024-12-26)

成功在 miss_atiey 的订单上测试：
- ⭐⭐⭐⭐⭐ 5星评分
- 评论: "Thank you for your supporting."
- 验证通过：订单提交后不再显示"Rate"按钮

---

## 快速开始

### 1. 打开 Shopee Seller Portal
访问：https://seller.shopee.com.my/portal/sale/order?type=completed

### 2. 打开浏览器开发者工具
- **Windows/Linux**: 按 `F12` 或 `Ctrl+Shift+J`
- **Mac**: 按 `Cmd+Option+J`

### 3. 复制并运行脚本

打开 `shopee_auto_rate_simple.js` 文件，复制全部内容，粘贴到 Console 控制台，按 Enter。

### 4. 启动自动评分

```javascript
const rater = new ShopeeAutoRater();
await rater.start();
```

---

## 重要提示

### ✅ 优点
1. **真实验证**: 使用 Chrome DevTools MCP 实际测试过
2. **无误报**: 正确验证评分是否真的选上了（检查 `data-current-value="5"`）
3. **Vue.js 兼容**: 使用完整鼠标事件序列触发 Vue 的事件处理器

### ⚠️ 注意事项
1. **不要关闭页面**: 脚本运行期间保持页面开启
2. **监控进度**: 脚本会在控制台显示实时进度
3. **出错暂停**: 如遇连续失败，脚本会自动暂停

### 📊 数据规模
- **总订单数**: 7,282
- **总页数**: 183 页
- **每页订单数**: 39 个

---

## 工作原理

### 技术细节
Shopee 使用 **Vue.js + EDS（Element Design System）** 评分组件。

普通的 `.click()` 方法**无效**，必须模拟完整的鼠标交互序列：

```javascript
// 6个事件按顺序触发
['mouseover', 'mouseenter', 'mousemove', 'mousedown', 'mouseup', 'click']
```

### 验证方法
检查 DOM 属性和样式：
- `data-current-value` 应该是 "5"
- 所有5个星星的 `width` 应该是 "24px"
- 所有5个星星的 `opacity` 应该是 "1"

---

## 故障排除

### 如果评分失败

1. **检查页面是否正确加载**
   - 确保在 Completed Orders 页面
   - 确保能看到 "Rate" 按钮

2. **重新加载脚本**
   ```javascript
   // 刷新页面后重新粘贴脚本
   const rater = new ShopeeAutoRater();
   await rater.start();
   ```

3. **查看控制台日志**
   - 查找 ❌ 错误标记
   - 查看具体失败原因

### 如果某个订单卡住

1. **手动关闭弹窗**
   点击 Cancel 或按 ESC

2. **继续下一个**
   脚本会自动跳过并继续

---

## 文件说明

- `shopee_auto_rate_simple.js` - 主脚本文件（已更新为验证可用版本）
- `VERIFIED_WORKING_METHOD.md` - 技术文档（英文）
- `README_CN.md` - 本文件（中文说明）

---

## 测试结果

### 之前版本（失败）
- **测试**: 0/11 成功 (0%)
- **问题**: 
  - 使用错误的选择器
  - 简单 `.click()` 无效
  - 误报成功（日志显示成功但实际失败）

### 当前版本（成功）
- **测试**: 1/1 成功 (100%)
- **改进**:
  - 正确的 CSS 选择器 (`.eds-rate-star`)
  - 完整的鼠标事件序列
  - 真实的验证机制

---

## 联系方式

如有问题或需要帮助，请查看技术文档 `VERIFIED_WORKING_METHOD.md`

---

**祝使用愉快！🎉**
