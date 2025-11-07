# EXE 打包使用指南

## 📦 打包步骤

### 1. 打包项目
双击运行 `build_exe.bat`，脚本会自动：
- 激活虚拟环境
- 安装 PyInstaller
- 清理旧的打包文件
- 使用 `build_exe.spec` 配置打包项目

打包完成后，会在 `dist` 目录生成 `FileUploadServer.exe`

### 2. 运行 EXE
**方式一：使用启动脚本（推荐）**
- 双击 `start_exe.bat` 启动服务
- 脚本会自动创建 uploads 目录并运行 exe

**方式二：直接双击**
- 进入 `dist` 目录
- 双击 `FileUploadServer.exe`

## 📁 分发给其他用户

将以下文件/文件夹打包到一起：
```
mini-chrome-plugin/
├── dist/
│   └── FileUploadServer.exe    （核心exe文件）
├── start_exe.bat                （启动脚本，可选）
└── chrome-extension/            （Chrome插件文件夹）
    ├── manifest.json
    ├── popup.html
    ├── popup.css
    └── popup.js
```

**最简分发方案：**
只需提供：
- `dist/FileUploadServer.exe` - 双击即可运行
- `chrome-extension/` 文件夹 - 加载到 Chrome

## ⚙️ 配置说明

### `build_exe.spec` 配置文件
- `name='FileUploadServer'`: exe 文件名
- `console=True`: 显示控制台窗口（可以看到日志）
- `upx=True`: 启用 UPX 压缩（减小文件体积）
- `onefile`: 打包为单个 exe 文件

### 修改端口或配置
如需修改端口，编辑 `main.py` 第 100 行：
```python
app.run(host='localhost', port=19666, debug=False, use_reloader=False)
```
修改后重新运行 `build_exe.bat` 打包。

## ⚠️ 注意事项

1. **杀毒软件警告**：首次运行可能被杀毒软件拦截，需添加信任
2. **防火墙提示**：首次运行会提示允许网络访问，点击允许
3. **uploads 目录**：首次运行会在 exe 同级目录自动创建
4. **Chrome 插件**：需要在 Chrome 中手动加载 `chrome-extension` 文件夹

## 🔧 已修改内容

1. **main.py**
   - 关闭 `debug=True`（exe不支持调试模式）
   - 设置 `use_reloader=False`（防止重复启动）
   - 添加文件名空值检查

2. **新增文件**
   - `build_exe.spec`: PyInstaller 打包配置
   - `build_exe.bat`: 自动打包脚本
   - `start_exe.bat`: exe 启动脚本

## 🚀 快速开始

```bash
# 1. 打包
双击 build_exe.bat

# 2. 运行
双击 start_exe.bat
```

服务启动后访问 http://localhost:19666 确认运行正常。
