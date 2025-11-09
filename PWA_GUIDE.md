# Chrome PWA 应用说明

## 📁 项目结构

项目现在包含两个版本的前端:

### 1. Chrome 插件版本 (`chrome-extension/`)
- 传统的 Chrome 浏览器插件
- 需要在 Chrome 扩展程序中加载
- 适用于 Chrome/Edge 浏览器

### 2. PWA 应用版本 (`chrome-pwa/`) ✨ 新增
- 基于 PWA 规范的 Web 应用
- 可安装到桌面,跨平台使用
- 支持离线访问,类原生应用体验
- 适用于所有现代浏览器

## 🚀 快速开始

### 启动后端服务 (必需)

```bash
# Windows
start_server.bat

# 或直接运行
python main.py
```

后端服务运行在: `http://localhost:19666`

### 使用 PWA 应用 (推荐)

1. **生成图标** (首次使用)
   ```bash
   # 方式1: 在浏览器中打开
   chrome-pwa/generate-icons.html
   # 下载图标并保存到 chrome-pwa 目录
   
   # 方式2: 使用 Python (需要 Pillow)
   pip install Pillow
   cd chrome-pwa
   python generate_icons.py
   ```

2. **启动 PWA**
   ```bash
   cd chrome-pwa
   start-pwa.bat
   ```
   
   访问: `http://localhost:8080`

3. **安装到桌面**
   - 在浏览器中点击地址栏的 "安装" 图标
   - 或等待页面提示安装
   - 安装后可从桌面启动

### 使用 Chrome 插件 (传统方式)

1. 打开 Chrome 浏览器
2. 访问 `chrome://extensions/`
3. 开启 "开发者模式"
4. 点击 "加载已解压的扩展程序"
5. 选择 `chrome-extension` 目录

## 📊 功能对比

| 功能 | Chrome 插件 | PWA 应用 |
|------|------------|----------|
| 文件上传 | ✅ | ✅ |
| 文本上传 | ✅ | ✅ |
| 拖拽上传 | ❌ | ✅ |
| 离线访问 | ❌ | ✅ |
| 桌面安装 | ❌ | ✅ |
| 跨浏览器 | ❌ | ✅ |
| 移动端支持 | ❌ | ✅ |
| 快捷键 | ❌ | ✅ |
| 服务器状态监控 | ❌ | ✅ |

## 🌟 PWA 优势

1. **跨平台**: Windows、macOS、Linux、Android、iOS
2. **独立窗口**: 类似原生应用,无浏览器地址栏
3. **离线支持**: Service Worker 缓存,断网可访问
4. **自动更新**: 访问时自动检测更新
5. **更好的 UI**: 现代化界面,响应式设计
6. **拖拽上传**: 支持文件拖放
7. **状态监控**: 实时显示后端服务状态

## 📖 详细文档

- [PWA 应用说明](chrome-pwa/README.md)
- [快速设置指南](chrome-pwa/SETUP.md)

## 🔧 技术栈

### 后端
- Python 3.x
- Flask (Web 框架)
- Flask-CORS (跨域支持)
- Pyperclip (剪贴板操作)

### PWA 前端
- HTML5 + CSS3 + JavaScript (ES6+)
- Service Worker (离线缓存)
- Web App Manifest (PWA 配置)
- Fetch API (网络请求)
- FormData API (文件上传)

### Chrome 插件前端
- HTML + CSS + JavaScript
- Chrome Extension Manifest V3

## 📝 开发建议

推荐使用 **PWA 版本**,因为:
- 更现代化的用户体验
- 支持更多平台和浏览器
- 功能更丰富
- 易于分发和安装

Chrome 插件版本保留用于:
- 需要使用 Chrome 特定 API 的场景
- 企业内部分发
- 特殊的浏览器集成需求

## 🐛 问题排查

### PWA 无法安装?
- 确保通过 HTTP 服务器访问 (不是 file://)
- 检查图标文件是否存在
- 查看浏览器控制台错误信息

### 后端连接失败?
- 确认 main.py 正在运行
- 检查端口 19666 是否被占用
- 查看防火墙设置

### Service Worker 异常?
- 清除浏览器缓存
- 在 DevTools > Application > Service Workers 中注销
- 刷新页面重新注册

## 📞 支持

遇到问题请查看:
1. [PWA 设置指南](chrome-pwa/SETUP.md)
2. 浏览器开发者工具控制台
3. [EXE 打包指南](EXE_BUILD_GUIDE.md)

---

**推荐使用 PWA 版本获得最佳体验! 🚀**
