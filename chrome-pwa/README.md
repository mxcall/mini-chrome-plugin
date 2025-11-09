# 文件上传助手 PWA

这是一个基于 PWA (Progressive Web App) 规范开发的文件上传工具,支持文件和文本的快速上传到本地服务器。

## 🌟 主要特性

- ✅ **PWA 支持**: 可安装到桌面,离线访问
- 📁 **文件上传**: 支持拖拽上传,最大 3GB
- 📝 **文本上传**: 一键复制到剪贴板
- 🎨 **现代界面**: 响应式设计,支持移动端
- ⚡ **Service Worker**: 离线缓存,快速加载
- 🔄 **实时状态**: 服务器连接状态实时监控

## 📦 项目结构

```
chrome-pwa/
├── index.html          # 主页面
├── styles.css          # 样式文件
├── app.js              # 应用逻辑
├── sw.js               # Service Worker
├── manifest.json       # PWA 配置文件
├── icon-192.png        # 应用图标 192x192
├── icon-512.png        # 应用图标 512x512
└── README.md           # 说明文档
```

## 🚀 使用方法

### 1. 启动后端服务

确保后端服务正在运行:

```bash
# 在项目根目录
python main.py

# 或使用批处理脚本
start_server.bat
```

后端服务将在 `http://localhost:19666` 启动。

### 2. 访问 PWA 应用

#### 方式一: 直接打开本地文件

在浏览器中打开 `chrome-pwa/index.html` 文件。

#### 方式二: 通过本地服务器 (推荐)

使用 Python 启动本地 HTTP 服务器:

```bash
# 进入 chrome-pwa 目录
cd chrome-pwa

# Python 3.x
python -m http.server 8080

# 访问 http://localhost:8080
```

使用 Node.js 的 http-server:

```bash
# 安装 http-server (仅首次)
npm install -g http-server

# 启动服务
cd chrome-pwa
http-server -p 8080

# 访问 http://localhost:8080
```

### 3. 安装 PWA 到桌面

1. 使用 Chrome/Edge 浏览器访问应用
2. 点击地址栏右侧的 "安装" 图标
3. 或者点击页面底部弹出的安装提示
4. 确认安装,应用将添加到桌面

## 📱 功能说明

### 文件上传

1. 点击上传区域选择文件,或直接拖拽文件到上传区域
2. 显示文件名和大小信息
3. 点击 "上传文件" 按钮
4. 上传成功后自动打开文件管理器并定位到文件

### 文本上传

1. 在文本框中输入或粘贴文本内容
2. 点击 "上传到剪贴板" 按钮
3. 文本自动保存到 `uploads/copy_tmp.txt` 并复制到剪贴板
4. 可使用快捷键 `Ctrl+Enter` 快速上传

### 快捷键

- `Ctrl+Enter`: 在文本框中快速上传文本

## 🔧 技术栈

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **PWA**: Service Worker, Web App Manifest
- **API**: Fetch API, FormData API
- **后端**: Flask (Python)

## 🌐 浏览器支持

- ✅ Chrome 90+
- ✅ Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Opera 76+

## 📝 PWA 特性

### Manifest 配置

- **应用名称**: 文件上传助手
- **显示模式**: standalone (独立应用)
- **主题色**: #667eea
- **方向**: 竖屏优先
- **图标**: 192x192, 512x512

### Service Worker 功能

- ✅ 静态资源缓存
- ✅ 离线访问支持
- ✅ 版本管理
- ✅ 缓存策略: Cache First
- ✅ 自动更新检测

### 安装要求

PWA 安装需要满足以下条件:

1. ✅ 通过 HTTPS 访问 (localhost 除外)
2. ✅ 包含有效的 manifest.json
3. ✅ 注册 Service Worker
4. ✅ 至少包含一个 192x192 图标

## 🎨 界面截图

应用提供了现代化的用户界面:

- 渐变色背景
- 卡片式布局
- 拖拽上传支持
- 实时状态反馈
- 响应式设计

## 🔒 安全说明

- 应用仅与本地服务器 (localhost:19666) 通信
- 不会上传数据到外部服务器
- 所有文件保存在本地 `uploads/` 目录

## 🐛 故障排除

### 无法安装 PWA

- 确保通过 HTTP(S) 服务器访问,而不是 file:// 协议
- 检查浏览器是否支持 PWA
- 查看浏览器控制台错误信息

### 后端连接失败

- 确认后端服务正在运行
- 检查端口 19666 是否被占用
- 查看防火墙设置

### Service Worker 未生效

- 清除浏览器缓存
- 在 Chrome DevTools > Application > Service Workers 中注销旧的 Worker
- 刷新页面重新注册

## 📄 License

MIT License

## 👨‍💻 开发者

本项目基于原有的 Chrome 插件改造而成,提供了更好的跨平台支持和用户体验。
