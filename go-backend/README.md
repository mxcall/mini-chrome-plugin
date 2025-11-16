# Go 后端文件上传服务

这是使用 Go 语言重写的文件上传后端服务，与原 Python 版本功能完全一致。

## 功能特性

- ✅ 文件上传 (`/upload`)
- ✅ 文本上传 (`/upload-text`) - 支持 base64 编码，自动保存并复制到剪贴板
- ✅ 支持大文件上传 (最大 3GB)
- ✅ 自动处理文件名冲突（添加时间戳）
- ✅ 上传成功后自动打开文件管理器定位文件
- ✅ CORS 支持
- ✅ 跨平台支持（Linux、Windows、macOS）

## 编译说明

### 前置要求

- Go 1.21 或更高版本

### 编译步骤

#### Windows 系统

双击运行 `build.bat` 或在命令行中执行：

```cmd
build.bat
```

#### Linux/macOS 系统

在终端中执行：

```bash
chmod +x build.sh
./build.sh
```

### 编译产物

编译成功后，会在 `bin` 目录下生成以下文件：

- `file-upload-server-linux-amd64` - Linux 64位可执行文件
- `file-upload-server-windows-amd64.exe` - Windows 64位可执行文件

## 使用说明

### Windows 运行

```cmd
cd bin
file-upload-server-windows-amd64.exe
```

### Linux 运行

```bash
cd bin
chmod +x file-upload-server-linux-amd64
./file-upload-server-linux-amd64
```

### 服务信息

- **监听地址**: `localhost:19666`
- **上传目录**: `./uploads`（程序运行目录下）
- **停止服务**: 按 `Ctrl+C`

## API 接口

### 1. 首页 - GET /

返回服务状态信息。

**响应示例**:
```json
{
  "status": "success",
  "message": "文件上传服务正在运行",
  "upload_endpoint": "/upload",
  "method": "POST"
}
```

### 2. 文件上传 - POST /upload

上传文件到服务器。

**请求格式**: `multipart/form-data`

**请求参数**:
- `file`: 文件对象

**成功响应**:
```json
{
  "status": "success",
  "filename": "example.txt",
  "filesize": 1048576
}
```

**错误响应**:
```json
{
  "status": "error",
  "message": "错误描述信息"
}
```

### 3. 文本上传 - POST /upload-text

上传文本内容，保存到 `copy_tmp.txt` 并复制到剪贴板。

**请求格式**: `application/json`

**请求参数**:
```json
{
  "content": "base64编码的文本内容"
}
```

**成功响应**:
```json
{
  "status": "success",
  "char_count": 100,
  "message": "文本已保存并复制到剪贴板"
}
```

## 依赖项

- `github.com/rs/cors` - CORS 中间件
- `github.com/atotto/clipboard` - 剪贴板操作

依赖会在编译时自动下载。

## 与 Python 版本的对比

| 特性 | Python 版本 | Go 版本 |
|------|-------------|---------|
| 文件上传 | ✅ | ✅ |
| 文本上传 | ✅ | ✅ |
| 大文件支持 | ✅ | ✅ |
| 跨平台 | ✅ | ✅ |
| 单文件部署 | ❌ | ✅ |
| 启动速度 | 慢 | 快 |
| 内存占用 | 较高 | 较低 |
| 无需运行时 | ❌ | ✅ |

## 优势

1. **单文件部署**: 编译后是单个可执行文件，无需安装 Python 环境
2. **跨平台**: 一次编译，可生成多个平台的可执行文件
3. **性能优越**: 启动快速，内存占用低
4. **部署简单**: 直接运行可执行文件即可，无需安装依赖

## 文件命名规则

- 如果上传的文件名不存在，直接使用原始文件名保存
- 如果文件名已存在，自动重命名为: `原始文件名_年月日时分秒.扩展名`
- 例如: `test.txt` 重复时会保存为 `test_20251116153025.txt`

## 故障排除

### 编译失败

1. 确认已安装 Go 1.21 或更高版本
2. 检查网络连接（需要下载依赖）
3. 确认 GOPATH 和 GOROOT 环境变量配置正确

### 运行时端口被占用

确保 `localhost:19666` 端口未被其他程序占用。

### 剪贴板功能不可用

Linux 系统需要安装 X11 或 Wayland 显示服务器才能使用剪贴板功能。
